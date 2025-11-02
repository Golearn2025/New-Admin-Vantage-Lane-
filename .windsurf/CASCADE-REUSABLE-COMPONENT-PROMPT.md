# 🎯 CASCADE AI - PROMPT REUTILIZABIL PENTRU COMPONENTE

> **Folosește acest prompt când:**
> - Creezi un component nou reutilizabil
> - Refactorizezi un component existent
> - Extragi logică comună în features/entities
> - Optimizezi performanță

---

## 📋 CHECKLIST PRE-IMPLEMENTARE

### STEP 0: CITEȘTE REGULILE (OBLIGATORIU!)
```bash
# ⚠️ ÎNAINTE DE ORICE COD, citește:
1. /RULES.md (1020 linii) - Toate regulile de coding
2. /WORKFLOW.md (570 linii) - Workflow complet
3. /AUDIT-PERFORMANCE-PLAN.md - Best practices performanță
```

### STEP 1: SCANEAZĂ REPOSITORY-UL
```bash
# ❌ NU crea duplicate! Verifică dacă există deja:

# 1. Verifică features similare
find apps/admin/features -name "*<feature-name>*" -type d

# 2. Verifică entities similare  
find apps/admin/entities -name "*<entity-name>*" -type d

# 3. Verifică componente în ui-core
find packages/ui-core/src -name "*<Component>*"

# 4. Verifică naming pattern existent
ls apps/admin/features/
ls apps/admin/entities/

# 5. Verifică imports pattern
grep -r "@features/" apps/admin/app/
grep -r "@entities/" apps/admin/features/
```

**ÎNTREBARE CRITICĂ:** Există deja ceva similar? Dacă DA → Reutilizează, NU duplica!

---

## 🏗️ ARHITECTURA PROIECTULUI

### Structură Obligatorie:
```
apps/admin/
├── app/(admin)/              # ❌ ZERO LOGICĂ - doar routing
│   └── [page]/
│       └── page.tsx          # import + render DOAR
│
├── features/                 # ✅ UI Components, Hooks, Columns
│   └── [feature-name]/       # kebab-case: payments-table
│       ├── components/       # PascalCase: PaymentsTable.tsx
│       │   ├── Component.tsx
│       │   ├── Component.module.css
│       │   └── Component.test.tsx
│       ├── hooks/            # camelCase: usePaymentsList.ts
│       │   ├── useHook.ts
│       │   └── useHook.test.ts
│       ├── columns/          # Pentru tables
│       │   ├── cells.tsx
│       │   └── helpers.ts
│       ├── types/            # Type definitions
│       │   └── feature.types.ts
│       └── index.ts          # Barrel export
│
└── entities/                 # ✅ Business Logic, API, Schemas
    └── [entity-name]/        # singular: payment
        ├── model/
        │   └── schema.ts     # Zod schemas
        ├── api/
        │   ├── api.ts
        │   └── api.test.ts
        ├── lib/              # Pure functions
        │   ├── validate.ts
        │   └── validate.test.ts
        └── index.ts          # Named exports
```

### Import Rules (CRITIC!):
```typescript
// ✅ PERMIS
app/      → @features/*       (DOAR features, NU entities!)
features/ → @entities/*       (DA, features pot folosi entities)
features/ → @vantage-lane/*   (DA, UI library)
entities/ → intern            (DA, între entities)

// ❌ INTERZIS (ESLint va bloca)
entities/ → @features/*       ❌ Circular dependency!
app/      → @entities/*       ❌ Skip features layer!
any/      → ../relative       ❌ Use alias!
```

---

## 🎨 DESIGN TOKENS - 100% OBLIGATORIU

### ❌ NU HARDCODA NICIODATĂ:
```css
/* ❌ GREȘIT - ZERO hardcodări */
.container {
  padding: 16px;                    /* ❌ */
  margin: 20px 0;                   /* ❌ */
  background: #ffffff;              /* ❌ */
  color: #333333;                   /* ❌ */
  border-radius: 8px;               /* ❌ */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* ❌ */
  font-size: 14px;                  /* ❌ */
  font-weight: 600;                 /* ❌ */
  transition: all 0.3s;             /* ❌ */
}
```

### ✅ FOLOSEȘTE TOKENS:
```css
/* ✅ CORECT - 100% design tokens */
.container {
  padding: var(--spacing-4);
  margin: var(--spacing-5) 0;
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-base);
}
```

### Tokens Disponibile:
```
packages/ui-core/src/tokens/
├── colors.css      → --color-*
├── spacing.css     → --spacing-*
├── typography.css  → --font-*
├── borders.css     → --border-*
├── shadows.css     → --shadow-*
└── animations.css  → --transition-*
```

**VERIFICARE:** Scanează fișierul CSS și asigură-te că NU există niciun `px`, `#hex`, `rgb()`, `em`, `rem` hardcodat!

