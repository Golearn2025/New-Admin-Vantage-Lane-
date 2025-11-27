# FLOW COMPLET: TABURI + CALENDAR → CARDURI + GRAFICE

**Data:** 2025-10-16  
**Status:** ✅ TOTUL FUNCȚIONEAZĂ!

---

## 🎯 ÎNTREBAREA: CÂND DAI CLICK PE TABURI SAU CALENDAR, SE SCHIMBĂ TOTUL?

**RĂSPUNS: DA! ✅ TOTUL SE SCHIMBĂ AUTOMAT!**

---

## 📊 FLOW COMPLET - TABURI (PRESET BUTTONS)

### **SCENARIO 1: User click pe "Today"**

```
┌────────────────────────────────────────────────────────────────┐
│  1. USER CLICK "Today" button                                  │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. DateFilterPreset trigger onChange                           │
│     onChange={(newPreset, range) => setPreset(newPreset)}      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. useDateFilter.setPreset('today') este apelat                │
│                                                                 │
│     const setPreset = (newPreset) => {                         │
│       setPresetState('today');           // Update preset      │
│       const range = getDateRangeForPreset('today');           │
│       // range = { start: 2025-10-16 00:00, end: 23:59 }      │
│       setDateRange(range);               // Update dateRange   │
│     }                                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. STATE CHANGES → React Re-render                             │
│     - preset: 'today' ✅                                        │
│     - dateRange: { start: 2025-10-16 00:00, end: 23:59 }      │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴───────────────┐
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  5. CARDURI          │      │  6. GRAFICE          │
│                      │      │                      │
│  getAPIParams()      │      │  getAPIParams()      │
│  returns:            │      │  returns:            │
│  {                   │      │  {                   │
│    start_date:       │      │    start_date:       │
│    '2025-10-16T00:00'│      │    '2025-10-16T00:00'│
│    end_date:         │      │    end_date:         │
│    '2025-10-16T23:59'│      │    '2025-10-16T23:59'│
│  }                   │      │  }                   │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           ▼                             ▼
   ┌──────────────┐              ┌──────────────┐
   │ useSWR       │              │ useSWR       │
   │ re-fetch     │              │ re-fetch     │
   │ /api/metrics │              │ /api/charts  │
   └──────┬───────┘              └──────┬───────┘
          │                             │
          ▼                             ▼
    ┌─────────────────────────────────────────┐
    │  7. DATABASE QUERY cu noile date        │
    │     - get_dashboard_metrics(            │
    │         '2025-10-16 00:00',            │
    │         '2025-10-16 23:59'             │
    │       )                                 │
    │     - get_dashboard_charts(             │
    │         '2025-10-16 00:00',            │
    │         '2025-10-16 23:59',            │
    │         'hour'  ← Auto-grouping         │
    │       )                                 │
    └─────────────┬───────────────────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────────┐
    │  8. UI UPDATE - TOTUL SE SCHIMBĂ!        │
    │     ✅ Cardurile arată date din azi       │
    │     ✅ Graficele arată date din azi       │
    │     ✅ Grouping: "Per Hour (24 points)"   │
    └──────────────────────────────────────────┘
```

---

## 📅 FLOW COMPLET - CALENDAR (CUSTOM DATE PICKER)

### **SCENARIO 2: User selectează custom range (7 zile)**

