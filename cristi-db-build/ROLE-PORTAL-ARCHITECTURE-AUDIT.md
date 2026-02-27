# 🏗️ ROLE & PORTAL ARCHITECTURE AUDIT

**Date:** 25 Feb 2026  
**Scope:** Admin Application Architecture Analysis  
**Question:** Single portal with RBAC vs Separate role-based applications?

---

## 🎯 EXECUTIVE SUMMARY

**Architecture Type:** 🟡 **HYBRID PORTAL WITH RBAC**

**Current State:**
- ✅ **Single codebase** with shared components
- ✅ **RBAC-based menu filtering** (different menus per role)
- ✅ **Shared pages** with conditional UI elements
- ⚠️ **Partial route separation** (`/operator`, `/driver` routes exist but use shared components)
- ⚠️ **Mixed approach** - not fully unified, not fully separated

**Complexity Level:** 🟡 **MEDIUM-HIGH**

**Recommendation:** 🔄 **REFACTOR TO TRUE SINGLE PORTAL** (remove `/operator`, `/driver` routes, use pure RBAC)

---

## 1️⃣ ROUTE STRUCTURE ANALYSIS

### **A) Route Groups**

**Main Route Group:** `app/(admin)/`

**All routes under `(admin)` group:**
```
app/(admin)/
├── api-test/
├── bookings/
├── business-intelligence/
├── dashboard/
├── debug/
├── disputes/
├── documents/
├── driver/              ⚠️ Separate driver route
│   ├── documents/
│   └── page.tsx
├── drivers-map/
├── invoices/
├── mapbox-test/
├── monitoring/
├── notifications/
├── operator/            ⚠️ Separate operator route
│   ├── drivers/
│   └── page.tsx
├── payments/
├── payouts/
├── prices/
├── project-health/
├── refunds/
├── reviews/
├── settings/
├── support-tickets/
├── test-mapbox/
└── users/
```

**API Routes:**
```
app/api/
├── auth/
├── bookings/
├── dashboard/
├── driver/              ⚠️ Driver-specific API routes
│   ├── earnings/
│   ├── live/
│   ├── location/
│   ├── stats/
│   ├── status/
│   └── trips/
├── health/
├── monitoring/
├── notifications/
├── operator/            ⚠️ Operator-specific API routes
│   ├── notifications/
│   ├── recent-drivers/
│   └── stats/
├── test/
├── users/
└── v1/
```

**Auth Routes:**
```
app/
├── auth/
│   ├── confirm/
│   └── reset-password/
├── forgot-password/
├── login/
└── logout/
```

---

### **B) Route Separation Analysis**

**❌ NO True Separation:**
- No `/admin/*` prefix
- No `/operator/*` prefix (only `/operator` page)
- No `/driver/*` prefix (only `/driver` page)

**⚠️ Partial Separation:**
- `/operator` route exists → Uses `DashboardPage` component (shared)
- `/driver` route exists → Uses `DriverDashboard` component (separate)
- `/api/operator/*` routes exist → Operator-specific API endpoints
- `/api/driver/*` routes exist → Driver-specific API endpoints

**✅ Shared Routes:**
- `/dashboard` → Used by admin
- `/bookings` → Used by admin + operator
- `/users` → Used by admin + operator (filtered)
- `/documents` → Used by admin + operator
- `/notifications` → Used by admin + operator
- `/support-tickets` → Used by admin + operator + driver

---

### **C) Layout Analysis**

**Single Layout:** `app/(admin)/layout.tsx`

```typescript
// app/(admin)/layout.tsx
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ReactQueryProvider>
      <NotificationsProvider>
        <AdminLayoutContent pathname={pathname}>{children}</AdminLayoutContent>
      </NotificationsProvider>
    </ReactQueryProvider>
  );
}

// Uses AppShell with role-based rendering
function AdminLayoutContent({ children, pathname }) {
  const { user, loading } = useCurrentUserWithMetrics();
  const userRole: UserRole = useMemo(() => user?.role || 'admin', [user?.role]);

  return (
    <MemoizedAppShell role={userRole} currentPath={pathname} {...memoizedUserProp}>
      {children}
    </MemoizedAppShell>
  );
}
```

