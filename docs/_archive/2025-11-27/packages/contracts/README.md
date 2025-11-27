# @vantage-lane/contracts

> TypeScript types and API contracts

## Status

🚧 **PR #1** - Package structure created  
📦 **PR #4-5** - Types will be defined per binding-spec.md

## Install

```bash
npm install @vantage-lane/contracts
```

## Usage

```typescript
import type { CardSpec, ChartSpec, ErrorPayload, AdapterResponse } from '@vantage-lane/contracts';

const cardSpec: CardSpec = {
  key: 'gmv_completed',
  type: 'KPI.Trend',
  label: 'GMV Completed',
  unit: 'GBP_pence',
  endpoint: '/api/dashboard/metrics',
  params: { window: 'this_month' },
};

const error: ErrorPayload = {
  code: 'DATABASE_ERROR',
  message: 'Failed to fetch data',
  meta: { timestamp: '2025-01-16T10:00:00Z' },
};
```

## Types Available

### Dashboard

- `CardSpec` - Card configuration
- `ChartSpec` - Chart configuration
- `CardProps` - Card component props
- `ChartProps` - Chart component props
- `MetricsResponse` - API metrics response

### API

- `ErrorPayload` - Unified error structure
- `ErrorCode` - Standard error codes
- `AdapterResponse<T>` - Data adapter response
- `Unit` - Measurement units (`count` | `GBP_pence` | `percentage`)

### States

- `ComponentState` - `loading` | `success` | `empty` | `error` | `N_A`

## License

MIT
