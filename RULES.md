# ⚖️ PROJECT RULES - STRICT ENFORCEMENT

**Last Updated:** 2025-10-19 11:48  
**Status:** ENFORCED via ESLint + Husky + Scripts  
**Compliance Required:** 100%

---

## 🎯 CORE PRINCIPLES

1. **Modular**: Feature-slices architecture
2. **Type-Safe**: Strict TypeScript, zero `any`
3. **Clean**: No business logic in UI
4. **Fast**: Server-side pagination, performance budgets
5. **Secure**: RLS ON, no service_role in browser
6. **Small**: File size limits strictly enforced
7. **Documented**: Living documentation

---

## 📏 FILE SIZE LIMITS (STRICT)

### **Enforced by ESLint:**

| File Type                      | Max Lines | Rule             | Override   |
| ------------------------------ | --------- | ---------------- | ---------- |
| **UI Components** (.tsx)       | 200       | `max-lines: 200` | ❌ BLOCKED |
| **Logic/Utils** (.ts in /lib/) | 150       | `max-lines: 150` | ❌ BLOCKED |
| **Hooks** (.ts in /hooks/)     | 80        | `max-lines: 80`  | ❌ BLOCKED |
| **Types** (.types.ts)          | 150       | `max-lines: 150` | ⚠️ Warning |
| **Tests** (.test.ts)           | 300       | No limit         | ✅ Allowed |

### **How to Check:**

```bash
# Check all file sizes
npm run check:files

# Output example:
# UI too long: apps/admin/features/dashboard/DashboardPage.tsx (245 lines)
```

### **Current Violations:** 7 files

```
❌ app/api/bookings/list/route.ts - 249 lines (limit: 150)
❌ packages/ui-core/src/DataTable/DataTable.tsx - 203 lines (limit: 200)
❌ packages/ui-dashboard/src/filters/DateRangePicker/DateRangePicker.tsx - 217 lines
❌ apps/admin/features/dashboard-metrics/useDashboardMetrics.ts - 112 lines (limit: 80)
❌ apps/admin/features/settings-profile/hooks/useProfileData.ts - 111 lines (limit: 80)
❌ apps/admin/shared/utils/chartGrouping.ts - 190 lines (limit: 150)
❌ packages/ui-dashboard/src/utils/dateRangePresets.ts - 171 lines (limit: 150)
```

**Action:** Must fix before merge!

---

## 🚫 TYPESCRIPT RULES (ZERO TOLERANCE)

### **Rule 1: No `any` Types**

**ESLint Rule:** `@typescript-eslint/no-explicit-any: "error"`

```typescript
// ❌ BLOCKED
const data: any = fetchData();
function process(input: any) {}

// ✅ CORRECT
const data: User[] = fetchData();
function process(input: UserInput): ProcessedData {}
```

**Check Command:**

```bash
npm run check:any
# Output: "No any types found" or list of violations
```

**Current Status:** ✅ 0 violations

---

### **Rule 2: Strict TypeScript**

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Check Command:**

```bash
npm run check:ts
# Or:
tsc --noEmit
```

---

## 🎨 DESIGN & STYLING RULES

### **Rule 3: No Inline Styles**

**Principle:** "Zero culori inline. Doar tokens."

```typescript
// ❌ BLOCKED
<div style={{ color: '#ff0000', padding: '16px' }}>

// ❌ BLOCKED
<div style={{ backgroundColor: 'var(--color-bg)' }}>

// ✅ CORRECT
<div className={styles.container}>

// ✅ CORRECT (only design tokens in inline, rare cases)
<div style={{
  color: 'var(--color-text-primary)',
  padding: 'var(--spacing-md)'
}}>
```

**Check Command:**

```bash
npm run check:colors
# Finds: style={{, color: #, rgb(, hsl(
```

**Current Violations:** 147 inline styles  
**Action:** Create CSS modules

---

### **Rule 4: No Hardcoded Colors**

**Only allowed in:**

- `packages/ui-core/src/tokens/*.css` (design tokens)
- `app/globals.css` (token definitions)

```css
/* ❌ BLOCKED in component CSS */
.button {
  background: #3b82f6;
  color: #ffffff;
}

/* ✅ CORRECT */
.button {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
```

**Check Command:**

```bash
npm run check:colors
```

**Current Status:** ✅ 0 violations (outside tokens)

---

## 🔒 CONSOLE STATEMENTS (PRODUCTION)

### **Rule 5: No console.log/error/warn**

**ESLint Rule:** `"no-console": ["error", { "allow": ["warn", "error"] }]`

Wait - this rule allows console.warn and console.error, but they should be removed too!

```typescript
// ❌ BLOCKED in production
console.log('Debug info');
console.error('Error:', error);
console.warn('Warning');

// ✅ CORRECT - Use logger
import { logger } from '@/lib/utils/logger';

logger.error('Error occurred', { error, context });
logger.info('User action', { userId, action });
```

