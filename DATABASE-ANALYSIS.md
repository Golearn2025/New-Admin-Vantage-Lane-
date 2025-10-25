# 🗄️ DATABASE ANALYSIS - CURRENT vs REQUIRED

## 📊 CURRENT DATABASE SCHEMA (Live from Supabase)

### **EXISTING TABLES** (25 tables total)

#### **1. USERS TABLES** ✅ GOOD FOUNDATION

**`customers`** (2 rows)
```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users) ✅
- email, first_name, last_name, phone
- avatar_url, date_of_birth
- addresses (jsonb)
- ride_preferences (jsonb)
- notification_settings (jsonb)
- is_active (boolean)
- status (varchar) - active, pending, suspended ✅
- loyalty_tier, total_spent, total_rides
- two_factor_enabled (boolean) ✅
- created_at, updated_at
```

**`drivers`** (7 rows)
```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users) ✅
- organization_id (uuid, FK → organizations) ✅
- email, first_name, last_name, phone
- date_of_birth, avatar_url
- license_number, license_expiry
- vehicle_id (uuid, FK → vehicles) ✅
- is_active (boolean)
- approval_status (varchar) - pending, approved, rejected ✅
- approved_by (uuid, FK → admin_users) ✅
- approved_at (timestamp) ✅
- rating_average, total_trips
- earnings_ytd, earnings_total
- driver_status (varchar) - offline, available, busy ✅
- onboarding_completed (boolean) ✅
- created_at, updated_at
```

**`admin_users`** (3 rows)
```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users) ✅
- email (unique)
- name, first_name, last_name, phone
- avatar_url, date_of_birth
- role (varchar) - super_admin, admin, support ✅
- default_operator_id (uuid, FK → organizations) ✅
- is_active (boolean)
- job_title, department, bio
- notification_settings (jsonb)
- two_factor_enabled (boolean)
- timezone, preferred_language
- approved_by (uuid, FK → admin_users)
- approved_at (timestamp)
- last_login, created_at, updated_at
```

**`corporate_users`** (0 rows)
```sql
- id, auth_user_id, corporate_account_id
- email, name, phone
- role (member, manager, admin)
- is_active, created_at, updated_at
```

---

#### **2. ORGANIZATIONS** ✅ EXCELLENT

**`organizations`** (5 rows) - **THIS IS YOUR "OPERATORS" TABLE!**
```sql
- id (uuid, PK)
- code (varchar, unique)
- org_type (varchar) - operator, corporate ✅
- name, description
- contact_email, contact_phone, city
- is_active (boolean)
- operating_hours_json (jsonb)
- pricing_json (jsonb)
- driver_commission_pct (numeric) ✅ DEFAULT 20.00
- rating_average, review_count
- created_at, updated_at
```