---

## 📏 RESPONSIVE DESIGN - NO HARDCODED VALUES

### ❌ NU Hardcoda Breakpoints:
```css
/* ❌ GREȘIT */
@media (max-width: 768px) {
  .container { padding: 12px; }
}

/* ❌ GREȘIT */
.button {
  width: 120px;
  height: 40px;
}
```

### ✅ Folosește Tokens & Fluid Design:
```css
/* ✅ CORECT - Token breakpoints */
@media (max-width: var(--breakpoint-md)) {
  .container { 
    padding: var(--spacing-3);
  }
}

/* ✅ CORECT - Fluid sizing */
.button {
  min-width: var(--button-min-width);
  padding: var(--spacing-2) var(--spacing-4);
}

/* ✅ CORECT - Container queries (modern) */
@container (min-width: 400px) {
  .card { 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
```

### Grid & Flexbox (Adaptive):
```css
/* ✅ Responsive grid fără breakpoints */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

/* ✅ Responsive flex */
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.flex-item {
  flex: 1 1 calc(33.333% - var(--spacing-3));
  min-width: 200px; /* sau var(--min-width-card) */
}
```

---

## 📦 FILE SIZE LIMITS - OBLIGATORIU

### Limite Stricte (ESLint enforced):
```typescript
max-lines: 200              // ❌ Fișier mai mare? Split!
max-lines-per-function: 50  // ❌ Funcție mai mare? Extract!
complexity: 10              // ❌ Complexity mai mare? Refactor!
```

### Exemplu Split:
```typescript
// ❌ GREȘIT - PaymentsPage.tsx (450 lines)
export default function PaymentsPage() {
  // 450 lines de cod aici... ❌
}

// ✅ CORECT - Modulat:
// features/payments-table/
// ├── components/
// │   ├── PaymentsTable.tsx      (180 lines) ✅
// │   ├── PaymentRow.tsx         (95 lines)  ✅
// │   ├── PaymentFilters.tsx     (120 lines) ✅
// │   └── PaymentActions.tsx     (85 lines)  ✅
// ├── hooks/
// │   ├── usePaymentsList.ts     (85 lines)  ✅
// │   └── usePaymentFilters.ts   (70 lines)  ✅
// └── columns/
//     ├── cells.tsx              (150 lines) ✅
//     └── helpers.ts             (60 lines)  ✅
```

---

## 🧩 ORCHESTRATOR PATTERN

### Principiu:
**Features orchestrează entities, entities NU știu de features**

### ✅ CORECT:
```typescript
// entities/payment/api/paymentApi.ts
// ✅ Pure business logic
export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*');
  
  if (error) throw error;
  return data.map(PaymentSchema.parse);
}

// features/payments-table/hooks/usePaymentsList.ts
// ✅ Features orchestrează
import { listPayments } from '@entities/payment/api';
import { useState, useEffect } from 'react';

export function usePaymentsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    listPayments()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading };
}

// features/payments-table/components/PaymentsTable.tsx
// ✅ Component folosește hook
import { usePaymentsList } from '../hooks/usePaymentsList';

export default function PaymentsTable() {
  const { data, loading } = usePaymentsList();
  
  if (loading) return <LoadingSpinner />;
  return <Table data={data} />;
}
```

### ❌ GREȘIT - Entity depinde de Feature:
```typescript
// ❌ entities/payment/api/paymentApi.ts
import { PaymentRow } from '@features/payments-table'; // ❌ INTERZIS!

// ❌ Circular dependency!
```

---

## ⚡ PERFORMANCE BEST PRACTICES

### 1. React.memo - Doar pentru liste mari
```typescript
// ✅ DA - Listă cu >50 items
const PaymentRow = React.memo<PaymentRowProps>(({ payment, onClick }) => {
  return <tr onClick={() => onClick(payment.id)}>...</tr>;
});

// ❌ NU - Component simplu
const Button = React.memo(() => <button>Click</button>); // ❌ overkill
```

### 2. useCallback - Doar pentru React.memo children
```typescript
// ✅ DA - Passed to memoized child
const MemoizedTable = React.memo(Table);

function Parent() {
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);
  
  return <MemoizedTable onRowClick={handleClick} />;
}

// ❌ NU - Simple handler
function Parent() {
  const handleClick = useCallback(() => {
    console.log('hi');
  }, []); // ❌ overkill
  
  return <button onClick={handleClick}>Click</button>;
}
```

### 3. useMemo - Doar pentru calcule expensive
```typescript
// ✅ DA - Sorting/filtering liste mari
const sortedPayments = useMemo(() => {
  return payments
    .filter(p => p.status === 'active')
    .sort((a, b) => b.amount - a.amount);
}, [payments]);

// ❌ NU - Calcule simple
const total = useMemo(() => a + b, [a, b]); // ❌ overkill
```

