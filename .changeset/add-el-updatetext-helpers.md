---
"@geajs/core": minor
---

### @geajs/core (minor)

- **`__el()` runtime helper**: Cached element lookup by ID suffix (`this.id_ + '-' + suffix`) with automatic cache invalidation when elements are disconnected or on re-render
- **`__updateText()` runtime helper**: Null-safe text content update that uses `__el()` to find the target element by suffix
