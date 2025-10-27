# 🚀 VANTAGE LANE ADMIN - PROJECT ROADMAP

## 📋 TABLE OF CONTENTS
1. [System Overview](#system-overview)
2. [User Roles & Access](#user-roles--access)
3. [Complete Flow End-to-End](#complete-flow-end-to-end)
4. [Implementation Phases](#implementation-phases)
5. [Database Schema Requirements](#database-schema-requirements)
6. [Technical Architecture](#technical-architecture)

---

## 🎯 SYSTEM OVERVIEW

### Platforms:
- **Landing Page** - Public website (customer booking)
- **Admin Panel** - Full system control (current project)
- **Operator Dashboard** - Limited operator access
- **Driver App** - Mobile app for drivers
- **Client App** - Mobile app for customers (not ready yet)

---

## 👥 USER ROLES & ACCESS

### 1. **ADMIN** (You + Cristi)
- ✅ Pre-created în Supabase
- ✅ Full access to everything
- ✅ Can create any user type
- ✅ Can edit/delete any data
- ✅ Sees all bookings, all operators, all drivers
- ✅ Controls pricing, commissions, settings

### 2. **OPERATOR**
- ⚠️ Created by Admins (cannot self-register)
- 📊 Limited dashboard view:
  - Their bookings only
  - Price after platform commission
  - Their commission earned
  - Driver price
- 🔧 Can:
  - Verify driver documents
  - Activate/deactivate drivers
  - Assign drivers to bookings
  - Edit bookings (with restrictions)
- ❌ Cannot:
  - See other operators' data
  - Change pricing structure
  - Access admin settings

### 3. **DRIVER**
- ✅ Can self-register via:
  - Driver App
  - Dedicated landing page
- ⚠️ Cannot access bookings until:
  - Documents uploaded
  - Profile photo uploaded
  - Admin/Operator verification
  - Admin/Operator activation
  - Allocated to an operator
- 📱 Receives:
  - Filtered bookings (based on vehicle category)
  - Price after platform + operator commission
  - Booking notifications

### 4. **CUSTOMER** (Client)
- ✅ Can register via:
  - Landing page
  - Client App (when ready)
- 📱 Can:
  - Create bookings
  - Edit bookings (before driver assignment)
  - Cancel bookings
  - View booking history
  - Make payments

---

## 🔄 COMPLETE FLOW END-TO-END

### **PHASE 1: DRIVER REGISTRATION & ONBOARDING**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DRIVER REGISTRATION                                      │
└─────────────────────────────────────────────────────────────┘

Driver App / Landing Page
   ↓
Create Account (Supabase Auth)
   ↓
Profile Creation
   ↓
Upload Documents:
   - Driver's License
   - Insurance
   - Vehicle Registration
   - MOT Certificate
   - PCO License (if applicable)
   ↓
Upload Profile Photo
   ↓
STATUS: "pending_verification"
   ↓
🔔 NOTIFICATION → Admins + Operators
   "New driver registered: [Name]"

┌─────────────────────────────────────────────────────────────┐
│ 2. ADMIN/OPERATOR VERIFICATION                              │
└─────────────────────────────────────────────────────────────┘

Admin/Operator receives notification
   ↓
Navigate to /users/drivers/pending
   ↓
Review Documents:
   ✅ Check driver's license validity
   ✅ Verify insurance coverage
   ✅ Confirm vehicle registration
   ✅ Verify MOT certificate
   ✅ Check PCO license (if required)
   ↓
Verify Vehicle Details:
   - Make: Mercedes
   - Model: S Class
   - Year: 2020
   - Color: Black
   - License Plate: AB12 CDE
   ↓
Assign Vehicle Category & Tags:
   - Category: LUX
   - Specific Model Tag: "Mercedes S Class"
   ↓
Assign to Operator:
   - Select operator from dropdown
   ↓
Activate Driver
   ↓
STATUS: "pending_verification" → "active"
   ↓
🔔 NOTIFICATION → Driver
   "Your account has been activated!"
   ↓
Driver can now see bookings (filtered by category)
```

---

### **PHASE 2: CUSTOMER BOOKING CREATION**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CUSTOMER CREATES BOOKING                                 │
└─────────────────────────────────────────────────────────────┘

Landing Page / Client App
   ↓
Customer Login/Register
   ↓
Booking Form:
   - Trip Type: Oneway/Return/Hourly
   - Pickup: Heathrow Terminal 5
   - Dropoff: Central London
   - Date & Time: 2025-01-15 14:00
   - Passengers: 2
   - Bags: 1
   - Child Seats: 0
   - Flight Number: BA123
   ↓
Select Vehicle:
   Option 1: "Any Executive Vehicle" (BMW 5, Mercedes E, Audi A6)
   Option 2: "Mercedes E Class Only"
   Option 3: "Any Luxury Vehicle" (Mercedes S, BMW 7, Audi A8)
   Option 4: "Mercedes S Class Only"
   ↓
🗺️ AUTO-CALCULATE:
   - Distance: 20.5 miles
   - Duration: 45 minutes
   ↓
💰 PRICE CALCULATION:
   Base Price (Executive): £85
   Distance (20.5 × £2.50): £51.25
   Services (Meet & Greet): £15
   ─────────────────────────
   CUSTOMER PRICE: £151.25
   ↓
Payment:
   - Method: Card
   - Amount: £151.25
   - Status: Paid
   ↓
Create Booking → Supabase
   STATUS: "NEW"
   ↓
🔔 NOTIFICATIONS:
   → Admin: "New booking #BK-001234"
   → Operator: "New booking #BK-001234"
   → Available Drivers (filtered): "New booking available"

┌─────────────────────────────────────────────────────────────┐
│ 2. DRIVER SEES BOOKING (FILTERED)                           │
└─────────────────────────────────────────────────────────────┘

Driver App opens
   ↓
Check Driver Details:
   - Category: EXEC
   - Specific Model: "Mercedes E Class"
   ↓
Booking Filter Logic:
   IF booking.category = "EXEC" AND booking.specific_model = "Any":
      → SHOW to all EXEC drivers
   ELSE IF booking.category = "EXEC" AND booking.specific_model = "Mercedes E Class":
      → SHOW only to Mercedes E Class drivers
   ↓
Driver sees:
   - Pickup: Heathrow Terminal 5
   - Dropoff: Central London
   - Date/Time: 2025-01-15 14:00
   - Distance: 20.5 miles
   - Duration: 45 minutes
   ↓
💰 DRIVER PRICE CALCULATION:
   Customer Price: £151.25
   Platform Commission (15%): -£22.69
   Operator Commission (10%): -£15.13
   ─────────────────────────
   DRIVER PRICE: £113.43
   ↓
Driver clicks "ACCEPT"
   ↓
STATUS: "NEW" → "ASSIGNED"
   ↓
🔔 NOTIFICATIONS:
   → Customer: "Driver assigned: [Name]"
   → Admin: "Booking assigned to [Driver]"
   → Operator: "Booking assigned to [Driver]"

┌─────────────────────────────────────────────────────────────┐
│ 3. OPERATOR DASHBOARD VIEW                                  │
└─────────────────────────────────────────────────────────────┘

Operator Dashboard (/operator/dashboard)
   ↓
Sees Booking #BK-001234:
   - Customer: John Doe
   - Route: Heathrow → Central
   - Driver: Michael Smith
   ↓
💰 OPERATOR VIEW:
   Customer Price: £151.25
   Platform Commission (15%): -£22.69
   ─────────────────────────
   PRICE AFTER PLATFORM: £128.56
   Operator Commission (10%): +£15.13
   Driver Price: £113.43

┌─────────────────────────────────────────────────────────────┐
│ 4. ADMIN DASHBOARD VIEW                                     │
└─────────────────────────────────────────────────────────────┘

Admin Dashboard (/dashboard)
   ↓
Sees ALL bookings:
   #BK-001234 - NEW → ASSIGNED
   ↓
💰 ADMIN VIEW (Full Breakdown):
   Customer Price: £151.25
   Platform Commission (15%): £22.69
   Operator Commission (10%): £15.13
   Driver Price: £113.43
   ↓
Can see:
   - All operators
   - All drivers
   - All bookings
   - Full financial breakdown
```

---

### **PHASE 3: BOOKING STATUS FLOW**

```
Booking Lifecycle:

1. NEW
   ↓ (Driver accepts)
2. ASSIGNED
   ↓ (Driver starts journey)
3. EN_ROUTE_TO_PICKUP
   ↓ (Driver arrives at pickup)
4. ARRIVED_AT_PICKUP
   ↓ (Customer on board)
5. IN_PROGRESS
   ↓ (Arrives at destination)
6. ARRIVED_AT_DROPOFF
   ↓ (Customer dropped off)
7. COMPLETED
   ↓ (Payment processed)
8. PAID

Alternative Statuses:
- CANCELLED (by customer/admin)
- NO_SHOW (customer didn't show up)
- DRIVER_CANCELLED (driver cancelled)
```

---

### **PHASE 4: BOOKING EDITING SCENARIOS**

```
┌─────────────────────────────────────────────────────────────┐
│ SCENARIO 1: Customer wants to change pickup                │
└─────────────────────────────────────────────────────────────┘

Original: Heathrow Terminal 5 → Central London
New: Gatwick Airport → Central London
   ↓
Admin/Operator edits booking:
   - Change pickup from LHR to Gatwick
   - Recalculate distance: 20.5mi → 28.3mi
   - Recalculate price: £151.25 → £175.50
   - Price difference: +£24.25
   ↓
IF price increases:
   - Update booking.price = £175.50
   - Create payment_adjustment record:
     - booking_id: #BK-001234
     - amount: £24.25
     - status: "pending"
     - payment_link: generated Stripe link
   - Send email to customer:
     Subject: "Booking Update - Additional Payment Required"
     Body: "Your booking has been updated. Please pay £24.25"
     Link: [Pay Now]
   ↓
Customer pays difference
   ↓
payment_adjustment.status = "paid"

┌─────────────────────────────────────────────────────────────┐
│ SCENARIO 2: Customer cancels booking                       │
└─────────────────────────────────────────────────────────────┘

Admin/Operator changes status:
   STATUS: "ASSIGNED" → "CANCELLED"
   cancellation_reason: "Customer request"
   cancelled_by: "admin" / "customer"
   cancelled_at: timestamp
   ↓
Refund Logic:
   IF cancellation > 24h before pickup:
      → Full refund (100%)
   ELSE IF cancellation 12-24h before:
      → Partial refund (50%)
   ELSE:
      → No refund (0%)
   ↓
Create refund record
Send email to customer

┌─────────────────────────────────────────────────────────────┐
│ SCENARIO 3: Change date/time                               │
└─────────────────────────────────────────────────────────────┘

Original: 2025-01-15 14:00
New: 2025-01-16 10:00
   ↓
Admin/Operator edits:
   - Update start_at
   - Check driver availability
   - IF driver not available:
     → Unassign driver
     → STATUS: "ASSIGNED" → "NEW"
     → Notify available drivers
   ↓
No price change (same route)
Send update email to customer & driver
```

---

## 🏗️ IMPLEMENTATION PHASES

### **PHASE 1: CORE USER MANAGEMENT** 🔴 P0 - CRITICAL
**Timeline: 2-3 days**

#### Pages to Build:
1. `/users/create` - Create any user type
2. `/users/[id]/edit` - Edit user details
3. `/users/drivers/pending` - Driver verification queue

#### Features:
- ✅ Create User Modal (Customer/Admin/Operator/Driver)
- ✅ Edit User Modal
- ✅ Delete User with confirmation
- ✅ User role assignment
- ✅ Operator assignment for drivers

#### Database:
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT; -- active, pending, suspended
ALTER TABLE users ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_category TEXT; -- EXEC, LUX, SUV, VAN
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT; -- pending, verified, rejected
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id);
```

---

### **PHASE 2: DRIVER ONBOARDING & DOCUMENTS** 🔴 P0 - CRITICAL
**Timeline: 3-4 days**

#### Pages to Build:
1. `/users/drivers/pending` - Verification queue
2. `/users/drivers/[id]/documents` - Document review page
3. `/users/drivers/[id]/verify` - Verification modal

#### Features:
- ✅ Document upload storage (Supabase Storage)
- ✅ Document viewer (PDF, images)
- ✅ Verification workflow
- ✅ Vehicle categorization
- ✅ Operator assignment
- ✅ Activation/deactivation

#### Database:
```sql
CREATE TABLE driver_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES users(id) NOT NULL,
  document_type TEXT NOT NULL, -- license, insurance, registration, mot, pco
  file_url TEXT NOT NULL,
  file_name TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  expiry_date DATE,
  notes TEXT
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES users(id) NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  license_plate TEXT UNIQUE,
  category TEXT NOT NULL, -- EXEC, LUX, SUV, VAN
  specific_model_tag TEXT, -- "Mercedes S Class", "BMW 5 Series", etc.
  seats INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **PHASE 3: OPERATOR DASHBOARD** 🟡 P1 - HIGH
**Timeline: 2-3 days**

#### Pages to Build:
1. `/operator/dashboard` - Operator-specific dashboard
2. `/operator/bookings` - Operator bookings list
3. `/operator/drivers` - Operator's drivers
4. `/operator/settings` - Commission settings

#### Features:
- ✅ Filtered dashboard (only operator's data)
- ✅ Commission display
- ✅ Driver management
- ✅ Booking assignment

#### Database:
```sql
CREATE TABLE operator_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  commission_percentage DECIMAL(5,2) DEFAULT 10.00,
  platform_commission_percentage DECIMAL(5,2) DEFAULT 15.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **PHASE 4: BOOKING EDIT & STATUS MANAGEMENT** 🔴 P0 - CRITICAL
**Timeline: 3-4 days**

#### Pages to Build:
1. `/bookings/[id]/edit` - Edit booking page
2. `/bookings/[id]/status` - Status change modal
3. `/bookings/[id]/cancel` - Cancellation modal

#### Features:
- ✅ Edit pickup/dropoff (with recalculation)
- ✅ Edit date/time
- ✅ Edit vehicle category
- ✅ Edit passengers/bags
- ✅ Status management
- ✅ Cancellation with refund logic
- ✅ Payment adjustments

#### Database:
```sql
CREATE TABLE booking_edits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  edited_by UUID REFERENCES users(id) NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  price_difference DECIMAL(10,2),
  edited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  payment_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
```

---

### **PHASE 5: VEHICLE CATEGORIZATION & SMART FILTERING** 🟡 P1 - HIGH
**Timeline: 2-3 days**

#### Pages to Build:
1. `/settings/vehicle-categories` - Category management
2. `/settings/vehicle-models` - Model tag management

#### Features:
- ✅ Create/edit vehicle categories
- ✅ Create/edit specific model tags
- ✅ Smart booking filtering for drivers
- ✅ "Any vehicle" vs "Specific model" logic

#### Filter Logic:
```typescript
// Booking filter for drivers
function getAvailableBookingsForDriver(driver) {
  const bookings = await getNewBookings();
  
  return bookings.filter(booking => {
    // Category match
    if (booking.category !== driver.vehicle_category) return false;
    
    // Specific model logic
    if (booking.specific_model && booking.specific_model !== 'any') {
      return booking.specific_model === driver.vehicle_specific_model_tag;
    }
    
    // "Any vehicle" in category
    return true;
  });
}
```

---

### **PHASE 6: PAYMENT ADJUSTMENTS & EMAIL NOTIFICATIONS** 🟡 P1 - HIGH
**Timeline: 2-3 days**

#### Pages to Build:
1. `/bookings/[id]/payment-adjustments` - Payment adjustment page
2. `/settings/email-templates` - Email template management

#### Features:
- ✅ Generate payment links (Stripe)
- ✅ Send adjustment emails
- ✅ Track payment status
- ✅ Email templates for:
  - Booking confirmation
  - Driver assignment
  - Booking update
  - Payment adjustment
  - Cancellation
  - Refund

#### Email Service:
```typescript
// Email templates
const templates = {
  PAYMENT_ADJUSTMENT: {
    subject: 'Booking Update - Additional Payment Required',
    body: `
      Hi {{customer_name}},
      
      Your booking #{{booking_id}} has been updated.
      
      Changes:
      {{changes_list}}
      
      Additional payment required: £{{amount}}
      
      Please pay here: {{payment_link}}
    `
  }
};
```

---

### **PHASE 7: DYNAMIC PRICING MANAGEMENT** 🟡 P1 - HIGH
**Timeline: 3-4 days**

#### Pages to Build:
1. `/prices` - Existing page enhancement
2. `/prices/base-rates` - Base price management
3. `/prices/per-mile-rates` - Per-mile rate management
4. `/prices/hourly-rates` - Hourly rate management
5. `/prices/commissions` - Commission settings

#### Features:
- ✅ Edit base prices per category
- ✅ Edit per-mile rates
- ✅ Edit hourly rates
- ✅ Platform commission settings
- ✅ Operator commission defaults
- ✅ Price history/audit log

#### Database:
```sql
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- EXEC, LUX, SUV, VAN
  base_price DECIMAL(10,2) NOT NULL,
  price_per_mile DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_until DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commission_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  default_operator_commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  effective_from DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 PRIORITY MATRIX

### 🔴 **P0 - CRITICAL (Do First)**
1. **User Management** (Create/Edit/Delete) - 2-3 days
2. **Driver Verification & Documents** - 3-4 days
3. **Booking Edit & Status** - 3-4 days

**Total: ~8-11 days**

### 🟡 **P1 - HIGH (Do Next)**
4. **Operator Dashboard** - 2-3 days
5. **Vehicle Categorization & Filtering** - 2-3 days
6. **Payment Adjustments & Emails** - 2-3 days
7. **Dynamic Pricing Management** - 3-4 days

**Total: ~9-13 days**

### 🟢 **P2 - MEDIUM (Nice to Have)**
8. Financial Reports
9. Analytics Dashboard
10. Audit Logs

---

## 🎯 RECOMMENDED APPROACH

### Week 1: Core User Management
- ✅ Build Create/Edit/Delete modals
- ✅ Implement role-based access
- ✅ Test all user types

### Week 2: Driver Onboarding
- ✅ Document upload system
- ✅ Verification workflow
- ✅ Vehicle categorization
- ✅ Operator assignment

### Week 3: Booking Management
- ✅ Edit booking functionality
- ✅ Status management
- ✅ Price recalculation
- ✅ Payment adjustments

### Week 4: Advanced Features
- ✅ Operator dashboard
- ✅ Smart filtering
- ✅ Email notifications
- ✅ Pricing management

---

## 🔄 INTEGRATION POINTS

### Supabase:
- ✅ Auth (already configured)
- ✅ Database (Postgres)
- ✅ Storage (documents, photos)
- ✅ Realtime (booking updates)

### External Services:
- ✅ Stripe (payments)
- ✅ SendGrid/Resend (emails)
- ✅ Google Maps (already integrated)

---

## ✅ NEXT IMMEDIATE STEPS

**START WITH:** Phase 1 - Core User Management

1. Create `/users/create` modal
2. Create `/users/[id]/edit` modal
3. Implement Delete user functionality
4. Add role assignment dropdown
5. Test with all user types

**Să încep cu PHASE 1?** 🚀
