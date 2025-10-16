# Error Policy & State Machine

**Version:** 1.0.0  
**Purpose:** Standard error codes, API→UI mapping, state transitions.

---

## 1. Standard Error Codes

### API Error Codes (Backend)

| Code | HTTP Status | Meaning | Retry? |
|------|-------------|---------|--------|
| `DATABASE_ERROR` | 500 | Supabase query failed | Yes |
| `TIMEOUT` | 504 | Request exceeded 5s | Yes |
| `FORBIDDEN` | 403 | RLS policy violation (operator without org_id) | No |
| `NO_DATA` | 200 | Query successful but 0 rows (API emits, UI renders empty state) | No |
| `N_A` | 200 | Metric unavailable (UI decides based on null + context, not API code) | No |
| `INVALID_UUID` | 422 | organization_id malformed | No |
| `RATE_LIMITED` | 429 | Too many requests (check Retry-After header) | Yes (after delay) |

**Unified Error Payload Format:**
```typescript
interface ErrorResponse {
  code: ErrorCode;
  message: string;
  meta?: {
    retry_after?: number;  // Seconds (for RATE_LIMITED)
    timestamp?: string;
    [key: string]: unknown;
  };
}
```

**Example:**
```json
{
  "code": "DATABASE_ERROR",
  "message": "Failed to fetch bookings: connection timeout",
  "meta": {
    "timestamp": "2025-01-16T03:30:00Z"
  }
}
```

---

## 2. UI State Machine

### States

```
┌──────┐
│ idle │ Initial state, no data fetched
└───┬──┘
    │ User opens dashboard
    ▼
┌─────────┐
│ loading │ Skeleton visible, aria-busy="true"
└────┬────┘
     │
     ├──► ┌─────────┐
     │    │ success │ Data rendered, aria-busy="false"
     │    └─────────┘
     │
     ├──► ┌───────┐
     │    │ empty │ NO_DATA: query OK, 0 rows
     │    └───────┘
     │
     ├──► ┌────────┐
     │    │  N/A   │ Metric not applicable (ex: refunds disabled)
     │    └────────┘
     │
     └──► ┌───────┐
          │ error │ DATABASE_ERROR, TIMEOUT, FORBIDDEN, etc.
          └───┬───┘
              │ User clicks "Retry"
              ▼
          ┌─────────┐
          │ loading │ Retry attempt
          └─────────┘
```

### State Properties

| State | Skeleton | Content | Error Banner | Retry Button | aria-busy |
|-------|----------|---------|--------------|--------------|-----------|
| `idle` | No | No | No | No | false |
| `loading` | Yes | No | No | No | true |
| `success` | No | Yes | No | No | false |
| `empty` | No | Empty message | No | No | false |
| `N/A` | No | N/A indicator | No | No | false |
| `error` | No | No | Yes | Yes (conditional) | false |

---

## 3. Error Code → UI State Mapping

### DATABASE_ERROR

**Trigger:** Supabase query failure  
**UI State:** `error`  
**Display:**
- Border: `var(--color-danger-default)` (red)
- Icon: Alert triangle (20×20)
- Message: "Failed to load data. Please try again."
- CTA: "Retry" button (primary variant)

**Behavior:**
- User clicks Retry → transition to `loading` → re-fetch
- Max 3 retries, then show "Contact support" message

**Code Example (Card):**
```tsx
{state === 'error' && (
  <div className="error-state">
    <AlertTriangle size={20} color="var(--color-danger-default)" />
    <p>Failed to load data</p>
    <Button variant="primary" size="sm" onClick={handleRetry}>
      Retry
    </Button>
  </div>
)}
```

---

### TIMEOUT

**Trigger:** Request >5s  
**UI State:** `error`  
**Display:**
- Border: `var(--color-warning-default)` (orange)
- Icon: Clock icon
- Message: "Request timed out. Check your connection."
- CTA: "Retry" button

**Behavior:** Same as DATABASE_ERROR (retriable)

---

### FORBIDDEN

**Trigger:** RLS violation (operator accesses without organization_id)  
**UI State:** `error`  
**Display:**
- Border: `var(--color-danger-default)`
- Icon: Lock icon
- Message: "Access denied. Contact your administrator."
- CTA: NO retry button (not retriable)

**RBAC Context:**
```typescript
// Operator without org_id → API returns 403
if (role === 'operator' && !organization_id) {
  throw new Error('FORBIDDEN: Operator requires organization_id');
}
```

