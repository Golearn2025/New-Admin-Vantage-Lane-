# 🎯 ORCHESTRATOR PATTERN - Standard pentru Componente Reutilizabile

## 📋 CE ESTE UN ORCHESTRATOR?

**Orchestratorul** este un **hook custom** care centralizează TOATĂ logica de business pentru o funcționalitate, făcând componentele 100% reutilizabile și fără logică duplicată.

---

## 🏗️ STRUCTURA STANDARD (3 LAYERE)

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: PURE UTILS (Zero side effects)                    │
│ packages/*/src/utils/                                       │
│ - Pure functions (testabile 100%)                          │
│ - Zero dependencies externe                                 │
│ - Input → Output (deterministic)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: ORCHESTRATOR HOOK (State + Side effects)          │
│ packages/*/src/hooks/use*Orchestrator.ts                   │
│ - useState, useEffect, useMemo, useCallback                │
│ - Combină pure utils                                       │
│ - URL sync, API calls, localStorage                        │
│ - Returnează API simplu pentru UI                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: UI COMPONENTS (Zero logică)                       │
│ apps/*/features/*/components/                              │
│ - Doar render (JSX)                                        │
│ - Props de la orchestrator                                 │
│ - Event handlers → orchestrator                            │
│ - Zero business logic                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 EXEMPLU COMPLET: Date Range Orchestrator

### **LAYER 1: Pure Utils**

```typescript
// packages/ui-dashboard/src/utils/dateRangePresets.ts

/**
 * Pure function - Zero side effects
 * Testabil cu Jest în 2 secunde
 */
export function getRangeFromPreset(preset: DatePreset): DateRange {
  const now = new Date();
  
  switch (preset) {
    case 'last_7_days':
      return {
        start: startOfDay(subtractDays(now, 6)),
        end: endOfDay(now),
      };
    // ... alte presets
  }
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
```

**✅ Caracteristici Layer 1:**
- ✅ Pure functions (input → output)
- ✅ Zero `useState`, `useEffect`
- ✅ Zero API calls
- ✅ Zero localStorage
- ✅ Testabil 100% (unit tests)
- ✅ Reutilizabil în orice context

---

### **LAYER 2: Orchestrator Hook**

```typescript
// packages/ui-dashboard/src/hooks/useDateRangeOrchestrator.ts

'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRangeFromPreset, startOfDay, endOfDay } from '../utils/dateRangePresets';

/**
 * ORCHESTRATOR - Centralizează TOATĂ logica de date filtering
 * 
 * Responsabilități:
 * 1. State management (preset, custom range)
 * 2. URL sync (share + refresh)
 * 3. Custom range memorat (nu se pierde)
 * 4. API params ready
 * 5. Normalizare (startOfDay, endOfDay)
 */
export function useDateRangeOrchestrator(defaultPreset: DatePreset = 'last_30_days') {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. STATE MANAGEMENT
  const lastCustomRef = useRef<DateRange | null>(null);
  const [preset, setPresetState] = useState<DatePreset>(() => {
    const urlPreset = searchParams.get('preset') as DatePreset | null;
    return urlPreset || defaultPreset;
  });
  const [customRange, setCustomRangeState] = useState<DateRange | null>(() => {
    const urlStart = searchParams.get('start');
    const urlEnd = searchParams.get('end');
    if (urlStart && urlEnd) {
      return {
        start: startOfDay(new Date(urlStart)),
        end: endOfDay(new Date(urlEnd)),
      };
    }
    return null;
  });
  
  // 2. EFFECTIVE RANGE (preset sau custom)
  const effectiveRange = useMemo(() => {
    if (preset === 'custom' && customRange) {
      lastCustomRef.current = customRange; // Memorează!
      return customRange;
    }
    return getRangeFromPreset(preset);
  }, [preset, customRange]);
  
  // 3. URL SYNC (share + refresh)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('preset', preset);
    params.set('start', effectiveRange.start.toISOString().split('T')[0] || '');
    params.set('end', effectiveRange.end.toISOString().split('T')[0] || '');
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [preset, effectiveRange, router]);
  
  // 4. SETTERS (restaurează custom când revii)
  const setPreset = useCallback((newPreset: DatePreset) => {
    if (newPreset === 'custom' && lastCustomRef.current) {
      setCustomRangeState(lastCustomRef.current); // Restaurează!
    }
    setPresetState(newPreset);
  }, []);
  
  const setCustomRange = useCallback((range: DateRange) => {
    const normalized = {
      ...range,
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    };
    setCustomRangeState(normalized);
    setPresetState('custom');
  }, []);
  
  // 5. API PARAMS (ready pentru fetch)
  const apiParams = useMemo(() => ({
    start_date: effectiveRange.start.toISOString().split('T')[0] || '',
    end_date: effectiveRange.end.toISOString().split('T')[0] || '',
  }), [effectiveRange]);
  
  // 6. RETURN API SIMPLU
  return {
    preset,
    effectiveRange,
    setPreset,
    setCustomRange,
    apiParams,
  };
}
```