**`user_organization_roles`** (1 row) - **RBAC SYSTEM!**
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users) ✅
- organization_id (uuid, FK → organizations) ✅
- role (varchar) - admin, operator, etc. ✅
- is_active (boolean)
- created_at
```

---

#### **3. BOOKINGS** ✅ VERY COMPLETE

**`bookings`** (72 rows)
```sql
- id (uuid, PK)
- reference (varchar, unique) - BK-001234 ✅
- customer_id (uuid, FK → customers) ✅
- organization_id (uuid, FK → organizations) ✅
- trip_type (varchar) - oneway, return, hourly, hourly_daily, fleet ✅
- category (varchar) - EXEC, LUX, SUV, VAN ✅
- vehicle_model (varchar) ✅
- scheduled_at (timestamp) ✅
- passenger_count, bag_count ✅
- child_seats (integer) ✅
- flight_number (varchar) ✅
- notes (text) ✅
- distance_miles (numeric) ✅
- duration_min (integer) ✅
- status (varchar) - NEW, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED ✅
- payment_status (varchar) - pending, paid, refunded ✅
- currency, payment_method
- price (numeric) ✅
- extras_total (numeric) ✅
- fleet_executive, fleet_s_class, fleet_v_class, fleet_suv ✅
- return_date, return_time, return_flight_number ✅
- hours (integer) ✅
- created_at, updated_at, cancelled_at
- cancel_reason (varchar)
```

**`booking_segments`** (137 rows)
```sql
- id, booking_id
- seq_no (integer) - order of segments ✅
- role (varchar) - pickup, dropoff ✅
- place_text, place_label ✅
- lat, lng (numeric) ✅
- created_at
```

**`booking_services`** (68 rows)
```sql
- id, booking_id
- service_code (varchar) ✅
- service_label (varchar)
- price (numeric)
- is_free (boolean) ✅
- created_at
```

**`booking_assignment`** (5 rows)
```sql
- id, booking_id
- driver_id (uuid, FK → drivers) ✅
- organization_id (uuid, FK → organizations) ✅
- assigned_by (uuid, FK → admin_users) ✅
- assigned_at, accepted_at
- status (varchar) - pending, accepted, rejected
- rejection_reason
```

**`booking_timeline`** (0 rows) - **STATUS HISTORY!**
```sql
- id, booking_id
- status (varchar) ✅
- notes, user_id
- created_at
```

---

#### **4. VEHICLES** ✅ PERFECT

**`vehicles`** (10 rows)
```sql
- id (uuid, PK)
- driver_id (uuid, FK → drivers) ✅
- organization_id (uuid, FK → organizations) ✅
- make, model, year, color ✅
- license_plate (varchar, unique) ✅
- category (varchar) - EXEC, LUX, SUV, VAN ✅
- seats (integer) ✅
- is_active (boolean)
- rating_average
- created_at, updated_at
```

---

#### **5. DOCUMENTS** ✅ EXISTS!

**`driver_documents`** (0 rows) - **ALREADY EXISTS!**
```sql
- id, driver_id
- document_type (varchar) ✅
- file_url (text) ✅
- status (varchar) - pending, verified, rejected ✅
- uploaded_at, verified_at
- verified_by (uuid, FK → admin_users) ✅
- expiry_date (date) ✅
- rejection_reason
```

---

#### **6. PAYMENTS & BILLING** ✅ ADVANCED

**`billing`** (72 rows)
```sql
- id, booking_id, customer_id
- amount, currency
- payment_method
- payment_status (pending, paid, refunded)
- stripe_payment_intent_id ✅
- paid_at, refunded_at, refund_amount
- created_at, updated_at
```

**`driver_earnings`** (5 rows)
```sql
- id, driver_id, booking_id
- base_fare, distance_fare, time_fare
- surge_multiplier
- tips, total_fare
- commission_pct, commission_amount ✅
- net_earnings ✅
- paid_out (boolean)
- payout_id
- created_at
```

**`payouts`** (0 rows)
```sql
- id, driver_id
- period_start, period_end
- total_earnings, platform_fee, payout_amount
- status (pending, processing, paid)
- payment_method, transaction_id
- created_at, processed_at
```

---

#### **7. REVIEWS & RATINGS** ✅

**`reviews`** (0 rows)
```sql
- id, booking_id, customer_id, driver_id
- rating (1-5)
- comment
- created_at
```

**`driver_reviews`** (0 rows)
```sql
- id, driver_id, customer_id, booking_id
- rating (1-5)
- comment, tags (jsonb)
- created_at
```

---

#### **8. SUPPORT & NOTIFICATIONS** ✅

**`support_tickets`** (0 rows)
```sql
- id, customer_id, booking_id
- subject, description
- status (open, in_progress, resolved)
- priority (low, medium, high)
- resolved_by, resolved_at
- created_at, updated_at
```

**`notifications`** (0 rows)
```sql
- id, user_id
- type, title, message
- target_type (driver, customer, operator, admin) ✅
- is_system, read_at
- created_at
```

---

## 🆚 COMPARISON: CURRENT vs ROADMAP

### ✅ **WHAT WE ALREADY HAVE** (GOOD NEWS!)

| Feature | Status | Table | Notes |
|---------|--------|-------|-------|
| **Users** | ✅ EXISTS | customers, drivers, admin_users | 3 separate tables |
| **Operators** | ✅ EXISTS | organizations (org_type='operator') | Already implemented! |
| **Operator Assignment** | ✅ EXISTS | drivers.organization_id | Drivers → Operators link |
| **User Roles** | ✅ EXISTS | user_organization_roles | RBAC system ready |
| **Vehicle Categorization** | ✅ EXISTS | vehicles.category | EXEC, LUX, SUV, VAN |
| **Driver Verification** | ✅ EXISTS | drivers.approval_status | pending, approved, rejected |
| **Document Management** | ✅ EXISTS | driver_documents | Full document system |
| **Booking Complete** | ✅ EXISTS | bookings | All fields from roadmap |
| **Distance & Duration** | ✅ EXISTS | bookings.distance_miles, duration_min | Already saved! |
| **Status Tracking** | ✅ EXISTS | bookings.status | NEW → COMPLETED flow |
| **Booking History** | ✅ EXISTS | booking_timeline | Status change audit |
| **Commission Tracking** | ✅ EXISTS | driver_earnings | Full breakdown |
| **Operator Commission** | ✅ EXISTS | organizations.driver_commission_pct | Default 20% |

---

### ⚠️ **WHAT NEEDS TO BE ADDED** (GAPS)

#### **1. Vehicle Model Tag** 🔴 MISSING
```sql
-- Current: vehicles.category = "LUX"
-- Need: vehicles.specific_model_tag = "Mercedes S Class"

