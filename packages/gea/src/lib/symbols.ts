/**
 * Well-known symbols for engine-only Component / Router / Store internals.
 * User-visible state stays on string keys; these never participate in observe() paths.
 */
export const GEA_SELF_PROXY = Symbol.for('gea.selfProxy')

/** Store engine — `this[GEA_STORE_*]()`; `GEA_STORE_ROOT` replaces the `__store` getter. */
export const GEA_STORE_ROOT = Symbol.for('gea.store.rootProxy')
export const GEA_STORE_CREATE_PROXY = Symbol.for('gea.store.createProxy')
export const GEA_STORE_FLUSH_CHANGES = Symbol.for('gea.store.flushChanges')
export const GEA_STORE_EMIT_CHANGES = Symbol.for('gea.store.emitChanges')
export const GEA_STORE_ADD_OBSERVER = Symbol.for('gea.store.addObserver')
export const GEA_STORE_COLLECT_MATCHING_OBSERVER_NODES = Symbol.for('gea.store.collectMatchingObserverNodes')
export const GEA_STORE_COLLECT_DESCENDANT_OBSERVER_NODES = Symbol.for('gea.store.collectDescendantObserverNodes')
export const GEA_STORE_ADD_DESCENDANTS_FOR_OBJECT_REPLACEMENT = Symbol.for(
  'gea.store.addDescendantsForObjectReplacement',
)
export const GEA_STORE_GET_OBSERVER_NODE = Symbol.for('gea.store.getObserverNode')
export const GEA_STORE_COLLECT_MATCHING_OBSERVER_NODES_FROM_NODE = Symbol.for(
  'gea.store.collectMatchingObserverNodesFromNode',
)
export const GEA_STORE_NOTIFY_HANDLERS = Symbol.for('gea.store.notifyHandlers')
export const GEA_STORE_NOTIFY_HANDLERS_WITH_VALUE = Symbol.for('gea.store.notifyHandlersWithValue')
export const GEA_STORE_GET_DIRECT_TOP_LEVEL_OBSERVED_VALUE = Symbol.for('gea.store.getDirectTopLevelObservedValue')
export const GEA_STORE_GET_TOP_LEVEL_OBSERVED_VALUE = Symbol.for('gea.store.getTopLevelObservedValue')
export const GEA_STORE_CLEAR_ARRAY_INDEX_CACHE = Symbol.for('gea.store.clearArrayIndexCache')
export const GEA_STORE_NORMALIZE_BATCH = Symbol.for('gea.store.normalizeBatch')
export const GEA_STORE_DELIVER_ARRAY_ITEM_PROP_BATCH = Symbol.for('gea.store.deliverArrayItemPropBatch')
export const GEA_STORE_DELIVER_KNOWN_ARRAY_ITEM_PROP_BATCH = Symbol.for('gea.store.deliverKnownArrayItemPropBatch')
export const GEA_STORE_DELIVER_TOP_LEVEL_BATCH = Symbol.for('gea.store.deliverTopLevelBatch')
export const GEA_STORE_QUEUE_CHANGE = Symbol.for('gea.store.queueChange')
export const GEA_STORE_TRACK_PENDING_CHANGE = Symbol.for('gea.store.trackPendingChange')
export const GEA_STORE_SCHEDULE_FLUSH = Symbol.for('gea.store.scheduleFlush')
export const GEA_STORE_QUEUE_DIRECT_ARRAY_ITEM_PRIMITIVE_CHANGE = Symbol.for(
  'gea.store.queueDirectArrayItemPrimitiveChange',
)
export const GEA_STORE_INTERCEPT_ARRAY_METHOD = Symbol.for('gea.store.interceptArrayMethod')
export const GEA_STORE_INTERCEPT_ARRAY_ITERATOR = Symbol.for('gea.store.interceptArrayIterator')
export const GEA_STORE_GET_CACHED_ARRAY_META = Symbol.for('gea.store.getCachedArrayMeta')
/** Test/profiler hook: returns the browser root `ProxyHandler` (same object the store constructor uses). */
export const GEA_STORE_GET_BROWSER_ROOT_PROXY_HANDLER_FOR_TESTS = Symbol.for(
  'gea.store.getBrowserRootProxyHandlerForTests',
)

/** Store proxy introspection (root + nested). */
export const GEA_PROXY_IS_PROXY = Symbol.for('gea.proxy.isProxy')
export const GEA_PROXY_RAW = Symbol.for('gea.proxy.raw')
export const GEA_PROXY_GET_RAW_TARGET = Symbol.for('gea.proxy.getRawTarget')
export const GEA_PROXY_GET_TARGET = Symbol.for('gea.proxy.getTarget')
export const GEA_PROXY_GET_PATH = Symbol.for('gea.proxy.getPath')

/** Router: Outlet / RouterView marker (avoid string keys on component instances). */
export const GEA_IS_ROUTER_OUTLET = Symbol.for('gea.router.isOutlet')

/**
 * Serialized `data-prop-*` attribute values that reference `GEA_PROP_BINDINGS` map keys.
 * DOM cannot store symbols; this prefix marks engine-owned binding tokens (not user strings).
 */