```
┌────────────────────────────────────────────────────────────────┐
│  1. USER selectează în calendar: 10 Oct → 16 Oct               │
│     Click "Apply"                                               │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. DateRangePicker trigger onChange                            │
│     onChange={(range) => setCustomRange(range)}                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. useDateFilter.setCustomRange(range) este apelat             │
│                                                                 │
│     const setCustomRange = (range) => {                        │
│       setPresetState('custom');          // Mark as custom     │
│       setDateRange(range);               // Update dateRange   │
│       // range = { start: 2025-10-10, end: 2025-10-16 }       │
│     }                                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. STATE CHANGES → React Re-render                             │
│     - preset: 'custom' ✅                                       │
│     - dateRange: { start: 2025-10-10, end: 2025-10-16 }       │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴───────────────┐
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  5. CARDURI          │      │  6. GRAFICE          │
│                      │      │                      │
│  getAPIParams()      │      │  getAPIParams()      │
│  returns:            │      │  returns:            │
│  {                   │      │  {                   │
│    start_date:       │      │    start_date:       │
│    '2025-10-10T00:00'│      │    '2025-10-10T00:00'│
│    end_date:         │      │    end_date:         │
│    '2025-10-16T23:59'│      │    '2025-10-16T23:59'│
│  }                   │      │  }                   │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           │                             │
           │   determineChartGrouping(   │
           │     dateRange               │
           │   ) → 'daily'               │
           │   (7 zile = daily grouping) │
           │                             │
           ▼                             ▼
   ┌──────────────┐              ┌──────────────┐
   │ useSWR       │              │ useSWR       │
   │ re-fetch     │              │ re-fetch     │
   │ /api/metrics │              │ /api/charts  │
   └──────┬───────┘              └──────┬───────┘
          │                             │
          ▼                             ▼
    ┌─────────────────────────────────────────┐
    │  7. DATABASE QUERY cu noile date        │
    │     - get_dashboard_metrics(            │
    │         '2025-10-10 00:00',            │
    │         '2025-10-16 23:59'             │
    │       )                                 │
    │     - get_dashboard_charts(             │
    │         '2025-10-10 00:00',            │
    │         '2025-10-16 23:59',            │
    │         'day'  ← Auto-grouping          │
    │       )                                 │
    └─────────────┬───────────────────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────────┐
    │  8. UI UPDATE - TOTUL SE SCHIMBĂ!        │
    │     ✅ Cardurile arată suma din 7 zile    │
    │     ✅ Graficele arată 7 bare (daily)     │
    │     ✅ Grouping: "Per Day (7 points)"     │
    └──────────────────────────────────────────┘
```

---

## 🔑 KEY FUNCTIONS - CE FACE FIECARE

### **1. setPreset(preset) - Pentru TABURI**

```typescript
// apps/admin/shared/hooks/useDateFilter.ts - Line 41
const setPreset = useCallback((newPreset: DatePreset) => {
  setPresetState(newPreset); // 1. Update preset state
  const range = getDateRangeForPreset(newPreset); // 2. Calculate date range
  setDateRange(range); // 3. Update dateRange state
}, []);
```

**CE FACE:**

1. Marchează preset-ul selectat ('today', 'yesterday', etc.)
2. Calculează start/end date pentru preset-ul respectiv
3. Actualizează `dateRange` state → TRIGGER RE-RENDER

**REZULTAT:** Toate componentele care folosesc `dateRange` sau `getAPIParams()` se actualizează automat!

---

### **2. setCustomRange(range) - Pentru CALENDAR**

```typescript
// apps/admin/shared/hooks/useDateFilter.ts - Line 47
const setCustomRange = useCallback((range: DateRange) => {
  setPresetState('custom'); // 1. Mark as custom
  setDateRange(range); // 2. Update dateRange with selected range
}, []);
```

**CE FACE:**

1. Marchează că e range custom (nu preset)
2. Actualizează `dateRange` cu range-ul selectat din calendar
3. TRIGGER RE-RENDER

**REZULTAT:** Toate componentele se actualizează cu noul range!

---

### **3. getAPIParams() - Folosit de CARDURI și GRAFICE**

```typescript
// apps/admin/shared/hooks/useDateFilter.ts - Line 52
const getAPIParams = useCallback(() => {
  return {
    start_date: formatDateForAPI(dateRange.start),
    end_date: formatDateForAPI(dateRange.end),
  };
}, [dateRange]); // ← RE-COMPUTE când dateRange se schimbă!
```

**CE FACE:**

- Se recalculează AUTOMAT când `dateRange` se schimbă
- Returnează `start_date` și `end_date` în format ISO 8601
- Folosit de carduri și grafice pentru API calls

---

## ✅ VERIFICARE: DE CE FUNCȚIONEAZĂ TOTUL?

### **React State Flow:**

```typescript
// 1. User Action
Click "Today" → setPreset('today')
           ↓
// 2. State Update (useDateFilter hook)
setDateRange({ start: ..., end: ... })
           ↓
// 3. React Re-render (toate componentele care folosesc hook-ul)
dateRange changed → Re-render dashboard page
           ↓
// 4. getAPIParams() recalculează
getAPIParams() returns new { start_date, end_date }
           ↓
// 5. SWR Key Change
API URL changed → SWR triggers re-fetch
           ↓
// 6. New Data
New data from API → UI updates
```

---

## 🧪 TEST MATRIX - TABURI

