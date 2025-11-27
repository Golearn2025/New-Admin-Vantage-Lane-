# 🔍 **ONE WAY Booking Verification - DB Live vs Admin UI**

**Booking:** CB-00050 (9d756419-24b4-4fd9-80de-8b081ad69fb1)  
**Type:** ONE WAY  
**Date:** 2025-10-22

---

## **📊 STEP 1: Check Database (Supabase Dashboard)**

### **Query pentru Booking Principal**

```sql
-- Run în Supabase Dashboard > SQL Editor
SELECT 
  -- 📋 BASIC INFO
  id, 
  reference,
  status,
  trip_type,
  category,
  vehicle_model,
  
  -- 📅 DATES
  start_at,
  created_at,
  
  -- 🗺️ ROUTE
  distance_miles,
  duration_min,
  flight_number,
  
  -- 👥 PASSENGERS
  passenger_count,
  bag_count,
  
  -- 🔗 FOREIGN KEYS
  customer_id,
  organization_id,
  assigned_driver_id,
  assigned_vehicle_id,
  
  -- 🔄 RETURN (Should be NULL for ONE WAY)
  return_date,
  return_time,
  return_flight_number,
  
  -- 🚗 FLEET (Should be NULL for ONE WAY)
  fleet_executive,
  fleet_s_class,
  fleet_v_class,
  fleet_suv,
  
  -- 💰 HOURLY (Should be NULL for ONE WAY)
  hours,
  
  -- 📝 NOTES
  notes,
  
  -- 📍 SOURCE (New field)
  source
  
FROM bookings 
WHERE id = '9d756419-24b4-4fd9-80de-8b081ad69fb1';
```

### **Expected Results pentru ONE WAY:**

| Field | Expected Value | Type |
|-------|----------------|------|
| `trip_type` | `'oneway'` | ✅ MUST |
| `return_date` | `NULL` | ✅ MUST be NULL |
| `return_time` | `NULL` | ✅ MUST be NULL |
| `return_flight_number` | `NULL` | ✅ MUST be NULL |
| `fleet_executive` | `NULL` | ✅ MUST be NULL |
| `fleet_s_class` | `NULL` | ✅ MUST be NULL |
| `fleet_v_class` | `NULL` | ✅ MUST be NULL |
| `fleet_suv` | `NULL` | ✅ MUST be NULL |
| `hours` | `NULL` | ✅ MUST be NULL |

---

### **Query pentru Customer**

```sql
SELECT 
  id,
  first_name,
  last_name,
  phone,
  email,
  loyalty_tier,
  status,
  total_spent,
  total_rides
FROM customers
WHERE id = (
  SELECT customer_id FROM bookings 
  WHERE id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
);
```

### **Expected Results:**

| Field | Expected Value (Sample) |
|-------|------------------------|
| `first_name` | Cristian |
| `last_name` | Manolache |
| `phone` | +447903508199 |
| `email` | christianmanolache@gmail.com |
| `loyalty_tier` | bronze |
| `status` | active |
| `total_spent` | 0 (first booking) |
| `total_rides` | 0 |

---

### **Query pentru Route (Segments)**

```sql
SELECT 
  booking_id,
  seq_no,
  role,
  place_text,
  place_label
FROM booking_segments
WHERE booking_id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
ORDER BY seq_no;
```

### **Expected Results (ONE WAY = 2 segments):**

| seq_no | role | place_text | place_label |
|--------|------|------------|-------------|
| 1 | pickup | London | Specific address |
| 2 | dropoff | Aberdeen | Specific address |

---

### **Query pentru Pricing**

```sql
SELECT 
  booking_id,
  price,
  currency,
  payment_method,
  payment_status
FROM booking_pricing
WHERE booking_id = '9d756419-24b4-4fd9-80de-8b081ad69fb1';
```

### **Expected Results:**

| Field | Expected Value |
|-------|---------------|
| `price` | 85.00 (base price) |
| `currency` | GBP |
| `payment_method` | CARD |
| `payment_status` | pending |

---

### **Query pentru Services (FREE + PAID)**

```sql
SELECT 
  booking_id,
  service_code,
  unit_price,
  quantity,
  CASE 
    WHEN unit_price = 0 THEN 'FREE'
    ELSE 'PAID'
  END as service_type
FROM booking_services
WHERE booking_id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
ORDER BY unit_price DESC;
```

### **Expected Results:**

Pentru CB-00050 documentat:
- **3 PAID services** (exemple: Fresh Flowers £120, Security Escort £750, etc.)
- **11 FREE services** (wifi, meet_and_greet, luggage_assistance, etc.)

---

### **Query pentru Organization**

```sql
SELECT 
  o.id,
  o.name,
  o.rating_average,
  o.review_count
FROM organizations o
WHERE o.id = (
  SELECT organization_id FROM bookings 
  WHERE id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
);
```

