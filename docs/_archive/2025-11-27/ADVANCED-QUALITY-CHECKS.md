# 🔍 ADVANCED QUALITY CHECKS - Complete Guide

**Comprehensive code quality analysis pentru zero technical debt**

---

## 🎯 **QUICK START:**

```bash
# Rulează TOATE verificările advanced:
npm run check:advanced

# Sau individual:
npm run check:quality      # any, colors, magic numbers, TODOs
npm run check:duplicates   # Code duplication
npm run check:deadcode     # Unused code
npm run check:performance  # Bundle size, reusability
```

---

## 📋 **CE VERIFICĂM:**

### **1. ANY TYPES** ❌

```typescript
// ❌ BAD - Type any
function process(data: any) {}

// ✅ GOOD - Specific type
function process(data: BookingListItem) {}
```

**Check:**

```bash
npm run check:any
# sau în check:quality
```

**Ce detectează:**

- TypeScript `any` types
- Missing type annotations
- Unsafe type assertions

**Target:** **0 any types în production code**

---

### **2. HARDCODED COLORS** 🎨

```css
/* ❌ BAD - Hardcoded color */
.button {
  color: #f1d16a;
}

/* ✅ GOOD - Design token */
.button {
  color: var(--color-primary);
}
```

**Check:**

```bash
npm run check:colors
# sau în check:quality
```

**Ce detectează:**

- Inline colors: `color: #...`
- RGB values: `rgb(...)`
- HSL values: `hsl(...)`

**Target:** **0 hardcoded colors**  
**Solution:** Use design tokens din `packages/ui-core/src/tokens/`

---

### **3. MAGIC NUMBERS** 🔢

```typescript
// ❌ BAD - Magic number
setTimeout(callback, 5000);
if (count > 100) {
}

// ✅ GOOD - Named constants
const TIMEOUT_MS = 5000;
const MAX_ITEMS = 100;

setTimeout(callback, TIMEOUT_MS);
if (count > MAX_ITEMS) {
}
```

**Check:**

```bash
npm run check:quality
```

**Ce detectează:**

- Hardcoded numbers >9
- Duplicate numeric values
- Unexplained thresholds

**Target:** **< 10 magic numbers**  
**Solution:** Extract to named constants

---

### **4. HARDCODED STRINGS** 📝

```typescript
// ❌ BAD - Hardcoded text
<button>Click here to continue</button>

// ✅ GOOD - Prepared for i18n
<button>{t('button.continue')}</button>
```

**Check:**

```bash
npm run check:quality
```

**Ce detectează:**

- Hardcoded UI text
- Potential i18n issues
- Repeated string literals

**Target:** Reasonable amount  
**Note:** Consider i18n for internationalization

---

### **5. TODO/FIXME COMMENTS** 📝

```typescript
// ❌ BAD - Unresolved TODO
// TODO: Implement this feature

// ✅ GOOD - Track în issue tracker
// Issue #123: Implement advanced filtering
```

**Check:**

```bash
npm run check:quality
```

**Ce detectează:**

- `TODO` comments
- `FIXME` comments
- `XXX` markers
- `HACK` comments

**Target:** **< 5 TODOs**  
**Solution:** Resolve sau track în issue tracker

---

### **6. BUSINESS LOGIC ÎN UI** 🏗️

```typescript
// ❌ BAD - Business logic în component
function BookingCard() {
  const data = await supabase.from('bookings').select();
  return <div>{data}</div>;
}

// ✅ GOOD - Separation of concerns
function BookingCard() {
  const { data } = useBookings(); // Hook handles logic
  return <div>{data}</div>;
}
```

**Check:**

```bash
npm run check:business
# sau în check:quality
```

**Ce detectează:**

- Direct Supabase calls în components
- `fetch()` în UI
- axios în components

**Target:** **0 violations**  
**Solution:** Use hooks/services

---

### **7. CODE DUPLICATION** 📋

```typescript
// ❌ BAD - Duplicated code
function processBooking1() {
  validate();
  transform();
  save();
}

function processBooking2() {
  validate();
  transform();
  save();
}

// ✅ GOOD - Reusable function
function processBooking(type) {
  validate();
  transform();
  save();
}
```

**Check:**

