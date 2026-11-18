use std::collections::VecDeque;
use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};

use crate::discovery::DiscoveredEnv;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum LsPhase {
    Stopped,
    Starting,
    Ready { port: u16, pid: u32 },
    Failed(String),
}

#[derive(Debug, Clone)]
pub struct LsSnapshot {
    pub phase: LsPhase,
    pub csrf_token: String,
    pub logs: Vec<String>,
    pub plugins: Vec<String>,
    pub conversations_count: usize,
}

pub struct LanguageServerHandle {
    env: DiscoveredEnv,
    csrf_token: String,
    child: Arc<Mutex<Option<Child>>>,
    phase: Arc<Mutex<LsPhase>>,
    logs: Arc<Mutex<VecDeque<String>>>,
    plugins: Arc<Mutex<Vec<String>>>,
    conversations_count: Arc<Mutex<usize>>,
}

impl LanguageServerHandle {
    pub fn start(env: DiscoveredEnv) -> Self {
        let csrf_token = uuid::Uuid::new_v4().to_string();
        let handle = Self {
            env,
            csrf_token,
            child: Arc::new(Mutex::new(None)),
            phase: Arc::new(Mutex::new(LsPhase::Stopped)),
            logs: Arc::new(Mutex::new(VecDeque::with_capacity(200))),
            plugins: Arc::new(Mutex::new(Vec::new())),
            conversations_count: Arc::new(Mutex::new(0)),
        };
        handle.restart();
        handle
    }

    pub fn snapshot(&self) -> LsSnapshot {
        LsSnapshot {
            phase: self.phase.lock().map(|g| g.clone()).unwrap_or(LsPhase::Stopped),
            csrf_token: self.csrf_token.clone(),
            logs: self
                .logs
                .lock()
                .map(|q| q.iter().cloned().collect())
                .unwrap_or_default(),
            plugins: self.plugins.lock().map(|p| p.clone()).unwrap_or_default(),
            conversations_count: self.conversations_count.lock().map(|c| *c).unwrap_or(0),
        }
    }

    pub fn stop(&self) {
        if let Ok(mut guard) = self.child.lock()
            && let Some(mut c) = guard.take()
        {
            let _ = c.kill();
            let _ = c.wait();
        }
        if let Ok(mut p) = self.phase.lock() {
            *p = LsPhase::Stopped;
        }
    }

    pub fn restart(&self) {
        self.stop();
        let Some(bin) = self.env.ls_binary.clone() else {
            if let Ok(mut p) = self.phase.lock() {
                *p = LsPhase::Failed("language_server.exe not found".to_owned());
            }
            return;
        };
        if let Ok(mut p) = self.phase.lock() {
            *p = LsPhase::Starting;
        }
        if let Ok(mut q) = self.logs.lock() {
            q.clear();
        }

        let mut cmd = Command::new(&bin);
        cmd.args([
            "--standalone",
            "--override_ide_name",
            "antigravity",
            "--subclient_type",
            "hub",
            "--override_ide_version",
            &self.env.agy_version,
            "--override_user_agent_name",
            "antigravity",
            "--https_server_port",
            "0",
            "--csrf_token",
            &self.csrf_token,
            "--app_data_dir",
            "antigravity",
            "--api_server_url",
            "https://generativelanguage.googleapis.com",
            "--cloud_code_endpoint",
            "https://daily-cloudcode-pa.googleapis.com",
            "--enable_sidecars",
        ]);
        if let Some(mcp_js) = &self.env.chrome_devtools_mcp_js {
            cmd.env("CHROME_DEVTOOLS_MCP_JS", mcp_js);
        }
        cmd.stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }

        let mut child = match cmd.spawn() {
            Ok(c) => c,
            Err(err) => {
                if let Ok(mut p) = self.phase.lock() {
                    *p = LsPhase::Failed(format!("spawn failed: {err}"));
                }
                return;
            }
        };

        let pid = child.id();
        let stdout = child.stdout.take();
        let stderr = child.stderr.take();
        if let Ok(mut guard) = self.child.lock() {
            *guard = Some(child);
        }

        for stream_opt in [
            stdout.map(|s| Box::new(s) as Box<dyn std::io::Read + Send>),
            stderr.map(|s| Box::new(s) as Box<dyn std::io::Read + Send>),
        ] {
            let Some(stream) = stream_opt else { continue };
            let phase = Arc::clone(&self.phase);
            let logs = Arc::clone(&self.logs);
            let plugins = Arc::clone(&self.plugins);
            let convs = Arc::clone(&self.conversations_count);
            let csrf = self.csrf_token.clone();
            let ws_uri = format!(
                "file:///{}",
                self.env.gemini_home.to_string_lossy().replace('\\', "/")
            );
            std::thread::spawn(move || {
                let reader = BufReader::new(stream);
                for line in reader.lines().map_while(Result::ok) {
                    if let Ok(mut q) = logs.lock() {
                        if q.len() >= 180 {
                            q.pop_front();
                        }
                        q.push_back(line.clone());
                    }
                    if let Some(port) = parse_listening_port(&line) {
                        let became_ready = {
                            let mut p = phase.lock().unwrap();
                            let prev = matches!(*p, LsPhase::Ready { .. });
                            *p = LsPhase::Ready { port, pid };
                            !prev
                        };
                        if became_ready {
                            let csrf_inner = csrf.clone();
                            let plugins_inner = Arc::clone(&plugins);
                            let convs_inner = Arc::clone(&convs);
                            let ws_inner = ws_uri.clone();
                            std::thread::spawn(move || {
                                std::thread::sleep(std::time::Duration::from_millis(600));
                                poll_ls_rpc(port, &csrf_inner, &ws_inner, &plugins_inner, &convs_inner);
                            });
                        }
                    }
                }
            });
        }
    }

    pub fn refresh_rpc(&self) {
        let snap = self.snapshot();
        let LsPhase::Ready { port, .. } = snap.phase else {
            return;
        };
        let plugins = Arc::clone(&self.plugins);
        let convs = Arc::clone(&self.conversations_count);
        let csrf = self.csrf_token.clone();
        let ws_uri = format!(
            "file:///{}",
            self.env.gemini_home.to_string_lossy().replace('\\', "/")
        );
        std::thread::spawn(move || {
            poll_ls_rpc(port, &csrf, &ws_uri, &plugins, &convs);
        });
    }
}

