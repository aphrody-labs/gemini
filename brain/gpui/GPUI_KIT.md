# GPUI Kit 0.10.0 Digest

> One consumer crate (`gpui_kit::*`, `gpui_kit::base`, `gpui_kit::component`, `gpui_kit::assets`, `gpui_kit::platform`). Zero `mod.rs` in Aphrody tree; default `gpui-fast` blanket `IntoElement`.

## Architectural Rules

1. **Strict Behavior vs Presentation Seam**:
   - `gpui-base` (79 modules): owns layout, focus trap, state transitions, keyboard nav, AccessKit semantics, and motion primitives — zero hardcoded colors/spacing.
   - `gpui-component` (70 public modules): styled component facade applying `cx.theme()` (`ActiveTheme`), icons (`gpui-kit-assets`), and typography.
   - Application layer composes `gpui_kit::component::*` without re-implementing interaction state.
2. **Component-Family Ownership Contract** (from `conventions.md`):
   - Command: `Button::new("id").on_click(...)` — application executes command.
   - Boolean request: `Checkbox::new("id")` / `Switch::new("id")` / `Radio::new("id")` — pass `.checked(bool)` and handle `.on_change(cx.listener(|this, next, _, cx| { this.val = *next; cx.notify(); }))`.
   - Option group: `RadioGroup::new("id").selected_index(Option<usize>).on_change(...)`.
   - Retained editors/controls: `Input::new(&self.state)`, `Diff::new(&self.diff)`, `Select::new(&self.select)`, `Table::new(&self.table)` — caller owns `Entity<*State>` and keeps subscriptions.
   - Forms: `Form::new().label_layout(Axis::Horizontal|Vertical).columns(n).child(Field::new()...).footer(el)`.
   - Extension traits must be imported explicitly: `ButtonVariants`, `Sizable`, `Disableable`, `ActiveTheme`, `WindowExt`.
3. **Stable Identity & No `pub` Fields Across Seam**:
   - Repeated controls derive `ElementId` from domain keys (never loop indices).
   - Overlays dismiss on `Escape` and return focus to trigger.
   - Integration tests use `#[gpui_kit::test]` and `gpui_kit::test::{TestEventExt, TestWindowExt}` (never sleep loops).

## Coding Guides Sections (24)

- Coding Guides
- Architecture at a glance
- Organize large applications by capability
- Bootstrap and root ownership
- Understand GPUI's phases and contexts
- Choose the right unit
- Use `RenderOnce` for value-like elements
- Use `Entity<T>` for retained behavior
- Elements, views, and behavior systems are different
- State ownership
- Avoid state feedback loops
- Stable identity
- Rendering and composition
- Behavior and presentation boundary
- Theme and styling
- Base font is the application zoom control
- Events, actions, and focus
- Async work and side effects
- Layout, measurement, and scrolling
- Lists, tables, and large data
- Public API design
- Platform and capability boundaries
- File and naming conventions
- Vocabulary is part of the API

## `gpui-component` Public Modules (70)