**Status:** ✅ **Single layout for all roles**

**AppShell renders:**
- Different sidebar menus per role
- Same topbar for all roles
- Same layout structure

---

### **D) Subdomain Logic**

**Searched for:** Subdomain-specific routing, domain checks

**Found:** ❌ NONE

**Status:** ✅ No subdomain separation

---

## 2️⃣ ROLE-BASED UI LOGIC

### **A) Menu Configuration**

**File:** `apps/admin/shared/ui/composed/appshell/menu-config.ts`

**Admin Menu (Full Access):**
```typescript
const adminMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'scale', label: 'Business Intelligence', href: '/business-intelligence' },
  { icon: 'calendar', label: 'Bookings', href: '/bookings' },
  { icon: 'users', label: 'Users', href: '/users', children: [...] },
  { icon: 'documents', label: 'Documents', href: '/documents' },
  { icon: 'bell', label: 'Notifications', href: '/notifications' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'star', label: 'Reviews', href: '/reviews' },
  { icon: 'prices', label: 'Prices', href: '/prices' },
  { icon: 'wallet', label: 'Payments', href: '/payments' },
  { icon: 'fileText', label: 'Invoices', href: '/invoices' },
  { icon: 'banknote', label: 'Payouts', href: '/payouts' },
  { icon: 'eye', label: 'Live Drivers Map', href: '/drivers-map' },
  { icon: 'monitoring', label: 'Monitoring', href: '/monitoring' },
  { icon: 'projectHealth', label: 'Project Health', href: '/project-health' },
  { icon: 'auditHistory', label: 'Audit History', href: '/audit-history' },
  { icon: 'settings', label: 'Settings', href: '/settings' },
];
```

**Operator Menu (Limited Access):**
```typescript
const operatorMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/operator' }, // ⚠️ Different route
  { icon: 'calendar', label: 'Bookings', href: '/bookings' },
  { icon: 'users', label: 'Users', href: '/users', children: [
    '/users/drivers',         // ✅ Only drivers
    '/users/drivers/pending', // ✅ Only pending drivers
  ]},
  { icon: 'documents', label: 'Documents', href: '/documents' },
  { icon: 'bell', label: 'Notifications', href: '/notifications' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'settings', label: 'Settings', href: '/settings/profile' },
];
```

**Driver Menu (Dedicated Portal):**
```typescript
const driverMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/driver' }, // ⚠️ Different route
  { icon: 'calendar', label: 'My Trips', href: '/driver/trips' },
  { icon: 'documents', label: 'Documents', href: '/driver/documents' },
  { icon: 'wallet', label: 'Earnings', href: '/driver/earnings' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'settings', label: 'Profile', href: '/driver/profile' },
];
```

**Menu Selection Logic:**
```typescript
export function getMenuForRole(role: UserRole): NavMenuItem[] {
  switch (role) {
    case 'admin':
      return adminMenu;
    case 'operator':
      return operatorMenu;
    case 'driver':
      return driverMenu;
    default:
      return [];
  }
}
```

**Status:** ✅ **RBAC-based menu filtering**

---

### **B) Conditional UI Elements**

**Found in:**

1. **Dashboard Page** (`apps/admin/features/shared/dashboard/components/DashboardPage.tsx`)
   ```typescript
   {/* Operator Performance - Only show to admin */}
   {user?.role === 'admin' && (
     <ChartCard title="Operator Performance" loading={isLoading}>
       <StackedBarChart data={convertedCharts.operator_performance} />
     </ChartCard>
   )}
   ```