ALTER TABLE vehicles 
ADD COLUMN specific_model_tag VARCHAR(100);

-- Examples:
-- "Mercedes S Class"
-- "Mercedes E Class"
-- "BMW 5 Series"
-- "BMW 7 Series"
```

#### **2. Booking Specific Model** 🔴 MISSING
```sql
-- Current: bookings.category = "EXEC"
-- Need: bookings.specific_model = "Mercedes E Class" or "any"

ALTER TABLE bookings
ADD COLUMN specific_model VARCHAR(100);

-- Values: "any", "Mercedes E Class", "BMW 5 Series", etc.
```

#### **3. Payment Adjustments Table** 🔴 MISSING
```sql
CREATE TABLE payment_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
  payment_link TEXT,
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
```

#### **4. Booking Edits Audit** 🔴 MISSING
```sql
CREATE TABLE booking_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  edited_by UUID REFERENCES admin_users(id) NOT NULL,
  field_changed VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  price_difference NUMERIC(10,2),
  edited_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **5. Pricing Configuration** 🔴 MISSING
```sql
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- EXEC, LUX, SUV, VAN
  base_price NUMERIC(10,2) NOT NULL,
  price_per_mile NUMERIC(10,2) NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_until DATE,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **6. Platform Commission Config** 🔴 MISSING
```sql
CREATE TABLE commission_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 15.00,
  default_operator_commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  effective_from DATE NOT NULL,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **7. Operator Settings Enhancement** 🟡 OPTIONAL
```sql
-- Current: organizations.driver_commission_pct
-- Consider adding: operator-specific platform commission override

ALTER TABLE organizations
ADD COLUMN platform_commission_override NUMERIC(5,2);
```

---

### 🎯 **CRITICAL INSIGHT: ROLE STRUCTURE**

**CURRENT SYSTEM:**
```
auth.users (Supabase Auth)
   ↓
Separate profile tables:
- customers (auth_user_id → auth.users)
- drivers (auth_user_id → auth.users)
- admin_users (auth_user_id → auth.users)
- corporate_users (auth_user_id → auth.users)
   ↓
user_organization_roles (RBAC)
```

**THIS IS GOOD!** We have:
- ✅ Separation of concerns
- ✅ RBAC system ready
- ✅ Operator assignment via organizations

**OPERATORS = ORGANIZATIONS with org_type='operator'**

---

## 🚀 MIGRATION PLAN

### **PHASE 1: Add Missing Columns** (30 minutes)
```sql
-- 1. Vehicle specific model tag
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS specific_model_tag VARCHAR(100);

-- 2. Booking specific model filter
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS specific_model VARCHAR(100);

-- 3. Platform commission config in organizations
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS platform_commission_pct NUMERIC(5,2) DEFAULT 15.00;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_specific_model ON vehicles(specific_model_tag);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_organization ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_drivers_organization ON drivers(organization_id);
```

### **PHASE 2: Create New Tables** (1 hour)
```sql
-- 1. Payment adjustments
CREATE TABLE payment_adjustments (...);

-- 2. Booking edits audit
CREATE TABLE booking_edits (...);

-- 3. Pricing configuration
CREATE TABLE pricing_config (...);

-- 4. Commission configuration
CREATE TABLE commission_config (...);

-- Add RLS policies
-- Add triggers
-- Add functions
```

---

## 📊 SUMMARY

### ✅ **EXCELLENT DATABASE FOUNDATION!**

**What works perfectly:**
- ✅ User management (4 types)
- ✅ Operator system (organizations table)
- ✅ Driver verification (approval_status)
- ✅ Document management (driver_documents)
- ✅ Vehicle categorization (vehicles.category)
- ✅ Booking complete (all fields)
- ✅ Commission tracking (driver_earnings)
- ✅ Status management (booking_timeline)

**Small gaps to fill:**
- 🔴 Vehicle specific model tag (1 column)
- 🔴 Booking specific model filter (1 column)
- 🔴 Payment adjustments (1 table)
- 🔴 Booking edits audit (1 table)
- 🔴 Pricing config (2 tables)

**Estimated migration time: 2-3 hours total**

---

## 🎯 RECOMMENDED NEXT STEPS

1. **Run Phase 1 migrations** (add missing columns)
2. **Run Phase 2 migrations** (create new tables)
3. **Start Phase 1 implementation** (User Management UI)
4. **No need to rebuild database!** - Foundation is solid ✅

---

**Să rulez migrațiile sau să încep cu UI-ul direct?** 🚀