- **`accordion`** | Exports: `struct Accordion, fn new, fn multiple, fn bordered, fn disabled, fn item`
- **`alert`** | Exports: `enum AlertVariant, struct Alert, fn new, fn info, fn success, fn warning`
- **`attachment`** | Exports: `enum AttachmentStatus, fn is_pending, fn is_uploading, fn is_processing, fn is_failed, fn is_complete`
- **`avatar`**
- **`badge`** | Exports: `struct Badge, fn new, fn dot, fn count, fn icon, fn max`
- **`breadcrumb`** | Exports: `struct Breadcrumb, struct BreadcrumbItem, fn new, fn disabled, fn on_click, fn child`
- **`bubble`** | Exports: `enum BubbleVariant, enum BubbleReactionSide, struct Bubble, fn new, fn alignment, fn with_variant`
- **`button`** | Exports: `fn logical_corners_edges`
- **`carousel`** | Exports: `fn init`
- **`chart`** | Exports: `fn caller_id, struct ChartAppear, fn set_enabled, fn set_key, fn generation, fn update`
- **`checkbox`** | Exports: `struct Checkbox, fn new, fn role, fn tooltip, fn tooltip_show_delay, fn label`
- **`clipboard`** | Exports: `struct Clipboard, fn new, fn label, fn tooltip, fn tooltip_show_delay, fn accessibility_label`
- **`collapsible`** | Exports: `struct Collapsible, fn new, fn open, fn motion_id, fn content`
- **`color_picker`** | Exports: `struct ColorPicker, fn new, fn featured_colors, fn icon, fn label, fn accessibility_label`
- **`combobox`** | Exports: `struct ComboboxTriggerContext, fn selection, fn placeholder, fn is_open, fn is_disabled, fn size`
- **`command`** — A command palette: a search field over a filtered list of commands, with groups, Action keybinding hints and keyboard navigation. [`Command`] owns the entries and rendering policy; [`CommandState`] holds
- **`description_list`** | Exports: `struct DescriptionList, enum DescriptionItem, enum DescriptionText, fn new, fn value, fn span`
- **`dialog`**
- **`diff`** — Readonly, virtualized patch display inspired by Diffs from Pierre. Parse an externally supplied patch into [`DiffFile`]s, retain one [`DiffState`] for all of them in the owner, and build [`Diff`] during rendering. | Exports: `fn init, enum DiffMode, enum DiffHoverHighlight, enum DiffHunkSeparator, enum DiffChangeIndicator, struct DiffAnnotation`
- **`dock`** — The gpui-component appearance for the dock. The layout tree, the persisted schema, the drag geometry, the active-panel state machine and the container entities all live in | Exports: `struct DockToggleEvent, fn placement, fn is_open, fn toggle_dock_by_user, fn report_user_toggle, fn init`
- **`empty`** | Exports: `struct Empty, fn new, fn header, fn content, struct EmptyHeader, fn media`
- **`form`** | Exports: `fn v_form, fn h_form, fn field`
- **`global_state`** | Exports: `fn init`
- **`grid_layout`** — What this design system paints on a grid layout. Base owns the grid: where items sit, the drag, the resize, the keyboard and the layout arithmetic. Everything here is appearance — the gap, the motion | Exports: `fn grid_layout`
- **`group_box`** | Exports: `enum GroupBoxVariant, trait GroupBoxVariants, fn from_str, fn as_str, struct GroupBox, fn new`
- **`highlighter`** | Exports: `fn input_highlighter_factory`
- **`history`**
- **`hover_card`** | Exports: `struct HoverCard, fn new, fn anchor, fn trigger, fn trigger_style, fn content`
- **`input`** | Exports: `struct Tree, fn init`
- **`kbd`** | Exports: `struct Kbd, fn new, fn keystroke, fn appearance, fn outline, fn binding_for_action`
- **`label`** | Exports: `enum HighlightsMatch, fn as_str, fn is_prefix, struct Label, fn new, fn id`
- **`link`** | Exports: `struct Link, fn new, fn href, fn on_click, fn disabled`
- **`list`**
- **`marker`** | Exports: `enum MarkerVariant, enum MarkerLoadingStyle, enum MarkerAlignment, struct Marker, fn new, fn id`
- **`menu`** | Exports: `fn init`
- **`message`** | Exports: `enum MessageAlignment, fn is_right, struct MessageGroup, fn new, struct Message, fn alignment`
- **`message_scroller`** | Exports: `struct MessageScrollerState, fn new, fn item_count, fn is_scrolled_up, fn is_following_tail, fn logical_scroll_top`
- **`native_menu`** — A menu rendered natively by the operating system. Unlike [`crate::menu::PopupMenu`], which is drawn by GPUI and therefore clipped to the window bounds, [`NativeMenu`] is rendered by the OS. It can | Exports: `struct NativeMenu, fn new, fn menu, fn menu_with_disabled, fn menu_with_check, fn menu_with_icon`
- **`notification`** | Exports: `enum NotificationType, enum NotificationDelivery, fn includes_in_app, fn includes_system, enum NotificationId, struct Notification`
- **`pagination`** | Exports: `struct Pagination, fn new, fn current_page, fn total_pages, fn on_click, fn compact`
- **`plot`** — Plotting for GPUI Component's charts. The unstyled primitives — scales, shapes, axes, grids, labels, [`Plot`] and [`PlotElement`] — live in [`gpui_base::plot`] and are re-exported here.
- **`popover`** | Exports: `fn init, fn dropdown_popup, struct Popover, fn new, fn anchor, fn offset`
- **`progress`**
- **`questionnaire`** — Composable questionnaire controls. The behavior — answers, validation, navigation, focus and shortcuts — lives in [`gpui_base::questionnaire`]; this module is its skin. The public path | Exports: `fn init`
- **`radio`** | Exports: `struct Radio, fn new, fn tooltip, fn tooltip_show_delay, fn label, fn accessibility_label`
- **`rating`** | Exports: `struct Rating, fn new, fn with_size, fn disabled, fn color, fn value`
- **`resizable`** — What this design system paints inside a resize handle. Base owns the band, the cursor and the drag; everything here is appearance. A divider rests as the same hairline it has always been, and answers the | Exports: `fn h_resizable, fn v_resizable, fn resize_handle, fn resize_handle_appearance, fn render_resize_handle`
- **`scroll`**
- **`searchable_list`**
- **`select`** | Exports: `struct Caret, fn new, fn text_color, enum SelectEvent, struct SelectState, struct Select`
- **`separator`** | Exports: `enum SeparatorStyle, struct Separator, fn vertical, fn horizontal, fn vertical_dashed, fn horizontal_dashed`
- **`setting`**
- **`sheet`** | Exports: `fn init, fn physical_placement, struct SheetSettings, struct Sheet, fn new, fn title`
- **`shimmer`** | Exports: `enum ShimmerSpread, struct ShimmerStyle, fn new, fn duration, fn highlight_color, fn spread`
- **`sidebar`** | Exports: `enum SidebarCollapsible, trait SidebarItem, struct Sidebar, fn new, fn side, fn collapsible`
- **`skeleton`** | Exports: `struct Skeleton, fn new, fn secondary`
- **`slider`** | Exports: `struct Slider, fn new, fn horizontal, fn vertical, fn disabled, fn accessibility_label`
- **`speech`** — Speech input: capture audio, recognize it and hand the text to the caller. [`SpeechState`] owns a session and [`SpeechButton`], [`SpeechIndicator`] and [`SpeechWaveform`] render it. Recognition and audio capture are both replaceable:
- **`spinner`** | Exports: `struct Spinner, fn new, fn icon, fn color, fn ease`
- **`status_bar`** | Exports: `struct StatusBar, fn new, fn left, fn right`
- **`stepper`**
- **`switch`** | Exports: `struct Switch, fn new, fn checked, fn label, fn accessibility_label, fn on_click`
- **`tab`**
- **`table`** | Exports: `fn init`
- **`tag`** | Exports: `enum TagVariant, struct Tag, fn new, fn primary, fn secondary, fn danger`
- **`text`** — Compatibility facade for rich text now owned by `gpui-base`. | Exports: `fn base_text_view_style, fn install_text_view_defaults, fn component_code_block_highlighter, type SharedCodeBlockHighlighter, fn shared_code_block_highlighter`
- **`theme`** | Exports: `fn init, trait ActiveTheme, struct Theme, fn global, fn global_mut, fn update`
- **`toolbar`** | Exports: `struct ToolbarGroup, fn new, fn label, fn child, fn children, fn content`
- **`tooltip`** | Exports: `fn init, struct Tooltip, fn new, fn element, fn action, fn key_binding`
- **`tree`** | Exports: `fn tree, struct Tree, fn new, fn context_menu, fn scroll_bounce`

