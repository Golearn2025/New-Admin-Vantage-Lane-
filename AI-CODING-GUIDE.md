# 🤖 AI Coding Guide - Zero Errors, Maximum Automation

## 🎯 OBIECTIV: Cod Perfect Automat

Cu setup-ul nostru, AI-ul scrie codul pentru tine și te oprește INSTANT când greșești!

---

## 🚀 Quick Start

### 1. Instalează TOATE extensiile:
```bash
bash scripts/install-ai-extensions.sh
```

### 2. Restart VSCode

### 3. Sign in to GitHub Copilot
- `Cmd + Shift + P`
- Type: "Copilot: Sign In"
- Follow instructions

---

## 💬 CUM SĂ VORBEȘTI CU AI-ul

### **Metoda 1: Copilot Chat** (Recomandat!)

**Deschide Chat:**
```
Cmd + Shift + I  (sau click pe chat icon)
```

**Exemplu Real - Bookings Table:**
```
Tu: Creează un React component pentru bookings table cu următoarele:
- 9 coloane: checkbox, expand, reference, customer, route, vehicle, payment, status, actions
- Folosește design tokens din @vantage-lane/ui-core
- TypeScript cu types din @admin-shared/api/contracts/bookings
- CSS Modules pentru styling
- Hook useBookingsList pentru data fetching

Copilot: [GENEREAZĂ TOT CODUL COMPLET]
```

---

### **Metoda 2: Inline Comments**

Scrii un comment și apeși TAB:

```typescript
// Creează hook pentru bookings list cu pagination și filtering
[TAB]
// ✨ Copilot scrie:
export function useBookingsList(filters?: BookingsFilters) {
  const [data, setData] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  // ... tot codul complet!
}
```

---

## 🎨 EXEMPLE PRACTICE

### **Exemplu 1: Creează Component cu Design Tokens**

**Tu spui:**
```
@workspace Create a StatusBadge component that:
1. Uses ONLY design tokens (no hardcoded colors)
2. Has variants: pending, active, completed, cancelled
3. Shows icons from @vantage-lane/ui-icons
4. Uses CSS Modules
5. TypeScript with proper types
6. Export from index.ts
```

**Copilot:**
- Creează `StatusBadge.tsx`
- Creează `StatusBadge.module.css` (100% tokens!)
- Creează `index.ts`
- Adaugă TypeScript types
- **TOT AUTOMAT! ✨**

---

### **Exemplu 2: API Route**

**Tu spui:**
```typescript
// Creează Next.js API route pentru bookings list:
// - GET /api/bookings/list
// - Query params: page, page_size, status
// - Response: BookingsListResponse type
// - Use Supabase client
// - Fetch customers separately (no nested queries)
// - Transform data cu transformBookingsData
[TAB]
```

**Copilot scrie TOTUL!** ✨

---

### **Exemplu 3: Refactoring Automat**

**Selectează cod cu hardcoded colors:**
```css
.button {
  background: #F1D16A;  /* ❌ hardcoded */
  color: #1A1A1A;       /* ❌ hardcoded */
}
```

**În Copilot Chat:**
```
Replace all hardcoded colors with design tokens from 
packages/ui-core/src/tokens/colors.css
```

**Copilot:**
```css
.button {
  background: var(--color-primary);  /* ✅ token */
  color: var(--color-text-primary);  /* ✅ token */
}
```

---

## ⚡ REAL-TIME VALIDATION (Niciodată nu scrii cod greșit!)

### **1. Error Lens**
Vezi TOATE erorile INLINE:

```typescript
const name = 'John';  ❌ 'name' is assigned but never used
const age: number = '25';  ❌ Type 'string' is not assignable to 'number'
```

### **2. SonarLint**
Oprește bad practices:

```typescript
if (user == null) { }  ⚠️ Use '===' instead of '=='
```

### **3. Import Cost**
Vezi dacă pachetul e prea mare:

