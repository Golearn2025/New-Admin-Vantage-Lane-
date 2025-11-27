# @vantage-lane/styles

> Design tokens and theme CSS variables

## Status

🚧 **PR #1** - Package structure created  
📦 **PR #5** - Tokens will be copied from `app/globals.css`

## Install

```bash
npm install @vantage-lane/styles
```

## Usage

### Import all tokens (recommended)

```typescript
// app/layout.tsx or _app.tsx
import '@vantage-lane/styles/globals.css';
```

### Import specific parts

```typescript
import '@vantage-lane/styles/tokens.css'; // Color, spacing, typography tokens
import '@vantage-lane/styles/theme-dark.css'; // Dark theme (Charcoal Premium)
import '@vantage-lane/styles/theme-light.css'; // Light theme (future)
```

## Tokens Available

- **Colors:** `--color-bg-primary`, `--color-text-primary`, `--color-accent-500`, etc.
- **Spacing:** `--spacing-1` (4px) through `--spacing-32` (128px)
- **Typography:** `--font-sans`, `--font-mono`, `--font-xs` through `--font-2xl`
- **Radius:** `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Example

```css
.my-component {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

## License

MIT
