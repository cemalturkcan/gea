---
"@geajs/vite-plugin": patch
---

Fix duplicate `.map()` blocks in one component sharing a single `#__dc` template-cache field, which bound the second map to the wrong container and could clear sibling DOM (e.g. tab titles vs tab contents) on prop updates.

Fix delegated map click handlers: `__getMapItemFromEvent` now resolves items using the same expression as the JSX `key` (e.g. template literals like `` `${tab.title}-button` ``) instead of defaulting to `.id`, so `onTabChange` receives the real item and `tab.index` is correct.

Map row template init: use object dummies with `content: () => ''` (and non-primitive dummies when the row reads object fields or uses a composite key) so `render*Item("__dummy__")` never calls `tab.content` on a string.

When a row’s text slot uses an **item method call** like `item.content()`, skip surgical `nodeValue` patches and rerender the row — patching would stringify component output as escaped HTML.
