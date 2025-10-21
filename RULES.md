# 📋 VANTAGE LANE ADMIN - CODING RULES

> **SINGURA SURSĂ DE ADEVĂR pentru reguli de coding**  
> **Version:** 2.0 Enterprise  
> **Last Updated:** 2025-10-21

---

## 🎯 PRINCIPII FUNDAMENTALE

1. **Design Tokens 100%** - Zero hardcodări CSS
2. **TypeScript Strict** - Zero `any` implicit
3. **Architecture Clean** - app/ → features/ → entities/
4. **Testing Mandatory** - 80% coverage entities, 60% features
5. **Security First** - Secrets scan, RLS, CSP

---

## 1️⃣ DESIGN TOKENS - 100% ZERO Hardcodări

### Principiu:
**Reutilizabilitate completă prin design tokens**

### ✅ CORECT:
```css
/* Component.module.css */
.container {
  padding: var(--spacing-4);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-primary);
  transition: var(--transition-base);
}
```

### ❌ GREȘIT:
```css
/* ❌ NICIODATĂ așa */
.container {
  padding: 16px;              /* ❌ hardcoded */
  background: #ffffff;        /* ❌ hardcoded */
  border-radius: 8px;         /* ❌ hardcoded */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* ❌ hardcoded */
}
```

### Tokens Disponibile:
- **Colors:** `packages/ui-core/src/tokens/colors.css`
- **Spacing:** `packages/ui-core/src/tokens/spacing.css`
- **Typography:** `packages/ui-core/src/tokens/typography.css`
- **Borders:** `packages/ui-core/src/tokens/borders.css`
- **Shadows:** `packages/ui-core/src/tokens/shadows.css`
- **Animations:** `packages/ui-core/src/tokens/animations.css`

### Checklist:
- [ ] CSS Module folosește DOAR `var(--token-name)`
- [ ] Zero valori hardcodate: `#hex`, `rgb()`, `px`, `rem`
- [ ] Toate culorile din `--color-*`
- [ ] Toate spacing-urile din `--spacing-*`

---

## 2️⃣ TypeScript - Tipuri Complete

### Principiu:
**Type safety 100%, zero `any` implicit**

### ✅ CORECT:
```typescript
// types.ts
export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
}

// component.tsx
interface Props {
  payments: Payment[];
  onSelect: (id: string) => void;
}

export default function PaymentsTable({ payments, onSelect }: Props) {
  const handleRowClick = (payment: Payment) => {  // ✅ tip explicit
    onSelect(payment.id);
  };
  
  return (
    <div>
      {payments.map((payment) => (  // ✅ type inference
        <Row key={payment.id} data={payment} onClick={handleRowClick} />
      ))}
    </div>
  );
}
```

### ❌ GREȘIT:
```typescript
// ❌ NICIODATĂ așa
export default function PaymentsTable({ payments, onSelect }) {  // ❌ no types
  const handleRowClick = (row) => {  // ❌ implicit any
    onSelect(row.id);
  };
}
```

### Checklist:
```bash
npm run check:ts  # TREBUIE: 0 errors
```
- [ ] Toate funcțiile au tipuri pentru parametri
- [ ] Toate interfețele exportate
- [ ] Niciun `any` implicit
- [ ] Import tipuri din `@entities/*` (nu `@features/*`)
- [ ] Zod schemas pentru validare API

---

## 3️⃣ ESLint Limits - Fișiere Mici & Simple

### Principiu:
**Cod modular, ușor de înțeles și întreținut**

### Limite Stricte:
```typescript
max-lines: 200              // max linii per fișier
max-lines-per-function: 50  // max linii per funcție
complexity: 10              // max complexity per funcție
```

### ✅ CORECT - Structură modulară:
```
features/payments-table/
├── components/
│   ├── PaymentsTable.tsx       (180 lines)  ✅
│   ├── PaymentRow.tsx          (95 lines)   ✅
│   └── PaymentFilters.tsx      (120 lines)  ✅
├── hooks/
│   └── usePaymentsList.ts      (85 lines)   ✅
└── columns/
    ├── index.ts                (45 lines)   ✅
    ├── cells.tsx               (150 lines)  ✅
    └── helpers.ts              (70 lines)   ✅
```

### ❌ GREȘIT:
```
features/payments/
└── PaymentsPage.tsx  (774 lines) ❌ PREA MARE!
```

### Checklist:
```bash
npm run lint  # TREBUIE: 0 errors
```
- [ ] Niciun fișier > 200 lines
- [ ] Funcții < 50 lines
- [ ] Complexity < 10
- [ ] Fără `eslint-disable` comments