**Behavior:**
- NO retry (RLS won't change mid-session)
- Show message + link to support

---

### NO_DATA

**Trigger:** Query successful but 0 rows  
**UI State:** `empty`  
**Display:**
- Background: `var(--color-surface-elevated)` (normal card)
- Icon: Inbox icon (opacity 32%)
- Message: "No data for selected period"
- Sublabel: "Try selecting a different time range"
- CTA: NO retry button (data doesn't exist)

**Example (Card):**
```tsx
{state === 'empty' && (
  <div className="empty-state">
    <Inbox size={48} opacity={0.32} />
    <p className="message">No data for selected period</p>
    <p className="sublabel">Try selecting a different time range</p>
  </div>
)}
```

**Distinction from Error:**
- Empty = valid state (query worked, no results)
- Error = failure state (query broken)

---

### N_A (Not Applicable)

**Trigger:** Metric unavailable in context  
**UI State:** `N/A`  
**Display:**
- Value: "N/A" (large, muted color)
- Sublabel: Reason (ex: "Refunds table not configured")
- Icon: Info circle (optional)
- Border: Normal (not error)

**Examples:**
- Refunds card când refunds table doesn't exist
- Platform commission când operator role (hidden metric)
- Forecasted metrics când historical data <7 days

**Code Example:**
```tsx
{state === 'N/A' && (
  <div className="na-state">
    <div className="value">N/A</div>
    <div className="sublabel">{fallback_reason}</div>
  </div>
)}
```

**Distinction:**
- N/A = metric conceptually unavailable
- Empty = metric available but no data yet

---

### INVALID_UUID

**Trigger:** Malformed organization_id parameter  
**UI State:** `error`  
**Display:**
- Message: "Invalid organization ID. Please refresh."
- CTA: "Refresh" button → reload page

**Behavior:**
- NOT retriable with same params
- Likely app bug or corrupted JWT → needs fresh session

---

### RATE_LIMITED

**Trigger:** >60 requests/minute from same IP  
**UI State:** `error`  
**Display:**
- Message: "Too many requests. Please wait {retry_after} seconds."
- CTA: "Retry" disabled for {retry_after}s, then enabled

**Behavior:**
- Read `Retry-After` header from API response (HTTP 429)
- Fallback to 30s if header missing
- Auto-retry after delay
- Show countdown timer: "Retry available in 25s..."

**Implementation:**
```typescript
const retryAfter = response.headers.get('Retry-After') 
  ? parseInt(response.headers.get('Retry-After')!) 
  : 30;

// OR from meta if JSON response
const retryAfter = error.meta?.retry_after ?? 30;
```

---

## 4. Error Logging & Telemetry

### Client-Side Logging

```typescript
function logError(code: ErrorCode, context: Record<string, unknown>) {
  // Send to Sentry or logging service
  logger.error({
    code,
    message: ERROR_MESSAGES[code],
    context: {
      component: 'CardKit',
      card_key: context.card_key,
      endpoint: context.endpoint,
      user_role: context.user_role,
      timestamp: new Date().toISOString()
    }
  });
}
```

**Do NOT log:**
- Sensitive params (JWT tokens, API keys)
- User PII (email, org names)

**DO log:**
- Error code
- Component name
- Endpoint URL (sanitized)
- User role (admin|operator)
- Timestamp

---

## 5. User-Facing Error Messages

### Tone Guidelines
- **Calm:** Avoid alarming language ("Failed" > "Oops! Something went wrong!")
- **Actionable:** Tell user what to do ("Retry" > "Error occurred")
- **Honest:** Don't hide errors ("Contact support" not "Try later")

### Message Templates (i18n Keys)

**All error messages MUST use i18n keys, NOT inline strings.**

**Location:** `apps/admin/shared/i18n/dashboard.json`

```json
{
  "dashboard.error.DATABASE_ERROR": "Failed to load data. Please try again.",
  "dashboard.error.TIMEOUT": "Request timed out. Check your connection.",
  "dashboard.error.FORBIDDEN": "Access denied. Contact your administrator.",
  "dashboard.error.NO_DATA": "No data for selected period.",
  "dashboard.error.N_A": "Not applicable: {{reason}}",
  "dashboard.error.INVALID_UUID": "Invalid organization ID. Please refresh.",
  "dashboard.error.RATE_LIMITED": "Too many requests. Wait {{seconds}} seconds.",
  "dashboard.error.retry_button": "Retry",
  "dashboard.error.retry_countdown": "Retry available in {{seconds}}s",
  "dashboard.error.contact_support": "Contact support"
}
```

**Usage in Component:**
```typescript
import { t } from '@admin/shared/i18n';

// Error message
const message = t(`dashboard.error.${error.code}`, { reason: error.meta?.reason });

// Retry button
<Button onClick={handleRetry}>{t('dashboard.error.retry_button')}</Button>
```

---

## 6. Retry Strategy

### Retriable Errors
- DATABASE_ERROR
- TIMEOUT
- RATE_LIMITED

### Non-Retriable Errors
- FORBIDDEN (RLS won't change)
- INVALID_UUID (needs fix, not retry)
- NO_DATA (data doesn't exist)
- N_A (metric unavailable)

### Retry Logic

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

async function fetchWithRetry(
  endpoint: string,
  params: Record<string, string>,
  attempt = 0
): Promise<Response> {
  try {
    return await fetch(endpoint + '?' + new URLSearchParams(params));
  } catch (error) {
    if (attempt < MAX_RETRIES && isRetriable(error.code)) {
      await delay(RETRY_DELAYS[attempt]);
      return fetchWithRetry(endpoint, params, attempt + 1);
    }
    throw error;
  }
}
```

---

## 7. Accessibility for Errors

### ARIA Roles

```tsx
// Error state
<div role="alert" aria-live="assertive">
  <p>Failed to load data</p>
</div>

// Empty state
<div role="status" aria-live="polite">
  <p>No data for selected period</p>
</div>

// N/A state
<div role="status">
  <p>Not applicable: {reason}</p>
</div>
```

### Screen Reader Announcements

| State | Announcement |
|-------|--------------|
| loading | "Loading data" (aria-busy) |
| success | "Data loaded" (aria-live=polite) |
| empty | "No data available" (aria-live=polite) |
| error | "Error: Failed to load data" (aria-live=assertive) |
| N/A | "Not applicable: {reason}" (aria-live=polite) |

---

## 8. Visual Error States

### Color Coding

| State | Border | Background | Icon Color |
|-------|--------|------------|------------|
| success | default | elevated | primary |
| empty | default | elevated | muted (32% opacity) |
| N/A | default | elevated | neutral |
| error | critical | elevated | critical |

### Animation

- **Error appear:** Fade-in + subtle shake (2px left-right, 1 cycle, 240ms)
- **Empty appear:** Fade-in only (180ms)
- **Retry button:** Pulse on hover (scale 1.0 ↔ 1.05)

---

## 9. Testing Error States

### Manual Test Cases

1. **DATABASE_ERROR:** Kill Supabase connection → verify error UI + retry
2. **TIMEOUT:** Slow network throttling → verify timeout message
3. **FORBIDDEN:** Operator without org_id → verify "Access denied"
4. **NO_DATA:** Query range with 0 bookings → verify empty state
5. **N_A:** Metric with null API response → verify N/A display
6. **INVALID_UUID:** Malformed org_id param → verify error
7. **RATE_LIMITED:** >60 requests/min → verify rate limit message

### Automated Tests

```typescript
describe('Error States', () => {
  it('shows DATABASE_ERROR with retry button', () => {
    mockAPI.mockRejectedValue({ code: 'DATABASE_ERROR' });
    render(<CardKit spec={...} />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('shows NO_DATA without retry button', () => {
    mockAPI.mockResolvedValue({ data: [], code: 'NO_DATA' });
    render(<CardKit spec={...} />);
    expect(screen.getByText('No data for selected period')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });
});
```

---

## Summary Checklist

- ✅ Error codes: DATABASE_ERROR, TIMEOUT, FORBIDDEN, NO_DATA, N_A, INVALID_UUID, RATE_LIMITED
- ✅ State machine: idle → loading → (success|empty|N/A|error)
- ✅ Retriable: DATABASE_ERROR, TIMEOUT, RATE_LIMITED
- ✅ Non-retriable: FORBIDDEN, INVALID_UUID, NO_DATA, N/A
- ✅ Retry strategy: Exponential backoff, max 3 attempts
- ✅ User messages: Calm, actionable, honest
- ✅ A11y: role=alert (errors), role=status (empty/N/A), aria-live
- ✅ Logging: Error code + context, NO PII
- ✅ Visual: Color-coded borders, icons, animations