2. **Dashboard Metrics** (`apps/admin/features/shared/dashboard-metrics/DashboardMetrics.tsx`)
   ```typescript
   function getSpecsForRole(specs: CardSpec[], role: string): CardSpec[] {
     if (role === 'operator') {
       // Operator only sees specific cards
       const allowedKeys = ['total_revenue', 'total_bookings', ...];
       return specs.filter(spec => allowedKeys.includes(spec.key));
     }
     return specs; // Admin sees all
   }
   ```

3. **Documents Approval** (`apps/admin/features/shared/documents-approval/hooks/useDocumentsApproval.ts`)
   ```typescript
   // ✅ RBAC: For operators, filter by their organization
   if (user?.role === 'operator' && user?.organization_id) {
     apiFilters.organizationId = user.organization_id;
   }
   ```

4. **Drivers Table** (`apps/admin/features/admin/drivers-table/components/DriversTable.tsx`)
   ```typescript
   const { user } = useCurrentUser();
   const isOperator = user?.role === 'operator';
   ```

5. **Account Tab** (`apps/admin/features/shared/settings-profile/components/AccountTab.tsx`)
   ```typescript
   const roleBadgeClass = profile.role === 'admin' ? styles.badgeAdmin : styles.badgeSupport;
   ```

**Status:** ✅ **Same pages with conditional UI based on role**

---

### **C) Component Separation**

**Shared Components:**
- `DashboardPage` → Used by admin AND operator (`/operator` route)
- `UsersTableBase` → Used by admin AND operator (filtered)
- `DocumentsApproval` → Used by admin AND operator (filtered)
- `BookingsTable` → Used by admin AND operator (filtered)

**Separate Components:**
- `DriverDashboard` → Used only by driver (`/driver` route)
- `OperatorDashboard` → Embedded in shared `DashboardPage`

**Status:** 🟡 **Mostly shared, some role-specific**

---

## 3️⃣ API ROUTE ROLE VALIDATION

### **A) Routes WITH Role Validation**

**6/24 routes (25%):**

1. **`/api/dashboard/charts`**
   ```typescript
   // 1. Auth check
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return 401;
   
   // 2. RBAC check
   const { createAdminClient } = await import('@/lib/supabase/admin');
   const supabaseAdmin = createAdminClient();
   const { data: adminUser } = await supabaseAdmin
     .from('admin_users')
     .select('role, is_active')
     .eq('auth_user_id', user.id)
     .single();
   
   // 3. Check if admin
   if (adminUser && ['super_admin', 'admin'].includes(adminUser.role)) {
     isAuthorized = true;
   } else {
     // 4. Check if operator
     const { data: operatorUser } = await supabase
       .from('user_organization_roles')
       .select('organization_id, role')
       .eq('user_id', user.id)
       .single();
     
     if (operatorUser && operatorUser.role === 'admin') {
       isAuthorized = true;
     }
   }
   
   if (!isAuthorized) return 403;
   ```

2. **`/api/dashboard/metrics`** (same pattern)
3. **`/api/operator/stats`** (same pattern)
4. **`/api/operator/notifications`** (same pattern)
5. **`/api/operator/recent-drivers`** (same pattern)
6. **`/api/v1/notifications/send-to-driver`** (same pattern)

---

### **B) Routes WITHOUT Role Validation**

**18/24 routes (75%):**

1. `/api/users/list` ❌ — Any authenticated user can list ALL users
2. `/api/bookings/list` ❌ — Any authenticated user can list ALL bookings
3. `/api/bookings/[id]` ❌ — No role check
4. `/api/bookings/[id]/legs` ❌ — No role check
5. `/api/bookings/counts` ❌ — No role check
6. `/api/bookings/create` ❌ — No role check
7. `/api/driver/earnings` ❌ — No role check (relies on RLS)
8. `/api/driver/stats` ❌ — No role check (relies on RLS)
9. `/api/driver/trips` ❌ — No role check (relies on RLS)
10. `/api/driver/status` ❌ — No role check (relies on RLS)
11. `/api/driver/location` ❌ — No role check (relies on RLS)
12. `/api/driver/live` ❌ — No role check
13. `/api/notifications/history` ❌ — No role check
14. `/api/monitoring/security` ❌ — No role check
15. `/api/auth/logout` ✅ — No role check needed (logout)
16. `/api/health` ✅ — Public endpoint
17. `/api/test/generate-jobs` ⚠️ — Test endpoint (should be removed)
18. `/api/bookings/create-test` ⚠️ — Test endpoint (should be removed)