---

## 4️⃣ Architecture - Feature Sliced Design

### Principiu:
**Separare clară: routing, UI, business logic**

### Structură Obligatorie:
```
apps/admin/
├── app/              # ❌ DOAR routing, ZERO logică
│   └── (admin)/
│       └── payments/
│           └── page.tsx  # ✅ DOAR: import + render
│
├── features/         # ✅ UI components, hooks, columns
│   └── payments-table/
│       ├── components/
│       ├── hooks/
│       └── columns/
│
└── entities/         # ✅ Business logic, API, schemas
    └── payment/
        ├── model/schema.ts
        ├── api/paymentApi.ts
        └── lib/validatePayment.ts
```

### ✅ CORECT - page.tsx:
```typescript
// app/(admin)/payments/page.tsx
import { PaymentsTable } from '@features/payments-table';

export default function PaymentsPage() {
  return <PaymentsTable />;  // ✅ doar render
}
```

### ❌ GREȘIT - page.tsx:
```typescript
// ❌ NICIODATĂ logică în app/
export default function Page() {
  const [data, setData] = useState([]); // ❌ state în page
  useEffect(() => { /* fetch */ }); // ❌ fetch în page
  return <div>...</div>;
}
```

### Checklist:
```bash
npm run guard:app-logic  # Auto-check
```
- [ ] Niciun `useState`/`useEffect` în `app/`
- [ ] Niciun folder `components/hooks` în `app/`
- [ ] Import DOAR din `@features/*` în pages
- [ ] Logică business DOAR în `entities/`

---

## 5️⃣ Forbidden Imports

### Principiu:
**Previne circular dependencies și arhitectură ruptă**

### Reguli:
```typescript
// ESLint enforced
entities/* ❌ NICIODATĂ → features/*
app/*      ❌ NICIODATĂ → entities/* (doar @features/*)
features/* ✅ OK         → entities/*
```

### ✅ CORECT:
```typescript
// entities/payment/api.ts
import { PaymentSchema } from '../model/schema';  // ✅ intern entity
export async function listPayments() { /* ... */ }

// features/payments-table/components/PaymentsTable.tsx
import { Payment } from '@entities/payment';  // ✅ features → entities
import { usePaymentsList } from '../hooks/usePaymentsList';  // ✅ intern

// app/(admin)/payments/page.tsx
import { PaymentsTable } from '@features/payments-table';  // ✅ app → features
```

### ❌ GREȘIT:
```typescript
// entities/payment/api.ts
import { PaymentRow } from '@features/payments-table';  // ❌ entities → features

// app/(admin)/payments/page.tsx
import { Payment } from '@entities/payment';  // ❌ app → entities direct
```

### Checklist:
- [ ] Niciun import `entities/* → features/*`
- [ ] Niciun import `app/* → entities/*`
- [ ] Niciun import `@/components/*` în `app/`

---

## 6️⃣ Testing Rules

### Coverage Minimum:
```typescript
entities/*: 80%  // Business logic critical
features/*: 60%  // UI components
```

### Test Placement:
```
entities/payment/
├── lib/
│   ├── calculateTotal.ts
│   └── calculateTotal.test.ts  ✅
├── api/
│   ├── paymentApi.ts
│   └── paymentApi.test.ts      ✅
└── model/
    └── schema.ts  (no test needed)

features/payments-table/
├── components/
│   ├── PaymentsTable.tsx
│   └── PaymentsTable.test.tsx  ✅
└── hooks/
    ├── usePaymentsList.ts
    └── usePaymentsList.test.ts ✅
```

### Naming Convention:
```typescript
✅ filename.test.ts
❌ filename.spec.ts
```

