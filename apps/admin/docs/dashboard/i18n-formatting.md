# i18n & Formatting Specification

**Version:** 1.0.0  
**Purpose:** Centralized formatters și i18n keys pentru dashboard components.

---

## 1. Locale Configuration

**Default Locale:** `en-GB`  
**Default Currency:** `GBP`  
**Default Timezone:** UTC → Local conversion DOAR în UI

**Config Location:** `apps/admin/shared/config/dashboard.config.ts`

```typescript
export const DASHBOARD_CONFIG = {
  locale: 'en-GB',
  currency: 'GBP',
  timezone: 'Europe/London', // sau browser default
  date_format: 'DD/MM/YYYY',
  time_format: '24h'
};
```

**Fallback Strategy:**
- Dacă locale unavailable → fallback la `en-GB`
- Dacă currency unavailable → fallback la `GBP`
- NICIODATĂ throw pentru missing locale

---

## 2. Unit ↔ Formatter Compatibility Matrix

**1:1 Mapping between API units and formatters:**

| API Unit | Formatter Function | Input Type | Output Example | Locale-Aware |
|----------|-------------------|------------|----------------|---------------|
| `count` | `formatNumber()` | `number` | "1,234" | Yes (separators) |
| `GBP_pence` | `formatCurrency()` | `number` (pence) | "£1,234.56" | Yes (locale + currency) |
| `percentage` | `formatPercent()` | `number` (0-100) | "12.50%" | No (universal) |

**Rules:**
- NICIODĂT apela formatter greșit pentru unit (ex: `formatCurrency(count)` → ERROR)
- Adapter validatează unit match înainte de a pasa la UI
- UI alege formatter based pe `props.unit`:

```typescript
function renderValue(value: number, unit: Unit): string {
  switch (unit) {
    case 'count': return formatNumber(value);
    case 'GBP_pence': return formatCurrency(value);
    case 'percentage': return formatPercent(value);
    default: {
      const _exhaustive: never = unit;
      throw new Error(`Unknown unit: ${_exhaustive}`);
    }
  }
}
```

---

## 3. Formatter Centralization

**Location:** `apps/admin/shared/ui/composed/dashboard/formatters.ts`

**Rule:** TOATE conversiile de display DOAR aici. Zero formatare în componente.

### Currency Formatter

```typescript
/**
 * Converts pence (integer) to formatted GBP currency string
 * @param pence - Integer value in pence (ex: 12345 = £123.45)
 * @param locale - BCP 47 locale (default: en-GB)
 * @returns Formatted string (ex: "£123.45")
 */
function formatCurrency(
  pence: number | null,
  locale: string = DASHBOARD_CONFIG.locale
): string {
  if (pence === null) return 'N/A';
  
  const pounds = pence / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(pounds);
}

// Examples:
// formatCurrency(12345) → "£123.45"
// formatCurrency(100) → "£1.00"
// formatCurrency(0) → "£0.00"
// formatCurrency(null) → "N/A"
```

### Number Formatter

```typescript
/**
 * Formats count values with thousand separators
 * @param value - Integer count (ex: 1234)
 * @returns Formatted string (ex: "1,234")
 */
function formatNumber(
  value: number | null,
  locale: string = DASHBOARD_CONFIG.locale
): string {
  if (value === null) return 'N/A';
  
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Examples:
// formatNumber(1234) → "1,234"
// formatNumber(1000000) → "1,000,000"
// formatNumber(0) → "0"
```

### Percentage Formatter

```typescript
/**
 * Formats percentage values
 * @param value - Percentage as float (ex: 12.5 = 12.5%)
 * @returns Formatted string (ex: "12.50%")
 */
function formatPercent(
  value: number | null,
  decimals: number = 2
): string {
  if (value === null) return 'N/A';
  
  return `${value.toFixed(decimals)}%`;
}

// Examples:
// formatPercent(12.5) → "12.50%"
// formatPercent(100) → "100.00%"
// formatPercent(0.5, 1) → "0.5%"
```

### Date Formatter

```typescript
/**
 * Formats ISO date string to localized date
 * @param isoDate - ISO 8601 date string (ex: "2025-01-15T10:30:00Z")
 * @param format - 'short' | 'medium' | 'long' (default: short)
 * @returns Formatted string (ex: "15/01/2025")
 */
function formatDate(
  isoDate: string,
  format: 'short' | 'medium' | 'long' = 'short',
  locale: string = DASHBOARD_CONFIG.locale
): string {
  const date = new Date(isoDate);
  
  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' }
  }[format];
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// Examples:
// formatDate("2025-01-15T10:30:00Z", 'short') → "15/01/2025"
// formatDate("2025-01-15T10:30:00Z", 'medium') → "15 Jan 2025"
// formatDate("2025-01-15T10:30:00Z", 'long') → "15 January 2025"
```

### Relative Time Formatter

```typescript
/**
 * Formats relative time for "cached_at" timestamps
 * @param isoDate - ISO timestamp
 * @returns Relative string (ex: "2 minutes ago")
 */
function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Examples:
// formatRelativeTime("2025-01-15T10:28:00Z") → "2 minutes ago" (at 10:30)
// formatRelativeTime("2025-01-15T09:30:00Z") → "1 hour ago"
```

---

## 3. i18n Key Structure