**Status:** 🔴 **75% of API routes missing role validation**

---

### **C) Role Validation Summary**

| API Route | Auth Check | Role Check | Status |
|-----------|------------|------------|--------|
| `/api/dashboard/charts` | ✅ | ✅ Admin/Operator | 🟢 |
| `/api/dashboard/metrics` | ✅ | ✅ Admin/Operator | 🟢 |
| `/api/operator/stats` | ✅ | ✅ Admin/Operator | 🟢 |
| `/api/operator/notifications` | ✅ | ✅ Admin/Operator | 🟢 |
| `/api/operator/recent-drivers` | ✅ | ✅ Admin/Operator | 🟢 |
| `/api/v1/notifications/send-to-driver` | ✅ | ✅ Admin only | 🟢 |
| `/api/users/list` | ✅ | ❌ | 🔴 |
| `/api/bookings/list` | ✅ | ❌ | 🔴 |
| `/api/bookings/[id]` | ✅ | ❌ | 🔴 |
| `/api/driver/*` (5 routes) | ✅ | ❌ | 🟡 |
| `/api/health` | ❌ | ❌ | 🟢 Public |
| `/api/auth/logout` | ✅ | ❌ | 🟢 No check needed |

---

## 4️⃣ LAYOUT & NAVIGATION CHECK

### **A) Sidebar Navigation**

**File:** `apps/admin/shared/ui/composed/appshell/SidebarNav.tsx`

**Logic:**
```typescript
export function SidebarNav({ role, currentPath, onToggleExpand }: SidebarNavProps) {
  const {
    menuItems,      // ✅ Role-based menu from getMenuForRole()
    expandedItems,
    isCollapsed,
    handleToggleExpand,
  } = useSidebarNavigation(role);

  return (
    <div className={styles.menuList}>
      {menuItems.map((item) => (
        <SidebarNavItem key={item.href} item={item} />
      ))}
    </div>
  );
}
```

**Role Indicator:**
```typescript
<div className={styles.roleIndicator}>
  <span className={styles.roleLabel}>
    {role === 'admin' ? 'Administrator' : role === 'driver' ? 'Driver' : 'Operator'}
  </span>
</div>
```

**Status:** ✅ **Same sidebar component, different menu items per role**

---

### **B) Topbar**

**File:** `apps/admin/shared/ui/composed/appshell/Topbar.tsx`

**Logic:**
```typescript
<div className={styles.userInfo}>
  <span className={styles.userName}>{user?.name || 'User'}</span>
  <span className={styles.userRole}>
    {role === 'admin' ? 'Administrator' : 'Operator'}
  </span>
</div>
```

**Status:** ✅ **Same topbar, role label changes**

---

### **C) Menu Hiding Logic**

**Defined in:** `menu-config.ts`

**Admin sees:**
- All 17 menu items
- Full access to all routes

**Operator sees:**
- 7 menu items (filtered)
- Limited submenu items (e.g., only `/users/drivers`)

**Driver sees:**
- 6 menu items
- Completely different routes (`/driver/*`)

**Status:** ✅ **Menu items hidden/shown based on role**

---

## 5️⃣ DRIVER LOGIC

### **A) Driver Pages in Admin App**

**Found:**
- `/driver` route → `DriverDashboard` component
- `/driver/documents` route → Exists
- `/driver/trips` route → Mentioned in menu, not found in filesystem
- `/driver/earnings` route → Mentioned in menu, not found in filesystem
- `/driver/profile` route → Mentioned in menu, not found in filesystem

