# 📊 Bookings Data Mapping - Main Row vs Expanded Row

**Created:** 2025-10-22  
**Purpose:** Document EXACT data flow from DB → UI (Main Row + Expanded Row)  
**Sample Booking:** CB-00050 (9d756419-24b4-4fd9-80de-8b081ad69fb1)

---

## 🎯 **CURRENT STATE: What's in DB vs What's in UI**

### **✅ MAIN ROW (Currently Displayed)**

| Field | DB Source | UI Column | Value (Sample) | Status |
|-------|-----------|-----------|----------------|--------|
| `reference` | bookings.reference | Reference | CB-00050 | ✅ |
| `trip_type` | bookings.trip_type | Reference (icon) | oneway | ✅ |
| `customer_name` | customers.first_name + last_name | Customer | Cristian Manolache | ✅ |
| `customer_phone` | customers.phone | Customer (link) | +447903508199 | ✅ |
| `customer_email` | customers.email | Customer (link) | christianmanolache@gmail.com | ✅ |
| `customer_loyalty_tier` | customers.loyalty_tier | Customer Stats | bronze | ✅ |
| `customer_status` | customers.status | Customer Stats | active | ✅ |
| `customer_total_spent` | customers.total_spent | Customer Stats | £0.00 | ✅ |
| `customer_total_bookings` | customers.total_rides | Customer Stats | 0 | ✅ |
| `pickup_location` | booking_segments (role=pickup) | Route | London | ✅ |
| `destination` | booking_segments (role=dropoff) | Route | Aberdeen | ✅ |
| `distance_miles` | bookings.distance_miles | Route | 536.64 mi | ✅ |
| `duration_min` | bookings.duration_min | Route | 562 min | ✅ |
| `scheduled_at` | bookings.start_at | Route (PICKUP) | 2025-10-21 18:15 | ✅ |
| `created_at` | bookings.created_at | Route (Created) | 2025-10-12 17:57 | ✅ |
| `flight_number` | bookings.flight_number | Route | ✈️ 1111 | ✅ |
| `category` | bookings.category | Vehicle | EXEC | ✅ |
| `vehicle_model` | bookings.vehicle_model | Vehicle | van_v_class | ✅ |
| `passenger_count` | bookings.passenger_count | Vehicle | 1 Pass | ✅ |
| `bag_count` | bookings.bag_count | Vehicle | 1 Bags | ✅ |
| `fare_amount` | booking_pricing.price | Payment | £85.00 | ✅ |
| `paid_services[]` | booking_services (unit_price > 0) | Payment | 3 items | ✅ |
| `payment_method` | booking_pricing.payment_method | Payment | CARD | ✅ |
| `payment_status` | booking_pricing.payment_status | Payment | pending | ✅ |
| `status` | bookings.status | Status Badge | NEW | ✅ |

**TOTAL MAIN ROW FIELDS:** 25 ✅ **All Working**

---

### **❌ EXPANDED ROW (Partial - MISSING DATA)**

