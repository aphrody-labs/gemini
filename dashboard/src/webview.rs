use std::path::Path;
use std::sync::{Arc, Mutex};

use gpui::{Bounds, Pixels, Window};
use raw_window_handle::{HasWindowHandle, RawWindowHandle, WindowHandle};
use wry::{
    WebContext, WebView, WebViewBuilder,
    dpi::{LogicalPosition, LogicalSize},
};

pub const GEMINI_HOME_URL: &str = "https://gemini.google.com/app";

struct ParentHandle(RawWindowHandle);

impl HasWindowHandle for ParentHandle {
    fn window_handle(&self) -> Result<WindowHandle<'_>, raw_window_handle::HandleError> {
        Ok(unsafe { WindowHandle::borrow_raw(self.0) })
    }
}

#[derive(Debug, Clone, Default)]
pub struct PaneNavState {
    pub url: String,
    pub title: String,
}

pub struct DualWebViews {
    _agy_ctx: WebContext,
    _gemini_ctx: WebContext,
    pub agy: WebView,
    pub gemini: WebView,
    pub agy_nav: Arc<Mutex<PaneNavState>>,
    pub gemini_nav: Arc<Mutex<PaneNavState>>,
    last_agy_bounds: Option<(f64, f64, f64, f64, bool)>,
    last_gemini_bounds: Option<(f64, f64, f64, f64, bool)>,
    zoom: f64,
}

impl DualWebViews {
    pub fn build_for_window(
        window: &Window,
        data_root: &Path,
        agy_url: &str,
        app_version: &str,
        device_id: &str,
    ) -> anyhow::Result<Self> {
        let raw = HasWindowHandle::window_handle(window)?.as_raw();
        let parent = ParentHandle(raw);

        let agy_dir = data_root.join("antigravity");
        let gem_dir = data_root.join("gemini");
        std::fs::create_dir_all(&agy_dir)?;
        std::fs::create_dir_all(&gem_dir)?;

        let mut agy_ctx = WebContext::new(Some(agy_dir));
        let mut gemini_ctx = WebContext::new(Some(gem_dir));

        let agy_nav = Arc::new(Mutex::new(PaneNavState {
            url: agy_url.to_owned(),
            title: "Antigravity".to_owned(),
        }));
        let gemini_nav = Arc::new(Mutex::new(PaneNavState {
            url: GEMINI_HOME_URL.to_owned(),
            title: "Google Gemini".to_owned(),
        }));

        let agy_nav_title = Arc::clone(&agy_nav);
        let agy_nav_load = Arc::clone(&agy_nav);
        let agy = WebViewBuilder::new_with_web_context(&mut agy_ctx)
            .with_visible(false)
            .with_additional_browser_args(
                "--ignore-certificate-errors --disable-blink-features=AutomationControlled",
            )
            .with_url(agy_url)
            .with_devtools(true)
            .with_document_title_changed_handler(move |title| {
                if let Ok(mut g) = agy_nav_title.lock() {
                    g.title = title;
                }
            })
            .with_on_page_load_handler(move |_, url| {
                if let Ok(mut g) = agy_nav_load.lock() {
                    g.url = url;
                }
            })
            .build_as_child(&parent)?;

        let gemini_shim = format!(
            "window.geminiNative = window.geminiNative || {{ \
               appVersion: {ver}, \
               localDeviceId: {dev}, \
               log: function() {{}}, \
               syncExperimentFlags: function() {{}}, \
               getCachedFlags: function() {{ return Promise.resolve({{}}); }}, \
               pollExperimentFlagsNow: function() {{ return Promise.resolve({{}}); }} \
             }};",
            ver = serde_json::to_string(app_version).unwrap_or_else(|_| "\"1.19.0\"".to_owned()),
            dev = serde_json::to_string(device_id).unwrap_or_else(|_| "\"gpui\"".to_owned()),
        );

        let gem_nav_title = Arc::clone(&gemini_nav);
        let gem_nav_load = Arc::clone(&gemini_nav);
        let gemini = WebViewBuilder::new_with_web_context(&mut gemini_ctx)
            .with_visible(false)
            .with_additional_browser_args("--disable-blink-features=AutomationControlled")
            .with_initialization_script(&gemini_shim)
            .with_url(GEMINI_HOME_URL)
            .with_devtools(true)
            .with_document_title_changed_handler(move |title| {
                if let Ok(mut g) = gem_nav_title.lock() {
                    g.title = title;
                }
            })
            .with_on_page_load_handler(move |_, url| {
                if let Ok(mut g) = gem_nav_load.lock() {
                    g.url = url;
                }
            })
            .build_as_child(&parent)?;

        Ok(Self {
            _agy_ctx: agy_ctx,
            _gemini_ctx: gemini_ctx,
            agy,
            gemini,
            agy_nav,
            gemini_nav,
            last_agy_bounds: None,
            last_gemini_bounds: None,
            zoom: 1.0,
        })
    }

    pub fn place_agy(&mut self, bounds: Option<Bounds<Pixels>>) {
        place_one(&self.agy, &mut self.last_agy_bounds, bounds);
    }

    pub fn place_gemini(&mut self, bounds: Option<Bounds<Pixels>>) {
        place_one(&self.gemini, &mut self.last_gemini_bounds, bounds);
    }

    pub fn set_zoom(&mut self, zoom: f64) {
        self.zoom = zoom.clamp(0.5, 2.5);
        let _ = self.agy.zoom(self.zoom);
        let _ = self.gemini.zoom(self.zoom);
    }

    pub fn zoom(&self) -> f64 {
        self.zoom
    }
}

fn place_one(
    view: &WebView,
    cache: &mut Option<(f64, f64, f64, f64, bool)>,
    bounds: Option<Bounds<Pixels>>,
) {
    let next = match bounds {
        Some(b) if f32::from(b.size.width) > 4.0 && f32::from(b.size.height) > 4.0 => (
            f64::from(f32::from(b.origin.x)),
            f64::from(f32::from(b.origin.y)),
            f64::from(f32::from(b.size.width)),
            f64::from(f32::from(b.size.height)),
            true,
        ),
        _ => (0.0, 0.0, 0.0, 0.0, false),
    };
    if *cache == Some(next) {
        return;
    }
    *cache = Some(next);
    if next.4 {
        let _ = view.set_bounds(wry::Rect {
            position: LogicalPosition::new(next.0, next.1).into(),
            size: LogicalSize::new(next.2, next.3).into(),
        });
        let _ = view.set_visible(true);
    } else {
        let _ = view.set_visible(false);
    }
}
