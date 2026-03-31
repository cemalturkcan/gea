---
"@geajs/vite-plugin": patch
---

Treat Gea **functional** component modules (JSX + default-exported function) as component modules for HMR so relative imports are wrapped in `createHotComponentProxy`. Fixes stale tab content after child HMR when switching tabs (parent module does not re-run).