```bash
npm run check:duplicates
```

**Ce detectează:**

- Repeated function patterns
- Similar code blocks
- Copy-pasted components
- Repeated imports
- Similar JSX structures

**Target:** **< 20 patterns**  
**Solution:** Extract to reusable components/functions

---

### **8. DEAD CODE** 💀

```typescript
// ❌ BAD - Unused export
export function unusedFunction() {}

// ❌ BAD - Empty file
// (file with < 5 lines)

// ✅ GOOD - Remove unused code
// Delete or use it
```

**Check:**

```bash
npm run check:deadcode
```

**Ce detectează:**

- Unused exports
- Empty files (< 5 lines)
- Commented out code
- Unused CSS classes
- Unused imports

**Target:** **< 10 issues**  
**Solution:** Remove sau complete

---

### **9. LARGE FILES** 📏

```
❌ BAD:
  DashboardPage.tsx - 500 lines

✅ GOOD:
  DashboardPage.tsx - 150 lines
  DashboardMetrics.tsx - 100 lines
  DashboardCharts.tsx - 100 lines
```

**Check:**

```bash
npm run check:files
# sau în check:performance
```

**Ce detectează:**

- Files > 200 lines (warning)
- Files > 300 lines (error)

**Target:** **All files < 300 lines**  
**Solution:** Split into smaller modules

---

### **10. COMPONENT REUSABILITY** ♻️

```
✅ GOOD STRUCTURE:

packages/ui-core/     # Reusable components
  ├── Button/
  ├── Input/
  └── DataTable/

apps/admin/           # App-specific components
  ├── BookingsTable/
  └── DashboardMetrics/
```

**Check:**

```bash
npm run check:performance
```

**Ce detectează:**

- Reusable vs app-specific ratio
- Component extraction opportunities
- Design system usage

**Target:** **30%+ reusability ratio**  
**Solution:** Extract common components to ui-core

---

### **11. IMPORT EFFICIENCY** 📦

```typescript
// ❌ BAD - Relative imports
import { Button } from '../../../ui-core/Button';

// ✅ GOOD - Barrel imports
import { Button } from '@ui-core';
```

**Check:**

```bash
npm run check:performance
```

**Ce detectează:**

- Relative vs barrel imports ratio
- Deep import paths
- Import organization

**Target:** More barrel than relative  
**Solution:** Use path aliases (@ui-core, @shared)

---

### **12. PERFORMANCE ANTI-PATTERNS** ⚡

```typescript
// ❌ BAD - Inline function (re-renders)
<button onClick={() => handleClick()}>

// ✅ GOOD - Memoized callback
const handleClick = useCallback(() => { }, []);
<button onClick={handleClick}>
```

**Check:**

```bash
npm run check:performance
```

**Ce detectează:**

- Inline functions în JSX
- Complex useEffect dependencies
- Missing memoization

**Target:** **< 50 inline functions**  
**Solution:** Use useCallback/useMemo

---

### **13. DESIGN TOKENS USAGE** 🎨

```css
/* ✅ EXCELLENT */
.button {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Token usage: 100% */
```

**Check:**

```bash
npm run check:performance
```

**Ce detectează:**

- % CSS files using tokens
- Design system consistency

**Target:** **80%+ token usage**  
**Current:** Based on refactoring memory, we have **100%** în refactored components!

---

## 🚀 **WORKFLOW COMPLET:**

### **VARIANTA 1: Quick Quality Check (2 min)**

```bash
npm run check:quality
```

**Verifică:**

- ✅ any types
- ✅ hardcoded colors
- ✅ magic numbers
- ✅ TODOs
- ✅ business logic în UI

---

### **VARIANTA 2: Advanced Quality Check (5 min)**

```bash
npm run check:advanced
```

**Verifică:**

- ✅ check:quality (all above)
- ✅ check:duplicates (code duplication)
- ✅ check:deadcode (unused code)
- ✅ check:performance (bundle, reusability)

---

### **VARIANTA 3: Complete Check (10 min)**

```bash
npm run check:everything    # P0 + basic
npm run check:advanced      # Quality + duplicates + deadcode + performance
npm run check:enterprise    # Architecture
npm test                    # Unit tests
```

