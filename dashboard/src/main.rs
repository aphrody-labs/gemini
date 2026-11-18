#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod discovery;
mod ls;
mod webview;

use std::cell::RefCell;
use std::path::PathBuf;
use std::process::Command;
use std::rc::Rc;
use std::sync::Arc;
use std::time::Duration;

use gpui::{
    App, Bounds, Context, FocusHandle, Focusable, Hsla, KeyDownEvent, SharedString, Task, Window,
    WindowBounds, WindowOptions, actions, canvas, div, prelude::*, px, rgb, size,
};
use gpui_platform::application;

use discovery::{DiscoveredEnv, discover_env};
use ls::{LanguageServerHandle, LsPhase, read_learning_stats};
use webview::{DualWebViews, GEMINI_HOME_URL};

actions!(gemini_dashboard, [ToggleFind, ToggleMinichat, CycleMode, ReloadActive, QuitApp]);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ViewMode {
    Split,
    Antigravity,
    Gemini,
    Minichat,
    Control,
}

impl ViewMode {
    fn label(self) -> &'static str {
        match self {
            Self::Split => "Split",
            Self::Antigravity => "Antigravity",
            Self::Gemini => "Gemini",
            Self::Minichat => "Minichat",
            Self::Control => "Control",
        }
    }

    fn next(self) -> Self {
        match self {
            Self::Split => Self::Antigravity,
            Self::Antigravity => Self::Gemini,
            Self::Gemini => Self::Minichat,
            Self::Minichat => Self::Control,
            Self::Control => Self::Split,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ActivePane {
    Antigravity,
    Gemini,
}

struct Palette {
    bg: Hsla,
    panel: Hsla,
    card: Hsla,
    border: Hsla,
    text: Hsla,
    muted: Hsla,
    accent: Hsla,
    accent_text: Hsla,
    ok: Hsla,
    warn: Hsla,
}

impl Palette {
    fn from_dark(dark: bool) -> Self {
        if dark {
            Self {
                bg: rgb(0x1E222A).into(),
                panel: rgb(0x282C34).into(),
                card: rgb(0x2F343F).into(),
                border: rgb(0x3E4451).into(),
                text: rgb(0xABB2BF).into(),
                muted: rgb(0x7F848E).into(),
                accent: rgb(0x61AFEF).into(),
                accent_text: rgb(0x181A1F).into(),
                ok: rgb(0x98C379).into(),
                warn: rgb(0xE5C07B).into(),
            }
        } else {
            Self {
                bg: rgb(0xFAF4E5).into(),
                panel: rgb(0xEEE8D5).into(),
                card: rgb(0xFDF6E3).into(),
                border: rgb(0xD3CCB8).into(),
                text: rgb(0x435155).into(),
                muted: rgb(0x657B83).into(),
                accent: rgb(0xCB4B16).into(),
                accent_text: rgb(0xFDF6E3).into(),
                ok: rgb(0x859900).into(),
                warn: rgb(0xB58900).into(),
            }
        }
    }
}

struct Dashboard {
    focus_handle: FocusHandle,
    env: DiscoveredEnv,
    ls: Arc<LanguageServerHandle>,
    webviews: Rc<RefCell<Option<DualWebViews>>>,
    webviews_started: bool,
    agy_loaded_port: Option<u16>,
    mode: ViewMode,
    active_pane: ActivePane,
    dark: bool,
    find_open: bool,
    find_query: String,
    action_status: String,
    learning_stats: (usize, usize, Vec<String>),
    agy_bounds: Rc<RefCell<Option<Bounds<Pixels>>>>,
    gemini_bounds: Rc<RefCell<Option<Bounds<Pixels>>>>,
    _poll_task: Task<()>,
}

impl Focusable for Dashboard {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Dashboard {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let env = discover_env();
        let dark = env.dark_mode;
        let ls = Arc::new(LanguageServerHandle::start(env.clone()));
        let learning_stats = read_learning_stats(&env.gemini_home);

        let poll_task = cx.spawn_in(window, async move |this, cx| {
            loop {
                cx.background_executor().timer(Duration::from_millis(650)).await;
                let keep_going = this.update_in(cx, |this, _window, cx| {
                    this.tick(cx);
                });
                if keep_going.is_err() {
                    break;
                }
            }
        });

        Self {
            focus_handle: cx.focus_handle(),
            env,
            ls,
            webviews: Rc::new(RefCell::new(None)),
            webviews_started: false,
            agy_loaded_port: None,
            mode: ViewMode::Split,
            active_pane: ActivePane::Antigravity,
            dark,
            find_open: false,
            find_query: String::new(),
            action_status: "Ready".to_owned(),
            learning_stats,
            agy_bounds: Rc::new(RefCell::new(None)),
            gemini_bounds: Rc::new(RefCell::new(None)),
            _poll_task: poll_task,
        }
    }

    fn ensure_webviews_deferred(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        if self.webviews_started {
            return;
        }
        self.webviews_started = true;
        let data_root = self.env.gemini_home.join("dashboard").join("data");
        let app_version = self.env.gemini_app_version.clone();
        let device_id = self.env.local_device_id.clone();
        let initial_url = match self.ls.snapshot().phase {
            LsPhase::Ready { port, .. } => {
                self.agy_loaded_port = Some(port);
                format!("https://127.0.0.1:{port}/")
            }
            _ => "about:blank".to_owned(),
        };

        cx.spawn_in(window, async move |this, cx| {
            cx.background_executor().timer(Duration::from_millis(40)).await;
            let _ = this.update_in(cx, |this, window, cx| {
                match DualWebViews::build_for_window(
                    window,
                    &data_root,
                    &initial_url,
                    &app_version,
                    &device_id,
                ) {
                    Ok(views) => {
                        *this.webviews.borrow_mut() = Some(views);
                        this.sync_webview_visibility();
                        cx.notify();
                    }
                    Err(err) => {
                        this.action_status = format!("WebView2 init error: {err}");
                        cx.notify();
                    }
                }
            });
        })
        .detach();
    }

    fn tick(&mut self, cx: &mut Context<Self>) {
        let snap = self.ls.snapshot();
        if let LsPhase::Ready { port, .. } = snap.phase
            && self.agy_loaded_port != Some(port)
        {
            self.agy_loaded_port = Some(port);
            if let Some(views) = self.webviews.borrow().as_ref() {
                let _ = views.agy.load_url(&format!("https://127.0.0.1:{port}/"));
            }
            self.action_status = format!("Antigravity LS ready on port {port}");
        }
        self.learning_stats = read_learning_stats(&self.env.gemini_home);
        cx.notify();
    }

    fn sync_webview_visibility(&self) {
        let mut borrow = self.webviews.borrow_mut();
        let Some(views) = borrow.as_mut() else {
            return;
        };
        let agy_b = match self.mode {
            ViewMode::Split | ViewMode::Antigravity => *self.agy_bounds.borrow(),
            ViewMode::Gemini | ViewMode::Minichat | ViewMode::Control => None,
        };
        let gem_b = match self.mode {
            ViewMode::Split | ViewMode::Gemini | ViewMode::Minichat => *self.gemini_bounds.borrow(),
            ViewMode::Antigravity | ViewMode::Control => None,
        };
        views.place_agy(agy_b);
        views.place_gemini(gem_b);
    }

    fn set_mode(&mut self, mode: ViewMode, cx: &mut Context<Self>) {
        self.mode = mode;
        match mode {
            ViewMode::Antigravity => self.active_pane = ActivePane::Antigravity,
            ViewMode::Gemini | ViewMode::Minichat => self.active_pane = ActivePane::Gemini,
            _ => {}
        }
        if mode == ViewMode::Control {
            *self.agy_bounds.borrow_mut() = None;
            *self.gemini_bounds.borrow_mut() = None;
        }
        self.sync_webview_visibility();
        cx.notify();
    }

    fn eval_active(&self, script: &str) {
        let borrow = self.webviews.borrow();
        let Some(views) = borrow.as_ref() else { return };
        let view = match self.active_pane {
            ActivePane::Antigravity => &views.agy,
            ActivePane::Gemini => &views.gemini,
        };
        let _ = view.evaluate_script(script);
    }

    fn go_home(&mut self) {
        let borrow = self.webviews.borrow();
        let Some(views) = borrow.as_ref() else { return };
        match self.active_pane {
            ActivePane::Gemini => {
                let _ = views.gemini.load_url(GEMINI_HOME_URL);
            }
            ActivePane::Antigravity => {
                if let LsPhase::Ready { port, .. } = self.ls.snapshot().phase {
                    let _ = views.agy.load_url(&format!("https://127.0.0.1:{port}/"));
                }
            }
        }
    }

    fn run_find(&self, backwards: bool) {
        if self.find_query.is_empty() {
            return;
        }
        let q = serde_json::to_string(&self.find_query).unwrap_or_else(|_| "\"\"".to_owned());
        self.eval_active(&format!("window.find({q}, false, {backwards}, true, false, false, false);"));
    }

    fn open_devtools(&self) {
        let borrow = self.webviews.borrow();
        let Some(views) = borrow.as_ref() else { return };
        match self.active_pane {
            ActivePane::Antigravity => views.agy.open_devtools(),
            ActivePane::Gemini => views.gemini.open_devtools(),
        }
    }

    fn adjust_zoom(&mut self, delta: Option<f64>, cx: &mut Context<Self>) {
        if let Some(views) = self.webviews.borrow_mut().as_mut() {
            let next = match delta {
                Some(d) => views.zoom() + d,
                None => 1.0,
            };
            views.set_zoom(next);
            self.action_status = format!("Zoom {}%", (views.zoom() * 100.0).round() as i32);
        }
        cx.notify();
    }

    fn run_gemini_script(&mut self, args: &'static [&'static str], label: &'static str, cx: &mut Context<Self>) {
        let home = self.env.gemini_home.clone();
        self.action_status = format!("Running {label}...");
        cx.notify();
        cx.spawn(async move |this, cx| {
            let result = cx
                .background_executor()
                .spawn(async move {
                    let mut cmd = Command::new("bun");
                    cmd.arg("--no-install").arg("--no-env-file").args(args).current_dir(&home);
                    #[cfg(windows)]
                    {
                        use std::os::windows::process::CommandExt;
                        cmd.creation_flags(0x0800_0000);
                    }
                    match cmd.output() {
                        Ok(out) => {
                            let msg = String::from_utf8_lossy(&out.stdout).trim().to_owned();
                            let err = String::from_utf8_lossy(&out.stderr).trim().to_owned();
                            if out.status.success() {
                                format!("{label}: {}", if msg.is_empty() { "ok" } else { &msg })
                            } else {
                                format!("{label} failed: {err} {msg}")
                            }
                        }
                        Err(e) => format!("{label} error: {e}"),
                    }
                })
                .await;
            let _ = this.update(cx, |this, cx| {
                this.action_status = result.lines().last().unwrap_or("done").to_owned();
                this.learning_stats = read_learning_stats(&this.env.gemini_home);
                cx.notify();
            });
        })
        .detach();
    }

    fn on_key_down(&mut self, event: &KeyDownEvent, _window: &mut Window, cx: &mut Context<Self>) {
        let mods = &event.keystroke.modifiers;
        let key = event.keystroke.key.as_str();
        if mods.control && key.eq_ignore_ascii_case("f") {
            self.find_open = !self.find_open;
            cx.notify();
            return;
        }
        if mods.control && key.eq_ignore_ascii_case("m") {
            let next = if self.mode == ViewMode::Minichat {
                ViewMode::Split
            } else {
                ViewMode::Minichat
            };
            self.set_mode(next, cx);
            return;
        }
        if mods.control && key.eq_ignore_ascii_case("r") {
            self.eval_active("location.reload()");
            return;
        }
        if self.find_open && self.mode != ViewMode::Control {
            if key == "escape" {
                self.find_open = false;
                cx.notify();
                return;
            }
            if key == "enter" {
                self.run_find(mods.shift);
                return;
            }
            if key == "backspace" {
                self.find_query.pop();
                cx.notify();
                return;
            }
            if let Some(ch) = &event.keystroke.key_char
                && !mods.control
                && !mods.alt
            {
                self.find_query.push_str(ch);
                cx.notify();
            }
        }
    }

    fn chip_button(
        &self,
        id: impl Into<SharedString>,
        label: impl Into<SharedString>,
        active: bool,
        p: &Palette,
        on_click: impl Fn(&mut Self, &mut Window, &mut Context<Self>) + 'static,
        cx: &mut Context<Self>,
    ) -> impl IntoElement {
        let bg = if active { p.accent } else { p.card };
        let fg = if active { p.accent_text } else { p.text };
        div()
            .id(gpui::ElementId::Name(id.into()))
            .px_2p5()
            .py_1()
            .rounded_md()
            .bg(bg)
            .border_1()
            .border_color(if active { p.accent } else { p.border })
            .text_xs()
            .text_color(fg)
            .cursor_pointer()
            .hover(|s| s.opacity(0.88))
            .on_click(cx.listener(move |this, _, window, cx| on_click(this, window, cx)))
            .child(label.into())
    }

    fn render_control_view(&mut self, p: &Palette, cx: &mut Context<Self>) -> impl IntoElement {
        let snap = self.ls.snapshot();
        let (phase_label, phase_color) = match &snap.phase {
            LsPhase::Ready { port, pid } => (format!("Ready · 127.0.0.1:{port} · PID {pid}"), p.ok),
            LsPhase::Starting => ("Starting language_server.exe...".to_owned(), p.warn),
            LsPhase::Stopped => ("Stopped".to_owned(), p.muted),
            LsPhase::Failed(e) => (format!("Error: {e}"), p.warn),
        };
        let (journal_n, inbox_n, mem_files) = &self.learning_stats;
        let plugins_text = if snap.plugins.is_empty() {
            "Waiting for LS RPC...".to_owned()
        } else {
            snap.plugins.join(" · ")
        };
        let log_tail: Vec<String> = snap.logs.iter().rev().take(18).rev().cloned().collect();

        div()
            .size_full()
            .p_4()
            .gap_3()
            .flex()
            .flex_col()
            .overflow_hidden()
            .child(
                div()
                    .flex()
                    .gap_3()
                    .child(
                        div()
                            .flex_1()
                            .p_3()
                            .rounded_lg()
                            .bg(p.card)
                            .border_1()
                            .border_color(p.border)
                            .flex()
                            .flex_col()
                            .gap_1p5()
                            .child(div().text_sm().text_color(p.accent).child("Antigravity 2.0 + Language Server"))
                            .child(div().text_xs().text_color(phase_color).child(phase_label))
                            .child(div().text_xs().text_color(p.muted).child(format!(
                                "Version {} · Conversations: {} · Plugins: {}",
                                self.env.agy_version, snap.conversations_count, plugins_text
                            )))
                            .child(
                                div()
                                    .flex()
                                    .gap_2()
                                    .pt_1()
                                    .child(self.chip_button(
                                        "ctl-restart-ls",
                                        "Restart LS",
                                        false,
                                        p,
                                        |this, _, cx| {
                                            this.agy_loaded_port = None;
                                            this.ls.restart();
                                            this.action_status = "Restarting language_server.exe".to_owned();
                                            cx.notify();
                                        },
                                        cx,
                                    ))
                                    .child(self.chip_button(
                                        "ctl-refresh-rpc",
                                        "Refresh RPC",
                                        false,
                                        p,
                                        |this, _, cx| {
                                            this.ls.refresh_rpc();
                                            this.action_status = "Refreshed ConnectRPC".to_owned();
                                            cx.notify();
                                        },
                                        cx,
                                    )),
                            ),
                    )
                    .child(
                        div()
                            .flex_1()
                            .p_3()
                            .rounded_lg()
                            .bg(p.card)
                            .border_1()
                            .border_color(p.border)
                            .flex()
                            .flex_col()
                            .gap_1p5()
                            .child(div().text_sm().text_color(p.accent).child("Gemini Desktop + Autonomous Learning"))
                            .child(div().text_xs().text_color(p.text).child(format!(
                                "Gemini App {} · Journal: {} · Inbox digests: {} · Memories: {}",
                                self.env.gemini_app_version,
                                journal_n,
                                inbox_n,
                                mem_files.len()
                            )))
                            .child(div().text_xs().text_color(p.muted).child(if mem_files.is_empty() {
                                "No memory topics yet".to_owned()
                            } else {
                                mem_files.join(" · ")
                            }))
                            .child(
                                div()
                                    .flex()
                                    .gap_2()
                                    .pt_1()
                                    .child(self.chip_button(
                                        "ctl-distill",
                                        "Distill Journal",
                                        false,
                                        p,
                                        |this, _, cx| {
                                            this.run_gemini_script(&["scripts/learn.ts", "distill"], "distill", cx);
                                        },
                                        cx,
                                    ))
                                    .child(self.chip_button(
                                        "ctl-sync",
                                        "Sync GEMINI.md + FTS5",
                                        false,
                                        p,
                                        |this, _, cx| {
                                            this.run_gemini_script(&["scripts/sync.ts"], "sync", cx);
                                        },
                                        cx,
                                    ))
                                    .child(self.chip_button(
                                        "ctl-check",
                                        "Run Check Gates",
                                        false,
                                        p,
                                        |this, _, cx| {
                                            this.run_gemini_script(&["scripts/check.ts"], "check", cx);
                                        },
                                        cx,
                                    )),
                            ),
                    ),
            )
            .child(
                div()
                    .flex_1()
                    .p_3()
                    .rounded_lg()
                    .bg(p.card)
                    .border_1()
                    .border_color(p.border)
                    .flex()
                    .flex_col()
                    .gap_1()
                    .overflow_hidden()
                    .child(div().text_xs().text_color(p.accent).child("language_server.exe Live Log Tail"))
                    .children(log_tail.into_iter().map(|line| {
                        div().text_xs().text_color(p.muted).truncate().child(line)
                    })),
            )
    }
}

impl Render for Dashboard {
    fn render(&mut self, window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        self.ensure_webviews_deferred(window, cx);
        let p = Palette::from_dark(self.dark);
        let snap = self.ls.snapshot();
        let ls_badge = match &snap.phase {
            LsPhase::Ready { port, .. } => format!("LS :{port}"),
            LsPhase::Starting => "LS starting".to_owned(),
            LsPhase::Stopped => "LS stopped".to_owned(),
            LsPhase::Failed(_) => "LS error".to_owned(),
        };
        let (agy_nav, gem_nav) = {
            let b = self.webviews.borrow();
            match b.as_ref() {
                Some(v) => (
                    v.agy_nav.lock().map(|g| g.url.clone()).unwrap_or_default(),
                    v.gemini_nav.lock().map(|g| g.url.clone()).unwrap_or_default(),
                ),
                None => (String::new(), String::new()),
            }
        };

        let agy_bounds_ref = Rc::clone(&self.agy_bounds);
        let gem_bounds_ref = Rc::clone(&self.gemini_bounds);
        let webviews_for_agy = Rc::clone(&self.webviews);
        let webviews_for_gem = Rc::clone(&self.webviews);
        let current_mode = self.mode;

        let body: gpui::AnyElement = match self.mode {
            ViewMode::Control => self.render_control_view(&p, cx).into_any_element(),
            ViewMode::Split => div()
                .flex_1()
                .flex()
                .gap_1()
                .p_1()
                .child(
                    div()
                        .flex_1()
                        .h_full()
                        .rounded_md()
                        .border_1()
                        .border_color(if self.active_pane == ActivePane::Antigravity {
                            p.accent
                        } else {
                            p.border
                        })
                        .child(canvas(
                            |_, _, _| {},
                            move |bounds, _, _, _| {
                                *agy_bounds_ref.borrow_mut() = Some(bounds);
                                if let Some(v) = webviews_for_agy.borrow_mut().as_mut() {
                                    v.place_agy(Some(bounds));
                                }
                            },
                        ).size_full()),
                )
                .child(
                    div()
                        .flex_1()
                        .h_full()
                        .rounded_md()
                        .border_1()
                        .border_color(if self.active_pane == ActivePane::Gemini {
                            p.accent
                        } else {
                            p.border
                        })
                        .child(canvas(
                            |_, _, _| {},
                            move |bounds, _, _, _| {
                                *gem_bounds_ref.borrow_mut() = Some(bounds);
                                if let Some(v) = webviews_for_gem.borrow_mut().as_mut() {
                                    v.place_gemini(Some(bounds));
                                }
                            },
                        ).size_full()),
                )
                .into_any_element(),
            ViewMode::Antigravity => div()
                .flex_1()
                .p_1()
                .child(canvas(
                    |_, _, _| {},
                    move |bounds, _, _, _| {
                        *agy_bounds_ref.borrow_mut() = Some(bounds);
                        if let Some(v) = webviews_for_agy.borrow_mut().as_mut() {
                            v.place_agy(Some(bounds));
                            v.place_gemini(None);
                        }
                    },
                ).size_full())
                .into_any_element(),
            ViewMode::Gemini => div()
                .flex_1()
                .p_1()
                .child(canvas(
                    |_, _, _| {},
                    move |bounds, _, _, _| {
                        *gem_bounds_ref.borrow_mut() = Some(bounds);
                        if let Some(v) = webviews_for_gem.borrow_mut().as_mut() {
                            v.place_gemini(Some(bounds));
                            v.place_agy(None);
                        }
                    },
                ).size_full())
                .into_any_element(),
            ViewMode::Minichat => div()
                .flex_1()
                .p_2()
                .flex()
                .justify_end()
                .child(
                    div()
                        .w(px(440.0))
                        .h_full()
                        .rounded_lg()
                        .border_1()
                        .border_color(p.accent)
                        .child(canvas(
                            |_, _, _| {},
                            move |bounds, _, _, _| {
                                *gem_bounds_ref.borrow_mut() = Some(bounds);
                                if let Some(v) = webviews_for_gem.borrow_mut().as_mut() {
                                    v.place_gemini(Some(bounds));
                                    v.place_agy(None);
                                }
                            },
                        ).size_full()),
                )
                .into_any_element(),
        };

        div()
            .id("dashboard-root")
            .track_focus(&self.focus_handle)
            .on_key_down(cx.listener(Self::on_key_down))
            .size_full()
            .bg(p.bg)
            .text_color(p.text)
            .flex()
            .flex_col()
            .child(
                div()
                    .w_full()
                    .px_3()
                    .py_1p5()
                    .bg(p.panel)
                    .border_b_1()
                    .border_color(p.border)
                    .flex()
                    .items_center()
                    .justify_between()
                    .gap_2()
                    .child(
                        div()
                            .flex()
                            .items_center()
                            .gap_1p5()
                            .child(div().text_sm().text_color(p.accent).child("Aphrody × Gemini GPUI"))
                            .children([
                                ViewMode::Split,
                                ViewMode::Antigravity,
                                ViewMode::Gemini,
                                ViewMode::Minichat,
                                ViewMode::Control,
                            ]
                            .into_iter()
                            .map(|m| {
                                self.chip_button(
                                    format!("mode-{}", m.label()),
                                    m.label(),
                                    current_mode == m,
                                    &p,
                                    move |this, _, cx| this.set_mode(m, cx),
                                    cx,
                                )
                            })),
                    )
                    .child(
                        div()
                            .flex()
                            .items_center()
                            .gap_1()
                            .child(self.chip_button(
                                "pane-toggle",
                                match self.active_pane {
                                    ActivePane::Antigravity => "Target: Agy",
                                    ActivePane::Gemini => "Target: Gemini",
                                },
                                false,
                                &p,
                                |this, _, cx| {
                                    this.active_pane = match this.active_pane {
                                        ActivePane::Antigravity => ActivePane::Gemini,
                                        ActivePane::Gemini => ActivePane::Antigravity,
                                    };
                                    cx.notify();
                                },
                                cx,
                            ))
                            .child(self.chip_button("nav-back", "<", false, &p, |this, _, _| this.eval_active("history.back()"), cx))
                            .child(self.chip_button("nav-fwd", ">", false, &p, |this, _, _| this.eval_active("history.forward()"), cx))
                            .child(self.chip_button("nav-reload", "Reload", false, &p, |this, _, _| this.eval_active("location.reload()"), cx))
                            .child(self.chip_button("nav-home", "Home", false, &p, |this, _, _| this.go_home(), cx))
                            .child(self.chip_button("zoom-out", "-", false, &p, |this, _, cx| this.adjust_zoom(Some(-0.1), cx), cx))
                            .child(self.chip_button("zoom-reset", "100%", false, &p, |this, _, cx| this.adjust_zoom(None, cx), cx))
                            .child(self.chip_button("zoom-in", "+", false, &p, |this, _, cx| this.adjust_zoom(Some(0.1), cx), cx))
                            .child(self.chip_button("find-btn", "Find", self.find_open, &p, |this, _, cx| {
                                this.find_open = !this.find_open;
                                cx.notify();
                            }, cx))
                            .child(self.chip_button("devtools", "DevTools", false, &p, |this, _, _| this.open_devtools(), cx))
                            .child(self.chip_button("theme-toggle", if self.dark { "Light" } else { "Dark" }, false, &p, |this, _, cx| {
                                this.dark = !this.dark;
                                cx.notify();
                            }, cx))
                            .child(div().px_2().text_xs().text_color(p.ok).child(ls_badge)),
                    ),
            )
            .when(self.find_open, |root| {
                root.child(
                    div()
                        .w_full()
                        .px_3()
                        .py_1()
                        .bg(p.card)
                        .border_b_1()
                        .border_color(p.border)
                        .flex()
                        .items_center()
                        .gap_2()
                        .child(div().text_xs().text_color(p.muted).child("Find:"))
                        .child(
                            div()
                                .min_w(px(220.0))
                                .px_2()
                                .py_0p5()
                                .rounded_sm()
                                .bg(p.bg)
                                .border_1()
                                .border_color(p.accent)
                                .text_xs()
                                .child(if self.find_query.is_empty() {
                                    "Type query, Enter = next".to_owned()
                                } else {
                                    self.find_query.clone()
                                }),
                        )
                        .child(self.chip_button("find-prev", "Prev", false, &p, |this, _, _| this.run_find(true), cx))
                        .child(self.chip_button("find-next", "Next", false, &p, |this, _, _| this.run_find(false), cx))
                        .child(self.chip_button("find-close", "Close", false, &p, |this, _, cx| {
                            this.find_open = false;
                            cx.notify();
                        }, cx)),
                )
            })
            .child(body)
            .child(
                div()
                    .w_full()
                    .px_3()
                    .py_1()
                    .bg(p.panel)
                    .border_t_1()
                    .border_color(p.border)
                    .flex()
                    .justify_between()
                    .text_xs()
                    .text_color(p.muted)
                    .child(format!("Agy: {agy_nav} | Gemini: {gem_nav}"))
                    .child(format!(
                        "{} | Inbox: {} | {}",
                        self.action_status,
                        self.learning_stats.1,
                        self.env.gemini_home.display()
                    )),
            )
    }
}

fn main() {
    application().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(1480.0), px(920.0)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |window, cx| cx.new(|cx| Dashboard::new(window, cx)),
        )
        .expect("open fused gemini + antigravity gpui window");
        cx.activate(true);
    });
}
