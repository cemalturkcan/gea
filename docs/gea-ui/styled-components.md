# Styled Components

These components are thin wrappers around standard HTML elements with consistent Tailwind CSS styling and variant support. They don't use Zag.js state machines — they're simple, predictable, and easy to compose.

All styled components accept a `class` prop for additional Tailwind classes.

## Button

A button with variant and size props.

### Variants

| Variant | Description |
| --- | --- |
| `default` | Solid primary background |
| `destructive` | Red/danger styling |
| `outline` | Bordered with transparent background |
| `secondary` | Muted background |
| `ghost` | No background until hovered |
| `link` | Styled as an underlined link |

### Sizes

| Size | Description |
| --- | --- |
| `default` | Standard height (36px) |
| `sm` | Compact (32px) |
| `lg` | Larger (40px) |
| `icon` | Square (36×36px) |

### Usage

```tsx
import { Button } from '@geajs/ui'

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

<Button disabled>Disabled</Button>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |
| `type` | `string` | `'button'` | HTML button type |
| `class` | `string` | — | Additional CSS classes |

## Card

A content container with optional header, footer, title, and description slots.

### Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@geajs/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Sub-components

| Component | Purpose |
| --- | --- |
| `Card` | Outer container with border, shadow, and rounded corners |
| `CardHeader` | Top section with vertical spacing |
| `CardTitle` | Heading inside the header |
| `CardDescription` | Muted text below the title |
| `CardContent` | Main body area |
| `CardFooter` | Bottom section, typically for actions |

## Input

A styled text input.

```tsx
import { Input } from '@geajs/ui'

<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Current value |
| `disabled` | `boolean` | `false` | Disables the input |
| `name` | `string` | — | Form field name |
| `inputId` | `string` | — | HTML `id` attribute (use with `Label htmlFor`) |
| `onInput` | `(e: Event) => void` | — | Input event handler |
| `class` | `string` | — | Additional CSS classes |

## Textarea

A styled multi-line text input.

```tsx
import { Textarea } from '@geajs/ui'

<Textarea placeholder="Type your message..." rows={4} />
<Textarea disabled placeholder="Disabled" />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Current value |
| `rows` | `number` | — | Visible rows |
| `disabled` | `boolean` | `false` | Disables the textarea |
| `name` | `string` | — | Form field name |
| `onInput` | `(e: Event) => void` | — | Input event handler |
| `class` | `string` | — | Additional CSS classes |

## Label

A form label.

```tsx
import { Label } from '@geajs/ui'

<Label htmlFor="email">Email</Label>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | ID of the associated form element |
| `class` | `string` | — | Additional CSS classes |

## Badge

A small status indicator.

### Variants

| Variant | Description |
| --- | --- |
| `default` | Solid primary background |
| `secondary` | Muted background |
| `destructive` | Red/danger styling |
| `outline` | Bordered with transparent background |

### Usage

```tsx
import { Badge } from '@geajs/ui'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | Visual style |
| `class` | `string` | — | Additional CSS classes |

## Alert

An inline notification with a title and description.

### Variants

| Variant | Description |
| --- | --- |
| `default` | Neutral styling |
| `destructive` | Red/danger styling |

### Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from '@geajs/ui'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>This is an informational alert.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

### Sub-components

| Component | Purpose |
| --- | --- |
| `Alert` | Outer container, accepts `variant` |
| `AlertTitle` | Bold heading |
| `AlertDescription` | Body text |

## Separator

A horizontal or vertical divider.

```tsx
import { Separator } from '@geajs/ui'

<Separator />
<Separator orientation="vertical" />
<Separator class="my-6" />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction |
| `class` | `string` | — | Additional CSS classes |

## Skeleton

A loading placeholder that pulses to indicate content is being loaded.

```tsx
import { Skeleton } from '@geajs/ui'

<Skeleton class="h-4 w-[250px]" />
<Skeleton class="h-12 w-12 rounded-full" />
<Skeleton class="h-[125px] w-full rounded-xl" />
```

Shape the skeleton by passing Tailwind utility classes through the `class` prop — width, height, and border-radius control the placeholder's dimensions and shape.
