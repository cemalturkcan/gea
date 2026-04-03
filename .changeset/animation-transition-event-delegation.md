---
"@geajs/vite-plugin": patch
---

Add event delegation support for CSS animation and transition events: `animationstart`, `animationend`, `animationiteration`, `transitionstart`, `transitionend`, `transitionrun`, and `transitioncancel`. These can now be used declaratively in JSX (e.g. `onAnimationEnd={() => ...}`) instead of requiring imperative `addEventListener` in lifecycle hooks.
