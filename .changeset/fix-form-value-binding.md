---
'@geajs/core': patch
---

Fix form element value binding: sync `.value` DOM property for `<textarea>`, `<select>`, and `<input>` across all creation paths (initial render, full re-render, list item sync, clone items).