**✅ Caracteristici Layer 2:**
- ✅ Combină pure utils (Layer 1)
- ✅ State management (useState)
- ✅ Side effects (useEffect pentru URL sync)
- ✅ Memoization (useMemo, useCallback)
- ✅ Persistență (useRef pentru custom range)
- ✅ API simplu (returnează doar ce trebuie UI-ului)
- ✅ <100 linii (readable)

---

### **LAYER 3: UI Component**

```typescript
// apps/admin/features/dashboard/components/DashboardPage.tsx

'use client';

import { useDateRangeOrchestrator } from '@vantage-lane/ui-dashboard';

export default function DashboardPage() {
  // ORCHESTRATOR - 1 linie → TOTUL funcționează!
  const { preset, effectiveRange, setPreset, setCustomRange, apiParams } = 
    useDateRangeOrchestrator('last_30_days');
  
  return (
    <div>
      {/* Tabs pentru presets */}
      <Tabs
        activeTab={preset}
        onChange={setPreset}
        tabs={DATE_PRESET_TABS}
      />
      
      {/* Custom range picker */}
      {preset === 'custom' && (
        <DateRangePicker 
          value={effectiveRange}
          onChange={setCustomRange}
        />
      )}
      
      {/* Metrics cu API params */}
      <DashboardMetrics
        startDate={apiParams.start_date}
        endDate={apiParams.end_date}
      />
    </div>
  );
}
```

**✅ Caracteristici Layer 3:**
- ✅ Zero business logic
- ✅ Doar render (JSX)
- ✅ Props de la orchestrator
- ✅ Event handlers → orchestrator
- ✅ Reutilizabil în Reports, Analytics, etc.

---

## 🎯 PATTERN-UL GENERAL (Template)

### **1. Pure Utils Template**

```typescript
// packages/*/src/utils/[feature]Utils.ts

/**
 * Pure function - [descriere]
 * 
 * @param input - [descriere]
 * @returns [descriere]
 * 
 * @example
 * calculate(10, 20) // 30
 */
export function calculate(a: number, b: number): number {
  return a + b; // Pure, deterministic
}

// ✅ Testabil:
// test('calculate adds numbers', () => {
//   expect(calculate(10, 20)).toBe(30);
// });
```

---

### **2. Orchestrator Hook Template**

