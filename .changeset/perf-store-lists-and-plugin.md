---
"@geajs/core": patch
"@geajs/vite-plugin": patch
---

**Store:** Fast-path delivery for top-level-only observer batches (`_deliverTopLevelBatch`), so simple `__observe(store, ['data'], …)` handlers get a single batched notification with the correct observed value and fewer redundant normalizations.

**Lists:** Bulk HTML list rebuild uses a pre-sized string array and `join`; root replacement patch compares keys before touching the DOM; assign `__geaItem` on rows after `innerHTML` so delegated map handlers match the create-item path.

**Compiler:** Safer map item key expressions via optional member chains (`??`) for keyed lists and template item ids.
