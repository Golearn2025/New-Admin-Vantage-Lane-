# @vantage-lane/ui-core

> Core UI primitives - Button, Input, Card, Checkbox

## Status

🚧 **PR #1** - Package structure created  
📦 **PR #2** - Components will be moved from `apps/admin/shared/ui/core`

## Install

```bash
npm install @vantage-lane/ui-core
```

## Peer Dependencies

- `react@^18.0.0`
- `react-dom@^18.0.0`

## Usage

```tsx
import { Button, Input, Card } from '@vantage-lane/ui-core';

<Button variant="primary">Click me</Button>;
```

## Components

- **Button** - Primary/secondary/ghost variants
- **Input** - Text input with validation states
- **Card** - Container with elevation
- **Checkbox** - Accessible checkbox input

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck
```

## License

MIT