### Test Structure:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should return base price + services', () => {
    const result = calculateTotal(100, [50, 30]);
    expect(result).toBe(180);
  });
  
  it('should handle empty services', () => {
    expect(calculateTotal(100, [])).toBe(100);
  });
});
```

### Checklist:
```bash
npm run test:run      # Toate testele verzi
npm run test:coverage # Coverage > threshold
```
- [ ] Teste pentru toate funcțiile publice în `entities/*/lib`
- [ ] Teste pentru toate API calls în `entities/*/api`
- [ ] Teste pentru componente critice în `features/*/components`
- [ ] NO `test.skip()` în production

---

## 7️⃣ File Naming Convention

### Rules:
```
Components:     PascalCase      → PaymentsTable.tsx
Hooks:          camelCase       → usePaymentsList.ts
Utils/Lib:      camelCase       → calculatePrice.ts
Features:       kebab-case      → payments-table/
CSS Modules:    match component → PaymentsTable.module.css
Types:          camelCase       → payment.types.ts
Tests:          match source    → calculatePrice.test.ts
```

### ✅ CORECT:
```
features/payments-table/
├── components/
│   ├── PaymentsTable.tsx
│   ├── PaymentsTable.module.css
│   └── PaymentsTable.test.tsx
├── hooks/
│   ├── usePaymentsList.ts
│   └── usePaymentsList.test.ts
└── types/
    └── payment.types.ts
```

### ❌ GREȘIT:
```
features/payments_table/         ❌ underscore
├── paymentsTable.tsx           ❌ camelCase component
├── PaymentsTable.css           ❌ no .module
└── use-payments-list.ts        ❌ kebab-case hook
```

---

## 8️⃣ CSS Modules Rules

### Naming:
```css
/* PaymentsTable.module.css */
.container {  /* ✅ camelCase */
  padding: var(--spacing-4);
}

.headerTitle {  /* ✅ camelCase */
  font-size: var(--font-size-lg);
}
```

### Import Pattern:
```typescript
import styles from './PaymentsTable.module.css';

<div className={styles.container}>
  <h1 className={styles.headerTitle}>Title</h1>
</div>
```

### Multi-class:
```typescript
✅ className={`${styles.card} ${styles.active}`}
✅ className={clsx(styles.card, isActive && styles.active)}
❌ className="card active"  // no global classes
```

### Checklist:
- [ ] File name: `Component.module.css`
- [ ] Class names: camelCase
- [ ] Import as `styles`
- [ ] Usage: `className={styles.xxx}`

---

## 9️⃣ Export Patterns

### Components:
```typescript
// ✅ 1 default export
export default function PaymentsTable() {
  return <div>...</div>;
}
```

### Features (Barrel):
```typescript
// features/payments-table/index.ts
export { default as PaymentsTable } from './components/PaymentsTable';
export * from './types';
```

### Entities (Named only):
```typescript
// entities/payment/index.ts
export * from './model/schema';
export * from './api/paymentApi';
export * from './lib/validatePayment';
```

### Utils/Hooks (Named):
```typescript
export function calculatePrice() {}
export function usePaymentsList() {}
```

### ❌ NO MIXED:
```typescript
❌ export default X; export const Y = ...;
```

---

## 🔟 Error Handling

### API Calls:
```typescript
// ✅ Throw errors, nu return null
export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from('payments').select('*');
  
  if (error) throw error;  // ✅ throw
  
  return data.map(PaymentSchema.parse);  // ✅ validate
}
```

### Components:
```typescript
export default function PaymentsTable() {
  const { data, loading, error } = usePaymentsList();
  
  if (error) return <ErrorState message={error.message} />;  // ✅
  if (loading) return <LoadingSpinner />;  // ✅
  
  return <Table data={data} />;
}
```

### Logging:
```typescript
// ✅ Use logger util
import { logger } from '@/lib/utils/logger';

try {
  await processPayment(id);
} catch (error) {
  logger.error('Payment processing failed', { id, error });
  throw error;
}

// ❌ NO console.log() în production
```

---

## 1️⃣1️⃣ Performance Rules

### React.memo:
```typescript
// ✅ Pentru liste mari (>50 items)
const PaymentRow = React.memo<PaymentRowProps>(({ payment }) => {
  return <tr>...</tr>;
});

// ❌ Nu pentru componente mici
const Button = React.memo(() => <button>Click</button>);  // ❌ overkill
```

### useMemo:
```typescript
// ✅ Calcule expensive
const sortedPayments = useMemo(() => {
  return payments.sort((a, b) => a.amount - b.amount);
}, [payments]);

// ❌ Values simple
const total = useMemo(() => a + b, [a, b]);  // ❌ overkill
```

### useCallback:
```typescript
// ✅ În props la React.memo components
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);

// ❌ Toate handlers
const onClick = useCallback(() => console.log('hi'), []);  // ❌ overkill
```

### Dynamic Imports:
```typescript
// ✅ Heavy components
const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

---

## 1️⃣2️⃣ Security - Secrets Scan

### Principiu:
**ZERO secrets în cod sau git history**

### Rules:
- [ ] Toate secrets în `.env.local`
- [ ] `.env.example` cu template (NO values)
- [ ] `git-secrets` scan în pre-commit
- [ ] Niciun hardcoded API key

### ✅ CORECT:
```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE=eyJxxx...

// .env.example
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE=your-service-role-key

// code
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
```