---

## 📊 **REZULTATE EXPECTED:**

### **✅ EXCELLENT SCORE:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 QUALITY RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  'any' types:         0 ✅
  Hardcoded colors:    0 ✅
  Magic numbers:       5 ✅
  TODOs:               2 ✅
  Business logic:      0 ✅

  Code duplication:    Low ✅
  Dead code:          < 10 issues ✅
  Reusability:         35% ✅
  Token usage:         95% ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ EXCELLENT QUALITY - Zero technical debt!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 **TARGETS SUMMARY:**

| Check                    | Target      | Priority        |
| ------------------------ | ----------- | --------------- |
| **any types**            | 0           | 🔴 Critical     |
| **Hardcoded colors**     | 0           | 🔴 Critical     |
| **Business logic în UI** | 0           | 🔴 Critical     |
| **Magic numbers**        | < 10        | 🟡 Important    |
| **TODOs**                | < 5         | 🟡 Important    |
| **Code duplication**     | Low         | 🟡 Important    |
| **Dead code**            | < 10        | 🟡 Important    |
| **Large files**          | < 300 lines | 🟡 Important    |
| **Reusability ratio**    | > 30%       | 🟢 Nice to have |
| **Token usage**          | > 80%       | 🟢 Nice to have |

---

## 🔧 **HOW TO FIX:**

### **1. any Types:**

```bash
# Find all:
npm run check:any

# Fix:
- Replace any cu specific types
- Use TypeScript inference
- Create proper interfaces
```

### **2. Hardcoded Colors:**

```bash
# Find all:
npm run check:colors

# Fix:
- Use design tokens: var(--color-primary)
- Extract to packages/ui-core/src/tokens/
- Update CSS modules
```

### **3. Magic Numbers:**

```bash
# Find all:
npm run check:quality

# Fix:
const TIMEOUT_MS = 5000;
const MAX_ITEMS = 100;
const PAGE_SIZE = 20;
```

### **4. Code Duplication:**

```bash
# Find all:
npm run check:duplicates

# Fix:
- Extract to reusable functions
- Create shared components
- Use composition
```

### **5. Dead Code:**

```bash
# Find all:
npm run check:deadcode

# Fix:
- Remove unused exports
- Delete empty files
- Remove commented code
- Clean unused CSS
```

---

## 📝 **BEST PRACTICES:**

### **Înainte de fiecare commit:**

```bash
npm run check:quality  # Quick check
```

### **Înainte de Pull Request:**

```bash
npm run check:advanced  # Full quality check
```

### **Weekly cleanup:**

```bash
npm run check:deadcode      # Remove unused code
npm run check:duplicates    # Refactor duplicates
```

### **Monthly review:**

```bash
npm run check:performance   # Optimize bundle
npm run check:enterprise    # Architecture review
```

---

## 🎊 **CURRENT STATUS (Based on memories):**

```
✅ Hardcoded colors: 0 (din refactoring)
   - 137 hardcodări eliminate
   - 100% design tokens în 6 componente

✅ Business logic separation: Excellent
   - API modular (251 → 96 lines)
   - Hooks pentru business logic

✅ Reusability: High
   - packages/ui-core cu componente reutilizabile
   - Export centralizat

✅ Type safety: Excellent
   - TypeScript strict mode
   - 0 production errors

⚠️ Need to check:
   - Dead code (run check:deadcode)
   - Duplicates (run check:duplicates)
   - TODOs (run check:quality)
```

---

## 🚀 **AUTOMATION:**

### **Git Pre-commit Hook:**

```bash
# .husky/pre-commit
npm run check:quality || exit 1
```

### **CI/CD Pipeline:**

```yaml
# .github/workflows/quality.yml
- name: Quality Checks
  run: |
    npm run check:advanced
    npm run check:enterprise
```

---

## 📚 **RELATED DOCS:**

- **PRE-COMMIT-CHECKLIST.md** - Complete commit checklist
- **P0-FILES-CHECKLIST.md** - Critical files
- **STRUCTURE.md** - Project architecture
- **scripts/README.md** - All scripts guide

---

**Last updated:** 2025-10-19  
**Version:** 1.0.0  
**Status:** ✅ Comprehensive quality system active