**Namespace:** `dashboard.*`

**Keys by Domain:**

### Card Labels
```
dashboard.card.bookings_completed.label = "Bookings Completed"
dashboard.card.bookings_completed.sublabel = "This month"
dashboard.card.gmv_completed.label = "GMV Completed"
dashboard.card.platform_commission.label = "Platform Commission"
```

### Chart Titles
```
dashboard.chart.bar_daily_completed.title = "Daily Completed Bookings"
dashboard.chart.bar_daily_completed.x_axis = "Date"
dashboard.chart.bar_daily_completed.y_axis = "Bookings"
dashboard.chart.line_cumulative.title = "Cumulative Revenue"
```

### States
```
dashboard.state.loading = "Loading data..."
dashboard.state.empty = "No data for selected period"
dashboard.state.error = "Failed to load data"
dashboard.state.na = "Not applicable"
dashboard.state.retry = "Retry"
```

### Tooltips
```
dashboard.tooltip.cached_at = "Updated {time}"
dashboard.tooltip.threshold = "Alert threshold: {value}"
dashboard.tooltip.target = "{current} of {target} ({percent}%)"
```

### Units
```
dashboard.unit.count = "items"
dashboard.unit.GBP_pence = "£"
dashboard.unit.percentage = "%"
```

### Window Presets
```
dashboard.window.today = "Today"
dashboard.window.yesterday = "Yesterday"
dashboard.window.this_week = "This Week"
dashboard.window.last_week = "Last Week"
dashboard.window.this_month = "This Month"
dashboard.window.last_month = "Last Month"
dashboard.window.this_year = "This Year"
dashboard.window.all = "All Time"
dashboard.window.custom = "Custom Range"
```

---

## 4. UTC → Local Conversion

**Rule:** API returnează MEREU UTC timestamps. UI convertește la local.

```typescript
// API response
{
  "created_at": "2025-01-15T10:30:00Z"  // UTC
}

// UI display
"15/01/2025 11:30"  // Local time (Europe/London = UTC+1)

// Implementation
const utcDate = new Date("2025-01-15T10:30:00Z");
const localString = formatDate(utcDate.toISOString(), 'medium');
```

**Timezone Display:**
- Cards: No timezone shown (implicit local)
- Charts: X-axis labels în local time
- Tooltips: Show "Updated 2 minutes ago" (relative), NU absolute time

---

## 5. Fallback Strategy

**Missing Translation:**
```typescript
function t(key: string, fallback?: string): string {
  const translation = i18n[key];
  return translation ?? fallback ?? key;
}

// Example
t('dashboard.card.bookings_completed.label', 'Bookings')
// → Returns "Bookings Completed" if exists, else "Bookings"
```

**Invalid Locale:**
- Dacă `navigator.language` unavailable → use `en-GB`
- Log warning în dev mode, silent în production

**Currency Unavailable:**
- Fallback la GBP pentru toate conversii
- Notify dev team (Sentry/logging)

---

## 6. Number Formatting Edge Cases

### Large Numbers
```typescript
// ✅ CORRECT: Use compact notation for >1M
formatNumber(1234567) → "1,234,567"  // Keep full for <10M
formatNumber(12345678) → "12.3M"     // Compact for >10M

// Implementation
function formatNumberCompact(value: number): string {
  if (value < 10_000_000) {
    return formatNumber(value);
  }
  return new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}
```

### Negative Values
```typescript
// Currency
formatCurrency(-12345) → "-£123.45"  // NOT "(£123.45)"

// Count
formatNumber(-100) → "-100"

// Percentage
formatPercent(-5.5) → "-5.50%"
```

### Zero Values
```typescript
// Distinguish între 0 (valid) și null (missing)
formatCurrency(0) → "£0.00"      // Valid value
formatCurrency(null) → "N/A"     // Missing data
```

---

## 7. Accessibility Considerations

**Screen Reader Labels:**
```typescript
// ✅ CORRECT
aria-label="GMV Completed: £1,234.56"

// ❌ WRONG
aria-label="GMV Completed: 123456"  // Raw pence confusing
```

**Unit Announcements:**
```typescript
// Include units in aria-label
<div aria-label={`${label}: ${formatCurrency(value)}`}>
  {formatCurrency(value)}
</div>

// For counts
<div aria-label={`${label}: ${formatNumber(value)} bookings`}>
  {formatNumber(value)}
</div>
```

---

## 8. Performance Considerations

**Memoization:**
```typescript
// Cache Intl formatters (expensive to create)
const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP'
});

// Reuse
function formatCurrency(pence: number): string {
  return currencyFormatter.format(pence / 100);
}
```

**Avoid Re-creating:**
- Create formatters once at module level
- NOT inside render loops

---

## Summary Checklist

- ✅ Formatters centralizați în `formatters.ts`
- ✅ Fallback locale: `en-GB`, currency: `GBP`
- ✅ UTC → Local conversion DOAR în UI
- ✅ i18n keys namespace `dashboard.*`
- ✅ Units explicit în API (`GBP_pence`, `count`, `percentage`)
- ✅ Conversie pence→GBP în formatter, NU în componente
- ✅ Accessibility: units în aria-labels
- ✅ Performance: memoize formatters
- ✅ Edge cases: null→N/A, negatives, large numbers
