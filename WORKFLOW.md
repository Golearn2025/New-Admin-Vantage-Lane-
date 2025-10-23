# 🔄 VANTAGE LANE ADMIN - DEVELOPMENT WORKFLOW

> **SINGURA SURSĂ DE ADEVĂR pentru workflow de development**  
> **Version:** 2.0  
> **Last Updated:** 2025-10-21

---

## 🎯 OBIECTIV

Acest workflow garantează:
- ✅ Cod scalabil, modular, 100% tokens
- ✅ Zero importuri interzise
- ✅ Zero logică în app/
- ✅ Toate verificările trecute înainte de commit

---

## 📋 WORKFLOW COMPLET

### **STEP 0: Pre-flight Check**

```bash
# Verifică că ai toate tools necesare
node --version  # v18+
pnpm --version  # v9+
git --version

# Verifică branch
git status
git pull origin main

# Instalează dependencies
pnpm install

# Run pre-commit hooks local
npm run precommit  # Trebuie să treacă!
```

---

### **STEP 1: Repository Scan**

**Obiectiv:** Înțelege structura existentă, nu crea duplicate

#### Actions:
```bash
# 1. Verifică structura existentă
ls -la apps/admin/
ls -la apps/admin/features/
ls -la apps/admin/entities/

# 2. Verifică dacă feature-ul există deja
find apps/admin/features -name "*payment*" -type d
find apps/admin/entities -name "*payment*" -type d

# 3. Verifică imports existente
grep -r "@features/payments" apps/admin/
grep -r "@entities/payment" apps/admin/
```

#### Questions:
- [ ] Există deja feature similar?
- [ ] Există entity similar?
- [ ] Ce pattern urmează alte features?
- [ ] Ce naming convention se folosește?

#### Output:
**Documentează găsirile:**
```
STRUCTURE CHECK:
✅ Feature payments-table exists: apps/admin/features/payments-table/
✅ Entity payment exists: apps/admin/entities/payment/
✅ Pattern: kebab-case pentru features
✅ Import alias: @features/*, @entities/*
```

---

### **STEP 2: Planning**

**Obiectiv:** Plan clar înainte de a scrie cod

#### Template:
```markdown
## FEATURE: Payments Table

### Fișiere Noi:
1. `apps/admin/features/payments-table/components/PaymentsTable.tsx` (180 lines)
   - Role: Main table component
   - Imports: @entities/payment, @vantage-lane/ui-core

2. `apps/admin/features/payments-table/hooks/usePaymentsList.ts` (85 lines)
   - Role: Data fetching hook
   - Imports: @entities/payment/api

3. `apps/admin/features/payments-table/columns/cells.tsx` (150 lines)
   - Role: Table cell components
   - Imports: @vantage-lane/ui-core

### Tipuri Necesare:
- `Payment` - din @entities/payment
- `PaymentStatus` - din @entities/payment
- `PaymentFilters` - nou în feature

### Contracte API:
- `listPayments()` - fetch all payments
- `getPayment(id)` - fetch single payment

### Estimare:
- LOC: ~415 lines total
- Time: ~3-4 ore
- Tests: 6 test files
```

#### Checklist:
- [ ] Lista completă de fișiere noi
- [ ] Estimare linii pentru fiecare fișier
- [ ] Identificat toate tipurile necesare
- [ ] Identificat toate API calls
- [ ] Plan de teste

---

### **STEP 3: Implementation**

**Obiectiv:** Implementare respectând TOATE regulile

#### 3.1. Creează Structura:
```bash
# Feature structure
mkdir -p apps/admin/features/payments-table/{components,hooks,columns,types}
touch apps/admin/features/payments-table/index.ts
```

#### 3.2. Implementează Components:
```typescript
// ✅ RESPECTĂ:
// 1. Design Tokens DOAR (var(--*))
// 2. TypeScript strict (explicit types)
// 3. < 200 lines per file
// 4. Imports corecte (@features, @entities)
// 5. Export patterns (default pentru component)

// PaymentsTable.tsx
import { Payment } from '@entities/payment';  // ✅
import { Button } from '@vantage-lane/ui-core';  // ✅
import styles from './PaymentsTable.module.css';  // ✅

interface Props {
  onSelect: (id: string) => void;
}

export default function PaymentsTable({ onSelect }: Props) {
  // ...
}
```

#### 3.3. CSS Modules (100% Tokens):
```css
/* PaymentsTable.module.css */
.container {
  padding: var(--spacing-4);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
}

.header {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}
```