| Field | DB Source | UI Section | Value (Sample) | Status |
|-------|-----------|------------|----------------|--------|
| **RETURN JOURNEY** |
| `return_date` | bookings.return_date | Return Journey | **NULL** | ⚠️ N/A (oneway) |
| `return_time` | bookings.return_time | Return Journey | **NULL** | ⚠️ N/A (oneway) |
| `return_flight_number` | bookings.return_flight_number | Return Journey | **NULL** | ❌ **MISSING** |
| **FREE SERVICES** |
| `free_services[]` | booking_services (unit_price = 0) | Included Services | **11 FREE services** | ❌ **NOT FETCHED** |
| | | | - wifi | ❌ |
| | | | - bottled_water | ❌ |
| | | | - meet_and_greet | ❌ |
| | | | - luggage_assistance | ❌ |
| | | | - phone_chargers | ❌ |
| | | | - priority_support | ❌ |
| | | | - wait_time_included | ❌ |
| | | | - pet_friendly | ❌ |
| | | | - music_preference | ❌ |
| | | | - communication_style | ❌ |
| | | | - temperature_preference | ❌ |
| **ROUTE (DUPLICATE)** |
| `pickup_location` | booking_segments | Complete Route | London | 🔁 **DUPLICATE** |
| `destination` | booking_segments | Complete Route | Aberdeen | 🔁 **DUPLICATE** |
| `distance_miles` | bookings.distance_miles | Complete Route | 536.64 mi | 🔁 **DUPLICATE** |
| `duration_min` | bookings.duration_min | Complete Route | 562 min | 🔁 **DUPLICATE** |
| **CUSTOMER NOTES** |
| `customer_notes` | bookings.notes | Customer Notes | "11111" | ❌ **NOT PASSED** |
| **OPERATOR** |
| `operator_name` | organizations.name | Operator | **NULL** (no org) | ❌ **NOT FETCHED** |
| `operator_rating` | organizations.rating_average | Operator | **NULL** | ❌ **NOT FETCHED** |
| `operator_reviews` | organizations.review_count | Operator | **NULL** | ❌ **NOT FETCHED** |
| `source` | bookings.? | Operator | **HARDCODED "web"** | ❌ **HARDCODED** |
| **BOOKING DETAILS (DUPLICATE)** |
| `flight_number` | bookings.flight_number | Details | ✈️ 1111 | 🔁 **DUPLICATE** |
| `passenger_count` | bookings.passenger_count | Details | 1 | 🔁 **DUPLICATE** |
| `bag_count` | bookings.bag_count | Details | 1 | 🔁 **DUPLICATE** |
| **ASSIGNMENT** |
| `driver_id` | bookings.assigned_driver_id | Assignment | **NULL** (not assigned) | ✅ Available |
| `vehicle_id` | bookings.assigned_vehicle_id | Assignment | **NULL** (not assigned) | ✅ Available |
| `driver_name` | drivers.first_name + last_name | Driver Details | **NULL** | ❌ **NOT FETCHED** |
| `driver_phone` | drivers.phone | Driver Details | **NULL** | ❌ **NOT FETCHED** |
| `driver_email` | drivers.email | Driver Details | **NULL** | ❌ **NOT FETCHED** |
| `driver_rating` | drivers.rating_average | Driver Details | **NULL** | ❌ **NOT FETCHED** |
| `vehicle_make` | vehicles.make | Vehicle Details | **NULL** | ❌ **NOT FETCHED** |
| `vehicle_model` | vehicles.model | Vehicle Details | **NULL** | ❌ **NOT FETCHED** |
| `vehicle_color` | vehicles.color | Vehicle Details | **NULL** | ❌ **NOT FETCHED** |
| `vehicle_plate` | vehicles.license_plate | Vehicle Details | **NULL** | ❌ **NOT FETCHED** |
| `assigned_at` | booking_assignment.assigned_at | Assignment Metadata | **NULL** | ❌ **NOT FETCHED** |
| `assigned_by` | booking_assignment.assigned_by | Assignment Metadata | **NULL** | ❌ **NOT FETCHED** |
| `assigned_by_name` | admin_users.name | Assignment Metadata | **NULL** | ❌ **NOT FETCHED** |

**TOTAL EXPANDED FIELDS:** 33  
**STATUS:**
- ✅ Working: 3
- 🔁 Duplicates: 7
- ❌ Missing/Not Fetched: 23

---

## 🔴 **PROBLEMS IDENTIFIED:**

### **1. FREE SERVICES NOT FETCHED** ❌ CRITICAL
```typescript
// CURRENT (query-builder.ts)
.gt('unit_price', 0)  // ❌ Only paid services!

// SHOULD BE
// NO filter → fetch ALL services
```

**Impact:** 11 FREE services not displayed in UI!

### **2. OPERATOR DATA NOT FETCHED** ❌ HIGH
```typescript
// MISSING in query-builder.ts
fetchOrganizations(supabase, organizationIds)

// Currently HARDCODED in transform.ts
operator_name: 'Vantage Lane',  // ❌ WRONG!
source: 'web' as const,         // ❌ WRONG!
```

### **3. ASSIGNMENT DATA NOT FETCHED** ❌ HIGH
```typescript
// MISSING in query-builder.ts
fetchAssignments(supabase, bookingIds)
fetchDrivers(supabase, driverIds)
fetchVehicles(supabase, vehicleIds)
```

