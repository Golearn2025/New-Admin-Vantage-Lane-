

# 🔐 PERMISSIONS SYSTEM - Complete Guide

**Dynamic Permission Management for Vantage Lane Admin**

---

## 📋 **OVERVIEW**

The Permissions System allows **admins** to control exactly what pages each role or individual user can access in the admin panel. This is managed through a database-driven UI, providing flexibility without code changes.

---

## 🏗️ **ARCHITECTURE**

```
┌─────────────────────────────────────────────┐
│          PERMISSION SYSTEM                  │
├─────────────────────────────────────────────┤
│                                             │
│  DATABASE LAYER:                            │
│  ├── page_definitions (all pages)          │
│  ├── role_permissions (default per role)   │
│  └── user_permissions (user overrides)     │
│                                             │
│  API LAYER (Entity):                        │
│  ├── getPageDefinitions()                  │
│  ├── getRolePermissions(role)              │
│  ├── getUserPermissions(userId)            │
│  ├── updateRolePermission()                │
│  └── updateUserPermission()                │
│                                             │
│  UI LAYER (Feature):                        │
│  └── SettingsPermissions Component          │
│      ├── Role Permissions Tab              │
│      └── User Overrides Tab                │
│                                             │
│  INTEGRATION:                               │
│  └── usePermissionMenu Hook                 │
│      └── Dynamically filters sidebar menu  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 **DATABASE STRUCTURE**

### **1. `page_definitions` Table**

Defines all available pages in the system.

```sql
CREATE TABLE page_definitions (
  id UUID PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,     -- 'operator-dashboard'
  label TEXT NOT NULL,                -- 'Dashboard'
  icon TEXT,                          -- 'dashboard'
  href TEXT NOT NULL,                 -- '/operator/dashboard'
  parent_key TEXT,                    -- NULL or parent page_key
  display_order INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example rows:**
```sql
('operator-dashboard', 'Dashboard', 'dashboard', '/operator/dashboard', NULL, 1)
('users', 'Users', 'users', '/users', NULL, 3)
('users-drivers', 'Drivers', 'users', '/users/drivers', 'users', 2)
```

### **2. `role_permissions` Table**

Default permissions for each role.

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL,           -- 'admin' | 'operator' | etc.
  page_key TEXT NOT NULL,       -- FK to page_definitions
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(role, page_key)
);
```

**Example:**
```sql
('operator', 'operator-dashboard', TRUE)  -- Operator CAN see dashboard
('operator', 'users', FALSE)              -- Operator CANNOT see all users
```

### **3. `user_permissions` Table**

User-specific permission overrides.

```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,        -- Specific user
  page_key TEXT NOT NULL,       -- FK to page_definitions
  enabled BOOLEAN NOT NULL,     -- Override value
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, page_key)
);
```

**Example:**
```sql
-- Give specific operator access to payments
('uuid-123', 'payments', TRUE)
```

---

## 🎨 **UI FEATURES**

### **Route:** `/settings/permissions`

### **Two Main Views:**

#### **1. Role Permissions (Default View)**

Control what ALL users with a specific role can see.

```
┌──────────────────────────────────────┐
│ [Role Permissions] [User Overrides] │
├──────────────────────────────────────┤
│ Select Role: [Operator ▼]           │
├──────────────────────────────────────┤
│ Page                      │ Enabled  │
├──────────────────────────────────────┤
│ 🏠 Dashboard              │ ☑        │
│ 👥 My Drivers             │ ☑        │
│ 📅 Bookings               │ ☑        │
│ 📄 Documents              │ ☐        │
│ ⚙️ Settings               │ ☐        │
│   └─ Vehicle Categories   │ ☐        │
│   └─ Commissions          │ ☐        │
└──────────────────────────────────────┘
```

**Features:**
- Select role from dropdown
- Toggle permissions for each page
- Changes saved immediately
- Applies to ALL users with that role

#### **2. User Overrides**

Grant or revoke specific permissions for individual users.

```
┌──────────────────────────────────────┐
│ [Role Permissions] [User Overrides] │
├──────────────────────────────────────┤
│ User ID: [uuid-123]  [Load]         │
├──────────────────────────────────────┤
│ Page                      │ Enabled  │
├──────────────────────────────────────┤
│ 🏠 Dashboard              │ ☑        │
│ 💳 Payments               │ ☑ 🔧     │  ← Custom override
│ 📅 Bookings               │ ☑        │
└──────────────────────────────────────┘
```

**Features:**
- Enter user UUID
- See role permissions + overrides
- Badge shows "Custom Override"
- Overrides take precedence over role

---

## 🔧 **HOW IT WORKS**

### **Permission Resolution Logic:**

```
For any page and user:
1. Check user_permissions table for this user + page
   → If found: USE THIS VALUE ✅
   
