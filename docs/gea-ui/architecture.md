# Architecture

@geajs/ui bridges [Zag.js](https://zagjs.com/) — a framework-agnostic UI state-machine library — with Gea's reactive component model. This page explains how that bridge works and how to extend it.

## The Shell Component Pattern

Each interactive component follows a "shell component" pattern:

1. **Zag.js** provides a state machine that encodes all the complex behavior for a UI pattern — keyboard navigation, ARIA attributes, focus traps, open/close logic — in a framework-agnostic way.
2. **`ZagComponent`** (the base class) starts the machine, subscribes to state changes, and applies Zag's computed DOM attributes to the rendered elements.
3. **The concrete component** (e.g., `Dialog`, `Switch`, `Select`) defines the JSX template, declares which machine to use, and maps Zag's props to DOM selectors.
4. **Gea's reactivity** drives visual state — when Zag says "this is now open", Gea re-renders the parts that depend on that state.
5. **Tailwind CSS** handles styling through utility classes and CSS custom properties.

## ZagComponent Base Class

All Zag-powered components extend `ZagComponent`, which itself extends Gea's `Component`. It adds:

### Lifecycle

| Method | Purpose |
| --- | --- |
| `created(props)` | Creates and starts the Zag machine, connects the API, subscribes to state changes |
| `onAfterRender()` | Applies Zag's spread props to the rendered DOM |
| `dispose()` | Cleans up spread listeners and stops the machine |

### Override Points

Subclasses implement these methods to define their behavior:

| Method | Purpose |
| --- | --- |
| `createMachine(props)` | Return the Zag machine definition (e.g., `dialog.machine`) |
| `getMachineProps(props)` | Return the config object for the machine (id, callbacks, initial state) |
| `connectApi(service)` | Connect the running service to produce the API object |
| `getSpreadMap()` | Map CSS selectors to Zag prop getters |
| `syncState(api)` | Pull reactive properties from the API (e.g., `this.open = api.open`) |

### Example: Building a Custom Component

Here's a minimal example showing how a Zag-powered component is structured:

```tsx
import * as toggle from '@zag-js/toggle'
import { normalizeProps } from '@zag-js/vanilla'
import { ZagComponent } from '@geajs/ui'
import type { SpreadMap } from '@geajs/ui'

export default class Toggle extends ZagComponent {
  pressed = false

  createMachine() {
    return toggle.machine
  }

  getMachineProps(props: any) {
    return {
      id: this.id,
      defaultPressed: props.defaultPressed,
      onPressedChange: (details: any) => {
        this.pressed = details.pressed
        props.onPressedChange?.(details)
      },
    }
  }

  connectApi(service: any) {
    return toggle.connect(service, normalizeProps)
  }

  getSpreadMap(): SpreadMap {
    return {
      '[data-part="root"]': 'getRootProps',
    }
  }

  syncState(api: any) {
    this.pressed = api.pressed
  }

  template(props: any) {
    return (
      <button data-part="root" class="toggle-root">
        {props.children}
      </button>
    )
  }
}
```

## The Spread Map

The `getSpreadMap()` method is the key bridge between Zag and the DOM. It returns an object where:

- **Keys** are CSS selectors that match elements in the component's template.
- **Values** are either a string naming a Zag API method (e.g., `'getTriggerProps'`) or a function `(api, element) => props` for cases where the props depend on the specific element (e.g., accordion items that need a `value`).

After every Zag state change and after every render, `ZagComponent` iterates the spread map and calls Zag's `spreadProps()` on each matched element. This applies event listeners, ARIA attributes, `data-state` flags, and any other dynamic props that Zag computes.

### String Getters

For components with a single instance of each part:

```ts
getSpreadMap(): SpreadMap {
  return {
    '[data-part="trigger"]': 'getTriggerProps',
    '[data-part="content"]': 'getContentProps',
  }
}
```

### Function Getters

For components with multiple instances of a part (e.g., accordion items, select options):

```ts
getSpreadMap(): SpreadMap {
  return {
    '[data-part="item"]': (api, el) => {
      const value = (el as HTMLElement).dataset.value
      return api.getItemProps({ value })
    },
  }
}
```

## Data Attributes

Zag components use `data-part` attributes to identify structural elements and `data-state` attributes to communicate current state:

| Attribute | Example Values | Purpose |
| --- | --- | --- |
| `data-part` | `trigger`, `content`, `item`, `thumb` | Identifies the structural role |
| `data-state` | `open`, `closed`, `checked`, `unchecked` | Current visual/interactive state |
| `data-value` | `item-1`, `bold`, `us` | Item identity for list-based components |

These attributes serve double duty: Zag uses them to wire behavior, and you can target them in CSS for custom styling.

## Reactive State Sync

The `syncState(api)` method pulls values from the Zag API into Gea reactive properties. Because these are regular class properties tracked by Gea's proxy-based reactivity, any template expression that reads them will update automatically:

```ts
syncState(api: any) {
  this.open = api.open        // drives conditional rendering
  this.value = api.value      // drives display of selected value
}
```

This is the same pattern used throughout Gea — mutate a property, and the DOM patches itself.