**Status:** ⚠️ **Partial implementation** (some routes missing)

---

### **B) Driver Role Logic**

**Found in:**

1. **Auth Actions** (`apps/admin/shared/api/auth/actions.ts`)
   ```typescript
   const metaRole = data.user?.user_metadata?.role ?? 'operator';
   if (metaRole === 'driver') {
     redirectTo = '/bookings'; // ⚠️ Redirects to /bookings, not /driver
   }
   ```

2. **Server Role** (`apps/admin/lib/auth/server-role.ts`)
   ```typescript
   if (userRole === 'driver') {
     return 'driver';
   }
   ```

3. **Route Protection** (`apps/admin/lib/auth/server-role.ts`)
   ```typescript
   // Driver routes - ONLY for driver
   if (pathname.startsWith('/driver')) {
     return role === 'driver';
   }
   
   // Support Tickets - All three (Admin, Operator, Driver)
   if (pathname.startsWith('/support-tickets')) {
     return role === 'admin' || role === 'operator' || role === 'driver';
   }
   ```

4. **Menu Config** (`menu-config.ts`)
   ```typescript
   const driverMenu: NavMenuItem[] = [
     { icon: 'dashboard', label: 'Dashboard', href: '/driver' },
     { icon: 'calendar', label: 'My Trips', href: '/driver/trips' },
     { icon: 'documents', label: 'Documents', href: '/driver/documents' },
     { icon: 'wallet', label: 'Earnings', href: '/driver/earnings' },
     { icon: 'support', label: 'Support', href: '/support-tickets' },
     { icon: 'settings', label: 'Profile', href: '/driver/profile' },
   ];
   ```

**Status:** ⚠️ **Driver logic exists but incomplete**

---

### **C) Driver Mobile App**

**Searched for:** Driver mobile app references

**Found:** ❌ NONE in admin codebase

**Assumption:** Driver mobile app is separate (React Native or similar)

**Status:** ✅ **Driver uses admin web app + separate mobile app**

---

## 6️⃣ AUTH FLOW

### **A) Middleware Logic**

**File:** `middleware.ts`

**Logic:**
```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Check session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Not authenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated → allow through
  return response;
}
```

**Status:** ✅ **Middleware validates authentication, NOT role**

---

### **B) Post-Login Redirect**

**File:** `apps/admin/shared/api/auth/actions.ts`

**Logic:**
```typescript
export async function signInWithPassword(email: string, password: string) {
  const { data } = await supabase.auth.signInWithPassword({ email, password });
  const userId = data.user?.id;

  let redirectTo = '/dashboard';

  if (userId) {
    const supabaseAdmin = createAdminClient();
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('role')
      .eq('auth_user_id', userId)
      .single();

    if (adminUser) {
      // User is in admin_users → go to dashboard
      redirectTo = '/dashboard';
    } else {
      // Not an admin — check user_metadata for role
      const metaRole = data.user?.user_metadata?.role ?? 'operator';
      if (metaRole === 'driver') {
        redirectTo = '/bookings'; // ⚠️ Should be /driver
      } else if (metaRole === 'operator') {
        redirectTo = '/operator';
      } else {
        redirectTo = '/dashboard';
      }
    }
  }

  redirect(redirectTo);
}
```

**Redirect Map:**
- **Admin** → `/dashboard`
- **Operator** → `/operator`
- **Driver** → `/bookings` ⚠️ (should be `/driver`)

**Status:** ⚠️ **Role-based redirect exists but inconsistent**

---

### **C) Route Protection**

**File:** `apps/admin/lib/auth/server-role.ts`

