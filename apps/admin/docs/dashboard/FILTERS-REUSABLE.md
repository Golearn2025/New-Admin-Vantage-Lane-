# Date Filters - 100% REUSABLE Documentation

## 📦 Ce Am Creat (PHASE 2 - COMPLEX)

Toate componentele de filtrare sunt **100% REUTILIZABILE** și pot fi folosite în **ORICE proiect viitor**.

---

## 📁 Structura Fișierelor

### 1. **În `packages/ui-dashboard` (REUTILIZABIL GLOBAL)**

```
packages/ui-dashboard/src/
├── filters/
│   ├── DateRangePicker/
│   │   ├── DateRangePicker.tsx           ← Calendar dark theme
│   │   └── DateRangePicker.module.css    ← Stiluri dark
│   ├── DateFilterPreset/
│   │   ├── DateFilterPreset.tsx          ← Preset buttons
│   │   └── DateFilterPreset.module.css   ← Stiluri dark
│   └── index.ts                          ← Exports
├── utils/
│   ├── dateUtils.ts                      ← 20+ funcții pure
│   └── index.ts                          ← Exports
└── index.ts                              ← Main export
```

**Caracteristici:**

- ✅ ZERO dependencies pe app-specific logic
- ✅ Poate fi folosit în ORICE proiect
- ✅ TypeScript strict
- ✅ Dark theme by default
- ✅ Accessible (ARIA, keyboard navigation)
- ✅ Tree-shakeable

---

### 2. **În `apps/admin/shared` (BUSINESS LOGIC)**

```
apps/admin/shared/
├── hooks/
│   └── useDateFilter.ts                  ← State management
└── utils/
    └── chartGrouping.ts                  ← Auto-grouping logic
```

**Caracteristici:**

- ✅ Hook pentru state management
- ✅ Smart auto-grouping (daily → monthly → quarterly)
- ✅ Follows industry best practices (Google Analytics, Stripe)

---

## 🔧 Cum Se Folosește (IMPORT EXAMPLES)

### **Exemplu 1: Import în alt proiect viitor**

```typescript
// În ORICE proiect (nu doar admin)
import {
  DateRangePicker,
  DateFilterPreset,
  getDateRangeForPreset,
  formatDateForDisplay,
  differenceInDays,
  type DateRange,
  type DatePreset,
} from '@vantage-lane/ui-dashboard';

// Gata! Funcționează instant!
```

---

### **Exemplu 2: Folosire în Dashboard**

```typescript
// În app/(admin)/dashboard/page.tsx
import { DateFilterPreset, DateRangePicker } from '@vantage-lane/ui-dashboard';
import { useDateFilter } from '@admin/shared/hooks/useDateFilter';
import { determineChartGrouping } from '@admin/shared/utils/chartGrouping';

export default function DashboardPage() {
  const { dateRange, preset, setPreset, setCustomRange, getAPIParams } = useDateFilter('this_month');

  // Fetch data with date range
  const { data } = useSWR(
    `/api/dashboard/metrics?${new URLSearchParams(getAPIParams())}`,
    fetcher
  );

  // Determine chart grouping
  const grouping = determineChartGrouping(dateRange);

  return (
    <div>
      {/* Preset buttons */}
      <DateFilterPreset
        value={preset}
        onChange={(preset, range) => setPreset(preset)}
        presets={['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month']}
      />

      {/* Calendar picker */}
      <DateRangePicker
        value={dateRange}
        onChange={(range) => setCustomRange(range)}
      />

      {/* Your charts using filtered data */}
      <LineChart data={data.revenue_trend} grouping={grouping.label} />
    </div>
  );
}
```

---

## 🎨 Componente Disponibile

### **1. DateFilterPreset**

Quick select buttons pentru perioade comune.

```typescript
<DateFilterPreset
  value="this_month"
  onChange={(preset, dateRange) => {
    console.log('Selected:', preset, dateRange);
  }}
  presets={['today', 'yesterday', 'last_7_days', 'this_month']}
  variant="default" // sau "compact", "pills"
  showCustom={true}
/>
```

**Props:**

- `value`: DatePreset - Selected preset
- `onChange`: (preset, dateRange) => void
- `presets`: DatePreset[] - Available presets
- `variant`: 'default' | 'compact' | 'pills'
- `showCustom`: boolean - Show "Custom" button
- `labels`: Custom labels for presets

---

### **2. DateRangePicker**

Calendar picker pentru custom date ranges.

```typescript
<DateRangePicker
  value={dateRange}
  onChange={(dateRange) => {
    console.log('Selected range:', dateRange);
  }}
  minDate={new Date(2020, 0, 1)}
  maxDate={new Date()}
  placeholder="Select date range"
/>
```

**Props:**

- `value`: DateRange - Current date range
- `onChange`: (dateRange) => void
- `minDate`: Date - Minimum allowed date
- `maxDate`: Date - Maximum allowed date
- `showTime`: boolean - Show time picker
- `placeholder`: string

