# 🛡️ SECURITY - SUPABASE RBAC & RLS

**Owner:** Engineering Team  
**Scope:** Security implementation  
**Last Updated:** 2025-11-27  
**Status:** ACTIVE

## 🔐 SUPABASE PROJECT INFO

**Project ID:** `fmeonuvmlopkutbjejlo`  
**Project Name:** "Vantage Lane NEW DB"  
**Region:** eu-west-2  
**Status:** ACTIVE_HEALTHY

## 👥 USER ROLES MATRIX

| Role | Description | Permissions | Database Tables Access |
|------|-------------|-------------|------------------------|
| **admin** | Platform administrators | Full access to everything | All tables (no RLS restrictions) |
| **operator** | Transport companies | Limited to their organization | Filtered by organization_id |
| **driver** | Vehicle drivers | Personal data + assigned bookings | Filtered by auth_user_id |
| **customer** | Booking creators | Landing page only | Not in admin dashboard |

## 📊 DATABASE TABLES & RLS POLICIES

### 🔴 ADMIN-ONLY TABLES (No RLS)
```sql
admin_users              -- Platform admins
user_organization_roles  -- Role assignments
organizations           -- Operator companies (admins see all)
```

### 🟡 OPERATOR-FILTERED TABLES
```sql
-- RLS Policy: WHERE organization_id = current_user_organization()

drivers                 -- Only their drivers
bookings               -- Only their bookings (price - commission)
vehicles               -- Only their vehicles
driver_documents       -- Only their drivers' documents
```

### 🟢 DRIVER-FILTERED TABLES  
```sql
-- RLS Policy: WHERE auth_user_id = auth.uid()

driver_profiles        -- Own profile only
driver_earnings        -- Own earnings only
driver_notifications   -- Own notifications only
```

### 🔵 SHARED TABLES (Role-based RLS)
```sql
notifications          -- Filtered by recipient_role + organization
reviews                -- Public read, restricted write
safety_incidents       -- Role-based visibility
```

## 🔒 RLS POLICY EXAMPLES

### Operators See Only Their Data
```sql
CREATE POLICY "operators_own_drivers" ON drivers
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organization_roles 
    WHERE auth_user_id = auth.uid()
  )
);
```

### Drivers See Only Personal Data
```sql
CREATE POLICY "drivers_own_profile" ON driver_profiles  
FOR ALL TO authenticated
USING (auth_user_id = auth.uid());
```

### Admins Bypass All RLS
```sql
-- Admins have bypassrls attribute set in database
-- OR explicit policy:
CREATE POLICY "admins_full_access" ON bookings
FOR ALL TO authenticated  
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE auth_user_id = auth.uid()
  )
);
```

## 🎯 ROLE DETECTION (Frontend)

### useCurrentUser Hook Pattern:
```typescript
export function useCurrentUser() {
  // 1. Check admin_users table
  if (adminUser) return { role: 'admin', ...adminUser };
  
  // 2. Check user_organization_roles  
  if (organizationRole) return { role: 'operator', ...organizationRole };
  
  // 3. Check drivers table
  if (driverProfile) return { role: 'driver', ...driverProfile };
  
  // 4. Default (customers don't access admin)
  return null;
}
```

## 🚨 SECURITY VALIDATION COMMANDS

### Check RLS is Active:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false;
-- Should return 0 rows for production tables
```

### Validate Policies Exist:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Test Role Access:
```sql
-- As operator, should only see their bookings
SELECT COUNT(*) FROM bookings; 

-- As driver, should only see own profile  
SELECT COUNT(*) FROM driver_profiles;
```

## 🛡️ SECURITY CHECKLIST

- [ ] RLS enabled on ALL production tables
- [ ] No sensitive data in localStorage/sessionStorage  
- [ ] Environment variables in `.env.local` only
- [ ] API keys never in client-side code
- [ ] Database connection strings server-side only
- [ ] User roles validated on every API call
- [ ] File uploads validated and sanitized
- [ ] Input validation on all forms
- [ ] XSS protection headers configured
- [ ] CSRF tokens implemented

## 🚫 FORBIDDEN PATTERNS

- Direct database queries from frontend
- Role checks only in UI (must be in RLS)
- Storing passwords in plain text
- Using `SELECT *` without RLS consideration
- Bypassing authentication in development
- Hardcoded API keys in code
- Exposing admin functionality to operators

---

**Security is NON-NEGOTIABLE. All patterns must be validated in production.**
