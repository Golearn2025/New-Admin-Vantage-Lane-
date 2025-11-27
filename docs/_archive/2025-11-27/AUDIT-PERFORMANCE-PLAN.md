> ⚠️ DEPRECATED – Regulile și checklist-urile din acest fișier au fost migrate (parțial sau complet) în `docs/AUDIT_ENTERPRISE.md`.  
> Te rog folosește DOAR `docs/AUDIT_ENTERPRISE.md` ca sursă de adevăr pentru reguli și audit.

# 🔍 VANTAGE LANE ADMIN - PLAN AUDIT PERFORMANȚĂ

> **Audit Complet de Performanță & Optimizare**  
> **Target:** apps/admin (Vantage Lane Admin Portal)  
> **Date:** 2025-11-02  
> **Scope:** Identificare bottlenecks, optimizare resurse, best practices

---

## 🎯 OBIECTIVE AUDIT

### Principale:
1. **Performanță Runtime**
   - Identificare componente slow render (>16ms)
   - Memory leaks detection
   - Re-render-uri inutile
   - Bundle size & code splitting
   - Lazy loading opportunities

2. **Performanță Build**
   - Timp compilare TypeScript
   - Timp ESLint/Prettier
   - Dependențe duplicate
   - Tree-shaking effectiveness

3. **Arhitectură & Code Quality**
   - Circular dependencies
   - Duplicate code detection
   - Complexity per file/function
   - Import patterns optimization
   - Dead code elimination

4. **Database & API**
   - Query optimization (N+1 detection)
   - Fetch waterfall issues
   - Cache strategy gaps
   - RLS policies performance

5. **Assets & Resources**
   - Image optimization
   - CSS optimization (unused styles)
   - Font loading strategy
   - Third-party scripts impact

---

## 📋 METODOLOGIE AUDIT

### Faza 1: SCANNING (Automated Analysis)
```bash
# Performance profiling
npm run build -- --profile
npm run analyze  # Bundle analyzer

# Code metrics
npm run lint -- --format json > lint-report.json
npx ts-prune  # Dead code detection
npx madge --circular apps/admin  # Circular deps
npx depcheck  # Unused dependencies

# Coverage analysis
npm run test:coverage -- --reporter=json

# Bundle analysis
npx webpack-bundle-analyzer .next/analyze.json
```

### Faza 2: MANUAL INSPECTION (Deep Dive)
```
apps/admin/
├── app/ (admin)          → Routing patterns analysis
│   ├── Verificare: Zero logic în pages
│   ├── Verificare: Proper loading states
│   └── Verificare: Error boundaries
│
├── features/             → Component performance
│   ├── Analiza: React DevTools Profiler
│   ├── Analiza: Re-renders count
│   ├── Analiza: Props drilling
│   └── Analiza: Memoization opportunities
│
├── entities/             → Business logic optimization
│   ├── Analiza: API calls efficiency
│   ├── Analiza: Data transformation complexity
│   ├── Analiza: Schema validation overhead
│   └── Analiza: Caching strategy
│
└── packages/             → Shared libraries
    ├── ui-core/          → Component library perf
    ├── formatters/       → Data formatting overhead
    └── contracts/        → Type validation cost
```

### Faza 3: PROFILING (Runtime Analysis)
```javascript
// Chrome DevTools Protocol
1. Performance Recording (60s user flow)
2. Memory Heap Snapshots (3 snapshots over time)
3. Coverage Report (unused CSS/JS)
4. Network Waterfall Analysis
5. Lighthouse CI Report
```

---

## 🔬 METRICI DE MĂSURAT

### A. Bundle Metrics
```yaml
Current Target (RULES.md):
  - Total Bundle: < 300KB
  - Page Bundle: < 150KB
  - TTFB: < 500ms

Metrici Audit:
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to Interactive (TTI)
  - Total Blocking Time (TBT)
  - Cumulative Layout Shift (CLS)

Target Performance:
  - FCP: < 1.8s
  - LCP: < 2.5s
  - TTI: < 3.8s
  - TBT: < 200ms
  - CLS: < 0.1
```

### B. Code Metrics
```yaml
Per File:
  - Lines: < 200 (RULES.md)
  - Functions: < 50 lines (RULES.md)
  - Complexity: < 10 (RULES.md)
  - Imports: < 15
  - Exports: < 10

Per Feature:
  - Total LOC: < 1000
  - Test Coverage: > 60%
  - Files Count: < 15

Per Entity:
  - Total LOC: < 800
  - Test Coverage: > 80%
  - API Calls: < 10
```

