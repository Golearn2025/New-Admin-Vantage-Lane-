# 🔍 **UI EXPANDED ROW - AUDIT COMPLET**

**Date:** 2025-10-22  
**Status:** ❌ **COMPONENTĂ CREATĂ DAR FĂRĂ DATE!**

---

## **🎯 PROBLEMA PRINCIPALĂ:**

### **BookingExpandedRow.tsx:**
```typescript
✅ Component EXISTĂ (205 lines)
✅ Acceptă 13 props pentru toate datele
✅ Layout premium cu 3 coloane + assignment
✅ Reusable components (InfoSection, AssignmentSection, TabPanel)
✅ 100% Design Tokens în CSS
```

### **BookingsTable.tsx:**
```typescript
❌ Pasează DOAR 1 prop din 13!

// LINE 181 - PROBLEMA:
renderExpandedRow={(booking) => <BookingExpandedRow booking={booking} />}

// AR TREBUI:
renderExpandedRow={(booking) => (
  <BookingExpandedRow 
    booking={booking}
    freeServices={booking.free_services}          // ❌ NU există
    customerNotes={booking.notes}                 // ❌ NU există
    operatorName={booking.operator_name}          // ❌ HARDCODED
    operatorRating={booking.operator_rating}      // ❌ NU există
    operatorReviews={booking.operator_reviews}    // ❌ NU există
    returnDate={booking.return_date}              // ✅ Există
    returnTime={booking.return_time}              // ✅ Există
    returnFlight={booking.return_flight_number}   // ❌ NU există
    driverDetails={...}                           // ❌ NU există
    vehicleDetails={...}                          // ❌ NU există
    assignedAt={booking.assigned_at}              // ❌ NU există
    assignedBy={booking.assigned_by_name}         // ❌ NU există
  />
)}
```

---

## **📊 STATUS PROPS - BookingExpandedRow:**

| Prop | Type | UI Usage | Data Source | Status |
|------|------|----------|-------------|--------|
| `booking` | BookingListItem | Base data | ✅ Passed | ✅ |
| `freeServices` | string[] | Included Services card | booking_services (unit_price=0) | ❌ **NOT PASSED** |
| `customerNotes` | string | Customer Notes card | bookings.notes | ❌ **NOT PASSED** |
| `operatorName` | string | Operator card | organizations.name | ❌ **NOT PASSED** |
| `operatorRating` | number | Operator rating | organizations.rating_average | ❌ **NOT PASSED** |
| `operatorReviews` | number | Operator reviews | organizations.review_count | ❌ **NOT PASSED** |
| `returnDate` | string | Return Journey | bookings.return_date | ❌ **NOT PASSED** |
| `returnTime` | string | Return Journey | bookings.return_time | ❌ **NOT PASSED** |
| `returnFlight` | string | Return Journey | bookings.return_flight_number | ❌ **NOT PASSED** |
| `driverDetails` | DriverDetails | Driver tab | drivers.* | ❌ **NOT PASSED** |
| `vehicleDetails` | VehicleDetails | Vehicle tab | vehicles.* | ❌ **NOT PASSED** |
| `assignedAt` | string | Assignment metadata | booking_assignment.assigned_at | ❌ **NOT PASSED** |
| `assignedBy` | string | Assignment metadata | admin_users.name | ❌ **NOT PASSED** |

**TOTAL:** 1/13 props passed (8%) ❌

---

## **🔍 COMPONENTE REUSABLE - VERIFICARE RULES.md:**

### **✅ InfoSection.tsx (COMPLIANT)**

```typescript
Location: apps/admin/features/bookings-table/components/expanded/InfoSection.tsx
Lines: 71 (< 200 ✅)
Props: title, icon, children, variant, actions, collapsible
Reusability: ✅ Generic, no booking-specific logic
Design Tokens: ✅ 100% var(--*) în CSS
TypeScript: ✅ Strict mode, no any
```

**Usage:**
```tsx
<InfoSection title="Return Journey" icon="🔄" variant="default">
  {children}
</InfoSection>
```

**Variants:** default, compact, highlight, bordered

### **✅ TabPanel.tsx (COMPLIANT)**

```typescript
Location: apps/admin/features/bookings-table/components/expanded/TabPanel.tsx
Lines: 115 (< 200 ✅)
Props: tabs[], defaultTab, onChange, variant, size
Reusability: ✅ Generic tabbed interface
Design Tokens: ✅ 100% var(--*) în CSS
TypeScript: ✅ Strict mode, no any
Accessibility: ✅ ARIA labels, keyboard navigation
```

**Usage:**
```tsx
<TabPanel
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'driver', label: 'Driver', content: <Driver /> }
  ]}
  variant="default"
  size="md"
/>
```

**Variants:** default, pills, underline  
**Sizes:** sm, md, lg

### **✅ AssignmentSection.tsx (DOMAIN-SPECIFIC)**

```typescript
Location: apps/admin/features/bookings-table/components/expanded/AssignmentSection.tsx
Lines: 195 (< 200 ✅)
Props: driverId, vehicleId, driverDetails, vehicleDetails, assignedAt, assignedBy
Reusability: ⚠️ Booking-specific (acceptable for features/)
Design Tokens: ✅ 100% var(--*) în CSS
TypeScript: ✅ Strict mode, no any
Uses: TabPanel (reusable ✅)
```

