---
"@geajs/vite-plugin": minor
---

### @geajs/vite-plugin (minor)

- **Compiler generates `__observeList()` for component array slots**: Replace generated `_buildItems`, `__mountItems`, `__refreshItems` methods and `onAfterRender`/`__geaRequestRender` overrides with constructor-inline `this._items = (arr ?? []).map(item => this.__child(Ctor, props, key))`, `__itemProps_*` method (kept), and `this.__observeList(store, path, config)` call in `createdHooks()`. Template uses `${this._items.join('')}` instead of `.map().join('')`. For non-store arrays (props-based), generates a simplified `__refresh*` method using `__reconcileList`.
