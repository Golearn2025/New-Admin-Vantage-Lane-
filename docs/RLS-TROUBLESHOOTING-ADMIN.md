# 🔒 SUPABASE RLS TROUBLESHOOTING - ADMIN ACCESS GUIDE

## 🚨 PROBLEMA CLASICĂ: "Admin nu vede users/bookings"

### CAUZA ROOT:
**RLS Policies inconsistente între tabele!**

---

## 📋 DIAGNOSTIC RAPID

### STEP 1: Identifică ce NU vezi
```bash
# Test în browser - check Network tab
GET /api/users/list
Response: {"data": [...], "total": X}

# Compară cu database direct:
```

```sql
-- Verifică câți ar trebui să fie
SELECT 'customers' as table_name, COUNT(*) FROM customers WHERE deleted_at IS NULL
UNION ALL
SELECT 'drivers' as table_name, COUNT(*) FROM drivers WHERE deleted_at IS NULL  
UNION ALL
SELECT 'admin_users' as table_name, COUNT(*) FROM admin_users WHERE deleted_at IS NULL
UNION ALL
SELECT 'organizations' as table_name, COUNT(*) FROM organizations WHERE deleted_at IS NULL AND org_type = 'operator';
```

### STEP 2: Verifică RLS policies
```sql
-- Vezi toate policies pentru tabele problematice
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('customers', 'drivers', 'admin_users', 'organizations', 'bookings')
ORDER BY tablename, policyname;
```

---

## 🎯 PATTERNS RLS CORECTE

### ✅ PATTERN CORECT (folosit pentru bookings, customers, admin_users):
```sql
-- Policy care funcționează CORECT
CREATE POLICY table_admin_all_fixed ON table_name
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users au 
    WHERE au.auth_user_id = auth.uid() 
      AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[])
      AND COALESCE(au.is_active, true) = true
  )
);
```

### ❌ PATTERN GREȘIT (era pentru drivers):
```sql
-- Policy care NU funcționează (JWT role)
CREATE POLICY drivers_admin_all ON drivers
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);
-- PROBLEMA: User-ul are role în raw_user_meta_data, NU în JWT!
```

---

## 🛠️ FIX RECIPE - STEP BY STEP

### Pentru orice tabel care nu apare la admin:

#### 1. Identifică policy-ul greșit:
```sql
SELECT policyname, qual 
FROM pg_policies 
WHERE tablename = 'PROBLEM_TABLE' 
  AND qual LIKE '%auth.jwt%';
```

#### 2. Drop policy-ul greșit:
```sql
DROP POLICY IF EXISTS old_policy_name ON table_name;
```

#### 3. Creează policy corect:
```sql
CREATE POLICY table_admin_all_fixed ON table_name
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users au 
    WHERE au.auth_user_id = auth.uid() 
      AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[])
      AND COALESCE(au.is_active, true) = true
  )
);
```

#### 4. Test imediat:
```sql
-- Test direct în Supabase
SELECT COUNT(*) FROM table_name;
-- Ar trebui să returneze rows pentru admin
```

---

## 📊 VERIFICARE COMPLETĂ ADMIN ACCESS

### Test Script - rulează în Supabase SQL Editor:
```sql
-- 1. Verifică admin user există
SELECT 'admin_check' as test, 
       COUNT(*) as result
FROM admin_users 
WHERE auth_user_id = 'b99e1183-fd54-4c62-99b1-b3283de298c0'  -- REPLACE cu ID-ul tău
  AND role = 'admin' 
  AND is_active = true;

-- 2. Test access la fiecare tabel
SELECT 'customers_access' as test, COUNT(*) as result FROM customers WHERE deleted_at IS NULL;
SELECT 'drivers_access' as test, COUNT(*) as result FROM drivers WHERE deleted_at IS NULL;  
SELECT 'admin_users_access' as test, COUNT(*) as result FROM admin_users WHERE deleted_at IS NULL;
SELECT 'bookings_access' as test, COUNT(*) as result FROM bookings LIMIT 10;
SELECT 'organizations_access' as test, COUNT(*) as result FROM organizations WHERE deleted_at IS NULL;

-- Expected results: toate > 0
```

