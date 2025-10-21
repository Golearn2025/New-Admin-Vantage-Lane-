# Binding Specification — DataAdapter & Type-Safe Mappings

**Version:** 1.0.0  
**Purpose:** Contract între API endpoints și UI components. Zero business logic în UI.

---

## 1. DataAdapter<T> Generic Contract

```typescript
interface DataAdapter<T> {
  fetch(endpoint: string, params: Record<string, string>): Promise<AdapterResponse<T>>;
  validate(response: unknown): response is T;
  transform(raw: T): CardData | ChartData;
}

interface AdapterResponse<T> {
  value?: number; // Pentru single metrics (carduri)
  series?: SeriesPoint[]; // Pentru time-series (grafice)
  unit: 'count' | 'GBP_pence' | 'percentage';
  meta: {
    cached_at: string; // ISO timestamp
    window?: string; // 'today' | 'this_month' etc.
    organization_id?: string;
  };
}

interface SeriesPoint {
  x: string; // ISO date sau label
  y: number; // Raw value în unit specificat
}
```

---

## 2. Unit System — STRICT

**API Contract:**

- `GBP_pence`: DOAR integer (ex: 12345 = £123.45)
- `count`: DOAR integer (ex: 47 bookings)
- `percentage`: Float 0-100 (ex: 12.5 = 12.5%)

**Conversion Rules:**

- Conversie `pence → GBP` DOAR în `formatCurrency(pence)` helper
- NICIODATĂ în componente sau adapters
- Validare: dacă API returnează `unit: 'count'` dar CardSpec cere `GBP_pence` → throw `UnitMismatchError`

**Unit Mismatch Error:**

```typescript
class UnitMismatchError extends Error {
  code = 'UNIT_MISMATCH';
  expected: Unit;
  received: Unit;
  field: string;
}
// Exemplu: API returnează count, dar card spec cere GBP_pence
// → Error: "Unit mismatch for 'gmv_completed': expected GBP_pence, got count"
```

---

## 3. API Response → Props Mapping

**CardKit Mapping:**

```typescript
interface CardDataAdapter {
  endpoint: '/api/dashboard/metrics';
  params: { window: string; organization_id?: string };

  // Raw API response (MUST include unit for each metric)
  raw: {
    bookings_completed: number;
    bookings_completed_unit: 'count'; // ✅ Required
    gmv_completed_pence: number;
    gmv_completed_unit: 'GBP_pence'; // ✅ Required
    currency: 'GBP';
    window: string;
    cached_at: string;
  };

  // Mapped to CardProps
  output: {
    value: number; // Direct din API field
    unit: 'count' | 'GBP_pence'; // From API response
    meta: { cached_at; window };
  };
}
```

**ChartKit Mapping:**

```typescript
interface ChartDataAdapter {
  endpoint: '/api/dashboard/upcoming';
  params: { days: string };

  // Raw API response (MUST include unit)
  raw: {
    data: Array<{ day: string; booking_count: number; revenue_pence: number }>;
    unit: 'GBP_pence'; // ✅ Required at response level
    currency: 'GBP';
    cached_at: string;
  };

  // Mapped to ChartProps
  output: {
    series: Array<{ x: '2025-01-15'; y: 12345 }>; // pence raw
    unit: 'GBP_pence'; // From API response
    meta: { cached_at };
  };
}
```

---

## 4. Validation Pipeline

**Step 1: Schema Validation**

- Check response structure matches expected interface
- Throw `ValidationError` dacă lipsesc câmpuri obligatorii

**Step 2: Unit Validation**

- Compare `response.unit` cu `CardSpec.unit` sau `ChartSpec.unit`
- Throw `UnitMismatchError` dacă nu match

**Step 3: Value Validation**

- Check `typeof value === 'number'` pentru GBP_pence și count
- Check `Number.isInteger(value)` pentru pence și count
- Allow `null` pentru metrics opționale (ex: refunds când tabel gol)

**Step 4: NO_DATA vs N/A Distinction**

| Scenario           | API Response                                  | UI Decision                                    |
| ------------------ | --------------------------------------------- | ---------------------------------------------- |
| Query OK, 0 rows   | `{ data: [], code: 'NO_DATA' }`               | Render **empty state** ("No data for period")  |
| Metric unavailable | `{ value: null, reason: 'Feature disabled' }` | Render **N/A state** ("N/A: Feature disabled") |

**Rules:**

- `NO_DATA` = API explicit code când query succeeded dar no results
- `N/A` = UI decision când `value: null` + `reason` field present
- `value: null` WITHOUT `reason` → treat as error (missing data)

**Step 4: Type Narrowing**

```typescript
function isValidMetricsResponse(data: unknown): data is MetricsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'bookings_completed' in data &&
    typeof data.bookings_completed === 'number'
  );
}
```

---

## 5. Pence → UI Conversion (DOAR în Formatter)

**Location:** `apps/admin/shared/ui/composed/dashboard/formatters.ts`

**Rule:** Componenta primește MEREU `value_pence: number`. Niciodată convertit în component body.