2. If no user override, check role_permissions
   → If found: USE ROLE DEFAULT ✅
   
3. If neither: DENY ACCESS ❌
```

### **Flowchart:**

```
User tries to access /payments
         ↓
Does user have override for 'payments'?
    YES → Use override value (enabled/disabled)
    NO  ↓
Does user's role have permission for 'payments'?
    YES → Use role permission (enabled/disabled)
    NO  ↓
Default: DENY ACCESS
```

---

## 📡 **API FUNCTIONS**

### **Entity: `@entities/permission`**

#### **1. Get Page Definitions**
```typescript
import { getPageDefinitions } from '@entities/permission';

const pages = await getPageDefinitions();
// Returns all active pages in system
```

#### **2. Get Role Permissions**
```typescript
import { getRolePermissions } from '@entities/permission';

const response = await getRolePermissions('operator');
// Returns: { role: 'operator', pages: [...] }
```

#### **3. Update Role Permission**
```typescript
import { updateRolePermission } from '@entities/permission';

await updateRolePermission({
  role: 'operator',
  pageKey: 'payments',
  enabled: true,
});
// Operator can now see payments
```

#### **4. Get User Permissions**
```typescript
import { getUserPermissions } from '@entities/permission';

const response = await getUserPermissions('user-uuid');
// Returns pages with role + user overrides
```

#### **5. Update User Permission**
```typescript
import { updateUserPermission } from '@entities/permission';

await updateUserPermission({
  userId: 'user-uuid',
  pageKey: 'payments',
  enabled: true,
});
// This specific user can now see payments
```

---

## 🎯 **USAGE EXAMPLES**

### **Example 1: Give Operator Access to Payments**

```typescript
// Admin goes to /settings/permissions
// 1. Selects "Operator" role
// 2. Toggles "Payments" checkbox ON
// 3. All operators can now see payments
```

**Behind the scenes:**
```sql
INSERT INTO role_permissions (role, page_key, enabled)
VALUES ('operator', 'payments', TRUE);
```

### **Example 2: Give ONE Operator Special Access**

```typescript
// Admin goes to /settings/permissions
// 1. Clicks "User Overrides" tab
// 2. Enters user UUID: "abc-123"
// 3. Clicks "Load Permissions"
// 4. Toggles "Vehicle Categories" ON
// 5. Only THIS operator sees vehicle categories
```

**Behind the scenes:**
```sql
INSERT INTO user_permissions (user_id, page_key, enabled)
VALUES ('abc-123', 'settings-vehicle-categories', TRUE);
```

### **Example 3: Remove Access**

Same process, just toggle checkbox OFF.

---

## 🔗 **INTEGRATION WITH MENU**

### **Dynamic Menu Loading:**

```typescript
// apps/admin/shared/ui/composed/appshell/usePermissionMenu.ts

export function usePermissionMenu(userId: string, userRole: UserRole) {
  // 1. Fetch user's permissions from DB
  // 2. Filter menu items based on permissions
  // 3. Return filtered menu
}
```

### **Usage in AppShell:**

```typescript
// Layout automatically uses permissions
const { menu } = usePermissionMenu(user.id, user.role);