### ❌ GREȘIT:
```typescript
// ❌ NICIODATĂ hardcoded
const SUPABASE_KEY = 'eyJxxx...';  // ❌ LEAK!
```

### Check:
```bash
npm run check:secrets  # Pre-commit hook
```

---

## 1️⃣3️⃣ Security - RLS Tests

### Principiu:
**Row Level Security trebuie testat pentru fiecare tabel cu date sensibile**

### Test Pattern:
```typescript
// entities/booking/api/rls.test.ts
import { describe, it, expect } from 'vitest';
import { supabaseAs } from '@/lib/test/supabaseClient';

describe('Booking RLS', () => {
  it('blocks cross-tenant access', async () => {
    const client = supabaseAs('operator-org-a');
    
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .eq('organization_id', 'org-b');  // Try access org-b
    
    expect(error).toBeTruthy();  // ✅ Should be blocked
    expect(data).toBeNull();
  });
  
  it('allows own organization access', async () => {
    const client = supabaseAs('operator-org-a');
    
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .eq('organization_id', 'org-a');  // Own org
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

### Checklist:
- [ ] RLS tests pentru `bookings`
- [ ] RLS tests pentru `booking_pricing`
- [ ] RLS tests pentru `payments`
- [ ] RLS tests pentru `customers`

---

## 1️⃣4️⃣ Security - CSP Headers

### Principiu:
**Content Security Policy previne XSS și code injection**

### Implementation (middleware.ts):
```typescript
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // CSP Header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co"
  );
  
  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=()');
  
  return response;
}
```

### Checklist:
- [ ] CSP header complet
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin

---

## 1️⃣5️⃣ Dependency Policy

### Principiu:
**Dependencies auditate, versiuni pinned, updates controlate**

### Rules:
```json
// package.json
{
  "scripts": {
    "check:deps": "pnpm audit && pnpm outdated",
    "update:deps": "pnpm update --interactive"
  }
}
```

### Audit:
```bash
npm run check:deps  # Weekly check
```

### Checklist:
- [ ] Audit automat în pre-commit
- [ ] Versiuni pinned (nu `^` sau `~`)
- [ ] Update prin PR săptămânal
- [ ] NO abandoned packages (check last update)

---

## 1️⃣6️⃣ Performance Budget

### Principiu:
**Bundle size monitorizat, limite enforced**

### Limits:
```javascript
// scripts/check-bundle.js
const MAX_BUNDLE_KB = 300;  // 300KB pentru admin dashboard

// Check .next/build-manifest.json
if (totalSize > MAX_BUNDLE_KB * 1024) {
  console.error(`Bundle ${totalKB}KB > ${MAX_BUNDLE_KB}KB`);
  process.exit(1);
}
```

### Checklist:
```bash
npm run check:bundle  # Pre-commit
```
- [ ] Bundle < 300KB
- [ ] Page < 150KB
- [ ] TTFB < 500ms

---

## 1️⃣7️⃣ Timezone Policy

### Principiu:
**UTC în backend, conversie în UI**

### Rules:
```typescript
// ✅ Backend: UTC DOAR
const booking = {
  start_at: new Date().toISOString(),  // 2024-10-21T20:00:00Z
};

// ✅ UI: Convert to user timezone
import { formatDateUTC } from '@/lib/utils/date';

const display = formatDateUTC(booking.start_at, 'Europe/London');
// "21 Oct 2024, 21:00" (BST)
```

### Utils:
```typescript
// lib/utils/date.ts
export function formatDateUTC(isoString: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString));
}
```

### Checklist:
- [ ] DB timestamps în UTC
- [ ] API returns UTC ISO strings
- [ ] UI converts cu `formatDateUTC()`
- [ ] NO `new Date()` fără timezone

---

## 1️⃣8️⃣ Logging Policy

### Principiu:
**Logger unificat, NO console în production**

### Implementation:
```typescript
// lib/utils/logger.ts
export const logger = {
  error: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, meta);
    }
    // TODO: Send to monitoring service (Sentry)
  },
  
  warn: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, meta);
    }
  },
  
  info: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, meta);
    }
  },
};
```

### Usage:
```typescript
import { logger } from '@/lib/utils/logger';

try {
  await processPayment(id);
  logger.info('Payment processed', { id });
} catch (error) {
  logger.error('Payment failed', { id, error });
  throw error;
}
```

### ESLint:
```javascript
// .eslintrc.cjs
rules: {
  'no-console': 'error',  // Blochează console.log()
}
```

---

## 1️⃣9️⃣ Git Workflow

### Branch Naming:
```
feat/payments-table
fix/booking-validation
refactor/entities-structure
docs/api-readme
```

### Commit Message (Conventional Commits):
```
type(scope): subject