### **4. RETURN FLIGHT NUMBER NOT IN CONTRACT** ❌ MEDIUM
```typescript
// MISSING in BookingListItem interface
return_flight_number: string | null;  // ❌ Not defined
```

### **5. DUPLICATE FIELDS IN EXPANDED** 🔁 LOW
- pickup_location, destination, distance_miles, duration_min (4 fields)
- flight_number, passenger_count, bag_count (3 fields)

**Total waste:** 7 duplicate fields

---

## 🎯 **STANDARDUL SUPABASE: Cum fac alții?**

### **✅ BEST PRACTICE: Single Fetch + Transform**

```typescript
// ✅ CORECT: Fetch ONCE in list, use everywhere
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    customer:customers(*),
    organization:organizations(*),
    segments:booking_segments(*),
    pricing:booking_pricing(*),
    services:booking_services(*),
    assignment:booking_assignment(*),
    driver:drivers(*),
    vehicle:vehicles(*)
  `)
  .eq('id', bookingId)
  .single();

// Then cache and reuse:
- Main row: uses data directly
- Expanded row: uses SAME data (no re-fetch!)
```

### **❌ BAD PRACTICE: Multiple Fetches**

```typescript
// ❌ GREȘIT: Fetch la mount + fetch la expand
const { data } = await supabase.from('bookings').select('*');  // List
// ...later...
const { data: expanded } = await supabase.from('bookings').select('*, driver(*)').single();  // Expand
```

---

## 🔄 **REALTIME ANTI-LOOP PATTERN**

### **✅ STANDARDUL: Version-based Deduplication**

```typescript
// 1. Add version/revision to bookings table
ALTER TABLE bookings ADD COLUMN revision INT DEFAULT 0;

// 2. Increment on every update
CREATE OR REPLACE FUNCTION increment_booking_revision()
RETURNS TRIGGER AS $$
BEGIN
  NEW.revision = OLD.revision + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_revision
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION increment_booking_revision();

// 3. Client-side: Track local version
const [localRevisions, setLocalRevisions] = useState<Map<string, number>>(new Map());

supabase
  .channel('bookings-realtime')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    const { id, revision } = payload.new;
    const localRevision = localRevisions.get(id) || 0;
    
    // ✅ ANTI-ECHO: Ignore if we already processed this version
    if (revision <= localRevision) {
      console.log(`[SKIP] Already seen booking ${id} revision ${revision}`);
      return;
    }
    
    // ✅ Update local state
    setLocalRevisions(prev => new Map(prev).set(id, revision));
    
    // ✅ Fetch ONLY this booking (not full list!)
    refetchSingleBooking(id);
  })
  .subscribe();
```

### **❌ ANTI-PATTERN: Naive Realtime**

```typescript
// ❌ GREȘIT: No deduplication → infinite loop!
supabase
  .on('UPDATE', (payload) => {
    refetchAll();  // ❌ Re-fetches ALL bookings
    // → Triggers another UPDATE
    // → Triggers another refetchAll()
    // → INFINITE LOOP!
  });
```

---

## 📋 **SUPABASE REALTIME: Best Practices**

### **1. Subscribe la Eventi Specifice**

```typescript
// ✅ CORECT: Filter by status
supabase
  .channel('new-bookings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings',
    filter: 'status=eq.NEW'  // ✅ Only new jobs
  }, handleNewBooking)
  .subscribe();
```

### **2. Optimistic Updates**

```typescript
// ✅ CORECT: Update UI immediately, sync later
const acceptJob = async (bookingId: string) => {
  // 1. Optimistic UI update
  setBookings(prev => prev.map(b => 
    b.id === bookingId 
      ? { ...b, status: 'ASSIGNED', revision: b.revision + 1 }
      : b
  ));
  
  // 2. Server update (RPC)
  const { error } = await supabase.rpc('rpc_accept_job', {
    booking_id: bookingId,
    driver_id: currentUser.id
  });
  
  // 3. Rollback on error
  if (error) {
    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'NEW', revision: b.revision - 1 }
        : b
    ));
  }
  
  // 4. Realtime will confirm the change (if revision matches, skip)
};
```

### **3. Incremental Fetch (Not Full Refetch)**

```typescript
// ✅ CORECT: Fetch doar booking-ul nou
supabase
  .on('INSERT', async (payload) => {
    const newBooking = await fetchSingleBooking(payload.new.id);
    setBookings(prev => [newBooking, ...prev]);  // ✅ Prepend
  });