**Internal Tabs:**
1. Overview (driver + vehicle summary)
2. Driver Details (full profile)
3. Vehicle Details (full specs)

**States:**
- Pending (not assigned) → "Assign Driver" button
- Assigned → Full details with actions

---

## **🎨 CSS TOKENS - VERIFICARE RULES.md:**

### **❌ PROBLEME GĂSITE:**

Deși componentele noi (InfoSection, TabPanel, AssignmentSection) folosesc 100% tokens, **BookingExpandedRow.module.css** și alte fișiere vechi au **hardcodări**!

#### **BookingExpandedRow.module.css (VIOLATIONS):**

```css
/* LINE 14 */
border-top: 2px solid var(--color-border-primary);  // ❌ 2px hardcoded

/* LINE 44 */
border-bottom: 1px solid var(--color-border-secondary);  // ❌ 1px hardcoded

/* LINE 108 */
border-left: 3px solid var(--color-primary);  // ❌ 3px hardcoded

/* LINE 138 */
border-left: 3px solid var(--color-primary);  // ❌ 3px hardcoded

/* LINE 152-158 */
@media (max-width: 1200px) { ... }  // ❌ Hardcoded breakpoint
@media (max-width: 768px) { ... }   // ❌ Hardcoded breakpoint
```

**TOTAL VIOLATIONS:** 7 în BookingExpandedRow.module.css

#### **columns/columns.module.css (MAJOR VIOLATIONS):**

```css
32 hardcoded values:
- border: 1px, 2px solid
- max-width: 150px, min-width: 80px, 100px
- rgba(255, 255, 255, 0.95)
- box-shadow: 0 2px 4px rgba(...)
- text-shadow: 0 1px 2px rgba(...)
- @media (max-width: 768px)
```

#### **expanded/ components (CLEAN!):**

```css
✅ InfoSection.module.css: 100% tokens
✅ TabPanel.module.css: 100% tokens  
✅ AssignmentSection.module.css: 100% tokens
```

**VERDICT:**
- ✅ New components: COMPLIANT
- ❌ Old components: VIOLATIONS (63 total across all files)

---

## **📐 ARCHITECTURE - VERIFICARE RULES.md:**

### **✅ FOLDER STRUCTURE (COMPLIANT):**

```
apps/admin/features/bookings-table/
├── columns/                      ✅ UI logic
│   ├── cells.tsx
│   ├── cells-details.tsx
│   └── actions.tsx
├── components/                   ✅ UI components
│   ├── BookingsTable.tsx
│   ├── BookingExpandedRow.tsx
│   └── expanded/                 ✅ Sub-components
│       ├── InfoSection.tsx       ✅ Reusable
│       ├── TabPanel.tsx          ✅ Reusable
│       ├── AssignmentSection.tsx ✅ Domain-specific
│       └── index.ts              ✅ Barrel export
├── hooks/                        ✅ Data fetching
│   └── useBookingsList.ts
└── utils/                        ✅ Helpers
    └── bookingHelpers.ts

✅ NO logic in app/ folder
✅ NO entities → features imports
✅ Clean separation: UI (features) vs Logic (entities)
```

### **✅ IMPORTS (COMPLIANT):**

```typescript
// BookingExpandedRow.tsx
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';  ✅
import { InfoSection, AssignmentSection } from './expanded';  ✅

// BookingsTable.tsx
import { DataTable } from '@vantage-lane/ui-core';  ✅
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';  ✅
import { useBookingsList } from '../hooks/useBookingsList';  ✅

❌ NO forbidden imports found
```

---

## **🔧 CE FUNCȚIONEAZĂ:**

1. ✅ **Componentă BookingExpandedRow creată** (205 lines, compliant)
2. ✅ **Layout premium** (3-column grid + full-width assignment)
3. ✅ **Reusable components** (InfoSection, TabPanel, AssignmentSection)
4. ✅ **Design tokens în componente noi** (100%)
5. ✅ **TypeScript strict** (no any, complete types)
6. ✅ **Architecture corectă** (features/bookings-table structure)
7. ✅ **Barrel exports** (expanded/index.ts)
8. ✅ **Props interface definită** (13 props cu tipuri complete)

---

## **❌ CE NU FUNCȚIONEAZĂ:**

### **1. DATE LIPSĂ** ❌ CRITICAL

```typescript
// BookingsTable.tsx LINE 181
<BookingExpandedRow booking={booking} />

// Missing 12 props! UI shows:
- ❌ Empty "Included Services" (freeServices not passed)
- ❌ Empty "Customer Notes" (customerNotes not passed)
- ❌ Empty "Operator" section (operator* not passed)
- ❌ Empty "Return Journey" (return* not passed)
- ❌ Empty "Driver Details" tab (driverDetails not passed)
- ❌ Empty "Vehicle Details" tab (vehicleDetails not passed)
- ❌ Empty assignment metadata (assignedAt/By not passed)
```