---

## 🚀 API ENDPOINTS VERIFICATION

### Test API responses:
```bash
# În browser Network tab sau curl:

# Users API
GET /api/users/list
Expected: {"total": 14+, "data": [...customers, drivers, admins, operators...]}

# Bookings API  
GET /api/bookings/list?page=1&page_size=25
Expected: {"pagination": {"total_count": 100+}, "data": [...]}

# Dashboard APIs
GET /api/dashboard/metrics
GET /api/dashboard/charts
Expected: Full data, no empty arrays
```

---

## 🎯 USER-UL TĂU (catalin@vantage-lane.com)

### Verificări specifice:
```sql
-- 1. User ID și role
SELECT id, email, raw_user_meta_data ->> 'role' as metadata_role
FROM auth.users 
WHERE email = 'catalin@vantage-lane.com';
-- Expected: id = b99e1183-fd54-4c62-99b1-b3283de298c0, metadata_role = admin

-- 2. Admin users entry
SELECT id, auth_user_id, email, role, is_active
FROM admin_users 
WHERE auth_user_id = 'b99e1183-fd54-4c62-99b1-b3283de298c0';
-- Expected: role = admin, is_active = true

-- 3. Policy test direct
SELECT EXISTS (
  SELECT 1 
  FROM admin_users au 
  WHERE au.auth_user_id = 'b99e1183-fd54-4c62-99b1-b3283de298c0'
    AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[])
    AND COALESCE(au.is_active, true) = true
) as admin_policy_passes;
-- Expected: true
```

---

## 🚨 EMERGENCY FIX COMMANDS

### Dacă totul se strică, rulează în ordine:

```sql
-- 1. Fix drivers policy
DROP POLICY IF EXISTS drivers_admin_all ON drivers;
CREATE POLICY drivers_admin_all_fixed ON drivers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid() AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[]) AND COALESCE(au.is_active, true) = true));

-- 2. Fix customers policy (dacă e nevoie)
DROP POLICY IF EXISTS customers_admin_all ON customers;  
CREATE POLICY customers_admin_all_fixed ON customers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid() AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[]) AND COALESCE(au.is_active, true) = true));

-- 3. Fix organizations policy
DROP POLICY IF EXISTS organizations_admin_all ON organizations;
CREATE POLICY organizations_admin_all_fixed ON organizations FOR ALL TO authenticated  
USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid() AND au.role::text = ANY(ARRAY['admin'::varchar, 'support'::varchar]::text[]) AND COALESCE(au.is_active, true) = true));

-- 4. Verify bookings policy exists
SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND policyname LIKE '%admin%';
-- Should show: bookings_admin_all_fixed
```

---

## 🎯 QUICK DIAGNOSTICS CHECKLIST

### Când admin nu vede ceva:

- [ ] **Step 1:** Check API response în Network tab
- [ ] **Step 2:** Count rows direct în Supabase SQL  
- [ ] **Step 3:** Verifică RLS policies pentru tabelul respectiv
- [ ] **Step 4:** Caută policy cu `auth.jwt()` (bad pattern)
- [ ] **Step 5:** Replace cu policy cu `admin_users` check
- [ ] **Step 6:** Test din nou API + refresh browser

### Red flags în policies:
❌ `auth.jwt() ->> 'role'` 
❌ `(auth.uid() = some_specific_id)`
❌ Policy missing pentru admin
✅ `EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()...)`

---

## 💾 SALVEAZĂ ACEASTĂ SOLUȚIE!

**Project ID Supabase:** `fmeonuvmlopkutbjejlo`
**Admin User ID:** `b99e1183-fd54-4c62-99b1-b3283de298c0` (catalin@vantage-lane.com)

Când ai din nou probleme cu access la data, urmează exact acești pași!

---

## 📞 CONTACT PENTRU FIX-URI

**Dacă se strică din nou:**
1. Urmează DIAGNOSTIC RAPID
2. Rulează EMERGENCY FIX COMMANDS  
3. Verifică cu TEST SCRIPT
4. Refresh browser + clear cache

**99% din probleme se rezolvă cu acești pași!**