## `gpui-base` Foundation Modules (79)

- **`a11y_disabled`** — Disabled semantics on a control's accessibility node. GPUI has no `aria_disabled` setter, so a disabled control would reach assistive technology as one that accepts input. [`A11yDisabledExt`] wraps the | Exports: `struct A11yDisabled, fn new, trait A11yDisabledExt`
- **`accordion`** | Exports: `struct Accordion, fn new, struct AccordionItem, fn open, fn disabled, fn header`
- **`actions`** — Common actions shared by keyboard-driven GPUI controls. | Exports: `struct Confirm`
- **`alert_dialog`** | Exports: `fn new, struct AlertDialogTrigger, fn on_open, fn handle, struct AlertDialogAction, struct AlertDialog`
- **`animation`** | Exports: `fn cubic_bezier, fn unclamped_cubic_bezier, fn ease_out_cubic, fn ease_in_cubic, fn ease_in_out_cubic, trait Lerp`
- **`async_util`** — Cross-platform async channel primitives for native and WASM targets.
- **`auto_scroll`** | Exports: `struct AutoScroll, fn delta, fn compute_delta, fn set, fn is_active, fn stop`
- **`avatar`** | Exports: `struct Avatar, fn new, fn image, fn fallback, struct AvatarImage, struct AvatarFallback`
- **`button`** | Exports: `struct Button, fn new, fn disabled, fn is_disabled, fn selected, fn styles`
- **`calendar`** | Exports: `enum Date, fn is_some, fn is_complete, fn start, fn end, fn format`
- **`checkbox`** | Exports: `enum CheckboxState, struct Checkbox, fn new, fn role, fn state, fn checked`
- **`collapsible`** | Exports: `struct Collapsible, fn new, fn open, fn content, fn reveal`
- **`color_picker`** | Exports: `fn init, enum ColorPickerEvent, struct HslaSliders, fn hue, fn saturation, fn lightness`
- **`combobox`** | Exports: `fn init, struct Combobox, fn new, fn open, fn disabled, fn focus_handle`
- **`component_traits`** | Exports: `trait Selectable, trait Disableable, trait FocusableExt, trait Collapsible`
- **`date_picker`** | Exports: `struct DatePicker, fn new, fn open, fn disabled, fn on_open_change`
- **`dialog`** | Exports: `enum DialogChangeReason, struct DialogHandle, fn new, fn is_open, fn open, fn close`
- **`dock`** — Dockable layout: splits and tab groups that a host can rearrange, persist, and restore — with no appearance of its own. # The tree is the source of truth
- **`element_ext`** | Exports: `trait ElementExt`
- **`event`** | Exports: `trait OngoingScrollExt, trait InteractiveElementExt`
- **`focus_trap`** | Exports: `fn init, trait FocusTrapElement, struct FocusTrapManager, fn global, struct FocusTrapContainer, fn new`
- **`geometry`** | Exports: `enum Placement, fn is_horizontal, fn is_vertical, fn axis, enum Side, fn is_left`
- **`global_state`** | Exports: `struct DeferredPopover, struct GlobalState, fn note_touch, fn is_touch_press, fn init, fn suppress_text_selection`
- **`grid_layout`** — A grid whose items the user drags and resizes into place. [`GridLayoutState`] owns the layout — one [`GridArea`] per item, in grid cells — and the rules it settles under; [`GridLayout`] places each | Exports: `fn init`
- **`history`** | Exports: `struct History, fn new, fn max_entries, fn push, fn current, fn replace_current`
- **`hover_card`** | Exports: `struct HoverCard, fn new, fn anchor, fn trigger, fn content, fn open_delay`
- **`index_path`** | Exports: `struct IndexPath, fn new, fn section, fn row, fn column, fn eq_row`
- **`input`** — Text input: the shared editing engine and the three states built on it. Nothing here should be `pub` unless it is reachable from outside the crate. A `pub` on an item behind a private module says something the module path | Exports: `const MASK_CHAR, fn init`
- **`layout_direction`** — The application's layout direction. Right-to-left support is one global setting, not a switch on each component: [`LayoutDirection::global`] says whether the interface reads | Exports: `enum LayoutDirection, fn is_rtl, fn global, fn set_global, fn from_locale, fn system`
- **`link`** | Exports: `struct Link, struct LinkStyles, fn disabled, fn new, fn href, fn open_with`
- **`list_settings`** | Exports: `struct ListSettings`
- **`macos_accessibility`** | Exports: `fn install_window_hit_test_forwarder`
- **`measure`** | Exports: `fn measurement_enabled, fn measure_if, fn measure, struct Measure, fn new, fn end`
- **`motion`** | Exports: `trait Interpolate, struct MotionTransform, fn identity, enum ReducedMotion, struct Transition, fn new`
- **`nav_stack`** | Exports: `enum NavOperation, enum NavMotion, enum NavStackEvent, struct NavStackState, fn new, fn depth`
- **`number_input`** | Exports: `fn init, enum StepAction, enum NumberStep, fn by_value, fn value, enum NumberInputEvent`
- **`observe`** — Registers native elements without accepting a second description of their state. | Exports: `type ObservedElement, trait TestSupportExt, type ObservedTextElement, trait TestTextExt`
- **`otp_input`** | Exports: `enum OtpEvent, struct OtpState, fn new, fn default_value, fn set_value, fn value`
- **`overscroll`** — Boundary displacement shared by inputs and scroll viewports. Viewport owners keep their logical scroll position clamped and apply this displacement only to content geometry. Inputs drive it directly, while | Exports: `struct Overscroll, fn set_motion, fn offset, fn touch_phase, fn packet, fn step`
- **`pagination`** | Exports: `enum PaginationItem, struct PaginationState, fn new, fn visible_pages, fn disabled, fn on_change`
- **`plot`** — Unstyled plotting: scales, shapes, axes, grids, labels, and the element and hover tracking behind every [`Plot`]. Colors are always handed in by the caller. A styled layer supplies chart | Exports: `struct PlotMotion, fn with_pointer, fn with_enter, fn with_exit, fn with_appear, fn pointer`
- **`popover`** | Exports: `fn init, struct PopoverState, fn new, fn is_open, fn dismiss, fn show`
- **`popup`** | Exports: `const POPUP_PRIORITY, struct Popup, fn new, fn anchor, fn offset, fn on_position`
- **`positioner`** — Shared popup positioning. Every anchored surface in Base resolves its position here so that flipping, alignment, and viewport clamping cannot drift apart between popups, | Exports: `enum Align, struct ResolvedPosition, struct Positioner, struct PositionerState, fn side, fn corner`
- **`progress`** | Exports: `struct Progress, fn new, fn value, fn indeterminate, fn accessibility_label`
- **`questionnaire`** — Questionnaire behavior: answers, validation, navigation, focus and shortcuts. The state machine lives here so an application can replace the visual language without reimplementing it. `gpui-component` owns the skin.
- **`radio`** | Exports: `struct Radio, struct RadioStyles, fn checked, fn disabled, fn new, fn id`
- **`radio_group`** | Exports: `struct RadioGroup, fn new, fn axis`
- **`reduce_motion`** — Honors the operating system's reduced-motion preference. Every Base transition, spring, presence and reveal consults [`App::reduce_motion`], but GPUI never reads the platform's setting into | Exports: `fn init, fn apply_system_reduce_motion, enum ReduceMotionPreference, fn set_reduce_motion_preference`
- **`resizable`** | Exports: `const PANEL_MIN_SIZE, fn h_resizable, fn v_resizable, fn resizable_panel, struct ResizableState, fn sizes`
- **`root`** — Window roots and presentation-layer plugins. | Exports: `fn init, trait RootPlugin, struct Root, fn register_plugin, fn new, fn view`
- **`scroll_bounce`** — Boundary displacement only: the list keeps its clamped logical position. | Exports: `struct ScrollBounceMotion, fn with_tracking, fn with_response, fn with_max_stretch, fn tracking, fn response`
- **`scrollable_mask`** | Exports: `struct HorizontalScrollClaim, fn at, fn delta_x, fn last_horizontal_scroll_claim, fn horizontal_scroll_area, struct RoundedFrameCover`
- **`scrollbar`** | Exports: `enum ScrollbarMode, trait ScrollbarHandle, enum ScrollbarEntrance, struct ScrollbarMotion, fn with_idle, fn with_enter`
- **`select`** | Exports: `fn init, struct Select, fn new, fn open, fn disabled, fn focus_handle`
- **`selectable_text`** | Exports: `struct SelectableText, fn new, fn with_handle, fn document_order, fn text_style, fn highlights`
- **`sheet`** | Exports: `fn init, struct Sheet, fn new, fn overlay, fn surface, fn overlay_closable`
- **`slider`** | Exports: `enum SliderEvent, enum SliderValue, fn clamp, fn is_single, fn is_range, fn start`
- **`state_style`** | Exports: `struct StateStyle, fn into_refinement, fn resolve_style`
- **`styled`** | Exports: `enum RoleOverride, fn resolve, fn h_flex, fn v_flex, fn box_shadow, trait StyledExt`
- **`switch`** | Exports: `struct Switch, struct SwitchStyles, fn checked, fn disabled, struct SwitchTrack, struct SwitchTrackStyles`
- **`table`** | Exports: `fn new, struct Table, fn row_count, fn column_count, fn accessibility_label, struct TableRow`
- **`tabs`** | Exports: `struct Tab, fn new, fn id, fn selected, fn disabled, fn accessibility_label`
- **`test_support`** — Opt-in headless observation built exclusively on public GPUI APIs. Native accessibility properties are read automatically. Applications register identified GPUI elements with `.test_support()`, without supplying test-only state. | Exports: `struct ElementSnapshot, fn role, fn path, fn checked, fn indeterminate, fn selected`
- **`text`** | Exports: `fn init, fn markdown, fn html, enum Text, fn style, fn get_text`
- **`text_boundary`** | Exports: `fn word_range_from_chars, fn word_range_at, fn line_range_at`
- **`text_selection`** | Exports: `struct TextSelectionScopeId, fn new, struct TextSelectionContentKey, const fn, struct TextSelectionEndpoint`
- **`theme`** | Exports: `enum ThemeAppearance, struct Theme, fn global, fn global_mut, trait ActiveTheme, struct ScrollbarTheme`
- **`theme_tokens`** — Semantic design tokens shared by application-owned components. These tokens describe visual roles and scales. They intentionally do not contain component names such as `button`, `table`, or `sidebar`. | Exports: `struct SemanticThemeTokens, struct ColorTokens, fn light, fn dark, struct RadiusTokens, struct SpacingTokens`
- **`time_field`** | Exports: `fn init, enum TimePrecision, fn format, fn truncate, enum HourCycle, enum TimeSegment`
- **`toast`** | Exports: `struct ToastMotion, fn sonner, struct ToastStackState, fn is_expanded, struct ToastOptions, struct ToastAdvance`
- **`toggle`** | Exports: `struct Toggle, struct ToggleStyles, fn pressed, fn disabled, fn new, fn styles`
- **`toggle_group`** | Exports: `struct ToggleGroup, fn new, fn axis`
- **`toolbar`** | Exports: `struct Toolbar, fn new, fn disabled, fn axis, struct ToolbarGroup, fn label`
- **`tooltip`** | Exports: `struct Tooltip, fn new, struct TooltipDefaults, fn with_show_delay, fn with_grace_period, fn show_delay`
- **`touch_selection`** — Touch selection geometry shared by the input engine and window text selection. A touch selection is one made by a long press. It differs from a pointer | Exports: `enum SelectionEdge, const fn, struct TouchSelectionSnapshot`
- **`tree`** | Exports: `fn init, const fn, struct TreeItem, struct TreeEntry, fn new, fn item`
- **`undo_history`** | Exports: `struct UndoHistory, fn new, fn max_undos, fn group_interval, fn start_grouping, fn end_grouping`
- **`virtual_list`** — Virtual List for render a large number of differently sized rows/columns. > NOTE: This must ensure each column width or row height. Only visible range are rendered for performance reasons. | Exports: `struct VirtualListScrollHandle, fn new, fn base_handle, fn scroll_to_item, fn scroll_to_bottom, fn v_virtual_list`