### C. Runtime Metrics
```yaml
Components:
  - Render Time: < 16ms (60fps)
  - Re-renders per action: < 3
  - Props count: < 10
  - Children depth: < 5

Hooks:
  - useEffect deps: < 5
  - useMemo/useCallback justified
  - Custom hooks: < 100 LOC

API:
  - Response time: < 200ms
  - Concurrent requests: < 5
  - Cache hit rate: > 70%
```

### D. Memory Metrics
```yaml
Heap Size:
  - Initial: < 20MB
  - After 5min: < 50MB
  - Memory leaks: ZERO

Event Listeners:
  - Cleanup on unmount: 100%
  - Timers cleared: 100%
  - Subscriptions cleaned: 100%
```

---

## 🔍 CHECKLIST DETALIAT PER CATEGORIE

### 1️⃣ APP DIRECTORY (`app/(admin)/`)
```markdown
Pentru fiecare page.tsx:
- [ ] Are DOAR import + render (zero logic)
- [ ] Are loading.tsx cu Suspense
- [ ] Are error.tsx cu Error Boundary
- [ ] Folosește streaming SSR corect
- [ ] Metadata optimization (SEO)
- [ ] No layout shifts în loading state

Metrici:
- [ ] Page size < 150KB
- [ ] Hydration time < 500ms
- [ ] TTI < 3s
```

### 2️⃣ FEATURES DIRECTORY (`features/*/`)
```markdown
Pentru fiecare feature:

COMPONENTS:
- [ ] < 200 lines per component
- [ ] Props drilling < 3 levels
- [ ] Folosește React.memo doar unde necesar
- [ ] Children components extract corect
- [ ] Event handlers cu useCallback doar când necesar

HOOKS:
- [ ] < 100 lines per hook
- [ ] useEffect deps optimizate
- [ ] Cleanup functions prezente
- [ ] No infinite loops risk
- [ ] Return values typed corect

STYLES:
- [ ] 100% design tokens (var(--*))
- [ ] No duplicate CSS
- [ ] Responsive fără hardcoded breakpoints
- [ ] No unused classes (coverage)

COLUMNS (pentru tables):
- [ ] Cell renderers optimizate
- [ ] Formatters memoized
- [ ] No inline functions în columns def
- [ ] Sorting/filtering efficient

Metrici:
- [ ] First render < 100ms
- [ ] Re-renders < 3 per action
- [ ] Memory stable după 5min
```

### 3️⃣ ENTITIES DIRECTORY (`entities/*/`)
```markdown
Pentru fiecare entity:

MODEL:
- [ ] Zod schemas optimizate (no unnecessary validation)
- [ ] Types inferred corect
- [ ] No circular type references

API:
- [ ] Queries optimizate (SELECT specific fields)
- [ ] No N+1 queries
- [ ] Batch operations where possible
- [ ] Error handling consistent
- [ ] Retry logic pentru failed requests
- [ ] Cache strategy implementată

LIB:
- [ ] Pure functions (no side effects)
- [ ] Complexity < 10
- [ ] Unit tests > 80%
- [ ] No expensive operations în loops

Metrici:
- [ ] API response time < 200ms
- [ ] Validation overhead < 5ms
- [ ] Transform operations < 10ms
- [ ] Cache hit rate > 70%
```

### 4️⃣ PACKAGES (`packages/*/`)
```markdown
UI-CORE:
- [ ] Components tree-shakeable
- [ ] CSS tokens optimizate
- [ ] No runtime CSS-in-JS
- [ ] Bundle size per component < 5KB

FORMATTERS:
- [ ] Pure functions
- [ ] Memoization where needed
- [ ] No Intl.DateTimeFormat în loops
- [ ] Number formatters cached

CONTRACTS:
- [ ] Type-only exports (zero runtime)
- [ ] No heavy validation în contracts

Metrici:
- [ ] Import cost < 10KB per package
- [ ] No duplicate dependencies
- [ ] Tree-shaking effectiveness > 80%
```

---

## 🚨 RED FLAGS - Prioritate MAXIMĂ

