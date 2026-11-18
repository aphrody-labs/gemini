# GPUI Core Engine Digest

> Distilled from Aphrody `crates/gpui`, `crates/gpui_wgpu`, `crates/gpui_ui`, `crates/gpui_code`, and `skills/gpui-kit/references/gpui/`.

## Frame Lifecycle & Ownership Model

1. **Three Render Phases (Single Foreground Thread)**:
   - `request_layout(id, inspector_id, window, cx) -> (LayoutId, RequestLayoutState)`: views call `render(&mut self, window, cx) -> impl IntoElement` and emit Taffy nodes.
   - `prepaint(id, inspector_id, bounds, request_layout, window, cx) -> PrepaintState`: Taffy resolves geometry; elements push `Hitbox`, dispatch nodes, listeners, and cursors.
   - `paint(id, inspector_id, bounds, request_layout, prepaint, window, cx)`: elements push quads, sprites, underlines, shadows, and vector `Path`s into `Frame.scene`.
2. **Context Types**:
   - `App`: root state store, globals (`Global`), entity registry, asset source.
   - `Context<T>`: derefs to `App`, bound to `Entity<T>`; exposes `cx.notify()`, `cx.emit()`, `cx.subscribe()`, `cx.observe()`, `cx.listener()`, `cx.spawn(async move |weak, cx| ...)`.
   - `Window`: focus (`FocusHandle`), actions (`window.dispatch_action`), drawing (`paint_quad`, `paint_path`, `paint_layer(|w| ...)`), overlays, animations (`request_animation_frame`).
   - `AsyncApp` / `AsyncWindowContext`: cross-await handles from `cx.spawn` / `window.spawn`.
3. **Entity Discipline**:
   - Store child state as `Entity<S>` owned by the parent view; hold only `WeakEntity<T>` inside closures/async tasks.
   - Never mutate entities inside `render()` or call `cx.notify()` during `prepaint`/`paint` unless state genuinely changed (mandatory for `gpui-fast` view retention).
   - Keep `Task<R>` alive via a field, `.await`, or `.detach()`/`.detach_and_log_err(cx)`.
4. **Vector Paths & Layering (`crates/gpui`)**:
   - `pub struct Path<T = Pixels>` (backward compatible with both Zed `Path` and `gpui-kit` `Path<Pixels>`), `Path::translate(&self, Point<Pixels>) -> Self`.
   - `Window::paint_layer<R>(&mut self, f: impl FnOnce(&mut Self) -> R) -> R`.

## `crates/gpui` Modules (47)

`_accessibility` · `_ownership_and_data_flow` · `action` · `app` · `arena` · `asset_cache` · `assets` · `bench` · `bounds_tree` · `color` · `colors` · `debug_overlay` · `element` · `elements` · `executor` · `geometry` · `gestures` · `global` · `hot_reload` · `input` · `inspector` · `interactive` · `key_dispatch` · `keymap` · `path_builder` · `path_winding` · `platform` · `platform_scheduler` · `prelude` · `profiler` · `queue` · `randomized_element_tree` · `scene` · `seeds` · `shared_uri` · `spring` · `style` · `styled` · `subscription` · `svg_renderer` · `tab_stop` · `taffy` · `test` · `text_system` · `util` · `view` · `window`

## SDK Facade Boundaries

- **`gpui_ui`** (`--no-default-features`): must NEVER pull in `settings_content`, `cloud_llm_client`, or `language_model_core`. Optional features: `kit` (`gpui-kit`), `nsh` (`nsh-base`/`nsh-core`), `nsh-full` (`nsh-platform-gpui`).
  - Prelude exports: fn application, fn headless_application, struct StandaloneThemeSettings, fn init.
- **`gpui_code`** (`--no-default-features`): must NEVER pull in `buffer_diff`, `language`, `rpc`, or `proto`.
  - Exports: fn create_language_registry.

## Reference Topic Map (22 Guides)

### `action.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Key Formats](#key-formats) · [Menu Bar Shortcuts](#menu-bar-shortcuts) · [Action Naming](#action-naming) · [Context-Aware Bindings](#context-aware-bindings) · [Best Practices](#best-practices)
- Topics: `Actions & Keybindings`, `Overview`, `Quick Start`, `Simple Actions`, `Actions with Parameters`, `Key Formats`, `Menu Bar Shortcuts`, `Action Naming`, `Context-Aware Bindings`, `Best Practices`