**Logic:**
```typescript
export function isAllowed(pathname: string, role: ServerRole): boolean {
  // Driver routes - ONLY for driver
  if (pathname.startsWith('/driver')) {
    return role === 'driver';
  }

  // Business Intelligence - ONLY admin
  if (pathname.startsWith('/business-intelligence')) {
    return role === 'admin';
  }

  // Bookings - Admin AND Operator
  if (pathname.startsWith('/bookings')) {
    return role === 'admin' || role === 'operator';
  }

  // Users - Complex logic
  if (pathname.startsWith('/users/drivers')) {
    return role === 'admin' || role === 'operator';
  }
  if (pathname.startsWith('/users')) {
    return role === 'admin'; // Other /users/* only admin
  }

  // Documents - Admin AND Operator
  if (pathname.startsWith('/documents')) {
    return role === 'admin' || role === 'operator';
  }

  // Support Tickets - All three
  if (pathname.startsWith('/support-tickets')) {
    return role === 'admin' || role === 'operator' || role === 'driver';
  }

  // Settings - Admin only (except /settings/profile)
  if (pathname.startsWith('/settings/profile')) {
    return role === 'admin' || role === 'operator';
  }
  if (pathname.startsWith('/settings')) {
    return role === 'admin';
  }

  // Admin-only routes
  if (pathname.startsWith('/monitoring') || pathname.startsWith('/project-health')) {
    return role === 'admin';
  }

  // Dashboard - All three
  if (pathname.startsWith('/dashboard')) {
    return role === 'admin' || role === 'operator' || role === 'driver';
  }

  return true; // Default: allow
}
```

**Status:** ⚠️ **Route protection logic exists but NOT enforced in middleware**

**Issue:** This function exists but is NOT called by middleware!

---

## 7️⃣ CONCLUZIE FINALĂ

### **A) Avem un singur portal cu RBAC intern?**

**Răspuns:** 🟡 **DA, DAR INCONSISTENT**

**Detalii:**
- ✅ Single codebase
- ✅ Single layout (`app/(admin)/layout.tsx`)
- ✅ RBAC-based menu filtering
- ✅ Shared components with conditional UI
- ⚠️ Partial route separation (`/operator`, `/driver` exist)
- ⚠️ Route protection logic exists but NOT enforced
- ⚠️ API routes mostly missing role validation

---

### **B) Avem separare reală pe roluri?**

**Răspuns:** ❌ **NU**

**Detalii:**
- ❌ No separate apps (admin-app, operator-app, driver-app)
- ❌ No subdomain separation
- ❌ No separate layouts per role
- ⚠️ Partial route separation (`/operator`, `/driver` routes)
- ⚠️ API route separation (`/api/operator/*`, `/api/driver/*`)

**Concluzie:** Arhitectura ÎNCEARCĂ să separe, dar nu reușește complet.

---

### **C) Recomanzi separare în aplicații diferite?**

**Răspuns:** ❌ **NU, recomandam UNIFICARE**

**Motivație:**

**Current State (Hybrid):**
- `/dashboard` → Admin
- `/operator` → Operator (uses same `DashboardPage`)
- `/driver` → Driver (separate `DriverDashboard`)
- Confusing architecture
- Duplicate routes
- Inconsistent patterns

**Recommended State (Unified RBAC):**
- `/dashboard` → All roles (filtered by RBAC)
- `/bookings` → All roles (filtered by RBAC)
- `/users` → All roles (filtered by RBAC)
- Single source of truth
- Consistent patterns
- Easier to maintain

**Why NOT separate apps:**
1. ✅ Shared components already exist
2. ✅ Shared business logic
3. ✅ Shared API routes
4. ✅ RBAC already implemented
5. ❌ Separation would duplicate code
6. ❌ Separation would increase maintenance
7. ❌ Current hybrid approach is worst of both worlds

**Why unify:**
1. ✅ Simpler architecture
2. ✅ Single codebase
3. ✅ Easier to maintain
4. ✅ Consistent UX
5. ✅ RBAC already works
6. ✅ Just need to enforce it properly

---

### **D) Ce nivel de complexitate are arhitectura actuală?**

**Răspuns:** 🟡 **MEDIUM-HIGH**

**Breakdown:**