### **Expected Results:**

| Field | Expected Value |
|-------|---------------|
| `name` | Operator name (e.g., "Premium Chauffeurs") |
| `rating_average` | 4.0 - 5.0 |
| `review_count` | > 0 |

---

### **Query pentru Assignment (Driver + Vehicle)**

```sql
-- Check assignment
SELECT 
  booking_id,
  assigned_at,
  assigned_by
FROM booking_assignment
WHERE booking_id = '9d756419-24b4-4fd9-80de-8b081ad69fb1';

-- Check driver (if assigned)
SELECT 
  d.id,
  d.first_name,
  d.last_name,
  d.phone,
  d.email,
  d.rating_average
FROM drivers d
WHERE d.id = (
  SELECT assigned_driver_id FROM bookings 
  WHERE id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
);

-- Check vehicle (if assigned)
SELECT 
  v.id,
  v.make,
  v.model,
  v.color,
  v.license_plate
FROM vehicles v
WHERE v.id = (
  SELECT assigned_vehicle_id FROM bookings 
  WHERE id = '9d756419-24b4-4fd9-80de-8b081ad69fb1'
);
```

### **Expected Results (pentru NEW booking):**

| Field | Expected Value |
|-------|---------------|
| `assigned_driver_id` | NULL (not assigned yet) |
| `assigned_vehicle_id` | NULL (not assigned yet) |
| `assigned_at` | NULL |
| `assigned_by` | NULL |

---

## **📊 STEP 2: Check Admin UI**

### **Main Row Display:**

Deschide Admin UI → Bookings → Active → Găsește CB-00050

**Verifică:**

| UI Column | Expected Display | Source DB |
|-----------|------------------|-----------|
| **Reference** | `→ CB-00050` | bookings.reference + icon pentru trip_type |
| **Customer** | Cristian Manolache<br>+447903508199<br>christianmanolache@gmail.com<br>Tier: bronze / active<br>Spent: £0.00 / Rides: 0 | customers.* |
| **Route** | 🟢 London<br>🔴 Aberdeen<br>536.64 mi • 562 min<br>PICKUP: 2025-10-21 18:15<br>Created: 2025-10-12 17:57<br>✈️ 1111 | booking_segments + bookings.* |
| **Vehicle** | EXEC<br>van_v_class<br>1 Pass • 1 Bags | bookings.* |
| **Payment** | Base: £85.00<br>+ 3 paid services<br>TOTAL: £XXX.XX<br>CARD / pending | booking_pricing + booking_services |
| **Status** | NEW | bookings.status |
| **Actions** | Assign / Edit / More | - |

---

### **Expanded Row Display:**

Click pe `▶️` pentru a expanda

**Verifică secțiunile:**

#### **1. 🔄 Return Journey (Should NOT appear for ONE WAY)** ❌

**Expected:** Această secțiune NU ar trebui să apară pentru ONE WAY!

**If appears, it's a BUG:**
```typescript
// În BookingExpandedRow.tsx trebuie:
{booking.trip_type === 'return' && booking.return_date && (
  <TripTypeSection booking={booking} />
)}
```

#### **2. ✨ Included Services (FREE)** ✅

**Expected:** Lista de 11 servicii gratuite:
- ✅ WiFi
- ✅ Meet & Greet
- ✅ Luggage Assistance
- ✅ Pet Friendly
- ✅ Bottled Water
- ✅ Priority Support
- ✅ Phone Chargers
- ✅ Wait Time
- ✅ Music Preference
- ✅ Communication
- ✅ Temperature Preference (?)

**Source:** `booking.free_services[]` (filtering `unit_price = 0`)

#### **3. 📍 Complete Route** ✅

**Expected:**
```
🟢 PICKUP
London (specific address)
↓ 536.64 mi • 562 min
🔴 DROPOFF
Aberdeen (specific address)
```

**Source:** `booking_segments` + `bookings.distance_miles/duration_min`

#### **4. 📝 Customer Notes** ✅

**Expected:** Display de `booking.notes` (dacă există)

**Source:** `bookings.notes`

#### **5. 🏢 Operator** ✅

**Expected:**
```
Company: [Operator Name]
Rating: ⭐ X.X
Reviews: XXX
Source: web (sau app, call_center, partner_api)
```

**Source:** 
- `organizations.name`
- `organizations.rating_average`
- `organizations.review_count`
- `bookings.source` (NEW field!)

#### **6. 📊 Booking Details** ✅

**Expected:**
```
Flight: ✈️ 1111
Passengers: 1
Bags: 1
```

**Source:** `bookings.*`

#### **7. 👤 Driver Details** (if assigned) ⚠️

**Expected pentru NEW booking:** "Not assigned yet" sau similar

**If assigned:**
```
Name: [Driver Name]
Phone: [Phone]
Email: [Email]
Rating: ⭐ X.X
```

**Source:** `drivers.*`