### `async.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Core Patterns](#core-patterns) · [Common Pitfalls](#common-pitfalls)
- Topics: `Async & Background Tasks`, `Overview`, `Quick Start`, `Foreground Tasks (UI Updates)`, `Spawn with Window Context (spawn_in)`, `Background Tasks (Heavy Work)`, `Task Management`, `Core Patterns`, `1. Async Data Fetching (from Context<Self>)`, `2. Background Computation + UI Update`

### `context.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Common Operations](#common-operations) · [Context Hierarchy](#context-hierarchy) · [cx.listener](#cxlistener--binding-callbacks-to-self) · [subscribe_in](#subscribe_in--subscribe-with-window-access) · [observe_window_activation](#observe_window_activation) · [observe_global](#observe_global) · [defer / defer_in](#defer-and-defer_in) · [Naming Convention](#context-naming-convention)
- Topics: `Context Management`, `Overview`, `Quick Start`, `Context<T> - Component Context`, `App - Global Context`, `Window - Window Context`, `AsyncApp - Async Context`, `Common Operations`, `Entity Operations`, `Notifications and Events`

### `element-advanced.md`
- Summary: **Contents:** [Custom Layout Algorithms](#custom-layout-algorithms) · [Element Composition with Traits](#element-composition-with-traits) · [Async Element Updates](#async-element-updates) · [Element Memoization](#element-memoization) · [Virtual List Pattern](#virtual-list-pattern)
- Topics: `Advanced Element Patterns`, `Custom Layout Algorithms`, `Masonry Layout (Pinterest-Style)`, `Circular Layout`, `Element Composition with Traits`, `Hoverable Trait`, `Clickable Trait`, `Async Element Updates`, `Element Memoization`, `Virtual List Pattern`

### `element-api.md`
- Summary: **Contents:** [Element Trait Structure](#element-trait-structure) · [Associated Types](#associated-types) · [Methods](#methods) · [IntoElement Integration](#intoelement-integration) · [Layout System Integration](#layout-system-integration) · [Hitbox System](#hitbox-system) · [Event Handling](#event-handling) · [Cursor Styles](#cursor-styles)
- Topics: `Element API Reference`, `Element Trait Structure`, `Associated Types`, `RequestLayoutState`, `PrepaintState`, `Methods`, `id()`, `source_location()`, `request_layout()`, `prepaint()`

### `element-best-practices.md`
- Summary: **Contents:** [State Management](#state-management) · [Performance Considerations](#performance-considerations) · [Interaction Handling](#interaction-handling) · [Layout Strategies](#layout-strategies) · [Error Handling](#error-handling) · [Testing Element Implementations](#testing-element-implementations) · [Common Pitfalls](#common-pitfalls) · [Performance Checklist](#performance-checklist)
- Topics: `Element Best Practices`, `State Management`, `Using Associated Types Effectively`, `Managing Complex State`, `State Lifecycle`, `Performance Considerations`, `Minimize Allocations in Paint Phase`, `Cache Expensive Computations`, `Lazy Child Rendering`, `Interaction Handling`

### `element-examples.md`
- Summary: Complete examples of implementing custom elements for various scenarios.
- Topics: `Element Implementation Examples`, `Table of Contents`, `Simple Text Element`, `Interactive Element with Selection`, `Complex Element with Child Management`, `Usage Examples`, `Using SimpleText`, `Using SelectableText`, `Using ComplexElement`

### `element-id.md`
- Summary: `ElementId` is a unique identifier for a GPUI element. It is required for elements that need:
- Topics: `ElementId`, `Making an Element Stateful`, `Accepted Types`, `Uniqueness Rules`, `In Component Structs`, `Usage at Call Sites`

### `element-patterns.md`
- Summary: **Contents:** [Text Rendering Elements](#text-rendering-elements) · [Container Elements](#container-elements) · [Interactive Elements](#interactive-elements) · [Composite Elements](#composite-elements) · [Scrollable Elements](#scrollable-elements) · [Pattern Selection Guide](#pattern-selection-guide)
- Topics: `Common Element Patterns`, `Text Rendering Elements`, `Pattern Characteristics`, `Implementation Template`, `Use Cases`, `Container Elements`, `Interactive Elements`, `Composite Elements`, `Scrollable Elements`, `Pattern Selection Guide`

### `element.md`
- Summary: **Contents:** [When to Use](#when-to-use) · [Quick Start](#quick-start) · [Core Concepts](#core-concepts) · [Reference Documentation](#reference-documentation)
- Topics: `Custom Elements`, `When to Use`, `Quick Start`, `Core Concepts`, `Three-Phase Rendering`, `State Flow`, `Key Operations`, `Reference Documentation`, `Complete API Documentation`

### `entity-advanced.md`
- Summary: **Contents:** [Entity Collections Management](#entity-collections-management) · [Conditional Update Patterns](#conditional-update-patterns) · [Entity State Machine Pattern](#entity-state-machine-pattern) · [Entity Proxy Pattern](#entity-proxy-pattern) · [Cascading Updates Pattern](#cascading-updates-pattern) · [Entity Snapshot Pattern](#entity-snapshot-pattern) · [Entity Transaction Pattern](#entity-transaction-pattern) · [Entity Pool Pattern](#entity-pool-pattern)
- Topics: `Advanced Entity Patterns`, `Entity Collections Management`, `Dynamic Collection with Cleanup`, `Entity Registry Pattern`, `Conditional Update Patterns`, `Debounced Updates`, `Throttled Updates`, `Entity State Machine Pattern`, `Entity Proxy Pattern`, `Cascading Updates Pattern`

### `entity-api.md`
- Summary: **Contents:** [Entity Types](#entity-types) · [Entity Creation](#entity-creation) · [Entity Operations](#entity-operations) · [Context Methods](#context-methods-for-entities) · [Async Operations](#async-operations) · [Entity Lifecycle](#entity-lifecycle) · [EntityId](#entityid) · [Error Handling](#error-handling) · [Type Conversions](#type-conversions)
- Topics: `Entity API Reference`, `Entity Types`, `Entity<T>`, `WeakEntity<T>`, `AnyEntity`, `AnyWeakEntity`, `Entity Creation`, `cx.new()`, `Entity Operations`, `Reading State`

### `entity-best-practices.md`
- Summary: **Contents:** [Avoiding Common Pitfalls](#avoiding-common-pitfalls) · [Performance Optimization](#performance-optimization) · [Entity Lifecycle Management](#entity-lifecycle-management) · [Entity Observation Best Practices](#entity-observation-best-practices) · [Async Best Practices](#async-best-practices) · [Testing Best Practices](#testing-best-practices) · [Performance Checklist](#performance-checklist)
- Topics: `Entity Best Practices`, `Avoiding Common Pitfalls`, `Avoid Re-entrant Entity Access (Same Entity)`, ``defer_in` Re-locks the Entity — Same Rules Apply`, `Render Callbacks Must Not Access External Entities`, `Use Weak References in Closures`, `Use Inner Context in Closures`, `Entity as Props - Use Weak References`, `Performance Optimization`, `Minimize cx.notify() Calls`

### `entity-patterns.md`
- Summary: **Contents:** [Application Scenarios](#application-scenarios) · [Common Patterns](#common-patterns) · [Pattern Selection Guide](#pattern-selection-guide)
- Topics: `Entity Patterns`, `Application Scenarios`, `Model-View Separation`, `Component State Management`, `Cross-Entity Communication`, `Async Operations with Entities`, `Background Task Coordination`, `Common Patterns`, `1. Stateful Components`, `2. Shared State`

### `entity.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Core Principles](#core-principles) · [Common Use Cases](#common-use-cases) · [Extended References](#reference-documentation)
- Topics: `Entity State Management`, `Overview`, `Quick Start`, `Creating and Using Entities`, `In Components`, `Async Operations`, `Core Principles`, `Always Use Weak References in Closures`, `Use Inner Context`, `Avoid Nested Entity Updates`

### `event.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Common Patterns](#common-patterns) · [subscribe_in](#subscribe_in--subscription-with-window-access) · [observe_window_activation](#observe_window_activation) · [observe_global](#observe_global) · [Subscription Lifetime](#subscription-lifetime) · [Best Practices](#best-practices)
- Topics: `Events & Subscriptions`, `Overview`, `Quick Start`, `Define and Emit Events`, `Subscribe to Events`, `Observe Entity Changes`, `Common Patterns`, `1. Parent-Child Communication`, `2. Global Event Broadcasting`, `3. Observer Pattern`

### `focus-handle.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Focus Events](#focus-events) · [Keyboard Navigation](#keyboard-navigation) · [Common Patterns](#common-patterns) · [Best Practices](#best-practices)
- Topics: `Focus & Keyboard Navigation`, `Overview`, `Quick Start`, `Creating Focus Handles`, `Making Elements Focusable`, `Focus Management`, `Focus Events`, `Handling Focus Changes`, `Keyboard Navigation`, `Tab Order`

### `global.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Common Use Cases](#common-use-cases) · [Best Practices](#best-practices) · [When to Use](#when-to-use)
- Topics: `Global State`, `Overview`, `Quick Start`, `Define Global State`, `Set and Access Globals`, `Update Globals`, `Common Use Cases`, `1. App Configuration`, `2. Feature Flags`, `3. Shared Services`

### `layout-style.md`
- Summary: **Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Common Patterns](#common-patterns) · [Styling Methods](#styling-methods) · [h_flex / v_flex](#h_flex--v_flex-helpers) · [Tailwind Shorthands](#tailwind-style-shorthand) · [Overflow & Scroll](#overflow-and-scroll) · [Absolute Positioning](#absolute-positioning) · [Stacking Order](#stacking-order) · [Theme Integration](#theme-integration) · [Conditional Styling](#conditional-styling) · [Text Styling](#text-styling)
- Topics: `Layout & Styling`, `Overview`, `Quick Start`, `Basic Styling`, `Flexbox Layout`, `Size Units`, `Common Patterns`, `Centered Content`, `Card Layout`, `Responsive Spacing`

### `test-examples.md`
- Summary: **Contents:** [Testing Best Practices](#testing-best-practices) · [Test Organization](#test-organization) · [Setup and Teardown](#setup-and-teardown) · [Assertions](#assertions) · [Performance Testing](#performance-testing) · [Running Tests](#running-tests) · [Basic Test Execution](#basic-test-execution) · [Test Configuration](#test-configuration) · [Advanced Test Execution](#advanced-test-execution) · [CI/CD Integration](#cicd-integration)
- Topics: `Test Examples`, `Testing Best Practices`, `Test Organization`, `Setup and Teardown`, `Assertions`, `Performance Testing`, `Running Tests`, `Basic Test Execution`, `Run all tests`, `Run specific test`

### `test-reference.md`
- Summary: **Contents:** [Testing Patterns](#testing-patterns) · [Testing Crash-Free State Management (Re-entrancy)](#testing-crash-free-state-management-re-entrancy) · [Property Testing](#property-testing) · [Distributed Systems Testing](#distributed-systems-testing) · [Mocking and Isolation](#mocking-and-isolation)
- Topics: `Test Reference`, `Testing Patterns`, `Basic Entity Testing`, `Event Testing`, `Action Testing`, `Async Testing`, `Timer Testing`, `External I/O Testing`, `Testing Crash-Free State Management (Re-entrancy)`, `Pattern: Confirm through the real UI`

### `test.md`
- Summary: **Contents:** [Choose the test level](#choose-the-test-level) · [UI integration workflow](#ui-integration-workflow) · [Complete example](#complete-example) · [Queries and interactions](#queries-and-interactions) · [Frames and async work](#frames-and-async-work) · [Assertion boundaries](#assertion-boundaries) · [Additional resources](#additional-resources)
- Topics: `Testing`, `UI integration testing`, `Choose the test level`, `UI integration workflow`, `Complete example`, `Queries and interactions`, `Inspect accessibility targets and individual events`, `Exercise text composition through an input handler`, `Resize, display scale and clipboard`, `Frames and async work`
