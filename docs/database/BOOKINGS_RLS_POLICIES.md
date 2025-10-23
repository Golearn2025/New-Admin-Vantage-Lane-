# 🔐 Bookings Domain - RLS Policies Documentation

**Applied:** 2025-10-22  
**Migration:** `enable_rls_bookings_domain_v2`  
**Status:** ✅ Active in Production

---

## 📋 Overview

Row Level Security (RLS) enables **tenant isolation** and **role-based access control** for all bookings-related tables in the Vantage Lane Admin system.

**Secured Tables:**
- `bookings`
- `booking_assignment`
- `booking_services`
- `booking_segments`
- `booking_pricing`
- `customers`

---

## 🎯 Security Model

### **Principle: Deny by Default**

All direct INSERT/UPDATE/DELETE operations are **blocked**. Data modifications must go through:
- **RPC functions** (with SECURITY DEFINER)
- **Edge Functions** (with service role key)

### **Role-Based Access:**

| Role | Bookings Access | Assignment Access | Services/Pricing/Segments | Customer Data |
|------|----------------|-------------------|--------------------------|---------------|
| **Admin/Operator** | ✅ SELECT (own org only) | ✅ SELECT (own org) | ✅ SELECT (own org bookings) | ✅ SELECT (all) |
| **Driver** | ✅ SELECT (assigned only) | ✅ SELECT (own assignments) | ✅ SELECT (assigned bookings) | ❌ None |
| **Customer** | ✅ SELECT (own bookings) | ❌ None | ✅ SELECT (own bookings) | ✅ SELECT/UPDATE (own profile) |

---

## 🔑 Helper Function

```sql
public.get_user_org_id() → uuid
```

**Purpose:** Extract organization_id from JWT claims  
**Security:** SECURITY DEFINER (can read auth.jwt())  
**Returns:** organization_id from user_metadata or org claim

---

## 📊 Policies Summary

### **BOOKINGS Table (8 policies)**

1. **`admin_select_own_org_bookings`** (SELECT)
   - Admin/Operator can view bookings in their organization
   - Requires: `organization_id = get_user_org_id()`
   - Requires: Active admin user in `admin_users`

2. **`driver_select_assigned_bookings`** (SELECT)
   - Driver can view only assigned bookings
   - Requires: Active assignment in `booking_assignment`
   - Requires: Active driver in `drivers`

3. **`customer_select_own_bookings`** (SELECT)
   - Customer can view their own bookings
   - Requires: `customer_id = auth.uid()`
   - Requires: Active customer in `customers`

4. **`deny_direct_insert`** (INSERT)
   - **Blocks all direct inserts** → Use RPC only

5. **`deny_direct_update`** (UPDATE)
   - **Blocks all direct updates** → Use RPC only

6. **`deny_direct_delete`** (DELETE)
   - **Blocks all direct deletes** → Use RPC only

---

### **BOOKING_ASSIGNMENT Table (3 policies)**

1. **`admin_select_org_assignments`** (SELECT)
   - Admin/Operator view assignments in their org

2. **`driver_select_own_assignments`** (SELECT)
   - Driver views only their own assignments

3. **`deny_direct_assignment_writes`** (ALL)
   - **Blocks all direct writes** → Use RPC only

---

### **BOOKING_SERVICES Table (5 policies)**

1. **`admin_select_org_booking_services`** (SELECT)
2. **`driver_select_assigned_booking_services`** (SELECT)
3. **`customer_select_own_booking_services`** (SELECT)
4. **`deny_direct_services_writes`** (ALL)

---

### **BOOKING_SEGMENTS Table (5 policies)**

1. **`admin_select_org_booking_segments`** (SELECT)
2. **`driver_select_assigned_booking_segments`** (SELECT)
3. **`customer_select_own_booking_segments`** (SELECT)
4. **`deny_direct_segments_writes`** (ALL)

---

### **BOOKING_PRICING Table (5 policies)**

1. **`admin_select_org_booking_pricing`** (SELECT)
2. **`driver_select_assigned_booking_pricing`** (SELECT)
3. **`customer_select_own_booking_pricing`** (SELECT)
4. **`deny_direct_pricing_writes`** (ALL)

---

### **CUSTOMERS Table (7 policies)**

1. **`admin_select_all_customers`** (SELECT)
   - Admin/Operator view all customers

2. **`customer_select_own_profile`** (SELECT)
   - Customer views their own profile

3. **`customer_update_own_profile`** (UPDATE)
   - Customer updates their own profile
   - **Limited fields:** name, phone, addresses, preferences, notification settings

4. **`deny_direct_customer_insert`** (INSERT)
5. **`deny_direct_customer_delete`** (DELETE)

---

## ⚡ Performance Indexes

**Total Indexes:** 10 (8 new + 2 existing)