```typescript
// packages/*/src/hooks/use[Feature]Orchestrator.ts

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

export interface Use[Feature]OrchestratorResult {
  // State
  state: State;
  
  // Actions
  action: (param: Type) => void;
  
  // Computed
  computed: ComputedType;
  
  // API ready
  apiParams: ApiParams;
}

/**
 * [Feature] Orchestrator
 * 
 * Responsabilități:
 * 1. [Responsabilitate 1]
 * 2. [Responsabilitate 2]
 * 3. [Responsabilitate 3]
 */
export function use[Feature]Orchestrator(
  defaultValue: Type
): Use[Feature]OrchestratorResult {
  // 1. STATE
  const [state, setState] = useState<State>(defaultValue);
  
  // 2. COMPUTED (useMemo)
  const computed = useMemo(() => {
    return calculateSomething(state);
  }, [state]);
  
  // 3. SIDE EFFECTS (useEffect)
  useEffect(() => {
    // URL sync, localStorage, etc.
  }, [state]);
  
  // 4. ACTIONS (useCallback)
  const action = useCallback((param: Type) => {
    setState(newState);
  }, []);
  
  // 5. API PARAMS
  const apiParams = useMemo(() => ({
    param1: state.value1,
    param2: state.value2,
  }), [state]);
  
  // 6. RETURN
  return {
    state,
    action,
    computed,
    apiParams,
  };
}
```

---

### **3. UI Component Template**

```typescript
// apps/*/features/*/components/[Feature]Page.tsx

'use client';

import { use[Feature]Orchestrator } from '@vantage-lane/ui-*';

export default function [Feature]Page() {
  // ORCHESTRATOR
  const { state, action, computed, apiParams } = 
    use[Feature]Orchestrator(defaultValue);
  
  return (
    <div>
      {/* UI folosește doar props de la orchestrator */}
      <Component
        value={state}
        onChange={action}
        computed={computed}
      />
      
      {/* API calls cu apiParams */}
      <DataComponent params={apiParams} />
    </div>
  );
}
```

---

## 📊 COMPARAȚIE: Fără vs Cu Orchestrator

### **❌ FĂRĂ ORCHESTRATOR (Logic duplicat)**

```typescript
// DashboardPage.tsx
const [preset, setPreset] = useState('last_30_days');
const [customRange, setCustomRange] = useState(null);
const range = preset === 'custom' ? customRange : getRangeFromPreset(preset);
// ... 50 linii de logică

// ReportsPage.tsx
const [preset, setPreset] = useState('this_month');
const [customRange, setCustomRange] = useState(null);
const range = preset === 'custom' ? customRange : getRangeFromPreset(preset);
// ... ACELEAȘI 50 linii duplicat!

// AnalyticsPage.tsx
const [preset, setPreset] = useState('this_year');
const [customRange, setCustomRange] = useState(null);
const range = preset === 'custom' ? customRange : getRangeFromPreset(preset);
// ... ACELEAȘI 50 linii duplicat!
```

**Probleme:**
- ❌ 150 linii duplicat (3 × 50)
- ❌ Bug fix → 3 locuri de modificat
- ❌ Feature nouă → 3 locuri de adăugat
- ❌ Greu de testat
- ❌ Inconsistență între pagini

---

### **✅ CU ORCHESTRATOR (Zero duplicat)**

```typescript
// DashboardPage.tsx
const { preset, effectiveRange, setPreset, apiParams } = 
  useDateRangeOrchestrator('last_30_days');

// ReportsPage.tsx
const { preset, effectiveRange, setPreset, apiParams } = 
  useDateRangeOrchestrator('this_month');

// AnalyticsPage.tsx
const { preset, effectiveRange, setPreset, apiParams } = 
  useDateRangeOrchestrator('this_year');
```

**Avantaje:**
- ✅ 3 linii total (vs 150 linii)
- ✅ Bug fix → 1 loc (orchestrator)
- ✅ Feature nouă → 1 loc
- ✅ Testabil (unit tests pentru orchestrator)
- ✅ Consistență 100%

---

## 🎯 CÂND CREEZI ORCHESTRATOR?

### **✅ CREEAZĂ orchestrator când:**

1. **Logică repetată** în 2+ pagini
2. **State complex** (multiple useState)
3. **Side effects** (URL sync, localStorage, API)
4. **Computed values** (useMemo, useCallback)
5. **Business logic** (nu doar UI)

### **❌ NU creează orchestrator când:**