#### 3.4. Hooks:
```typescript
// usePaymentsList.ts
import { useState, useEffect } from 'react';
import { listPayments } from '@entities/payment/api';
import type { Payment } from '@entities/payment';

export function usePaymentsList() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // ...
  
  return { data, loading, error };
}
```

#### 3.5. Tests:
```typescript
// PaymentsTable.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentsTable from './PaymentsTable';

describe('PaymentsTable', () => {
  it('renders without errors', () => {
    render(<PaymentsTable onSelect={() => {}} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
```

#### 3.6. Barrel Export:
```typescript
// index.ts
export { default as PaymentsTable } from './components/PaymentsTable';
export * from './types';
```

#### 3.7. Page Integration:
```typescript
// app/(admin)/payments/page.tsx
import { PaymentsTable } from '@features/payments-table';

export default function PaymentsPage() {
  return <PaymentsTable onSelect={(id) => console.log(id)} />;
}
```

---

### **STEP 4: Self-Check**

**Obiectiv:** Verifică TOATE regulile înainte de commit

#### 4.1. Tests:
```bash
npm run test:run
# ✅ Expected: All tests pass
# ✅ Expected: Coverage > thresholds
```

#### 4.2. TypeScript:
```bash
npm run check:ts
# ✅ Expected: 0 errors
```

#### 4.3. ESLint:
```bash
npm run lint
# ✅ Expected: 0 errors
# ✅ Expected: No max-lines violations
# ✅ Expected: No complexity violations
```

#### 4.4. Build:
```bash
npm run build
# ✅ Expected: Build successful
# ✅ Expected: No warnings
```

#### 4.5. ENV Check:
```bash
npm run check:env
# ✅ Expected: All ENV vars present
```

#### 4.6. Secrets Scan:
```bash
npm run check:secrets
# ✅ Expected: No secrets found
```

#### 4.7. Architecture Guard:
```bash
npm run guard:app-logic
# ✅ Expected: No logic in app/
```

#### 4.8. Bundle Check:
```bash
npm run check:bundle
# ✅ Expected: Bundle < 300KB
```

#### Self-Check Log Template:
```
SELF-CHECK LOG:
✅ test:run      - 56/56 passing
✅ check:ts      - 0 errors
✅ lint          - 0 errors
✅ build         - SUCCESS (87.6 kB shared JS)
✅ check:env     - All vars present
✅ check:secrets - No secrets found
✅ guard:app-logic - PASS
✅ check:bundle  - 156KB < 300KB ✅

STATUS: READY FOR COMMIT ✅
```

---

### **STEP 5: Commit & Push**

#### 5.1. Stage Changes:
```bash
git add -A
git status  # Verify staged files
```

#### 5.2. Commit (Conventional Commits):
```bash
git commit -m "feat(payments): add PaymentsTable component with API integration

- Add PaymentsTable component with filtering
- Add usePaymentsList hook for data fetching
- Add payment cell components
- Add 6 test files with 80% coverage
- 100% design tokens, zero hardcoded values

Tests: 56/56 passing
Build: SUCCESS"
```

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, refactor, docs, test, chore, perf

#### 5.3. Push:
```bash
git push origin feature/payments-table
```

#### 5.4. Create PR:
- Title: Same as commit message
- Description: Link to issue, screenshots, checklist
- Reviewers: Assign team
- Labels: Add appropriate labels

---

### **STEP 6: Code Review Response**

#### If Changes Requested:
```bash
# Make changes
git add -A
git commit -m "fix(payments): address PR feedback

- Rename variable for clarity
- Add missing test case
- Update documentation"

git push origin feature/payments-table
```

#### After Approval:
```bash
# Squash merge to main
# Delete feature branch
git checkout main
git pull origin main
git branch -d feature/payments-table
```

---

## 🚨 STOP CONDITIONS

### Când să te oprești și să ceri clarificare:

#### 1. Regulă Hard Încălcată:
```
❌ Feature ar încălca forbidden imports
❌ Fișier ar depăși 200 lines
❌ Logică ar fi în app/
```

**Action:** Oprește-te, pune o singură întrebare clară:
```
⚠️ STOP: Feature-ul propus ar necesita import din entities → features, 
ceea ce încalcă regula de forbidden imports.

ÎNTREBARE: Cum vrei să procedăm?
A) Refactorizez arhitectura să evit circular dependency
B) Îți explic alternativa și o implementez
C) Altă soluție
```