### Performance Killers:
```typescript
❌ 1. Inline Object/Array în Props
<Component data={[1, 2, 3]} />  // Re-creates la fiecare render

❌ 2. Inline Functions în Loops
{items.map(item => <Row onClick={() => handle(item.id)} />)}

❌ 3. Excessive useEffect
useEffect(() => {
  // Complex logic
}, [dep1, dep2, dep3, dep4, dep5]);  // Prea multe deps

❌ 4. No Memoization în Computed Values Expensive
const sorted = data.sort();  // Re-sorts la fiecare render

❌ 5. Props Drilling > 3 Levels
<A><B><C><D value={x} /></D></C></B></A>

❌ 6. Large Bundle Imports
import _ from 'lodash';  // Import ALL 70KB
// Instead: import debounce from 'lodash/debounce';

❌ 7. Synchronous Heavy Operations
const result = data.map(expensive).filter(expensive);  // Blocks UI

❌ 8. Memory Leaks
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  // Missing: return () => clearInterval(timer);
}, []);

❌ 9. Excessive Re-renders
Parent state change → All children re-render

❌ 10. No Code Splitting
Import all features → Huge initial bundle
```

---

## 📊 OUTPUT FORMAT - RAPORT AUDIT

```markdown
# AUDIT REPORT: [Feature/Entity Name]

## 📍 LOCATION
Path: apps/admin/features/payments-table/

## 📈 METRICI CURENTE
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle Size | 87KB | < 150KB | ✅ |
| First Render | 145ms | < 100ms | ⚠️ |
| Re-renders | 5 | < 3 | ❌ |
| Test Coverage | 75% | > 60% | ✅ |
| Memory Leak | No | None | ✅ |
| Complexity | 12 | < 10 | ⚠️ |

## 🔍 FINDINGS

### 🔴 CRITICAL (Must Fix)
1. **File: PaymentsTable.tsx:L45**
   - Issue: Inline arrow function în map loop
   - Impact: Component re-creates function la fiecare render
   - Fix: Extract to useCallback
   ```typescript
   // ❌ Before
   {payments.map(p => <Row onClick={() => handle(p.id)} />)}
   
   // ✅ After
   const handleRowClick = useCallback((id: string) => {
     handle(id);
   }, [handle]);
   {payments.map(p => <Row onClick={handleRowClick} data={p} />)}
   ```

### 🟡 WARNING (Should Fix)
2. **File: usePaymentsList.ts:L23**
   - Issue: useEffect cu prea multe dependencies
   - Impact: Refetch prea des, API overhead
   - Fix: Split în multiple effects

### 🟢 INFO (Nice to Have)
3. **File: cells.tsx:L67**
   - Issue: Duplicate formatare cod
   - Impact: Bundle size +2KB
   - Fix: Extract în formatter util

## 💡 RECOMANDĂRI

### Immediate (P0):
- [ ] Refactor inline functions în loops
- [ ] Add React.memo la PaymentRow (renders >100 items)
- [ ] Extract formatare în @vantage-lane/formatters

### Short-term (P1):
- [ ] Implement virtualization pentru liste >50 items
- [ ] Add loading skeleton pentru better UX
- [ ] Cache API responses în React Query

### Long-term (P2):
- [ ] Migrate la Server Components (Next.js 14)
- [ ] Implement infinite scroll cu pagination
- [ ] Add error boundary per feature

## 📊 IMPACT ESTIMAT
- Bundle size: -15KB (-17%)
- First render: -50ms (-34%)
- Re-renders: -2 (-40%)
- Test coverage: +5% (80%)

## ⏱️ EFFORT ESTIMAT
- Immediate: 2-3 ore
- Short-term: 1 zi
- Long-term: 3-5 zile
```

---

## 🛠️ TOOLS FOLOSITE ÎN AUDIT

### Automated Tools:
```bash
# Bundle Analysis
- webpack-bundle-analyzer
- next-bundle-analyzer
- source-map-explorer

# Code Quality
- ESLint (max-lines, complexity)
- ts-prune (dead code)
- madge (circular deps)
- depcheck (unused deps)
- dependency-cruiser

# Testing
- Vitest (coverage)
- React Testing Library
- Lighthouse CI

# Performance
- Chrome DevTools Profiler
- React DevTools Profiler
- Web Vitals Library
- Performance Observer API
```

### Manual Inspection:
```
- Chrome DevTools → Performance Tab
- Chrome DevTools → Memory Tab
- Chrome DevTools → Coverage Tab
- React DevTools → Profiler Tab
- Network Tab → Waterfall Analysis
```

---

## 🎯 SUCCESS CRITERIA

### Audit complet când:
- [x] Toate files scanate (app/, features/, entities/, packages/)
- [x] Raport generat pentru fiecare categorie
- [x] Metrici măsurate pentru fiecare feature/entity
- [x] Red flags identificate și prioritizate
- [x] Recomandări cu effort estimat
- [x] Action plan cu timeline
- [x] Comparison: Before vs After metrics