1. **Logică simplă** (1 useState)
2. **UI-only** (doar render, zero business logic)
3. **Single use** (folosit într-un singur loc)
4. **Trivial** (toggle boolean, etc.)

---

## 📋 CHECKLIST ORCHESTRATOR

### **✅ Pure Utils (Layer 1)**
- [ ] Pure functions (input → output)
- [ ] Zero side effects
- [ ] Zero dependencies externe
- [ ] Testabil 100%
- [ ] <50 linii per funcție
- [ ] TypeScript strict

### **✅ Orchestrator Hook (Layer 2)**
- [ ] Combină pure utils
- [ ] State management (useState)
- [ ] Side effects (useEffect)
- [ ] Memoization (useMemo, useCallback)
- [ ] API simplu (return object)
- [ ] <100 linii total
- [ ] TypeScript strict
- [ ] Documented (JSDoc)

### **✅ UI Component (Layer 3)**
- [ ] Zero business logic
- [ ] Doar render (JSX)
- [ ] Props de la orchestrator
- [ ] Event handlers → orchestrator
- [ ] <200 linii
- [ ] TypeScript strict

---

## 🚀 EXEMPLE REALE ÎN PROIECT

### **1. Date Range Orchestrator** ✅
```
Layer 1: dateRangePresets.ts, datePeriods.ts
Layer 2: useDateRangeOrchestrator.ts
Layer 3: DashboardPage.tsx, ReportsPage.tsx, AnalyticsPage.tsx
```

### **2. Viitoare Orchestratoare (TODO)**

#### **Filters Orchestrator**
```typescript
// Layer 1: filterUtils.ts
export function buildFilters(status, operator, vehicle) { ... }

// Layer 2: useFiltersOrchestrator.ts
export function useFiltersOrchestrator() {
  // State: status, operator, vehicle, search
  // URL sync
  // API params ready
}

// Layer 3: BookingsPage.tsx, DriversPage.tsx
const { filters, setFilter, apiParams } = useFiltersOrchestrator();
```

#### **Pagination Orchestrator**
```typescript
// Layer 1: paginationUtils.ts
export function calculatePages(total, perPage) { ... }

// Layer 2: usePaginationOrchestrator.ts
export function usePaginationOrchestrator() {
  // State: page, perPage, total
  // URL sync
  // API params ready
}

// Layer 3: Orice tabel
const { page, setPage, totalPages, apiParams } = usePaginationOrchestrator();
```

#### **Sort Orchestrator**
```typescript
// Layer 1: sortUtils.ts
export function sortData(data, field, direction) { ... }

// Layer 2: useSortOrchestrator.ts
export function useSortOrchestrator() {
  // State: sortField, sortDirection
  // URL sync
  // API params ready
}

// Layer 3: Orice tabel
const { sortField, sortDirection, setSort, apiParams } = useSortOrchestrator();
```

---

## 🎯 GOLDEN RULES

1. **Pure Utils = Zero Side Effects**
   - Input → Output (deterministic)
   - Testabil 100%

2. **Orchestrator = State + Side Effects**
   - Combină pure utils
   - URL sync, localStorage, API
   - <100 linii

3. **UI = Zero Business Logic**
   - Doar render
   - Props de la orchestrator
   - Event handlers → orchestrator

4. **1 Orchestrator = N Pagini**
   - Reutilizabil în Dashboard, Reports, Analytics
   - Bug fix → 1 loc
   - Feature nouă → 1 loc

5. **TypeScript Strict**
   - Zero `any`
   - Interfaces pentru toate
   - JSDoc pentru funcții publice

---

## 📚 RESURSE

- **React Hooks Best Practices**: https://react.dev/reference/react
- **Custom Hooks Pattern**: https://react.dev/learn/reusing-logic-with-custom-hooks
- **Pure Functions**: https://en.wikipedia.org/wiki/Pure_function
- **Separation of Concerns**: https://en.wikipedia.org/wiki/Separation_of_concerns

---

**Acest pattern este STANDARD pentru TOATE componentele reutilizabile în proiect!** 🚀
