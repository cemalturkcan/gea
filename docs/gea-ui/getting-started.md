# Getting Started with Gea UI

## Installation

```bash
npm install @geajs/ui
```

`@geajs/ui` requires `@geajs/core` as a peer dependency:

```bash
npm install @geajs/core
```

## Tailwind CSS Setup

@geajs/ui uses [Tailwind CSS](https://tailwindcss.com/) for styling and ships a preset that defines the design token system (colors, border radius, etc.).

### 1. Add the Tailwind Preset

```js
// tailwind.config.js
import geaPreset from '@geajs/ui/tailwind-preset'

export default {
  presets: [geaPreset],
  content: [
    './src/**/*.{tsx,ts,jsx,js}',
    './node_modules/@geajs/ui/dist/**/*.js',
  ],
}
```

The preset configures:

- **Semantic colors** — `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, `border`, `input`, `ring`, `background`, `foreground` — all driven by CSS custom properties.
- **Border radius** — `lg`, `md`, `sm` tokens tied to a single `--radius` variable.
- **Dark mode** — enabled via the `dark` class strategy.

### 2. Import the Theme CSS

The theme stylesheet defines the CSS custom properties that the preset references. Import it once in your entry point:

```ts
// main.ts
import '@geajs/ui/style.css'
```

Or in your main CSS file:

```css
@import '@geajs/ui/style.css';
```

### 3. Include @geajs/ui in Tailwind's Content Paths

Make sure `node_modules/@geajs/ui/dist/**/*.js` is listed in your `content` array (shown above). This allows Tailwind to scan @geajs/ui's component source and include the utility classes they use.

## Minimal Example

```tsx
import { Component } from '@geajs/core'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@geajs/ui'
import '@geajs/ui/style.css'

export default class App extends Component {
  template() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your Gea UI setup is working.</p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    )
  }
}
```

## The `cn` Utility

@geajs/ui exports a `cn` helper that merges class names with [clsx](https://github.com/lukeed/clsx) and [tailwind-merge](https://github.com/dcastil/tailwind-merge). Use it when you need to conditionally compose Tailwind classes without conflicts:

```tsx
import { cn } from '@geajs/ui'

const classes = cn(
  'px-4 py-2 rounded',
  isActive && 'bg-primary text-primary-foreground',
  isDisabled && 'opacity-50 pointer-events-none',
)
```