```typescript
// ✅ CORRECT
function formatCurrency(pence: number, locale = 'en-GB'): string {
  const pounds = pence / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'GBP'
  }).format(pounds);
}

// În component:
<div>{formatCurrency(props.value_pence)}</div>

// ❌ WRONG — conversie în component
<div>£{(props.value_pence / 100).toFixed(2)}</div>
```

---

## 6. RBAC/RLS Integration

**Operator Requirements:**

- MUST provide `organization_id` în query params
- JWT decode → extract `organization_id` → append to API calls
- Dacă lipsește `organization_id` → API returnează `403 FORBIDDEN`

**Admin Requirements:**

- NO `organization_id` required (vede toate organizațiile)
- Query params fără `organization_id` → aggregate data

**Implementation Contract:**

```typescript
interface FetchParams {
  window: WindowPreset;
  organization_id?: string; // Required for operator, optional for admin
}

// În adapter:
function buildQueryParams(role: 'admin' | 'operator', orgId?: string): URLSearchParams {
  const params = new URLSearchParams({ window: 'this_month' });

  if (role === 'operator') {
    if (!orgId) throw new Error('RBAC violation: operator requires organization_id');
    params.set('organization_id', orgId);
  }

  return params;
}
```

---

## 7. Configuration Constants

**Location:** `apps/admin/shared/config/dashboard.config.ts`

```typescript
export const DASHBOARD_CONFIG = {
  locale: 'en-GB',
  currency: 'GBP',

  // Network & Retry
  request_timeout_ms: 5000,
  max_retries: 3,
  retry_delays_ms: [1000, 2000, 4000], // Exponential backoff

  // Performance Budgets
  card_first_paint_ms: 200,
  chart_render_ms: 400,
  scroll_fps_min: 55,
};
```

---

## 8. Error Handling Contract

**Adapter MUST catch și map errors + handle Retry-After:**

```typescript
try {
  const response = await fetch(endpoint);

  if (!response.ok) {
    const error = await response.json();

    // Extract Retry-After for RATE_LIMITED (HTTP 429)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
        ? parseInt(response.headers.get('Retry-After')!)
        : error.meta?.retry_after ?? 30; // Fallback order

      throw new RateLimitError({
        code: 'RATE_LIMITED',
        message: error.message,
        meta: { retry_after: retryAfter },
      });
    }

    throw mapAPIError(error);
  }
} catch (err) {
  // Map to standard error codes (vezi error-policy.md)
  throw new DashboardError(code, message);
}
```

**Retry-After Priority:**

1. HTTP `Retry-After` header (preferred)
2. JSON `meta.retry_after` field
3. Default fallback: 30 seconds

**Error Propagation:**

- Adapter throw → Component catch → setState('error')
- Component afișează error UI conform error-policy.md
- NICIODATĂ silent fail sau console.log

---

## 8. Metadata Handling

**API MUST return unit field:**

```json
{
  "bookings_completed": 47,
  "bookings_completed_unit": "count",
  "gmv_completed_pence": 123456,
  "gmv_completed_unit": "GBP_pence",
  "currency": "GBP",
  "cached_at": "2025-01-15T10:30:00Z",
  "window": "this_month"
}
```

**OR for charts:**

```json
{
  "data": [{ "day": "2025-01-15", "value": 12345 }],
  "unit": "GBP_pence",
  "currency": "GBP",
  "cached_at": "2025-01-15T10:30:00Z"
}
```

**Component SHOULD display:**

- Cached timestamp în tooltip: "Updated 2 minutes ago"
- Window în sublabel: "This month"
- Currency pentru context (though implicit în GBP_pence)

---

## 9. Performance Contracts

**Adapter:**

- Cache responses 60s client-side (in-memory Map)
- Deduplicate simultaneous identical requests
- Timeout 5s → throw `TIMEOUT` error

**Component:**

- Show skeleton within 16ms (1 frame)
- Render data within 200ms pentru cards
- Render chart within 400ms pentru ≤90 bars/365 points

---

## 10. Type Safety Guarantees

**NO `any` types allowed:**

```typescript
// ✅ CORRECT
function fetchMetrics(params: FetchParams): Promise<MetricsResponse>;

// ❌ WRONG
function fetchMetrics(params: any): Promise<any>;
```

**Strict Null Checks:**

- `value: number | null` când metric poate lipsi (ex: refunds)
- Component handle null → show N/A state

**Exhaustive Type Checking:**

```typescript
function renderByUnit(unit: Unit, value: number): string {
  switch (unit) {
    case 'count':
      return formatNumber(value);
    case 'GBP_pence':
      return formatCurrency(value);
    case 'percentage':
      return formatPercent(value);
    default: {
      const _exhaustive: never = unit; // Compilează doar dacă toate handled
      throw new Error(`Unhandled unit: ${_exhaustive}`);
    }
  }
}
```

---

## Summary Checklist

- ✅ DataAdapter<T> cu contract explicit input/output
- ✅ Unit validation cu UnitMismatchError
- ✅ Pence → GBP DOAR în formatter
- ✅ RBAC: operator needs org_id, admin optional
- ✅ Error mapping standardizat
- ✅ Metadata (cached_at, window) propagat
- ✅ Type safety: zero `any`, exhaustive checks
- ✅ Performance: cache 60s, timeout 5s
