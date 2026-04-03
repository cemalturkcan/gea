---
"@geajs/core": patch
"@geajs/vite-plugin": patch
---

Fix event delegation for elements inside conditional branches: the compiler no longer generates duplicate handler selectors that overwrite root-element event handlers. Also fix nested conditional expressions (e.g. `store.x && <Component/>` inside a ternary branch) not being tracked reactively — they are now registered as separate conditional slots with independent observers.
