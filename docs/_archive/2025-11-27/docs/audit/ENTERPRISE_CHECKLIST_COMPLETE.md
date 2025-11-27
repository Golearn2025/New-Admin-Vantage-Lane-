# ENTERPRISE CHECKLIST COMPLETE - SINGLE REFERENCE

**Date:** 2025-11-26  
**Version:** 1.0 (Complete Enterprise Standards)  
**Use:** Copy-paste această listă pentru orice pagină audit  

## 🔴 CODE QUALITY (MANDATORY)

### TypeScript & Architecture
- [ ] **Zero `any` types** (TypeScript strict mode)
- [ ] **Files <200 lines** (component splitting obligatoriu)
- [ ] **Functions <50 lines** (complexity management)  
- [ ] **Zero circular imports** (madge --circular clean)
- [ ] **Zero cod mort** (ts-prune minimal unused exports)
- [ ] **Zero deps nefolosite** (depcheck clean)

### UI & Design Consistency
- [ ] **Fără culori hardcodate** (doar var(--color-*) tokens)
- [ ] **Fără px brute** (doar var(--spacing-*) tokens)
- [ ] **Zero inline style** (style={{}} forbidden)
- [ ] **Zero !important** (architecture over brute force)
- [ ] **100% UI-Core components** (zero duplicate Button/Input/Badge/Table)
- [ ] **Icons DOAR din lucide-react** (zero SVG manual/custom)

---

## 🏗️ ARCHITECTURE (MANDATORY)

### Data & State Management
- [ ] **Doar EnterpriseDataTable** (production tables)
- [ ] **Formatters centralizate** (utils/, nu inline)
- [ ] **Filtre reutilizabile** (shared components)
- [ ] **Fără copy/paste** (DRY principle)
- [ ] **Fără fetch în UI** (data layer separation - hooks only)
- [ ] **Fără inline functions în map** (useCallback extracted)

### Performance & Memory
- [ ] **Fără re-fetch la re-render** (cache/ReactQuery/SWR)
- [ ] **Pagination limit/offset** (server-side pagination)
- [ ] **Cleanup useEffect** (deps corecte + return cleanup)
- [ ] **Memoization** (useMemo/useCallback pentru expensive ops)
- [ ] **Loading states** (skeleton/spinner pentru async)
- [ ] **Bundle analysis** (lazy loading pentru componente mari)

---

## 📱 RESPONSIVE & UX (MANDATORY)

### Breakpoint Requirements  
- [ ] **320px mobile** (iPhone SE) - toate features funcționale
- [ ] **375px mobile** (iPhone 12/13/14) - experiență optimă
- [ ] **768px tablet** (iPad) - desktop-like experience
- [ ] **Touch targets ≥44px** (iOS accessibility guidelines)
- [ ] **Sticky header** activ (tables și navigation)

### Image & Media
- [ ] **Image optimization** (Next.js Image component)
- [ ] **Screenshot înainte/după** (toate breakpoints)

---

## 🔒 SECURITY & COMPLIANCE (CRITICAL)

### Security Scanning
- [ ] **Gitleaks scan clean** (zero secrets în cod)
- [ ] **Input validation** (Zod schemas pentru toate inputs)
- [ ] **Security testing** (role isolation, cross-org access prevention)

### Accessibility (WCAG 2.1 AA)
- [ ] **Axe-core passing** (zero violations)
- [ ] **Keyboard navigation** (Tab, Enter, Esc funcțional)
- [ ] **ARIA labels present** (screen reader support)

---

## ⚡ PERFORMANCE (ENTERPRISE)

### Core Web Vitals
- [ ] **Performance metrics** (Lighthouse >90, LCP <2.5s, FID <100ms)
- [ ] **React DevTools profiler** (zero unnecessary re-renders)
- [ ] **Manual testing results** (real device, nu doar DevTools)

---

## 📊 QUALITY ASSURANCE (MANDATORY)

### Tool Verification (Run All)
- [ ] **ts-prune** output clean (minimal unused exports)
- [ ] **depcheck** output clean (zero unused dependencies)
- [ ] **madge --circular** clean (zero circular imports)
- [ ] **gitleaks detect** clean (zero secrets found)
- [ ] **axe-core** scan clean (zero accessibility violations)

### Evidence Collection
- [ ] **Evidence folder structure** organized:
  ```bash
  evidence/2025-11-26/
    screenshots/
      page-320px-before.png
      page-320px-after.png
      page-375px-after.png
      page-768px-after.png
    tools/
      ts-prune-output.txt
      depcheck-output.txt  
      madge-circular.txt
      gitleaks-scan.txt
      axe-results.json
    performance/
      lighthouse-report.json
      react-profiler.json
  ```

### Process Documentation  
- [ ] **Git diff prezentat** (show exact changes made)
- [ ] **Output brut prezentat** (grep, ts-prune, depcheck results)
- [ ] **Before/after comparison** (metrics improvement demonstrated)

---

## 🎯 ENTERPRISE SUCCESS CRITERIA

**Page audit COMPLETE when ALL items ✅ AND:**

### Zero Violations
- ✅ **TypeScript:** 0 errors, 0 `any` types
- ✅ **Lint:** 0 errors, 0 warnings  
- ✅ **Build:** Successful compilation
- ✅ **Security:** gitleaks + axe-core clean
- ✅ **Performance:** Lighthouse >90, LCP <2.5s

### Quality Evidence
- ✅ **Screenshots:** All breakpoints documented
- ✅ **Tool outputs:** All verification commands run
- ✅ **Performance data:** Metrics collected and improved
- ✅ **Manual testing:** Real device verification completed

### Architecture Compliance
- ✅ **UI-Core usage:** 100% (zero duplicate components)
- ✅ **Design tokens:** 100% (zero hardcoded values)  
- ✅ **File organization:** <200 lines, proper splitting
- ✅ **Performance optimization:** Memoization, lazy loading, pagination

**Definition of Done:** All checkboxes ✅ + evidence collected + performance targets met

---

## 📋 QUICK VERIFICATION COMMANDS

```bash
# Run ALL these after each change:

# 1. TypeScript & Build
pnpm check:ts && pnpm lint && pnpm build

# 2. Code Quality  
npx ts-prune | grep apps/admin/features/PAGE_NAME
npx depcheck
npx madge --circular apps/admin/features/PAGE_NAME

# 3. Security
npx gitleaks detect --source . --verbose
npx axe http://localhost:3000/PAGE_ROUTE

# 4. Architecture Compliance
grep -r ": any\|<any>" apps/admin/features/PAGE_NAME --include="*.tsx" --include="*.ts"
grep -r "rgba\|rgb\|#[0-9a-fA-F]\{3,6\}" apps/admin/features/PAGE_NAME --include="*.css" | grep -v "var(--"
grep -r "[0-9]\+px" apps/admin/features/PAGE_NAME --include="*.css" | grep -v "var(--"
grep -r "style={{" apps/admin/features/PAGE_NAME --include="*.tsx"
grep -r "!important" apps/admin/features/PAGE_NAME --include="*.css"

# Expected: 0 results for all grep commands
```

**Use această listă pentru ORICE audit de pagină - este COMPLETĂ și ENTERPRISE-READY!**
