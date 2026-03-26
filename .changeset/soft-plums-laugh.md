---
"@geajs/core": patch
"@geajs/vite-plugin": patch
---

Improve keyed list update performance by patching same-key replacements in place and reducing store overhead for repeated array item property writes.