---

## 🛠️ Utils Disponibile

### **dateUtils.ts** (20+ funcții)

```typescript
import {
  getDateRangeForPreset,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subtractDays,
  differenceInDays,
  formatDateForAPI,
  formatDateForDisplay,
  getPreviousPeriod,
} from '@vantage-lane/ui-dashboard';

// Examples:
const today = getDateRangeForPreset('today');
// { start: Date, end: Date, label: 'Today' }

const days = differenceInDays(new Date(), new Date(2024, 0, 1));
// 289 days

const formatted = formatDateForDisplay(new Date());
// "16/10/2024"

const apiDate = formatDateForAPI(new Date());
// "2024-10-16T00:00:00.000Z"
```

---

### **chartGrouping.ts** (Smart auto-grouping)

```typescript
import {
  determineChartGrouping,
  getSQLGroupingClause,
  formatXAxisLabel,
  getRecommendedChartType,
} from '@admin/shared/utils/chartGrouping';

// Auto-determine grouping
const dateRange = getDateRangeForPreset('this_year');
const grouping = determineChartGrouping(dateRange);
// { grouping: 'monthly', expectedPoints: 12, label: 'Per Month' }

// Get SQL clause
const sql = getSQLGroupingClause('monthly', 'created_at');
// "DATE_TRUNC('month', created_at)"

// Format x-axis label
const label = formatXAxisLabel(new Date(), 'monthly');
// "Oct 2024"
```

---

## 📊 Auto-Grouping Logic (BEST PRACTICES)

| Date Range      | Auto Grouping | Expected Points | Example                  |
| --------------- | ------------- | --------------- | ------------------------ |
| Today/Yesterday | Hourly        | 24 points       | 00:00, 01:00, ..., 23:00 |
| Last 7 days     | Daily         | 7 points        | Mon, Tue, ..., Sun       |
| Last 30 days    | Daily         | 30 points       | 1, 2, 3, ..., 30         |
| Last 90 days    | Weekly        | ~13 points      | Week 1, Week 2, ...      |
| Last 365 days   | Monthly       | 12 points       | Jan, Feb, ..., Dec       |
| Last 2 years    | Monthly       | 24 points       | Jan'23, Feb'23, ...      |
| 2+ years        | Quarterly     | 8+ points       | Q1'22, Q2'22, ...        |
| 5+ years        | Yearly        | N points        | 2020, 2021, ...          |

**Follows industry standards from:**

- Google Analytics
- Stripe Dashboard
- Shopify Analytics
- ChartMogul
- Mixpanel

---

## 🔄 State Management Hook

### **useDateFilter()**

```typescript
import { useDateFilter } from '@admin/shared/hooks/useDateFilter';

function MyDashboard() {
  const {
    dateRange, // Current DateRange
    preset, // Current DatePreset
    setPreset, // Set by preset
    setCustomRange, // Set custom range
    getAPIParams, // Get { start_date, end_date } for API
    reset, // Reset to default
  } = useDateFilter('this_month');

  // Use in API calls
  const params = getAPIParams();
  // { start_date: "2024-10-01T00:00:00Z", end_date: "2024-10-31T23:59:59Z" }
}
```

---

## 🎯 DatePreset Types

```typescript
type DatePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_365_days'
  | 'all_time'
  | 'custom';
```

---

## 🚀 Next Steps

1. ✅ **DONE**: Create reusable components
2. ⏳ **NEXT**: Update DB function with date parameters
3. ⏳ **NEXT**: Update API routes with query params
4. ⏳ **NEXT**: Integrate filters in dashboard page
5. ⏳ **FUTURE**: Add "Compare to previous period"

---

## ✨ Features

- ✅ **100% Reusable** - Use in ANY project
- ✅ **Zero Config** - Works out of the box
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Dark Theme** - Beautiful dark UI
- ✅ **Accessible** - ARIA labels, keyboard nav
- ✅ **Smart** - Auto-grouping based on date range
- ✅ **Industry Standard** - Follows best practices
- ✅ **Performant** - Tree-shakeable, optimized
- ✅ **Well Documented** - Clear examples

---

## 📚 Import Paths Summary

```typescript
// UI Components & Utils (100% REUSABLE)
from '@vantage-lane/ui-dashboard':
  - DateRangePicker
  - DateFilterPreset
  - getDateRangeForPreset()
  - formatDateForDisplay()
  - differenceInDays()
  - ...toate funcțiile din dateUtils

// Business Logic (App-specific)
from '@admin/shared/hooks/useDateFilter':
  - useDateFilter()

from '@admin/shared/utils/chartGrouping':
  - determineChartGrouping()
  - getSQLGroupingClause()
  - formatXAxisLabel()
```

---

**🎉 TOTUL ESTE 100% REUTILIZABIL!**

Poți copia `packages/ui-dashboard/src/filters` și `packages/ui-dashboard/src/utils/dateUtils.ts` în ORICE proiect viitor și funcționează instant!