impl Drop for LanguageServerHandle {
    fn drop(&mut self) {
        self.stop();
    }
}

pub fn parse_listening_port(line: &str) -> Option<u16> {
    let marker = "port at ";
    let idx = line.find(marker)?;
    let rest = &line[idx + marker.len()..];
    let digits: String = rest.chars().take_while(|c| c.is_ascii_digit()).collect();
    if digits.is_empty() {
        return None;
    }
    if line.contains("HTTP") || line.contains("HTTPS") {
        digits.parse::<u16>().ok()
    } else {
        None
    }
}

fn poll_ls_rpc(
    port: u16,
    csrf: &str,
    workspace_uri: &str,
    plugins_out: &Arc<Mutex<Vec<String>>>,
    convs_out: &Arc<Mutex<usize>>,
) {
    let config = ureq::Agent::config_builder()
        .tls_config(
            ureq::tls::TlsConfig::builder()
                .disable_verification(true)
                .build(),
        )
        .timeout_global(Some(std::time::Duration::from_secs(4)))
        .build();
    let agent: ureq::Agent = config.into();

    let plugins_url = format!(
        "https://127.0.0.1:{port}/exa.language_server_pb.LanguageServerService/GetAllPlugins"
    );
    if let Ok(mut resp) = agent
        .post(&plugins_url)
        .header("Content-Type", "application/json")
        .header("x-codeium-csrf-token", csrf)
        .send_json(serde_json::json!({ "workspaceUris": [workspace_uri] }))
        && let Ok(v) = resp.body_mut().read_json::<serde_json::Value>()
        && let Some(arr) = v.get("plugins").and_then(|p| p.as_array())
    {
        let names = arr
            .iter()
            .filter_map(|p| {
                let name = p.get("name")?.as_str()?;
                let disabled = p.get("disabled").and_then(|d| d.as_bool()).unwrap_or(false);
                Some(if disabled {
                    format!("{name} (disabled)")
                } else {
                    name.to_owned()
                })
            })
            .collect();
        if let Ok(mut g) = plugins_out.lock() {
            *g = names;
        }
    }

    let conv_url = format!(
        "https://127.0.0.1:{port}/exa.language_server_pb.LanguageServerService/ListConversations"
    );
    if let Ok(mut resp) = agent
        .post(&conv_url)
        .header("Content-Type", "application/json")
        .header("x-codeium-csrf-token", csrf)
        .send_json(serde_json::json!({}))
        && let Ok(v) = resp.body_mut().read_json::<serde_json::Value>()
        && let Some(arr) = v.get("summaries").and_then(|s| s.as_array())
        && let Ok(mut g) = convs_out.lock()
    {
        *g = arr.len();
    }
}

pub fn read_learning_stats(gemini_home: &PathBuf) -> (usize, usize, Vec<String>) {
    let state_path = gemini_home.join("learning").join("state.json");
    let journal_path = gemini_home.join("learning").join("journal.jsonl");
    let inbox_dir = gemini_home.join("learning").join("inbox");
    let mem_dir = gemini_home.join("memory");

    let journal_lines = std::fs::read_to_string(&journal_path)
        .map(|s| s.lines().filter(|l| !l.trim().is_empty()).count())
        .unwrap_or(0);
    let _ = state_path;

    let inbox_count = std::fs::read_dir(&inbox_dir)
        .map(|rd| {
            rd.flatten()
                .filter(|e| e.file_name().to_string_lossy().ends_with("-digest.md"))
                .count()
        })
        .unwrap_or(0);

    let memory_files = std::fs::read_dir(&mem_dir)
        .map(|rd| {
            rd.flatten()
                .filter_map(|e| {
                    let n = e.file_name().to_string_lossy().to_string();
                    n.ends_with(".md").then_some(n)
                })
                .collect()
        })
        .unwrap_or_default();

    (journal_lines, inbox_count, memory_files)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_ls_listening_port() {
        assert_eq!(
            parse_listening_port("Language server listening on random port at 4129 for HTTP"),
            Some(4129)
        );
        assert_eq!(
            parse_listening_port("listening on port at 54321 for HTTPS (gRPC)"),
            Some(54321)
        );
        assert_eq!(parse_listening_port("unrelated log line"), None);
    }
}