### **2. API NU RETURNEAZĂ DATE** ❌ CRITICAL

```typescript
// /api/bookings/list response LIPSĂ:
- free_services[] (filtered out by unit_price > 0)
- operator_name, operator_rating, operator_reviews (not fetched)
- return_flight_number (not in BookingListItem)
- assigned_at, assigned_by_name (not fetched)
- driver_details (not fetched)
- vehicle_details (not fetched)
```

### **3. CSS HARDCODĂRI** ❌ MEDIUM

```
63 violations across:
- BookingExpandedRow.module.css (7)
- columns/columns.module.css (32)
- Other CSS files (24)

Need to replace:
- 1px, 2px, 3px → var(--border-width-*)
- max-width: 150px → var(--size-*)
- rgba() colors → var(--color-*)
- @media (max-width: 768px) → var(--breakpoint-md)
```

### **4. DUPLICATE FIELDS** 🔁 LOW

```
7 fields duplicated în expanded:
- Route: pickup, destination, distance, duration (already in main row)
- Details: flight_number, passengers, bags (already in main row)
```

---

## **🎯 FIX PLAN - 3 STEPS:**

### **STEP 1: Extend BookingListItem Interface** (5 min)

```typescript
// apps/admin/shared/api/contracts/bookings.ts

export interface BookingListItem {
  // ... existing fields ...
  
  // ADD MISSING:
  notes: string | null;                    // customer notes
  return_flight_number: string | null;     // return flight
  
  operator_name: string | null;            // real org name
  operator_rating: number | null;          // org rating
  operator_reviews: number | null;         // org reviews count
  
  free_services: string[];                 // FREE services codes
  
  assigned_at: string | null;              // assignment timestamp
  assigned_by_name: string | null;         // admin who assigned
  
  driver_phone: string | null;             // driver contact
  driver_email: string | null;
  driver_rating: number | null;
  
  vehicle_make: string | null;             // vehicle specs
  vehicle_model: string | null;
  vehicle_color: string | null;
  vehicle_plate: string | null;
}
```

### **STEP 2: Update BookingsTable to Pass Props** (10 min)

```typescript
// apps/admin/features/bookings-table/components/BookingsTable.tsx

// LINE 181 - REPLACE:
renderExpandedRow={(booking) => (
  <BookingExpandedRow 
    booking={booking}
    freeServices={booking.free_services || []}
    customerNotes={booking.notes || undefined}
    operatorName={booking.operator_name || undefined}
    operatorRating={booking.operator_rating || undefined}
    operatorReviews={booking.operator_reviews || undefined}
    returnDate={booking.return_date || undefined}
    returnTime={booking.return_time || undefined}
    returnFlight={booking.return_flight_number || undefined}
    driverDetails={booking.driver_phone ? {
      name: booking.customer_name, // ← WRONG! Need driver_name
      phone: booking.driver_phone,
      email: booking.driver_email,
      rating: booking.driver_rating,
    } : undefined}
    vehicleDetails={booking.vehicle_make ? {
      make: booking.vehicle_make,
      model: booking.vehicle_model,
      color: booking.vehicle_color,
      plate: booking.vehicle_plate,
    } : undefined}
    assignedAt={booking.assigned_at || undefined}
    assignedBy={booking.assigned_by_name || undefined}
  />
)}
```

### **STEP 3: Fix CSS Tokens** (30 min)

Replace all hardcoded values with design tokens:

```css
/* BookingExpandedRow.module.css */

/* BEFORE */
border-top: 2px solid var(--color-border-primary);

/* AFTER */
border-top: var(--border-width-md) solid var(--color-border-primary);

/* BEFORE */
@media (max-width: 1200px) { ... }

/* AFTER */
@media (max-width: var(--breakpoint-lg)) { ... }
```

---

## **🚦 PRIORITATE:**

### **🔴 URGENT (Blocker pentru Step 3):**

1. **API Extension** - Fetch missing data (Step 3 original plan)
   - Add organizations, assignments, drivers, vehicles fetch
   - Fix services filter (remove unit_price > 0)
   - Add missing fields to transform

### **🟡 IMPORTANT (După API fix):**

2. **Props Passing** - Connect UI cu datele
   - Update BookingsTable.tsx LINE 181
   - Test expanded row arată date complete

### **🟢 NICE TO HAVE:**

3. **CSS Tokens Fix** - Conform RULES.md (Step 7)
   - Replace 63 hardcoded values
   - Use design tokens exclusively

4. **Remove Duplicates** - Optimize expanded row
   - Remove route duplicate (use main row data)
   - Remove details duplicate

---

## **✅ CONCLUSION:**

**UI COMPONENT:** ✅ **READY** (premium, reusable, tokens în noi)  
**DATA FLOW:** ❌ **BROKEN** (props not passed, API incomplete)  
**CSS COMPLIANCE:** ⚠️ **PARTIAL** (new=100%, old=violations)

**NEXT ACTION:** Execute **Step 3 (API Extension)** FIRST, then fix props passing!

---

**Last Updated:** 2025-10-22  
**Next Review:** After Step 3 completion