### 4. Red Flags - EVITĂ:
```typescript
// ❌ Inline objects în props
<Component config={{ x: 1 }} />  // Re-creates la fiecare render

// ❌ Inline arrays în props
<Component items={[1, 2, 3]} />  // Re-creates la fiecare render

// ❌ Inline functions în loops
{items.map(item => (
  <Row onClick={() => handle(item.id)} />  // ❌ Creates new function fiecare!
))}

// ✅ Extract outside
const config = { x: 1 };  // ✅ Created once
<Component config={config} />

const handleClick = useCallback((id: string) => handle(id), []);
{items.map(item => (
  <Row onClick={handleClick} itemId={item.id} />  // ✅
))}
```

---

## 🧪 TESTING - OBLIGATORIU

### Coverage Minimă:
```yaml
entities/*: 80%  # Business logic critical
features/*: 60%  # UI components
```

### Test Structure:
```typescript
// calculateTotal.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should calculate base + services', () => {
    expect(calculateTotal(100, [50, 30])).toBe(180);
  });
  
  it('should handle empty services', () => {
    expect(calculateTotal(100, [])).toBe(100);
  });
  
  it('should throw on negative values', () => {
    expect(() => calculateTotal(-100, [50])).toThrow();
  });
});
```

### Component Testing:
```typescript
// PaymentsTable.test.tsx
import { render, screen } from '@testing-library/react';
import PaymentsTable from './PaymentsTable';

describe('PaymentsTable', () => {
  it('renders loading state', () => {
    render(<PaymentsTable />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('renders table with data', async () => {
    render(<PaymentsTable />);
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
```

---

## 🔒 ERROR HANDLING

### Pattern Consistent:
```typescript
// ✅ Entity API - Throw errors
export async function getPayment(id: string): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;  // ✅ throw
  if (!data) throw new Error('Payment not found');
  
  return PaymentSchema.parse(data);  // ✅ validate
}

// ✅ Feature Hook - Handle errors
export function usePayment(id: string) {
  const [data, setData] = useState<Payment | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    getPayment(id)
      .then(setData)
      .catch(setError);  // ✅ catch
  }, [id]);
  
  return { data, error };
}

// ✅ Component - Display errors
export default function PaymentDetails({ id }: Props) {
  const { data, error } = usePayment(id);
  
  if (error) return <ErrorState message={error.message} />;  // ✅
  if (!data) return <LoadingSpinner />;
  
  return <div>{data.amount}</div>;
}
```

---

## ✅ SELF-CHECK ÎNAINTE DE COMMIT

### Run ALL checks:
```bash
# 1. Tests
npm run test:run
# ✅ Expected: All tests passing
# ✅ Expected: Coverage > thresholds

# 2. TypeScript
npm run check:ts
# ✅ Expected: 0 errors

# 3. ESLint
npm run lint
# ✅ Expected: 0 errors, 0 warnings

# 4. Build
npm run build
# ✅ Expected: Build successful

# 5. Architecture Guard
npm run guard:app-logic
# ✅ Expected: No logic în app/

# 6. ENV Check
npm run check:env
# ✅ Expected: All vars present

# 7. Secrets Scan
npm run check:secrets
# ✅ Expected: No secrets leaked
```

### Checklist Manual:
- [ ] 100% design tokens (zero hardcodări)
- [ ] TypeScript strict (zero `any`)
- [ ] Files < 200 lines
- [ ] Functions < 50 lines
- [ ] Complexity < 10
- [ ] Imports corecte (@features/@entities)
- [ ] Tests create (coverage OK)
- [ ] Responsive (no hardcoded breakpoints)
- [ ] Performance (memo/callback doar când necesar)
- [ ] Error handling consistent
- [ ] Documentation (JSDoc pentru funcții publice)

---

## 📝 DELIVERABLE TEMPLATE

```markdown
## FEATURE/COMPONENT: [Name]

### STRUCTURE CHECK:
✅ Feature în apps/admin/features/[name]/
✅ No duplicate folders
✅ Architecture respectată (app → features → entities)
✅ Naming convention: kebab-case folder, PascalCase components

### FILE PLAN:
1. `Component.tsx` (178 lines) - Main component
2. `Component.module.css` (45 lines) - Styles (100% tokens)
3. `Component.test.tsx` (85 lines) - Tests
4. `useHook.ts` (70 lines) - Data fetching
5. `index.ts` (10 lines) - Barrel export

### IMPORTS VERIFICATION:
✅ No forbidden imports (entities → features)
✅ Using @features/* aliases
✅ Using @entities/* aliases
✅ No relative imports (../)

### DESIGN TOKENS CHECK:
✅ 0 hardcoded colors (#hex, rgb)
✅ 0 hardcoded spacing (px, rem)
✅ 0 hardcoded shadows
✅ 0 hardcoded transitions
✅ All values from var(--*)

### RESPONSIVE CHECK:
✅ No hardcoded breakpoints (768px, etc)
✅ Using fluid design (auto-fit, minmax)
✅ Touch targets > 44px
✅ Mobile-first approach

### PERFORMANCE CHECK:
✅ React.memo doar pentru liste mari
✅ useCallback doar pentru memoized children
✅ useMemo doar pentru calcule expensive
✅ No inline objects/arrays în props
✅ No inline functions în loops

### SELF-CHECK LOG:
✅ test:run: 56/56 passing (coverage 82%)
✅ check:ts: 0 errors
✅ lint: 0 errors, 0 warnings
✅ build: SUCCESS (bundle +8KB)
✅ guard:app-logic: PASS
✅ check:env: PASS
✅ check:secrets: PASS

### COMMIT MESSAGE:
```
feat(payments): add PaymentsTable component with API integration

