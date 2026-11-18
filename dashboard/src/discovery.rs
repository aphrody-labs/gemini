use std::path::{Path, PathBuf};

use serde::Deserialize;

#[derive(Debug, Clone)]
pub struct DiscoveredEnv {
    pub gemini_home: PathBuf,
    pub ls_binary: Option<PathBuf>,
    pub chrome_devtools_mcp_js: Option<PathBuf>,
    pub gemini_app_version: String,
    pub agy_version: String,
    pub local_device_id: String,
    pub dark_mode: bool,
}

#[derive(Debug, Deserialize, Default)]
struct GeminiAppSettings {
    #[serde(rename = "localDeviceId", default)]
    local_device_id: String,
}

#[derive(Debug, Deserialize, Default)]
struct AgyConfigJson {
    #[serde(rename = "userSettings", default)]
    user_settings: AgyUserSettings,
}

#[derive(Debug, Deserialize, Default)]
struct AgyUserSettings {
    #[serde(rename = "themeMode", default)]
    theme_mode: String,
}

pub fn home_dir() -> PathBuf {
    std::env::var_os("USERPROFILE")
        .or_else(|| std::env::var_os("HOME"))
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("."))
}

pub fn local_app_data_dir() -> PathBuf {
    std::env::var_os("LOCALAPPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(|| home_dir().join("AppData").join("Local"))
}

pub fn roaming_app_data_dir() -> PathBuf {
    std::env::var_os("APPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(|| home_dir().join("AppData").join("Roaming"))
}

fn find_gemini_install_version(local_app_data: &Path) -> String {
    let base = local_app_data.join("Google").join("Gemini");
    let Ok(entries) = std::fs::read_dir(&base) else {
        return "1.19.0".to_owned();
    };
    let mut versions: Vec<String> = entries
        .flatten()
        .filter_map(|e| {
            let name = e.file_name().to_string_lossy().to_string();
            name.strip_prefix("app-").map(str::to_owned)
        })
        .collect();
    versions.sort();
    versions.pop().unwrap_or_else(|| "1.19.0".to_owned())
}

fn find_agy_resources(local_app_data: &Path) -> (Option<PathBuf>, Option<PathBuf>, String) {
    let agy_root = local_app_data.join("Programs").join("antigravity");
    let version = std::fs::read_to_string(agy_root.join("version"))
        .map(|s| s.trim().to_owned())
        .unwrap_or_else(|_| "2.31.2".to_owned());

    let ls_override = std::env::var_os("ANTIGRAVITY_LS_BIN").map(PathBuf::from);
    let ls_default = agy_root.join("resources").join("bin").join("language_server.exe");
    let ls_binary = ls_override
        .filter(|p| p.exists())
        .or_else(|| ls_default.exists().then_some(ls_default));

    let mcp_path = agy_root
        .join("resources")
        .join("app.asar.unpacked")
        .join("node_modules")
        .join("chrome-devtools-mcp")
        .join("build")
        .join("src")
        .join("bin")
        .join("chrome-devtools-mcp.js");
    let chrome_devtools_mcp_js = mcp_path.exists().then_some(mcp_path);

    (ls_binary, chrome_devtools_mcp_js, version)
}

pub fn discover_env() -> DiscoveredEnv {
    let home = home_dir();
    let gemini_home = home.join(".gemini");
    let local_app = local_app_data_dir();
    let roaming = roaming_app_data_dir();

    let (ls_binary, chrome_devtools_mcp_js, agy_version) = find_agy_resources(&local_app);
    let gemini_app_version = find_gemini_install_version(&local_app);

    let local_device_id = std::fs::read_to_string(roaming.join("Gemini").join("settings.json"))
        .ok()
        .and_then(|s| serde_json::from_str::<GeminiAppSettings>(&s).ok())
        .map(|s| s.local_device_id)
        .filter(|id| !id.is_empty())
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

    let dark_mode = std::fs::read_to_string(gemini_home.join("config").join("config.json"))
        .ok()
        .and_then(|s| serde_json::from_str::<AgyConfigJson>(&s).ok())
        .map(|c| c.user_settings.theme_mode.contains("DARK"))
        .unwrap_or(true);

    DiscoveredEnv {
        gemini_home,
        ls_binary,
        chrome_devtools_mcp_js,
        gemini_app_version,
        agy_version,
        local_device_id,
        dark_mode,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn discovers_home_and_defaults() {
        let env = discover_env();
        assert!(env.gemini_home.ends_with(".gemini"));
        assert!(!env.local_device_id.is_empty());
        assert!(!env.agy_version.is_empty());
    }
}
