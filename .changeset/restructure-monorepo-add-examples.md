---
"@geajs/core": patch
"@geajs/vite-plugin": patch
"@geajs/ui": patch
---

### @geajs/vite-plugin (minor)

#### Compiler restructure and new capabilities

- **Source directory reorganization**: All compiler source files moved from `packages/vite-plugin-gea/*.ts` to `packages/vite-plugin-gea/src/*.ts`.
- **Observer safety**: Observer callbacks are now wrapped in `try/catch` to prevent runtime crashes from propagating through the reactive system.
- **Store getter dependency resolution**: When an observe key targets a computed getter (single-part path), the compiler resolves the getter's underlying state dependencies and observes those instead, so mutations to underlying data correctly trigger the observer.
- **Early-return guard observers**: Templates with early-return guards (e.g., `if (!store.activeEmail) return <empty/>`) now generate `__rerender()` observers that re-render the full DOM when the guard condition changes.
- **Component-array pipeline**: Array maps with component children are routed through a dedicated component-array pipeline (`__buildComponentArray` / `__mountComponentArray` / `__refreshComponentArray`) instead of the HTML-based `__applyListChanges` pipeline, avoiding HTML-parser foster-parenting of custom elements inside `<table>` contexts.
- **Resolved array map delegate handling**: `.map().join("")` calls are stripped from children templates when using resolved array maps; containers are populated via DOM APIs in `onAfterRender`. `__refreshChildProps` calls are skipped for observe keys handled by resolved array map delegates to prevent innerHTML replacement from clobbering in-place map items.
- **`__geaPrev_` initialization**: Previous-value properties for store observers are initialized in `created()` hooks with try/catch, preventing spurious observer triggers on first flush.
- **Destructured store variable support**: `replaceMapWithComponentArrayItems` now handles the destructured pattern (`const { columns } = store; columns.map(...)`) in addition to direct member access.
- **Truthiness-only rerender observers**: `generateRerenderObserver` gained a `truthinessOnly` parameter for guard-based observers that only need to track truthiness changes.
- **Store getter static analysis**: New `store-getter-analysis.ts` module reads store source files, parses getter definitions, and extracts the state properties each getter depends on.

#### Test suite reorganization

- Split `plugin-regressions.test.ts` (3,208 lines) into 8 focused test files: compiler-errors, conditional-slots, events-templates, jsx-codegen, mapped-lists, misc, store-observers, and shared helpers.
- Split `runtime-regressions.test.ts` (9,473 lines) into 8 focused test files: bindings, child-components, conditional-slots, dnd-misc, events-forms, mapped-lists, store-props, and shared helpers.
- Removed debug artifacts: `debug-compile.mjs`, `output.txt`, `_debug_compile.ts`, `debug-create-rows.mjs`, `jira-bundle-debug.js`, `jira-integration-entry.ts`.

### @geajs/core (minor)

#### Runtime improvements

- **Proxy cache for stable object identity**: `Store.createDeepProxy` now caches proxies for non-array objects, ensuring stable identity when the same raw object is proxied multiple times (e.g., via `.find()` in computed getters).
- **`__rerender()` method**: New method on `Component` for full DOM replacement when templates have multiple return paths (early return pattern). Removes old element before calling `template()` to prevent `getElementById` from finding stale DOM nodes.
- **`__resetChildTree()`**: Recursively resets `rendered_` and `element_` state on child component trees when parent innerHTML replacement destroys them.
- **`data-gea-compiled-child-root` → `__geaCompiledChildRoot`**: Replaced DOM attribute with a JS property to keep compiler internals out of the visible DOM.
- **In-place keyed list content updates**: When key order is unchanged but item content has changed, existing DOM elements are updated in-place to preserve node identity (avoids spurious removals visible to MutationObserver).

### @geajs/ui (patch)

- **Preserve compiler binding IDs**: `zag-component.ts` now saves and restores the original `el.id` after Zag's `spreadProps` applies element attributes, preventing Zag from clobbering compiler-generated binding IDs that observers rely on.

### Monorepo and testing infrastructure

- Relocated all example apps from `packages/gea-ui/examples/` to `examples/` at repo root.
- Added 6 new demo apps: chat, ecommerce, email-client, finance, music-player, saas-dashboard.
- Centralized e2e testing: added `tests/e2e/playwright.config.ts` with per-example projects and port assignments (5291–5307), plus 17 Playwright spec files covering all example apps.
- Added `.claude/rules/` and `.cursor/rules/` for framework-fixes, playwright-testing, and unit-testing conventions.
- Added `example:*` npm scripts to root `package.json` for all demo apps.