// Sidebar shows ONLY allowed pages
<SidebarNav menu={menu} ... />
```

---

## 🚀 **SETUP & DEPLOYMENT**

### **Step 1: Run Migrations**

```bash
# In Supabase SQL Editor, run these IN ORDER:
1. database/migrations/006_permissions_system.sql
2. database/migrations/007_permission_functions.sql
```

### **Step 2: Verify Seed Data**

```sql
-- Check pages
SELECT * FROM page_definitions ORDER BY display_order;

-- Check default operator permissions
SELECT * FROM role_permissions WHERE role = 'operator';

-- Check default admin permissions
SELECT * FROM role_permissions WHERE role = 'admin';
```

### **Step 3: Access UI**

```
1. Login as admin
2. Go to: /settings/permissions
3. Select role: "Operator"
4. Toggle permissions as needed
```

---

## 🧪 **TESTING**

### **Test Scenario 1: Role Permissions**

```
1. Login as admin
2. Go to /settings/permissions
3. Select "Operator" role
4. Disable "Bookings"
5. Logout
6. Login as operator (den@vantage-lane.com)
7. Verify: No "Bookings" in sidebar ✅
```

### **Test Scenario 2: User Override**

```
1. Login as admin
2. Go to /settings/permissions
3. Click "User Overrides"
4. Enter operator user UUID
5. Enable "Payments" (even though role has it disabled)
6. Logout
7. Login as that operator
8. Verify: "Payments" appears in sidebar ✅
```

### **Test Scenario 3: Hierarchy**

```
Given:
- Role "operator" → payments: FALSE
- User "abc-123" → payments: TRUE

Result:
- User "abc-123" CAN see payments (override wins) ✅
- Other operators CANNOT see payments (role default) ✅
```

---

## 🔐 **SECURITY**

### **RLS Policies:**

```sql
-- Only admins can modify permissions
CREATE POLICY "Only admins can modify" ON role_permissions
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
```

### **Best Practices:**

1. **Never hardcode page access** - Always check permissions
2. **Use RLS policies** - Database-level security
3. **Audit changes** - Log who modified what
4. **Regular reviews** - Periodically review permissions
5. **Principle of least privilege** - Start with minimal access

---

## 📊 **MONITORING**

### **Useful Queries:**

```sql
-- Most restricted pages
SELECT page_key, COUNT(*) as disabled_roles
FROM role_permissions
WHERE enabled = FALSE
GROUP BY page_key
ORDER BY disabled_roles DESC;

-- Users with most overrides
SELECT user_id, COUNT(*) as override_count
FROM user_permissions
GROUP BY user_id
ORDER BY override_count DESC;

-- Pages nobody can access
SELECT pd.page_key
FROM page_definitions pd
LEFT JOIN role_permissions rp ON rp.page_key = pd.page_key AND rp.enabled = TRUE
WHERE rp.id IS NULL;
```

---

## 🎓 **FAQ**

**Q: What happens if I disable a parent page?**  
A: Children are hidden too. Enable parent to see children.

**Q: Can a user have access to a child but not parent?**  
A: Yes, using user overrides.

**Q: How do I give temporary access?**  
A: Use user overrides. To revoke, delete the override.

**Q: Does this work with middleware?**  
A: Yes, you can add middleware to check `check_user_permission()` function.

**Q: Can I export/import permissions?**  
A: Yes, dump tables as SQL and import on another instance.

---

## ✅ **CHECKLIST**

Setup:
- [ ] Run migration 006
- [ ] Run migration 007
- [ ] Verify seed data
- [ ] Access /settings/permissions

Testing:
- [ ] Test role permissions
- [ ] Test user overrides
- [ ] Test permission hierarchy
- [ ] Test menu filtering

Production:
- [ ] Set up audit logging
- [ ] Document custom permissions
- [ ] Train admins on system
- [ ] Monitor usage

---

## 🎉 **YOU'RE DONE!**

**You now have full control over who sees what in your admin panel!**

**Key Features:**
✅ Database-driven permissions  
✅ Role-based defaults  
✅ User-specific overrides  
✅ Dynamic menu filtering  
✅ Real-time updates  
✅ RLS security  

**Access the UI:** `/settings/permissions`

**Enjoy your flexible permission system! 🚀**