### Metrics Target Post-Audit:
```yaml
Bundle:
  - Total: < 250KB (target 300KB)
  - Pages: < 120KB (target 150KB)

Performance:
  - FCP: < 1.5s (target 1.8s)
  - LCP: < 2.0s (target 2.5s)
  - TTI: < 3.0s (target 3.8s)

Code Quality:
  - Zero files > 200 lines
  - Zero functions > 50 lines
  - Zero complexity > 10
  - Coverage: entities > 80%, features > 60%

Runtime:
  - Zero memory leaks
  - Re-renders < 3 per action
  - Render time < 16ms (60fps)
```

---

## 📝 PROPUNERI ADIȚIONALE (Cascade AI)

### 1. **Database Query Analysis**
   - Scan toate API calls din entities/*/api/
   - Detect N+1 queries
   - Suggest indexes pentru slow queries
   - Validate RLS policies performance

### 2. **CSS Optimization Deep Dive**
   - Scan toate .module.css files
   - Detect duplicate styles
   - Check unused CSS classes (via coverage)
   - Validate 100% design tokens usage
   - Calculate CSS bundle impact

### 3. **Import Cost Analysis**
   - Calculate import cost per file
   - Detect heavy imports (lodash, date-fns full imports)
   - Suggest tree-shakeable alternatives
   - Validate @/* alias usage corect

### 4. **React Patterns Anti-patterns**
   - Detect props drilling > 3 levels
   - Identify missing cleanup în useEffect
   - Find excessive useState (>5 per component)
   - Spot wrong dependencies în hooks

### 5. **Error Handling Audit**
   - Verify error boundaries coverage
   - Check try-catch consistency
   - Validate error logging (via logger util)
   - Test error states în UI

### 6. **Accessibility & UX Performance**
   - Check loading states everywhere
   - Verify skeleton screens
   - Validate error messages clarity
   - Test keyboard navigation
   - Check focus management

### 7. **Third-party Dependencies Audit**
   - List all dependencies cu size
   - Check for abandoned packages (last update > 1yr)
   - Detect duplicate dependencies
   - Suggest lighter alternatives

### 8. **Responsive Design Performance**
   - Validate no hardcoded px breakpoints
   - Check image responsive strategy
   - Test mobile performance (<3G)
   - Verify touch targets (>44px)

### 9. **Security Performance Impact**
   - CSP headers validation
   - Check secrets scan overhead
   - RLS policies query cost
   - Audit logs performance impact

### 10. **Developer Experience Metrics**
   - Build time analysis (TypeScript, ESLint)
   - Hot reload performance
   - Test suite execution time
   - Pre-commit hooks overhead
   - CI/CD pipeline duration

---

## 🚀 NEXT STEPS

### Dacă aprobat, execuție în ordinea:

1. **Setup** (30min)
   - Install analysis tools
   - Configure profilers
   - Prepare test environment

2. **Phase 1: Automated Scan** (2-3 ore)
   - Run all automated tools
   - Collect metrics
   - Generate raw reports

3. **Phase 2: Manual Deep Dive** (1-2 zile)
   - app/ directory (2-3 ore)
   - features/ directory (8-12 ore) ← BIGGEST
   - entities/ directory (4-6 ore)
   - packages/ directory (2-3 ore)

4. **Phase 3: Profiling** (4-6 ore)
   - Runtime performance testing
   - Memory leak detection
   - Bundle analysis
   - Network waterfall

5. **Phase 4: Report Generation** (2-3 ore)
   - Aggregate findings
   - Prioritize issues
   - Calculate impact/effort
   - Create action plan

6. **Phase 5: Recommendations** (1-2 ore)
   - Quick wins (P0)
   - Short-term (P1)
   - Long-term (P2)
   - Architecture improvements

**TOTAL ESTIMAT: 3-4 zile full audit**

---

**ÎNTREBARE PENTRU USER:**

Vrei să procedez cu:
- **A) Audit COMPLET** (3-4 zile, TOATE categoriile de mai sus)
- **B) Audit TARGETED** (1 zi, doar app/ + features/ + entities/)
- **C) Audit QUICK SCAN** (4-6 ore, doar automated tools + red flags)
- **D) Altă configurație** (spune-mi ce priorități ai)

După ce aleg, încep imediat cu faza de scanning! 🚀