**Current Violations:** 10 console statements

**Files:**

```
1. app/api/bookings/list/route.ts:82, 243
2. app/api/dashboard/metrics/route.ts:97, 130
3. app/api/dashboard/charts/route.ts:93, 117
4. app/(admin)/bookings/hooks/useBookingsList.ts:52
5. packages/ui-icons/src/index.ts:54
6. lib/middleware/rbac.ts:109
7. apps/admin/shared/hooks/useCurrentUser.ts:62
```

**Action:** Replace with proper error logging

---

## 🏗️ ARCHITECTURE RULES

### **Rule 6: No Business Logic in UI**

**Principle:** "Fără logică de business în UI"

```typescript
// ❌ BLOCKED - Business logic in component
function BookingCard({ booking }: Props) {
  const total = booking.basePrice +
    booking.services.reduce((sum, s) => sum + s.price, 0);
  const isUrgent = new Date(booking.pickupTime) < new Date(Date.now() + 3 * 60 * 60 * 1000);

  return <div>{total}</div>;
}

// ✅ CORRECT - Logic in helper/hook
// In /lib/helpers.ts:
export function calculateTotal(booking: Booking): number { }
export function isBookingUrgent(booking: Booking): boolean { }

// In component:
function BookingCard({ booking }: Props) {
  const total = calculateTotal(booking);
  const isUrgent = isBookingUrgent(booking);

  return <div>{total}</div>;
}
```

**Check Command:**

```bash
npm run check:business
# Finds: fetch(, axios(, supabase.from( in UI files
```

---

### **Rule 7: No Direct API Calls in UI**

**ESLint Rule:** Import restrictions

```typescript
// ❌ BLOCKED
import { supabase } from '@/lib/supabase/client';

function Component() {
  const data = await supabase.from('bookings').select();
}

// ✅ CORRECT - Use hooks
import { useBookings } from '@/features/bookings-table/hooks';

function Component() {
  const { data } = useBookings();
}
```

**Enforced by:**

- ESLint `no-restricted-imports`
- Pattern blocks: `**/shared/api/clients/**` in UI

---

### **Rule 8: Import Boundaries**

```typescript
// ❌ BLOCKED - UI importing business entities
import { BookingEntity } from '@/entities/booking';

// ❌ BLOCKED - Shared UI importing features
import { BookingsTable } from '@/features/bookings-table';

// ❌ BLOCKED - Circular dependencies
import { A } from './B'; // where B imports from A

// ✅ CORRECT
import { BookingType } from '@/shared/api/contracts';
import { useBookings } from '@/shared/hooks';
```

**Check Commands:**

```bash
# Check import boundaries
npm run check:boundaries

# Check circular dependencies
npm run check:circular
```

---

## ⚡ PERFORMANCE RULES

### **Rule 9: Performance Budgets**

| Metric                             | Budget         | Enforcement   |
| ---------------------------------- | -------------- | ------------- |
| **LCP** (Largest Contentful Paint) | <2s            | Lighthouse CI |
| **TTFB** (Time To First Byte)      | <200ms         | Lighthouse CI |
| **Bundle Size** (initial)          | <180KB gzipped | size-limit    |
| **DB Query p95**                   | <200ms         | Monitoring    |

**Check Commands:**

```bash
# Check bundle size
npm run check:budgets

# Check login page performance
npm run lh:login
# Requires: performance ≥ 0.9, accessibility ≥ 0.95
```

---

### **Rule 10: Server-Side Pagination**

**Principle:** "Paginare server-side. Keyset pentru liste mari."

```typescript
// ❌ BLOCKED - Client-side pagination
const allData = await fetch('/api/bookings/all'); // Fetches 10,000 rows
const page = allData.slice(0, 25);

// ✅ CORRECT - Server-side pagination
const { data } = await fetch('/api/bookings/list?page=1&page_size=25');
```

**Required for:**

- All lists with >50 items
- All data tables
- All search results

---

## 🔐 SECURITY RULES

### **Rule 11: RLS Always ON**

**Principle:** "RLS ON peste tot. Zero service-role în browser."

```typescript
// ❌ BLOCKED
import { supabaseAdmin } from '@/lib/supabase/admin'; // service_role key

// ✅ CORRECT
import { createClient } from '@/lib/supabase/client'; // Uses RLS
```

**Check:** No `service_role`, `supabaseAdmin`, `serviceRoleKey` in `/app` or UI files

---

### **Rule 12: No PII in Logs**

```typescript
// ❌ BLOCKED
logger.info('User logged in', { email: user.email, phone: user.phone });

// ✅ CORRECT
logger.info('User logged in', { userId: user.id });
```

---

## 🧪 TESTING RULES

### **Rule 13: Test Coverage**

**Required:**

