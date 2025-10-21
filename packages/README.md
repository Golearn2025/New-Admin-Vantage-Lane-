# Vantage Lane UI Packages

> Reusable UI components, design tokens, and utilities for Vantage Lane projects

## 📦 Packages

| Package                                  | Version | Description            | Status   |
| ---------------------------------------- | ------- | ---------------------- | -------- |
| [@vantage-lane/ui-core](./ui-core)       | 0.1.0   | Core UI primitives     | 🚧 PR #2 |
| [@vantage-lane/ui-icons](./ui-icons)     | 0.1.0   | SVG icon components    | 🚧 PR #3 |
| [@vantage-lane/styles](./styles)         | 0.1.0   | Design tokens & themes | 🚧 PR #5 |
| [@vantage-lane/formatters](./formatters) | 0.1.0   | Formatters + i18n      | 🚧 PR #5 |
| [@vantage-lane/contracts](./contracts)   | 0.1.0   | TypeScript types       | 🚧 PR #4 |

## 🚀 Quick Start

### Installation

```bash
# Install core UI components
npm install @vantage-lane/ui-core @vantage-lane/styles

# Install dashboard components (when available)
npm install @vantage-lane/ui-dashboard @vantage-lane/formatters @vantage-lane/contracts
```

### Setup

```typescript
// app/layout.tsx (Next.js) or _app.tsx (React)
import '@vantage-lane/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Usage

```typescript
import { Button, Input, Card } from '@vantage-lane/ui-core';
import { Dashboard, Calendar } from '@vantage-lane/ui-icons';
import { formatCurrency } from '@vantage-lane/formatters';

function MyComponent() {
  return (
    <Card>
      <Dashboard size={24} />
      <h2>Revenue: {formatCurrency(123456)}</h2>
      <Button variant="primary">View Details</Button>
    </Card>
  );
}
```

## 📋 Development

### Build All Packages

```bash
npm run build --workspaces
```

### Build Specific Package

```bash
npm run build -w @vantage-lane/ui-core
```

### Watch Mode

```bash
npm run dev -w @vantage-lane/ui-core
```

### Type Check

```bash
npm run typecheck --workspaces
```

## 🏗️ Architecture

### Monorepo Structure

```
packages/
├── ui-core/           # Button, Input, Card, Checkbox
├── ui-icons/          # SVG icons
├── ui-dashboard/      # CardKit, ChartKit (future)
├── styles/            # Design tokens + themes
├── formatters/        # Currency, date, number formatters
└── contracts/         # TypeScript types & API contracts
```

### Dependency Graph

```
ui-dashboard
├── ui-core (peer)
├── contracts
├── formatters
└── recharts (peer)

ui-core
└── react (peer)

formatters
└── (no deps)

contracts
└── (no deps)

styles
└── (no deps)
```

## 📝 Contributing

### Adding New Components

1. Create component in appropriate package
2. Export from `src/index.ts`
3. Add to README
4. Update version in `package.json`
5. Build: `npm run build -w <package>`

### Versioning

We use **semantic versioning**:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Releases

```bash
# Bump version
npm version patch -w @vantage-lane/ui-core

# Build
npm run build -w @vantage-lane/ui-core

# Publish (when registry is set up)
npm publish -w @vantage-lane/ui-core
```

## 🧪 Testing

```bash
# Run tests for all packages
npm test --workspaces

# Run tests for specific package
npm test -w @vantage-lane/ui-core
```

## 📚 Documentation

- [Design Specs](../apps/admin/docs/dashboard/) - Dashboard component specifications
- [Storybook](./docs/storybook) - Component showcase (future)
- Individual package READMEs - See each package folder

## 🔒 Access

Packages are **private** by default. Configure your npm registry:

```bash
npm config set @vantage-lane:registry https://npm.vantage-lane.internal
```

## 📄 License

MIT