## Conventions Snapshot

# Component-family conventions

Use this page to predict a component's shape before reading its detailed API. These conventions describe Rust GPUI Component. JavaScript uses its host's generated catalog; a Rust method is not automatically a JavaScript method.

## Choose the family

| Task | Family and constructor | State owner | Event or composition |
| --- | --- | --- | --- |
| Execute a command | `Button::new("save")` | Application owns the operation | `on_click` receives a click event |
| Change a boolean | `Checkbox::new("remember")`, `Switch::new("enabled")`, `Radio::new("choice")` | Application supplies `checked(bool)` | `on_change` receives the requested `&bool` |
| Choose one radio option | `RadioGroup::new("delivery")` | Application supplies `selected_index(Option<usize>)` | `on_change` receives the requested `&usize` |
| Edit retained text | `Input::new(&self.input)` | View retains `Entity<InputState>` | Retain the subscription; handle `InputEvent` |
| Display a supplied patch | `Diff::new(&self.diff)` | View retains `Entity<DiffState>`; application parses supplied unified/Git diff with `DiffFile::parse`; one state shows all files | Readonly `RenderOnce` element; retain subscriptions to `DiffEvent` when needed |
| Lay out fields | `Form::new()` | Children retain their own state | `child(Field)`, `columns`, `label_layout`, `footer` |
| Supply a compound part | `Field::new()`, `Tab::new()` | Containing component owns placement/selection | Read the parent's accepted child type |

Constructors establish the component family's ownership model. Do not infer that every `new` takes an ID or that every `child` accepts an arbitrary element. Keep domain IDs stable when controls are reordered. Positional selection APIs remain positional; applications map them to domain identity when needed.

## A value request is different from a command

For Checkbox, Switch, Radio, and RadioGroup, use the same owner-update pattern:

```rust
Switch::new("enabled")
    .checked(self.enabled)
    .on_change(cx.listener(|this, next, _, cx| {

## Crate Root Summary (`crates/gpui-kit/src/lib.rs`)

- Doc summary: GPUI Kit: one dependency for building desktop applications with GPUI. GPUI itself is published as a family of `gpui-pre-*` crates that move together. This crate depends on the matching set for you, so an
