# @vantage-lane/formatters

> Currency, number, date formatters + i18n helpers

## Status

🚧 **PR #1** - Package structure created  
📦 **PR #5** - Formatters will be implemented per `i18n-formatting.md` spec

## Install

```bash
npm install @vantage-lane/formatters
```

## Usage

```typescript
import { formatCurrency, formatNumber, formatDate, formatPercent } from '@vantage-lane/formatters';

// Currency (pence → GBP)
formatCurrency(12345); // "£123.45"
formatCurrency(null);  // "N/A"

// Number (with thousand separators)
formatNumber(1234567); // "1,234,567"

// Date
formatDate("2025-01-15T10:30:00Z", 'short'); // "15/01/2025"
formatRelativeTime("2025-01-15T10:28:00Z"); // "2 minutes ago"

// Percentage
formatPercent(12.5); // "12.50%"
```

## API

### `formatCurrency(pence: number | null, locale?: string): string`

Converts pence (integer) to formatted GBP currency.

### `formatNumber(value: number | null, locale?: string): string`

Formats count values with thousand separators.

### `formatDate(isoDate: string, format?: 'short' | 'medium' | 'long'): string`

Formats ISO date to localized string.

### `formatPercent(value: number | null, decimals?: number): string`

Formats percentage values.

## Configuration

Default locale: `en-GB`  
Default currency: `GBP`

## License

MIT