export const GEA_PROP_BINDING_ATTR_PREFIX = 'gea:p:'

/** Cached parent component id chain on DOM nodes (delegated events / bubbling). */
export const GEA_DOM_PARENT_CHAIN = Symbol.for('gea.dom.parentChain')

export const GEA_ID = Symbol.for('gea.id')
export const GEA_ELEMENT = Symbol.for('gea.element')
/** Parent component link for compiled children / router / DnD (engine-only). */
export const GEA_PARENT_COMPONENT = Symbol.for('gea.component.parentComponent')
export const GEA_RENDERED = Symbol.for('gea.rendered')
export const GEA_RAW_PROPS = Symbol('gea.rawProps')
export const GEA_BINDINGS = Symbol('gea.bindings')
export const GEA_SELF_LISTENERS = Symbol('gea.selfListeners')
export const GEA_CHILD_COMPONENTS = Symbol('gea.childComponents')
export const GEA_DEPENDENCIES = Symbol('gea.dependencies')
export const GEA_EVENT_BINDINGS = Symbol('gea.eventBindings')
export const GEA_PROP_BINDINGS = Symbol('gea.propBindings')
export const GEA_ATTR_BINDINGS = Symbol('gea.attrBindings')
export const GEA_OBSERVER_REMOVERS = Symbol('gea.observerRemovers')
export const GEA_COMPILED_CHILD = Symbol('gea.compiledChild')
export const GEA_ITEM_KEY = Symbol('gea.itemKey')
export const GEA_MAPS = Symbol('gea.maps')
export const GEA_CONDS = Symbol('gea.conds')
export const GEA_RESET_ELS = Symbol('gea.resetEls')
export const GEA_LIST_CONFIGS = Symbol('gea.listConfigs')

/** Router / Outlet / RouterView internals */
export const GEA_ROUTER_DEPTH = Symbol('gea.routerDepth')
export const GEA_ROUTER = Symbol('gea.router')
export const GEA_ROUTES_APPLIED = Symbol('gea.routesApplied')
export const GEA_CURRENT_COMP_CLASS = Symbol('gea.currentCompClass')
export const GEA_LAYOUTS = Symbol('gea.layouts')

/**
 * Stable symbol key for a component-array backing store (same reference for a given
 * `arrayPropName` in every module/realm via the global symbol registry).
 */
export function geaListItemsSymbol(arrayPropName: string): symbol {
  return Symbol.for(`gea.listItems.${arrayPropName}`)
}

/** Per-slot flag for conditional patch microtask reset (compiler-generated). */
export function geaCondPatchedSymbol(idx: number): symbol {
  return Symbol.for(`gea.condPatched.${idx}`)
}

/** Cached boolean result of `getCond()` for conditional slots (compiler + runtime). */
export function geaCondValueSymbol(idx: number): symbol {
  return Symbol.for(`gea.condValue.${idx}`)
}

/** Compiler: last value seen by `__observe_*` rerender guard (reference equality / truthiness). */
export function geaObservePrevSymbol(methodName: string): symbol {
  return Symbol.for(`gea.observePrev.${methodName}`)
}

/** Compiler: truthiness-only guard for early-return observer methods. */
export function geaPrevGuardSymbol(methodName: string): symbol {
  return Symbol.for(`gea.prevGuard.${methodName}`)
}

/** Component engine methods — `this[GEA_*]()` only; never user string keys. */
export const GEA_APPLY_LIST_CHANGES = Symbol.for('gea.component.applyListChanges')
export const GEA_CREATE_PROPS_PROXY = Symbol.for('gea.component.createPropsProxy')
export const GEA_REACTIVE_PROPS = Symbol.for('gea.component.reactiveProps')
export const GEA_UPDATE_PROPS = Symbol.for('gea.component.updateProps')
export const GEA_REQUEST_RENDER = Symbol.for('gea.component.requestRender')
export const GEA_RESET_CHILD_TREE = Symbol.for('gea.component.resetChildTree')
export const GEA_CHILD = Symbol.for('gea.component.child')
export const GEA_EL_CACHE = Symbol.for('gea.component.elCache')
export const GEA_EL = Symbol.for('gea.component.el')
export const GEA_UPDATE_TEXT = Symbol.for('gea.component.updateText')
export const GEA_OBSERVE = Symbol.for('gea.component.observe')
export const GEA_REORDER_CHILDREN = Symbol.for('gea.component.reorderChildren')
export const GEA_RECONCILE_LIST = Symbol.for('gea.component.reconcileList')
export const GEA_OBSERVE_LIST = Symbol.for('gea.component.observeList')
export const GEA_REFRESH_LIST = Symbol.for('gea.component.refreshList')
export const GEA_SWAP_CHILD = Symbol.for('gea.component.swapChild')
export const GEA_REGISTER_MAP = Symbol.for('gea.component.registerMap')
export const GEA_SYNC_MAP = Symbol.for('gea.component.syncMap')
export const GEA_SYNC_ITEMS = Symbol.for('gea.component.syncItems')
export const GEA_CLONE_ITEM = Symbol.for('gea.component.cloneItem')
export const GEA_REGISTER_COND = Symbol.for('gea.component.registerCond')
export const GEA_PATCH_COND = Symbol.for('gea.component.patchCond')
export const GEA_SYNC_DOM_REFS = Symbol.for('gea.component.syncDomRefs')
export const GEA_ENSURE_ARRAY_CONFIGS = Symbol.for('gea.component.ensureArrayConfigs')
export const GEA_SWAP_STATE_CHILDREN = Symbol.for('gea.component.swapStateChildren')