**Complexity Sources:**
1. 🔴 **Hybrid approach** (not fully unified, not fully separated)
2. 🔴 **Inconsistent route patterns** (`/dashboard` vs `/operator` vs `/driver`)
3. 🔴 **Route protection logic exists but NOT enforced**
4. 🔴 **75% of API routes missing role validation**
5. 🟡 **RBAC implemented in UI but not in backend**
6. 🟡 **Partial driver implementation** (some routes missing)
7. 🟡 **Inconsistent post-login redirects**

**Simplicity Sources:**
1. ✅ Single layout
2. ✅ Single codebase
3. ✅ RBAC-based menu filtering
4. ✅ Shared components

**Overall:** Architecture is MORE complex than it needs to be due to hybrid approach.

---

## 📊 ARCHITECTURE SCORECARD

| Aspect | Score | Status |
|--------|-------|--------|
| **Route Structure** | 5/10 | 🟡 Hybrid (inconsistent) |
| **RBAC Implementation** | 7/10 | 🟡 UI only, backend missing |
| **Code Reusability** | 8/10 | 🟢 High (shared components) |
| **Maintainability** | 5/10 | 🟡 Medium (hybrid complexity) |
| **Security** | 4/10 | 🔴 Low (missing role validation) |
| **Consistency** | 4/10 | 🔴 Low (mixed patterns) |
| **Overall** | **5.5/10** | **🟡 MEDIUM-HIGH COMPLEXITY** |

---

## 🔧 RECOMMENDED REFACTORING

### **Phase 1: Unify Routes (P0)**

**Remove:**
- `/operator` route → Redirect to `/dashboard`
- `/driver` route → Redirect to `/dashboard`

**Update:**
- All components use `/dashboard` with RBAC filtering
- Menu config already correct (just update hrefs)

**Impact:** Simplifies route structure, removes confusion

---

### **Phase 2: Enforce Route Protection (P0)**

**Add to middleware:**
```typescript
// After auth check, add role check
const role = await getServerRole(request);

if (!isAllowed(pathname, role)) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

**Impact:** Prevents unauthorized access to routes

---

### **Phase 3: Add API Role Validation (P0)**

**Add to all API routes:**
```typescript
// After auth check
const { createAdminClient } = await import('@/lib/supabase/admin');
const supabaseAdmin = createAdminClient();

const { data: adminUser } = await supabaseAdmin
  .from('admin_users')
  .select('role')
  .eq('auth_user_id', user.id)
  .single();

if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

**Impact:** Prevents unauthorized API access

---

### **Phase 4: Fix Post-Login Redirects (P1)**

**Update:**
```typescript
// All roles → /dashboard
redirectTo = '/dashboard';
```

**Impact:** Consistent UX, simpler logic

---

### **Phase 5: Complete Driver Implementation (P2)**

**Options:**
1. ✅ **Recommended:** Remove driver from admin app, use mobile app only
2. ⚠️ Complete driver routes in admin app (if needed for web access)

**Impact:** Reduces complexity or completes feature

---

## 📋 SUMMARY

**Current Architecture:**
- 🟡 Hybrid portal (not fully unified, not fully separated)
- ✅ RBAC in UI (menu filtering, conditional components)
- ❌ RBAC NOT enforced in backend (routes, API)
- ⚠️ Partial route separation (`/operator`, `/driver`)
- 🔴 75% of API routes missing role validation

**Recommendation:**
- ✅ **Unify to single portal with full RBAC**
- ❌ **Do NOT separate into multiple apps**
- 🔧 **Enforce RBAC in middleware + API routes**
- 🔧 **Remove `/operator`, `/driver` routes**
- 🔧 **Use `/dashboard` for all roles**

**Complexity Level:** 🟡 **MEDIUM-HIGH** (can be reduced to LOW with refactoring)

**Full report:** `cristi-db-build/ROLE-PORTAL-ARCHITECTURE-AUDIT.md`