#### 2. Structură Ambiguă:
```
❓ Nu e clar dacă payment e entity sau feature
❓ Există 2 foldere similare (payments vs payment)
```

**Action:** Clarificare înainte de a scrie cod

#### 3. Breaking Change:
```
⚠️ Schimbarea ar rupe alte feature-uri
⚠️ API change ar afecta alte consumatori
```

**Action:** Documentează impact, cere aprobare

---

## 📦 DELIVERABLES FORMAT

### La Final de Task:

```markdown
## DELIVERABLE: Payments Table Implementation

### STRUCTURE CHECK:
✅ Feature payments-table created în apps/admin/features/
✅ No duplicate folders found
✅ Architecture respectată (app → features → entities)

### FILE PLAN:
1. PaymentsTable.tsx (178 lines) - Main component
2. usePaymentsList.ts (82 lines) - Data hook
3. cells.tsx (145 lines) - Cell components
4. PaymentsTable.module.css (67 lines) - Styles
5. PaymentsTable.test.tsx (93 lines) - Tests
6. index.ts (12 lines) - Barrel export

### PATCHES:
[Diff pentru fiecare fișier...]

### SELF-CHECK LOG:
✅ test:run: 56/56 passing
✅ check:ts: 0 errors
✅ lint: 0 errors
✅ build: SUCCESS
✅ check:env: PASS
✅ check:secrets: PASS
✅ guard:app-logic: PASS
✅ check:bundle: 156KB < 300KB

### COMMIT MESSAGE:
feat(payments): add PaymentsTable component with API integration

### GAPS & RISKS:
1. Coverage la 75% (target 80%) - TODO: add edge case tests
2. Bundle size crescut cu 15KB - monitorizare necesară
3. RLS tests nu există încă - prioritate HIGH
```

---

## 🔄 ITERATIVE WORKFLOW

### Daily Workflow:
```bash
# Morning
git checkout main
git pull origin main
git checkout -b feat/new-feature

# Work
# ... implement following STEPS 1-4 ...

# Before Lunch
npm run precommit  # Quick check

# Before EOD
npm run precommit  # Full check
git commit -m "type(scope): subject"
git push origin feat/new-feature
```

### Weekly Workflow:
```bash
# Dependency check
npm run check:deps
npm run update:deps  # If needed

# Bundle analysis
npm run check:bundle

# RLS tests
npm run test:rls  # If implemented
```

---

## 🎯 SUCCESS CRITERIA

### Definition of Done:
- [ ] ✅ Toate testele verzi (npm run test:run)
- [ ] ✅ TypeScript clean (npm run check:ts)
- [ ] ✅ ESLint clean (npm run lint)
- [ ] ✅ Build successful (npm run build)
- [ ] ✅ ENV vars valid (npm run check:env)
- [ ] ✅ No secrets leaked (npm run check:secrets)
- [ ] ✅ Architecture guard pass (npm run guard:app-logic)
- [ ] ✅ Bundle under budget (npm run check:bundle)
- [ ] ✅ Code reviewed & approved
- [ ] ✅ Documentation updated
- [ ] ✅ Conventional commit format
- [ ] ✅ PR merged to main

---

## 📚 RESOURCES

### Commands Reference:
```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Quality Checks
npm run test:run         # Run tests
npm run test:coverage    # Run tests with coverage
npm run check:ts         # TypeScript check
npm run lint             # ESLint check
npm run format           # Format code
npm run check:env        # ENV vars check
npm run check:secrets    # Secrets scan
npm run check:deps       # Dependencies audit
npm run check:bundle     # Bundle size check
npm run guard:app-logic  # Architecture guard

# Pre-commit (runs all)
npm run precommit
```

### File Structure:
```
apps/admin/
├── app/                    # Routing ONLY
│   └── (admin)/
│       └── [page]/
│           └── page.tsx    # Import + Render
│
├── features/               # UI Components
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/
│       ├── columns/
│       ├── types/
│       └── index.ts
│
└── entities/               # Business Logic
    └── [entity-name]/
        ├── model/
        ├── api/
        ├── lib/
        └── index.ts
```

### Import Aliases:
```typescript
@features/*            // apps/admin/features/*
@entities/*            // apps/admin/entities/*
@vantage-lane/ui-core  // packages/ui-core/src/*
@/lib/*                // apps/admin/lib/*
```

---

**END OF WORKFLOW.md**  
**Version 2.0**  
**SINGURA SURSĂ DE ADEVĂR pentru development workflow**