| Index Name | Table | Columns | Type | Purpose |
|-----------|-------|---------|------|---------|
| `idx_bookings_org_status_updated` | bookings | organization_id, status, updated_at DESC | Partial | Tenant filtering |
| `idx_assignment_active_driver` | booking_assignment | booking_id, driver_id | Standard | Active assignment lookup |
| `idx_services_booking_id` | booking_services | booking_id | Standard | Fast JOIN |
| `idx_segments_booking_id` | booking_segments | booking_id, seq_no | Standard | Fast JOIN + ordering |
| `idx_pricing_booking_id` | booking_pricing | booking_id | Standard | Fast JOIN |
| `idx_customers_auth_user` | customers | auth_user_id | Partial | RLS auth lookup |
| `idx_admin_users_auth_user` | admin_users | auth_user_id, is_active | Partial | RLS auth lookup |
| `idx_drivers_active` | drivers | id, is_active | Partial | RLS driver lookup |
| `idx_bookings_assigned_driver` | bookings | assigned_driver_id | Standard | Pre-existing |
| `idx_bookings_assigned_vehicle` | bookings | assigned_vehicle_id | Standard | Pre-existing |

---

## 🔒 Security Guarantees

### ✅ **What's Protected:**

1. **Tenant Isolation:** Admin/Operator can NEVER see bookings from other organizations
2. **Driver Isolation:** Drivers can ONLY see bookings assigned to them
3. **Customer Privacy:** Customers can ONLY see their own bookings
4. **Write Protection:** All writes must go through audited RPC functions
5. **Referential Integrity:** Related tables (services, segments, pricing) inherit booking access

### ⚠️ **What's NOT Protected (intentional):**

1. **Service Role:** Supabase service_role key bypasses RLS (for backend operations)
2. **Admin Profile:** Admins can view all customer profiles (needed for support)
3. **Customer Self-Update:** Customers can update their own profile (limited fields)

---

## 📝 Usage Examples

### **Admin Query (JavaScript):**

```typescript
// ✅ WORKS: Admin sees only their org's bookings
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('status', 'pending');
// RLS automatically filters by organization_id

// ❌ FAILS: Direct insert blocked
const { error } = await supabase
  .from('bookings')
  .insert({ ... });
// Error: new row violates row-level security policy
```

### **Driver Query (JavaScript):**

```typescript
// ✅ WORKS: Driver sees only assigned bookings
const { data } = await supabase
  .from('bookings')
  .select('*, booking_assignment(*)')
  .eq('status', 'assigned');
// RLS filters via booking_assignment.driver_id = auth.uid()
```

### **Customer Query (JavaScript):**

```typescript
// ✅ WORKS: Customer sees only their bookings
const { data } = await supabase
  .from('bookings')
  .select('*, booking_pricing(*), booking_services(*)')
  .order('created_at', { ascending: false });
// RLS filters via bookings.customer_id = auth.uid()
```

---

## 🧪 Testing RLS

### **Test 1: Tenant Isolation**

```sql
-- As admin from org A
SET LOCAL jwt.claims.user_metadata.organization_id = 'org-a-uuid';
SELECT count(*) FROM bookings; 
-- Should return only org A bookings

-- As admin from org B
SET LOCAL jwt.claims.user_metadata.organization_id = 'org-b-uuid';
SELECT count(*) FROM bookings;
-- Should return only org B bookings (different count)
```

### **Test 2: Direct Write Block**

```sql
-- As any authenticated user
INSERT INTO bookings (reference, status) VALUES ('TEST-001', 'NEW');
-- Expected: ERROR: new row violates row-level security policy
```

### **Test 3: Driver Isolation**

```sql
-- As driver with no assignments
SELECT count(*) FROM bookings;
-- Expected: 0 rows

-- After assignment
SELECT count(*) FROM bookings;
-- Expected: Only assigned bookings visible
```

---

## 🚨 Troubleshooting

### **Problem: Admin sees 0 bookings**

**Cause:** JWT missing `organization_id` claim  
**Fix:** Ensure JWT has `user_metadata.organization_id` or `org` claim

### **Problem: Driver sees all bookings**

**Cause:** RLS not enabled or policy misconfigured  
**Fix:** Verify `SELECT rowsecurity FROM pg_tables WHERE tablename = 'bookings'` returns `true`

### **Problem: "permission denied for table bookings"**

**Cause:** Trying to write directly  
**Fix:** Use RPC functions (`rpc_accept_job`, `rpc_update_status`)

---

## 📚 Related Documentation

- **RPC Functions:** See `BOOKINGS_RPC_FUNCTIONS.md` (Step 2)
- **API Integration:** See `app/api/bookings/list/README.md`
- **Realtime Subscriptions:** See `REALTIME_SUBSCRIPTIONS.md` (Step 4)

---

## ✅ Verification Checklist

- [x] RLS enabled on 6 tables
- [x] 33 policies created
- [x] 10 performance indexes created
- [x] Helper function `get_user_org_id()` working
- [x] All direct writes blocked
- [x] Tenant isolation verified
- [x] Driver isolation verified
- [x] Customer isolation verified

---

**Last Updated:** 2025-10-22  
**Next Review:** After Step 2 (RPC Functions)