```typescript
import moment from 'moment';  📦 288KB ⚠️ TOO BIG!
// Copilot sugerează: use 'dayjs' instead (2KB)
```

### **4. TypeScript**
Erori INSTANT când scrii:

```typescript
interface User {
  name: string;
}

const user: User = {
  n|  ← Copilot autocomplete: 'name'
}
```

---

## 🎯 WORKFLOW PERFECT (Zero Errors)

### **Pasul 1: Spune AI-ului ce vrei**
```
Cmd + Shift + I (Copilot Chat)
```

### **Pasul 2: AI generează cod**
- ✅ Cu design tokens
- ✅ Cu TypeScript types
- ✅ Cu proper imports
- ✅ Cu CSS Modules
- ✅ Formatted cu Prettier

### **Pasul 3: Auto-validation în timp real**
- Error Lens arată erori INLINE
- ESLint auto-fix on save
- Prettier auto-format on save
- TypeScript checking live

### **Pasul 4: Save (Cmd + S)**
```
✨ AUTOMAT:
1. Prettier formatează
2. ESLint fixează
3. Imports sorted
4. Stylelint fixează CSS
5. Zero errors!
```

---

## 🔥 COMENZI MAGICE COPILOT

### **Fix Errors:**
```
/fix [describe error]
```

### **Explain Code:**
```
/explain [select code]
```

### **Generate Tests:**
```
/tests [select function]
```

### **Refactor:**
```
/refactor using design tokens
/refactor to TypeScript
/refactor to smaller files
```

---

## 📋 TEMPLATE PROMPT PENTRU FEATURES COMPLETE

Copiază și personalizează:

```markdown
@workspace Create a new feature for [FEATURE_NAME]:

**Structure:**
- Component: app/(admin)/[feature]/[FeatureName].tsx
- Styles: [FeatureName].module.css
- Types: types.ts
- API: app/api/[feature]/route.ts
- Hook: hooks/use[FeatureName].ts

**Requirements:**
1. Use ONLY design tokens (check packages/ui-core/src/tokens/)
2. TypeScript with proper types
3. CSS Modules (no hardcoded values)
4. Responsive design
5. Accessibility (ARIA labels)
6. Error handling
7. Loading states
8. Export everything from index.ts

**API:**
- Endpoint: /api/[feature]
- Method: GET/POST
- Use Supabase client from @/lib/supabase/server
- Transform data if needed

**Design:**
[Describe layout, colors, spacing]

**Data:**
[Describe what data to fetch/display]
```

---

## 🎨 DESIGN TOKENS REMINDER

**AI-ul știe să folosească:**
```css
/* Colors */
var(--color-primary)
var(--color-text-primary)
var(--color-bg-primary)

/* Spacing */
var(--spacing-xs)
var(--spacing-sm)
var(--spacing-md)

/* Typography */
var(--font-size-sm)
var(--font-weight-medium)

/* Borders */
var(--radius-md)
var(--border-width-thin)

/* Shadows */
var(--shadow-sm)
```

Doar spune: "use design tokens" și AI-ul o face!

---

## ✅ CHECKLIST - COD PERFECT

Când Copilot generează cod, verifică automat:

- [x] Design tokens (nu hardcoded colors)
- [x] TypeScript types (nu `any`)
- [x] CSS Modules (nu inline styles)
- [x] Proper imports (path aliases)
- [x] Error handling
- [x] Loading states
- [x] Accessibility
- [x] Responsive
- [x] Formatted (Prettier)
- [x] Linted (ESLint)
- [x] No console.log în production

---

## 🚨 DACĂ AI-ul GREȘEȘTE

### **1. Corectează prin Chat:**
```
The component uses hardcoded colors. Replace with design tokens.
```

### **2. Sau selectează codul greșit:**
```
Cmd + Shift + I
"Fix this to use design tokens"
```

### **3. AI-ul învață din greșeli!**
Cu fiecare corec
