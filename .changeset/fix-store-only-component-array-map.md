---
"@geajs/vite-plugin": patch
---

Fix store-only component array maps not observing store changes. When a component's only store access was a `.map()` rendering child components (e.g. `store.recordings.map(r => <SidebarItem .../>)`), the compiler failed to generate `createdHooks` with `__observeList`, so store updates never triggered re-renders. The guard that gates `createdHooks` generation now includes `observeListConfigs`, and `ensureStoreGroup` runs before `storeConfigs` is built.