- Add PaymentsTable component (100% design tokens)
- Add usePaymentsList hook with error handling
- Add payment cell components with formatters
- Add tests (82% coverage)
- Responsive design with fluid layout
- Performance optimized (React.memo for rows)

Tests: 56/56 passing
Build: SUCCESS
Bundle: +8KB
```

### NEXT STEPS:
1. ⏳ Așteaptă USER aprobare pentru commit
2. ⏳ După aprobare → git commit + push
3. ⏳ Create PR cu description
4. ⏳ Request review

### GAPS & RISKS:
- [Dacă există, listează aici]
```

---

## 🚫 RED FLAGS - OPREȘTE ȘI ÎNTREABĂ

### Când să ceri clarificare:
```
❌ Feature ar încălca forbidden imports
❌ Fișier ar depăși 200 lines (split needed)
❌ Circular dependency detectat
❌ Duplicate code detectat
❌ Logică în app/ directory
❌ Hardcodări CSS detectate
❌ Breaking change pentru alte features
❌ Performance impact major (>50KB bundle)
```

### Cum să întrebi:
```
⚠️ STOP: [Descriere problemă]

OPȚIUNI:
A) [Soluție 1 - descrie]
B) [Soluție 2 - descrie]
C) Altă abordare?

Ce preferi?
```

---

## 🎯 GOLDEN RULES

### Înainte de a scrie COD:
1. ✅ Ai citit RULES.md + WORKFLOW.md?
2. ✅ Ai scanat repo-ul (no duplicates)?
3. ✅ Ai plan clar (file structure)?
4. ✅ Știi unde se plasează (app/features/entities)?
5. ✅ Ai verificat design tokens disponibili?

### În timpul scrierii:
1. ✅ 100% design tokens (var(--*))
2. ✅ TypeScript strict (explicit types)
3. ✅ < 200 lines per file
4. ✅ < 50 lines per function
5. ✅ Responsive (no hardcoded px)
6. ✅ Performance (memo doar când necesar)

### După ce ai scris:
1. ✅ Run ALL self-checks (test, lint, build, etc)
2. ✅ Fix ALL errors înainte de commit
3. ✅ Documentează deliverable
4. ✅ **ÎNTREABĂ USER pentru aprobare commit!**
5. ✅ NU commit fără aprobare explicită!

---

## 📌 QUICK REFERENCE

### Import Structure:
```typescript
// ✅ CORRECT
import { Type } from '@entities/payment';
import { Component } from '@features/payments-table';
import { Button } from '@vantage-lane/ui-core';
import { logger } from '@/lib/utils/logger';

// ❌ WRONG
import from '../features/...';  // ❌ relative
import from '@/components/...'; // ❌ wrong alias
import { Feature } from '@entities/...'; // ❌ entities → features
```

### File Limits:
```
Files: < 200 lines
Functions: < 50 lines
Complexity: < 10
Imports: < 15
Props: < 10
```

### Performance:
```
React.memo: Only for lists >50 items
useCallback: Only for memoized children
useMemo: Only for expensive calculations
```

### Testing:
```
Entities: > 80% coverage
Features: > 60% coverage
Tests: filename.test.ts
```

---

**🚀 ACEST PROMPT GARANTEAZĂ:**
- ✅ Cod scalabil și modular
- ✅ Zero duplicate
- ✅ Zero hardcodări
- ✅ Zero forbidden imports
- ✅ Zero logic în app/
- ✅ Performance optimizat
- ✅ Responsive design
- ✅ Tests + coverage
- ✅ Documentație completă
- ✅ Ready for production

**📋 FOLOSEȘTE-L LA FIECARE:**
- Component nou
- Refactorizare
- Feature nou
- Entity nou
- Optimizare performanță

---

**Version:** 1.0  
**Last Updated:** 2025-11-02  
**Compatibility:** RULES.md v2.0, WORKFLOW.md v2.0