Examples:
✅ feat(payments): add PaymentsTable component with API integration
✅ fix(booking): resolve price calculation for fleet bookings
✅ refactor(entities): extract payment validation to lib
✅ docs(readme): update setup instructions
❌ fixed bug
❌ changes
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Tests
- `chore`: Maintenance

### PR Title:
Same as commit message (squash merge)

---

## 2️⃣0️⃣ Documentation Rules

### JSDoc:
```typescript
/**
 * Calculates total price including services
 * @param basePrice - Base transport price
 * @param services - Array of service prices
 * @returns Total price
 */
export function calculateTotal(basePrice: number, services: number[]): number {
  return basePrice + services.reduce((sum, price) => sum + price, 0);
}
```

### README per Feature:
```markdown
# Payments Table

## Usage
import { PaymentsTable } from '@features/payments-table';

<PaymentsTable onSelect={handleSelect} />

## Props
- `onSelect`: (id: string) => void - Called when row clicked
- `filters`: PaymentFilters - Optional filters

## API
Uses `listPayments()` from `@entities/payment`
```

### Inline Comments:
```typescript
// ✅ WHY, nu WHAT
// Using polling instead of websockets due to Supabase realtime limitations
const data = await pollPayments();

// ❌ WHAT (obvious)
// Increment counter
counter++;
```

---

## 2️⃣1️⃣ ENV Policy

### Files:
```
.env.local        # Git ignored, secrets HERE
.env.example      # Git tracked, template ONLY
```

### .env.example:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role

# Node
NODE_OPTIONS=--max_old_space_size=2048
```

### Check Script:
```bash
npm run check:env  # Verify all ENV vars present
```

### Checklist:
- [ ] `.env.example` complet
- [ ] `.env.local` în `.gitignore`
- [ ] NO secrets în `.env.example`
- [ ] Check automat în CI

---

## 2️⃣2️⃣ Conventional Commits (Enforced)

### Setup (commitlint):
```javascript
// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf'
    ]],
    'scope-empty': [2, 'never'],  // Scope obligatoriu
    'subject-min-length': [2, 'always', 10],
  },
};
```

### Husky Hook:
```bash
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

### Checklist:
- [ ] Type valid (feat, fix, etc.)
- [ ] Scope present
- [ ] Subject > 10 chars
- [ ] Format: `type(scope): subject`

---

## 2️⃣3️⃣ Pre-commit Checklist

### Hook (.husky/pre-commit):
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run precommit
```

### Script (package.json):
```json
{
  "scripts": {
    "precommit": "npm run test:run && npm run check:ts && npm run lint && npm run check:env && npm run check:secrets && npm run guard:app-logic"
  }
}
```

### Checklist Manual:
- [ ] ✅ `npm run test:run` - Toate testele verzi
- [ ] ✅ `npm run check:ts` - 0 TypeScript errors
- [ ] ✅ `npm run lint` - 0 ESLint errors
- [ ] ✅ `npm run check:env` - All ENV vars present
- [ ] ✅ `npm run check:secrets` - No secrets leaked
- [ ] ✅ `npm run guard:app-logic` - No logic in app/
- [ ] ✅ `npm run build` - Build successful

---

## ✅ QUICK REFERENCE

### Before Writing Code:
1. ✅ Folosesc CSS tokens? (`var(--*)`)
2. ✅ Tipuri TypeScript complete?
3. ✅ Fișier < 200 lines?
4. ✅ În folderul corect? (features/entities)
5. ✅ Importuri corecte? (@features/@entities)

### Before Commit:
```bash
npm run precommit  # TREBUIE SĂ TREACĂ!
```

### Import Structure:
```typescript
✅ import { Type } from '@entities/payment'
✅ import { Component } from '@features/payments-table'
✅ import { Button } from '@vantage-lane/ui-core'
❌ import from '../features/...'
❌ import from '@/components/...'
```

---

## 📊 ENFORCEMENT

### Automatic Checks:
- **Pre-commit:** Husky hooks
- **CI:** GitHub Actions
- **Lint:** ESLint rules
- **Types:** TypeScript strict mode
- **Tests:** Vitest coverage thresholds
- **Bundle:** Size limit checks
- **Security:** git-secrets, RLS tests, CSP

### Manual Review:
- Architecture adherence
- Code clarity
- Performance optimizations
- Security best practices

---

**END OF RULES.md**  
**Version 2.0 Enterprise**  
**SINGURA SURSĂ DE ADEVĂR pentru coding standards**