- ✅ 1 contract test per API endpoint
- ✅ 1 RLS test per database table
- ⚠️ Unit tests for business logic
- ⚠️ E2E tests for critical flows

**Check Commands:**

```bash
npm run test              # Unit tests
npm run test:e2e          # E2E tests
```

---

## 📚 DOCUMENTATION RULES

### **Rule 14: Documentation Required**

**Update on every change:**

- ✅ STRUCTURE.md (this file auto-updates)
- ✅ CHANGELOG.md (manual entry)
- ✅ Relevant docs in /apps/admin/docs/

**Files that require documentation:**

- New features
- API endpoints
- Database schema changes
- Architecture decisions (ADR)

---

## 🚀 PRE-PUSH VALIDATION (HUSKY)

### **Automated Checks (runs on `git push`):**

```bash
#!/bin/sh
# .husky/pre-push

npm run check:all

# Includes:
# 1. TypeScript compilation (tsc --noEmit)
# 2. ESLint validation
# 3. Next.js build
```

**What happens:**

- ✅ Pass → Push proceeds
- ❌ Fail → Push blocked until fixed

**Logs saved to:**

- `reports/tsc.log`
- `reports/eslint.log`
- `reports/next-build.log`

---

## 📊 QUALITY GATE (PR Requirements)

### **Must Pass:**

1. ✅ Zero TypeScript errors
2. ✅ Zero ESLint errors
3. ✅ Zero `any` types
4. ✅ Zero console statements
5. ✅ All files under size limits
6. ✅ No inline styles (except tokens)
7. ✅ No hardcoded colors
8. ✅ Server-side pagination on lists
9. ✅ Tests passing
10. ✅ Documentation updated

### **Commands to Run Before PR:**

```bash
# Full validation
npm run check:all

# Enterprise checks
npm run check:enterprise

# Individual checks
npm run check:ts          # TypeScript
npm run check:lint        # ESLint
npm run check:any         # any types
npm run check:files       # File sizes
npm run check:colors      # Inline colors
npm run check:business    # Business logic in UI
npm run check:boundaries  # Import boundaries
npm run check:circular    # Circular dependencies
```

---

## 🔧 AVAILABLE SCRIPTS

```json
{
  "check:ts": "tsc --noEmit",
  "check:lint": "eslint . --ext .ts,.tsx -f unix",
  "check:all": "...",
  "check:enterprise": "...",
  "check:any": "grep -R '\\bany\\b' ...",
  "check:files": "find apps/admin -name '*.tsx' ...",
  "check:colors": "grep -R 'color:\\s*#\\|rgb(\\|hsl(' ...",
  "check:business": "grep -R 'from.*shared/api/clients ...",
  "check:boundaries": "npx depcruise ...",
  "check:circular": "npx madge --circular ...",
  "check:budgets": "npx size-limit --why",
  "check:a11y": "npx @axe-core/cli http://localhost:3000/login"
}
```

---

## 📋 CURRENT COMPLIANCE STATUS

| Rule                 | Status  | Violations     | Action           |
| -------------------- | ------- | -------------- | ---------------- |
| File Sizes           | 🟡 95%  | 7 files        | Fix before merge |
| TypeScript any       | ✅ 100% | 0              | ✅ Perfect       |
| Console Statements   | 🔴 0%   | 10             | **P0 - Fix now** |
| Inline Styles        | 🔴 0%   | 147            | **P0 - Fix now** |
| Hardcoded Colors     | ✅ 100% | 0              | ✅ Perfect       |
| Business Logic in UI | ✅ 95%  | Few cases      | Monitor          |
| Import Boundaries    | ✅ 90%  | Few violations | Review           |
| Server Pagination    | ✅ 100% | 0              | ✅ Perfect       |
| RLS Security         | ✅ 100% | 0              | ✅ Perfect       |
| Documentation        | ✅ 95%  | Some gaps      | Update           |

**Overall Compliance:** 70% (Target: 100%)

---

## 🎯 IMMEDIATE ACTIONS (P0)

1. **Fix 10 console statements** - Replace with logger (1h)
2. **Fix 147 inline styles** - Create CSS modules (3h)
3. **Fix 7 file size violations** - Refactor large files (2h)

**Total Time:** 6 hours to 100% compliance

---

## 📝 RULES SUMMARY

✅ **ENFORCED BY TOOLING:**

- File size limits (ESLint)
- No `any` types (ESLint)
- No console (ESLint)
- Import boundaries (ESLint)
- Pre-push validation (Husky)

⚠️ **MANUAL REVIEW:**

- Inline styles (script check)
- Business logic in UI (script check)
- Documentation updates (PR review)

🎯 **AUTOMATIC:**

- TypeScript compilation
- Build success
- Performance budgets

---

**🔄 Auto-update:** Review rules when adding new patterns  
**✅ Compliance Target:** 100%  
**📏 Current:** 70% - Needs improvement