// ❌ GREȘIT: Re-fetch all
supabase
  .on('INSERT', () => {
    fetchAllBookings();  // ❌ Expensive!
  });
```

### **4. Debounce Rapid Updates**

```typescript
// ✅ CORECT: Batch multiple updates
import { debounce } from 'lodash';

const debouncedRefetch = debounce((bookingId: string) => {
  refetchSingleBooking(bookingId);
}, 500);

supabase
  .on('UPDATE', (payload) => {
    debouncedRefetch(payload.new.id);
  });
```

---

## 🎯 **SOLUTION: Data Flow Architecture**

### **CURRENT (BROKEN):**

```
User opens table
  ↓
Fetch bookings (25 rows) ← ❌ DOAR paid services, NO free
  ↓
User expands row
  ↓
❌ NO ADDITIONAL FETCH! (data missing!)
  ↓
UI shows incomplete data
```

### **TARGET (CORRECT):**

```
User opens table
  ↓
Fetch bookings (25 rows) ← ✅ ALL data (free+paid, org, assignment)
  ↓
Cache in React Query (staleTime: 30s)
  ↓
User expands row
  ↓
✅ Use CACHED data (no fetch!)
  ↓
UI shows COMPLETE data
  ↓
Realtime subscription → Update cache (version check)
  ↓
UI auto-updates (if revision changed)
```

---

## 📊 **DATA FETCH STRATEGY:**

### **Option A: Single API Call (RECOMMENDED)** ✅

```typescript
// /api/bookings/list?page=1&page_size=25
// Returns EVERYTHING needed for main + expanded

Promise.all([
  fetchBookings(supabase, offset, limit),
  fetchCustomers(supabase, customerIds),
  fetchOrganizations(supabase, orgIds),          // ← ADD
  fetchSegments(supabase, bookingIds),
  fetchPricing(supabase, bookingIds),
  fetchServices(supabase, bookingIds),            // ← FIX (remove filter)
  fetchAssignments(supabase, bookingIds),         // ← ADD
  fetchDrivers(supabase, driverIds),              // ← ADD
  fetchVehicles(supabase, vehicleIds)             // ← ADD
]);

// Client caches in React Query
// Expanded row uses cache (zero additional fetches!)
```

**PROS:**
- ✅ Single HTTP request
- ✅ All data available immediately
- ✅ No loading state on expand
- ✅ Works offline (if cached)

**CONS:**
- ⚠️ Slightly larger response (~10-15KB more)
- ⚠️ May fetch unused data (if user doesn't expand)

### **Option B: Lazy Load on Expand** ⚠️

```typescript
// List: Fetch minimal data
// Expand: Fetch additional data

const { data: details } = useSWR(
  expanded ? `/api/bookings/${bookingId}/details` : null,
  fetcher
);
```

**PROS:**
- ✅ Smaller initial response
- ✅ Only fetch what's needed

**CONS:**
- ❌ Additional HTTP request on expand
- ❌ Loading state (spinner)
- ❌ Delay before showing data
- ❌ More complex code

---

## ✅ **RECOMMENDATION: Option A (Single Fetch)**

**Why:**
1. Most users expand rows → pre-fetch is efficient
2. Response size increase is minimal (~10KB)
3. Better UX (instant expand, no loading)
4. Simpler code (one fetch, one cache)
5. Realtime is easier (one subscription)

**Next Steps (Step 3):**
- Extend `/api/bookings/list` to include:
  - ✅ Organizations (name, rating, reviews)
  - ✅ Free services (unit_price = 0)
  - ✅ Assignments (assigned_at, assigned_by)
  - ✅ Drivers (name, phone, email, rating)
  - ✅ Vehicles (make, model, color, plate)
  - ✅ return_flight_number field
  - ✅ customer_notes field

---

**Last Updated:** 2025-10-22  
**Next Review:** After Step 3 (API Extension)
