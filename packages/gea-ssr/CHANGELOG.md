# @geajs/ssr

## 1.0.1

### Patch Changes

- [`30c609b`](https://github.com/dashersw/gea/commit/30c609b1f101082fb297d4bac9b75297024f2214) Thanks [@dashersw](https://github.com/dashersw)! - Move the SSR root Store proxy handler from `@geajs/core` into `@geajs/ssr`, wired via `Store._rootProxyHandlerFactory`. Export `rootGetValue`, `rootSetValue`, and `rootDeleteProperty` for composition. Replace `Store._ssrOverlayResolver` and `Store._ssrDeleted` with the factory and `SSR_DELETED` from `@geajs/ssr`. Smaller browser bundles; SSR tests live under `@geajs/ssr`.