export const GEA_COMPONENT_CLASSES = Symbol.for('gea.component.componentClasses')
export const GEA_STATIC_ESCAPE_HTML = Symbol.for('gea.component.staticEscapeHtml')
export const GEA_STATIC_SANITIZE_ATTR = Symbol.for('gea.component.staticSanitizeAttr')
export const GEA_SYNC_VALUE_PROPS = Symbol.for('gea.component.syncValueProps')
export const GEA_SYNC_AUTOFOCUS = Symbol.for('gea.component.syncAutofocus')
export const GEA_PATCH_NODE = Symbol.for('gea.component.patchNode')
export const GEA_SETUP_LOCAL_STATE_OBSERVERS = Symbol.for('gea.component.setupLocalStateObservers')
/** Compiler: `template()` clone for SSR/hydration; optional on subclasses. */
export const GEA_CLONE_TEMPLATE = Symbol.for('gea.component.cloneTemplate')
/** Compiler: refresh `ref={}` targets after DOM updates. */
export const GEA_SETUP_REFS = Symbol.for('gea.component.setupRefs')
/** Compiler: incremental prop-driven DOM patches after `props` updates. */
export const GEA_ON_PROP_CHANGE = Symbol.for('gea.component.onPropChange')
/** Re-render helper: sync list rows not yet mounted (getter-backed lists). */
export const GEA_SYNC_UNRENDERED_LIST_ITEMS = Symbol.for('gea.component.syncUnrenderedListItems')

/** Internal lifecycle / DOM helpers — override via `this[GEA_*]()`. */
export const GEA_ATTACH_BINDINGS = Symbol.for('gea.component.attachBindings')
export const GEA_CLEANUP_BINDINGS = Symbol.for('gea.component.cleanupBindings')
export const GEA_MOUNT_COMPILED_CHILD_COMPONENTS = Symbol.for('gea.component.mountCompiledChildComponents')
export const GEA_INSTANTIATE_CHILD_COMPONENTS = Symbol.for('gea.component.instantiateChildComponents')
export const GEA_SETUP_EVENT_DIRECTIVES = Symbol.for('gea.component.setupEventDirectives')
export const GEA_TEARDOWN_SELF_LISTENERS = Symbol.for('gea.component.teardownSelfListeners')
export const GEA_EXTRACT_COMPONENT_PROPS = Symbol.for('gea.component.extractComponentProps')
export const GEA_COERCE_STATIC_PROP_VALUE = Symbol.for('gea.component.coerceStaticPropValue')
export const GEA_NORMALIZE_PROP_NAME = Symbol.for('gea.component.normalizePropName')

export const GEA_CTOR_AUTO_REGISTERED = Symbol.for('gea.ctor.autoRegistered')
export const GEA_CTOR_TAG_NAME = Symbol.for('gea.ctor.tagName')

/** ComponentManager.callEventsGetterHandler: skip callItemHandler (delegated handler ran on an ancestor). */
export const GEA_SKIP_ITEM_HANDLER = Symbol.for('gea.componentManager.skipItemHandler')

/** DOM expandos on nodes (engine-only). */
export const GEA_DOM_COMPONENT = Symbol.for('gea.dom.component')
export const GEA_DOM_KEY = Symbol.for('gea.dom.key')
export const GEA_DOM_ITEM = Symbol.for('gea.dom.item')
export const GEA_DOM_PROPS = Symbol.for('gea.dom.props')
export const GEA_DOM_COMPILED_CHILD_ROOT = Symbol.for('gea.dom.compiledChildRoot')
/** Cached delegated event token (mirrors `data-gea-event` without attribute read). */
export const GEA_DOM_EVENT_HINT = Symbol.for('gea.dom.eventHint')

/** Delegated `.map()` row clicks — `this[GEA_HANDLE_ITEM_HANDLER](itemId, e)`. */
export const GEA_HANDLE_ITEM_HANDLER = Symbol.for('gea.component.handleItemHandler')

/** Map sync state on internal config objects. */
export const GEA_MAP_CONFIG_PREV = Symbol.for('gea.mapConfig.prev')
export const GEA_MAP_CONFIG_COUNT = Symbol.for('gea.mapConfig.count')
export const GEA_MAP_CONFIG_TPL = Symbol.for('gea.mapConfig.tpl')

/** __observeList config bag */
export const GEA_LIST_CONFIG_REFRESHING = Symbol.for('gea.listConfig.refreshing')