#### **8. 🚗 Vehicle Details** (if assigned) ⚠️

**Expected pentru NEW booking:** "Not assigned yet"

**If assigned:**
```
Make: [Make]
Model: [Model]
Color: [Color]
Plate: [License Plate]
```

**Source:** `vehicles.*`

---

## **✅ CHECKLIST VERIFICARE ONE WAY:**

### **Database (Supabase Dashboard):**

- [ ] `trip_type = 'oneway'` ✅
- [ ] `return_date IS NULL` ✅
- [ ] `return_time IS NULL` ✅
- [ ] `return_flight_number IS NULL` ✅
- [ ] `fleet_executive IS NULL` ✅
- [ ] `fleet_s_class IS NULL` ✅
- [ ] `fleet_v_class IS NULL` ✅
- [ ] `fleet_suv IS NULL` ✅
- [ ] `hours IS NULL` ✅
- [ ] Customer data complete (first_name, last_name, phone, email, etc.)
- [ ] 2 segments (pickup + dropoff)
- [ ] Pricing exists (price, currency, payment_method, payment_status)
- [ ] Services exist (both FREE and PAID)
- [ ] Organization exists (if organization_id is not NULL)
- [ ] Assignment NULL pentru NEW booking

### **Admin UI (Main Row):**

- [ ] Reference shows correctly with ONE WAY icon (→)
- [ ] Customer info complete (name, phone, email, tier, status, spent, rides)
- [ ] Route shows 2 points (pickup → dropoff)
- [ ] Distance & duration shown
- [ ] Pickup date/time shown
- [ ] Flight number shown (if exists)
- [ ] Vehicle category & model shown
- [ ] Passenger & bag count shown
- [ ] Payment breakdown shown (base + services)
- [ ] Total amount calculated correctly
- [ ] Payment method & status shown
- [ ] Status badge shown correctly

### **Admin UI (Expanded Row):**

- [ ] ❌ Return Journey section DOES NOT appear (ONE WAY specific!)
- [ ] ✅ Included Services shows ALL FREE services (11 items)
- [ ] ✅ Complete Route shows pickup → dropoff with details
- [ ] ✅ Customer Notes shown (if exists)
- [ ] ✅ Operator info shown (name, rating, reviews, source)
- [ ] ✅ Booking Details shown (flight, passengers, bags)
- [ ] ⚠️ Driver/Vehicle shows "Not assigned" for NEW booking
- [ ] ✅ Assignment section shows appropriate state

---

## **🐛 COMMON BUGS TO CHECK:**

### **1. Return Journey Appears for ONE WAY** ❌

**Problem:** Return section visible pentru booking ONE WAY

**Fix:**
```typescript
// BookingExpandedRow.tsx
{booking.trip_type === 'return' && booking.return_date && (
  <TripTypeSection booking={booking} />
)}
```

### **2. FREE Services Missing** ❌

**Problem:** Doar PAID services afișate, FREE services missing

**Check:**
```typescript
// transform.ts - Line 89-91
free_services: bookingServices
  .filter((s) => parseFloat(s.unit_price) === 0) // ✅ Correct filter
  .map((s) => s.service_code),
```

### **3. Source Still Hardcoded** ❌

**Problem:** Source shows "web" pentru toate bookings

**Check:**
```typescript
// transform.ts - Line 122
source: booking.source || 'web', // ✅ Should read from DB
```

### **4. Operator Data Missing** ❌

**Problem:** Operator name/rating/reviews NULL

**Check:**
```typescript
// query-builder.ts - Line 79
fetchOrganizations(supabase, organizationIds), // ✅ Should be included
```

---

## **📋 REZULTATE AȘTEPTATE PENTRU CB-00050 (ONE WAY):**

| Aspect | DB Value | UI Display | Status |
|--------|----------|------------|--------|
| **Trip Type** | `oneway` | `→ CB-00050` | ✅ |
| **Return Fields** | ALL NULL | Section hidden | ✅ |
| **Fleet Fields** | ALL NULL | Not applicable | ✅ |
| **Hours** | NULL | Not applicable | ✅ |
| **Customer** | Full data | Complete display | ✅ |
| **Route** | 2 segments | pickup → dropoff | ✅ |
| **Services** | FREE + PAID | Both shown | ✅ |
| **Operator** | Full data | name/rating/reviews | ✅ |
| **Source** | `web` | "web" | ✅ |
| **Assignment** | NULL | "Not assigned" | ✅ |

---

## **🚀 NEXT STEPS:**

1. **Run queries în Supabase Dashboard** pentru CB-00050
2. **Copy results** și compară cu expected values
3. **Open Admin UI** și verifică vizual
4. **Report discrepancies** (dacă găsești diferențe)

---

**Autor:** Windsurf AI  
**Data:** 2025-10-22  
**Booking Test:** CB-00050 (ONE WAY)