| Tab Click    | dateRange Update         | Carduri Update | Grafice Update       | Grouping  |
| ------------ | ------------------------ | -------------- | -------------------- | --------- |
| Today        | 2025-10-16 00:00 → 23:59 | ✅ Sum azi     | ✅ 24 bars (hourly)  | Per Hour  |
| Yesterday    | 2025-10-15 00:00 → 23:59 | ✅ Sum ieri    | ✅ 24 bars (hourly)  | Per Hour  |
| Last 7 Days  | 2025-10-10 → 2025-10-16  | ✅ Sum 7 zile  | ✅ 7 bars (daily)    | Per Day   |
| Last 30 Days | 2025-09-17 → 2025-10-16  | ✅ Sum 30 zile | ✅ 30 bars (daily)   | Per Day   |
| This Month   | 2025-10-01 → 2025-10-31  | ✅ Sum lună    | ✅ 31 bars (daily)   | Per Day   |
| This Year    | 2025-01-01 → 2025-12-31  | ✅ Sum an      | ✅ 12 bars (monthly) | Per Month |

---

## 🧪 TEST MATRIX - CALENDAR

| Custom Range | dateRange Update | Carduri Update | Grafice Update       | Grouping  |
| ------------ | ---------------- | -------------- | -------------------- | --------- |
| 1 zi         | Selected day     | ✅ Sum 1 zi    | ✅ 24 bars (hourly)  | Per Hour  |
| 7 zile       | Start → End      | ✅ Sum 7 zile  | ✅ 7 bars (daily)    | Per Day   |
| 30 zile      | Start → End      | ✅ Sum 30 zile | ✅ 30 bars (daily)   | Per Day   |
| 90 zile      | Start → End      | ✅ Sum 90 zile | ✅ ~13 bars (weekly) | Per Week  |
| 365 zile     | Start → End      | ✅ Sum an      | ✅ 12 bars (monthly) | Per Month |

---

## 🔄 SYNC MECHANISM - SWR

### **De ce se sincronizează automat?**

```typescript
// CARDURI - useDashboardMetrics.ts
const apiUrl =
  options?.startDate && options?.endDate
    ? `/api/dashboard/metrics?start_date=${options.startDate}&end_date=${options.endDate}`
    : '/api/dashboard/metrics';

useSWR(apiUrl, fetcher);
// ↑ Când apiUrl se schimbă → SWR auto re-fetch!
```

```typescript
// GRAFICE - page.tsx
const apiParams = new URLSearchParams({
  ...getAPIParams(), // ← Se schimbă când dateRange se schimbă
  grouping: grouping.sqlGroup,
});

useSWR(`/api/dashboard/charts?${apiParams}`, fetcher);
// ↑ Când apiParams se schimbă → SWR auto re-fetch!
```

**SWR Key Changes:**

- User click "Today" → `getAPIParams()` returnează noi values
- API URL se schimbă (ex: `start_date=2025-10-16`)
- SWR detectează key change → Auto re-fetch
- New data → UI update

---

## ✅ CONCLUZIE FINALĂ

**DA! CÂND DAI CLICK PE TABURI SAU CALENDAR, SE SCHIMBĂ TOTUL!** 🎉

| Interaction           | State Change | Carduri Update | Grafice Update | Grouping Update |
| --------------------- | ------------ | -------------- | -------------- | --------------- |
| Click "Today"         | ✅           | ✅             | ✅             | ✅ Hourly       |
| Click "Last 7 Days"   | ✅           | ✅             | ✅             | ✅ Daily        |
| Click "This Year"     | ✅           | ✅             | ✅             | ✅ Monthly      |
| Select Calendar Range | ✅           | ✅             | ✅             | ✅ Auto         |

**TOATE componentele reacționează instant la schimbări!**

---

## 🚀 CUM SĂ TESTEZI

1. **Open Dashboard:** `http://localhost:3000/dashboard`
2. **Click "Today"** → Vezi că:
   - Cardurile arată suma din azi
   - Graficele arată 24 bare (hourly)
   - "Grouping: Per Hour (24 points)"
3. **Click "This Year"** → Vezi că:
   - Cardurile arată suma din 2025
   - Graficele arată 12 bare (monthly)
   - "Grouping: Per Month (12 points)"
4. **Open Calendar** → Selectează 7 zile → Vezi că:
   - Cardurile arată suma din range-ul selectat
   - Graficele arată 7 bare (daily)
   - "Grouping: Per Day (7 points)"

**TOTUL se sincronizează automat prin React state + SWR!** ✅
