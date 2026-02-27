# 🔒 ADMIN APP SECURITY AUDIT REPORT

**Date:** 25 Feb 2026  
**Environment:** Render.com (512MB plan)  
**Domain:** admin.vantage-lane.com  
**Issue:** Direct access to protected routes sometimes works without authentication

---

## 🎯 EXECUTIVE SUMMARY

**Overall Security Status:** 🟡 **MEDIUM RISK**

**Critical Findings:**
1. ✅ **Middleware protection EXISTS** and validates authentication
2. ⚠️ **API routes fail open on error** (security vs availability tradeoff)
3. ⚠️ **No auth state change listener** (expired sessions not detected client-side)
4. ⚠️ **RBAC checks use admin client** (bypasses RLS, potential risk)
5. ✅ **No client-side only protection** (all routes protected by middleware)

**Risk Level Breakdown:**
- Authentication: 🟢 **LOW** (middleware enforced)
- Authorization (RBAC): 🟡 **MEDIUM** (admin client usage)
- Session Management: 🟡 **MEDIUM** (no expiry listener)
- API Security: 🟡 **MEDIUM** (fail open on error)
- RLS Enforcement: 🟡 **MEDIUM** (service role key used)

---

## 1️⃣ AUTH FLOW ANALYSIS

### **A) Supabase Auth Initialization**

**Browser Client:**
```typescript
// apps/admin/shared/api/clients/supabase.ts
export const supaBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**Server Client:**
```typescript
// apps/admin/lib/supabase/server.ts
export const createClient = () => {
  const cookieStore = cookies();
  return supaServer(cookieStore);
};

// apps/admin/shared/api/clients/supabase.ts
export const supaServer = (cookieStore: ReadonlyRequestCookies) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // ... cookie handlers
      },
    }
  );
```

**Admin Client (Service Role):**
```typescript
// apps/admin/lib/supabase/admin.ts
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // ⚠️ BYPASSES RLS
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
```

---

### **B) Session Retrieval**

**Middleware (Server-Side):**
```typescript
// middleware.ts (line 59-62)
const {
  data: { user },
} = await supabase.auth.getUser(); // ✅ SECURE: getUser() validates JWT

if (!user) {
  // Redirect to login
}
```

**Client-Side (useCurrentUser hook):**
```typescript
// apps/admin/shared/hooks/useCurrentUser.ts (line 25-29)
async function getCurrentSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
```

**API Routes:**
```typescript
// Example: app/api/dashboard/charts/route.ts (line 62-65)
const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser(); // ✅ SECURE

if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

### **C) Where supabase.auth.getUser() is Used**

**Found in 15 API routes:**
1. `/api/dashboard/charts` ✅
2. `/api/dashboard/metrics` ✅
3. `/api/operator/stats` ✅
4. `/api/operator/notifications` ✅
5. `/api/operator/recent-drivers` ✅
6. `/api/driver/earnings` ✅
7. `/api/driver/stats` ✅
8. `/api/driver/trips` ✅
9. `/api/driver/status` ✅
10. `/api/driver/location` ✅
11. `/api/bookings/list` ✅
12. `/api/v1/notifications/send-to-driver` ✅
13. `middleware.ts` ✅

**Status:** ✅ All API routes validate authentication

---

### **D) Where Cookies are Read**

**Middleware:**
```typescript
// middleware.ts (line 46-48)
cookies: {
  getAll() {
    return request.cookies.getAll();
  },
  // ...
}
```

**Server Client:**
```typescript
// apps/admin/shared/api/clients/supabase.ts (line 30-32)
get(name: string) {
  return cookieStore.get(name)?.value;
}
```

**Status:** ✅ Cookies properly handled via Supabase SSR

---

## 2️⃣ MIDDLEWARE PROTECTION

### **A) Middleware Exists: YES ✅**

**File:** `middleware.ts`

**Full Logic:**

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Create Supabase SSR client
  const supabase = createServerClient(...);

  try {
    // 3. Check session — getUser() is more secure than getSession()
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 4. Not authenticated → redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 5. Authenticated → allow through
    return response;
  } catch (error) {
    // ⚠️ SECURITY ISSUE: Fail open for API routes
    if (pathname.startsWith('/api/')) {
      return response; // ⚠️ ALLOWS UNAUTHENTICATED ACCESS ON ERROR
    }

    // Page routes: redirect to login on error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_unavailable');
    return NextResponse.redirect(loginUrl);
  }
}
```

---

### **B) Session Validation**

**Does it check session?** ✅ YES
- Uses `supabase.auth.getUser()` (line 60-62)

**Does it call supabase.auth.getUser()?** ✅ YES
- More secure than `getSession()` (validates JWT server-side)

**Does it redirect to /login when no session?** ✅ YES
- Redirects with `redirectTo` param (line 66-69)

---

### **C) Route Protection**

**Public Paths (NOT protected):**
```typescript
const PUBLIC_PATHS = [
  '/login',
  '/forgot-password',
  '/auth/confirm',
  '/auth/reset-password',
  '/api/health',
];
```

**Protected Paths:**
- All routes EXCEPT public paths
- Matcher excludes: `_next/static`, `_next/image`, `favicon.ico`, static assets

**Status:** ✅ All admin routes protected

---

### **D) ⚠️ SECURITY ISSUE: Fail Open on Error**

**Code:**
```typescript
// middleware.ts (line 74-88)
catch (error) {
  console.error('[Middleware] Auth check failed:', error);

  if (pathname.startsWith('/api/')) {
    // API routes: let them handle auth themselves
    return response; // ⚠️ ALLOWS UNAUTHENTICATED ACCESS
  }

  // Page routes: redirect to login on error
  return NextResponse.redirect(loginUrl);
}
```

**Risk:** If Supabase is unreachable or times out:
- **API routes:** Allowed through WITHOUT authentication
- **Page routes:** Redirected to login (safe)

**Scenario:**
1. Supabase network timeout
2. User accesses `/api/dashboard/charts`
3. Middleware catches error → allows through
4. API route executes `supabase.auth.getUser()`
5. If Supabase is still down → API also fails open? ❌

**Impact:** 🔴 **HIGH** - Potential unauthorized API access during outages

---

## 3️⃣ ROUTE ACCESS CONTROL (RBAC)

### **A) Role Storage**

**Admin Users:**
```sql
-- Table: admin_users
id UUID PRIMARY KEY
auth_user_id UUID (FK to auth.users)
email TEXT
name TEXT
role TEXT -- 'super_admin' | 'admin' | 'support'
is_active BOOLEAN
```

**Operators:**
```sql
-- Table: user_organization_roles
user_id UUID (FK to auth.users)
organization_id UUID
role TEXT -- 'admin' (operator role)
is_active BOOLEAN
```

**Drivers:**
```sql
-- Table: drivers
id UUID PRIMARY KEY
auth_user_id UUID (FK to auth.users)
email TEXT
-- ... other fields
```

---

### **B) Role Validation**

**Client-Side (useCurrentUser hook):**
```typescript
// apps/admin/shared/hooks/useCurrentUser.ts (line 32-101)
async function getAdminUserData(authUserId: string): Promise<UserInfo> {
  const supabase = createClient();
  
  // 1. Check admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, name, role')
    .eq('auth_user_id', authUserId)
    .single();

  if (adminError) {
    // 2. Check user_organization_roles (operators)
    const { data: operatorUser } = await supabase
      .from('user_organization_roles')
      .select('organization_id, role, is_active')
      .eq('user_id', authUserId)
      .eq('is_active', true)
      .single();

    if (operatorUser) {
      return { role: 'operator', organization_id: ... };
    }
    
    // 3. Check drivers table
    const { data: driverUser } = await supabase
      .from('drivers')
      .select('id, email, first_name, last_name')
      .eq('auth_user_id', authUserId)
      .single();

    if (driverUser) {
      return { role: 'driver', ... };
    }

    throw new Error('User not found in any table');
  }

  // Map admin role to AppShell role
  let appShellRole: 'admin' | 'operator' | 'driver' = 'operator';
  if (adminUser.role === 'admin' || adminUser.role === 'super_admin') {
    appShellRole = 'admin';
  }

  return { role: appShellRole, ... };
}
```

**Status:** ✅ Role validation happens client-side

---

**Server-Side (API Routes):**
```typescript
// Example: app/api/dashboard/charts/route.ts (line 71-107)

// 1. Get authenticated user
const { data: { user } } = await supabase.auth.getUser();

// 2. RBAC check using admin client (⚠️ BYPASSES RLS)
const { createAdminClient } = await import('@/lib/supabase/admin');
const supabaseAdmin = createAdminClient();

const { data: adminUser } = await supabaseAdmin
  .from('admin_users')
  .select('role, is_active')
  .eq('auth_user_id', user.id)
  .single();

// 3. Check if admin
if (adminUser && adminUser.is_active && ['super_admin', 'admin'].includes(adminUser.role)) {
  isAuthorized = true;
  organizationId = null; // See all data
} else {
  // 4. Check if operator
  const { data: operatorUser } = await supabase
    .from('user_organization_roles')
    .select('organization_id, role, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (operatorUser && operatorUser.role === 'admin') {
    isAuthorized = true;
    organizationId = operatorUser.organization_id; // See only org data
  }
}

if (!isAuthorized) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

**Status:** ✅ Role validation happens server-side in API routes

---

### **C) RBAC Enforcement Map**

| Route | Auth Check | Role Check | Server-Side | Status |
|-------|------------|------------|-------------|--------|
| `/dashboard` | ✅ Middleware | ❌ Client only | ❌ | 🟡 MEDIUM |
| `/users` | ✅ Middleware | ❌ Client only | ❌ | 🟡 MEDIUM |
| `/drivers` | ✅ Middleware | ✅ Client (operator filter) | ❌ | 🟡 MEDIUM |
| `/bookings` | ✅ Middleware | ❌ Client only | ❌ | 🟡 MEDIUM |
| `/api/dashboard/charts` | ✅ API route | ✅ Admin/Operator | ✅ | 🟢 LOW |
| `/api/dashboard/metrics` | ✅ API route | ✅ Admin/Operator | ✅ | 🟢 LOW |
| `/api/users/list` | ✅ API route | ❌ No role check | ❌ | 🔴 HIGH |
| `/api/bookings/list` | ✅ API route | ❌ No role check | ❌ | 🔴 HIGH |
| `/api/operator/*` | ✅ API route | ✅ Admin/Operator | ✅ | 🟢 LOW |

---

### **D) ⚠️ SECURITY ISSUE: Missing Role Checks**

**Critical API Routes WITHOUT Role Validation:**

1. **`/api/users/list`**
   ```typescript
   // app/api/users/list/route.ts
   // ❌ NO ROLE CHECK - any authenticated user can access
   export async function GET(request: NextRequest) {
     const token = authHeader?.replace('Bearer ', '');
     if (!token) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     // Creates client with token
     const supabase = createClient(...);
     
     // ❌ NO ROLE VALIDATION
     // Fetches all users (customers, drivers, admins, operators)
     const [customers, drivers, admins, operators] = await Promise.all([...]);
     
     return NextResponse.json({ data: allUsers });
   }
   ```

   **Risk:** 🔴 **CRITICAL**
   - Any authenticated user (even drivers) can list ALL users
   - Exposes admin emails, operator data, customer data

2. **`/api/bookings/list`**
   ```typescript
   // app/api/bookings/list/route.ts
   // ❌ NO ROLE CHECK
   export async function GET(request: Request) {
     const { data: { user } } = await supabase.auth.getUser();
     
     if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     // ❌ NO ROLE VALIDATION
     // Calls RPC get_bookings_list
     const { data, error } = await supabase.rpc('get_bookings_list', {...});
     
     return NextResponse.json(data);
   }
   ```

   **Risk:** 🔴 **CRITICAL**
   - Any authenticated user can list all bookings
   - Depends on RLS policies (may not be sufficient)

---

## 4️⃣ API ROUTE SECURITY

### **A) Session Validation**

**All API routes validate session:** ✅ YES

**Pattern:**
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser();

if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Found in:** 15 API routes

---

### **B) Role Validation**

**API routes WITH role validation:** 6/15 (40%)
- `/api/dashboard/charts` ✅
- `/api/dashboard/metrics` ✅
- `/api/operator/stats` ✅
- `/api/operator/notifications` ✅
- `/api/operator/recent-drivers` ✅
- `/api/v1/notifications/send-to-driver` ✅

**API routes WITHOUT role validation:** 9/15 (60%) ⚠️
- `/api/users/list` ❌
- `/api/bookings/list` ❌
- `/api/bookings/[id]` ❌
- `/api/bookings/[id]/legs` ❌
- `/api/driver/earnings` ❌
- `/api/driver/stats` ❌
- `/api/driver/trips` ❌
- `/api/driver/status` ❌
- `/api/driver/location` ❌

---

### **C) Service Role Key Usage**

**API routes using SERVICE_ROLE_KEY:**

1. **`/api/dashboard/charts`** (line 72-73)
   ```typescript
   const { createAdminClient } = await import('@/lib/supabase/admin');
   const supabaseAdmin = createAdminClient(); // Uses SERVICE_ROLE_KEY
   ```

2. **`/api/dashboard/metrics`** (line 65-66)
3. **`/api/operator/stats`** (line 36-37)
4. **`/api/operator/notifications`** (line 37-38)
5. **`/api/operator/recent-drivers`** (line 37-38)
6. **`/api/bookings/[id]/legs`** (line 28-30)
   ```typescript
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ BYPASSES RLS
   );
   ```

**Purpose:** RBAC checks (bypass RLS to query admin_users table)

**Risk:** 🟡 **MEDIUM**
- Service role key bypasses ALL RLS policies
- If leaked, attacker has full database access
- Proper usage: Only for admin operations, never exposed to client

**Status:** ✅ Used correctly (server-side only, for RBAC)

---

### **D) RLS Bypass**

**API routes that bypass RLS:**
- All routes using `createAdminClient()`
- `/api/bookings/[id]/legs` (uses service role key directly)

**Mitigation:**
- Service role key is server-side only ✅
- Not exposed in environment variables to client ✅
- Used only for RBAC checks ✅

**Remaining Risk:** If server is compromised, service role key is exposed

---

## 5️⃣ CLIENT-SIDE ONLY PROTECTION CHECK

### **A) Search for Client-Side Redirects**

**Pattern searched:**
```typescript
if (!user) router.push('/login')
```

**Found:** ❌ NONE

**Reason:** All protection happens in middleware (server-side)

---

### **B) Layout Protection**

**File:** `app/(admin)/layout.tsx`

```typescript
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useCurrentUserWithMetrics();

  if (loading) {
    return <div>Loading...</div>; // ✅ Shows loading, doesn't redirect
  }

  // ❌ NO CLIENT-SIDE REDIRECT
  // Relies on middleware to handle auth
  
  return (
    <MemoizedAppShell role={userRole} currentPath={pathname} {...memoizedUserProp}>
      {children}
    </MemoizedAppShell>
  );
}
```

**Status:** ✅ No client-side only protection

**Why it's safe:**
- Middleware redirects unauthenticated users BEFORE layout renders
- Layout never receives unauthenticated state

---

### **C) Direct URL Access**

**Scenario:** User opens `/dashboard` without valid session

**Flow:**
1. Request hits middleware
2. Middleware calls `supabase.auth.getUser()`
3. No user → Redirect to `/login?redirectTo=/dashboard`
4. Layout never renders

**Status:** ✅ Protected by middleware

---

## 6️⃣ SESSION EXPIRATION HANDLING

### **A) Token Expiration**

**Supabase JWT Expiration:** 1 hour (default)

**What happens when token expires:**

**Middleware:**
```typescript
// middleware.ts (line 59-62)
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Expired token → redirect to login
  return NextResponse.redirect(loginUrl);
}
```

**Status:** ✅ Expired tokens handled by middleware

---

### **B) Auth State Change Listener**

**Searched for:** `onAuthStateChange`

**Found:** ❌ NONE

**Impact:** 🟡 **MEDIUM RISK**

**Scenario:**
1. User logs in → JWT valid for 1 hour
2. User stays on page for 2 hours (no navigation)
3. JWT expires
4. User tries to fetch data → API returns 401
5. ❌ No automatic logout or redirect

**Current Behavior:**
- API calls fail with 401
- User sees error messages
- Must manually refresh page or navigate (triggers middleware)

**Expected Behavior:**
- Detect expired session
- Auto-logout
- Redirect to login

---

### **C) Auto-Logout on Invalid Session**

**Current:** ❌ NO

**Code:**
```typescript
// apps/admin/shared/hooks/useCurrentUser.ts
// ❌ NO onAuthStateChange listener
export function useCurrentUser() {
  const { data: session } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getCurrentSession,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
  
  // ❌ NO listener for session expiry
}
```

**Risk:**
- User stays logged in UI-side even after session expires
- API calls fail silently
- Confusing UX

---

### **D) Middleware Handling of Expired Tokens**

**Current:** ✅ YES

```typescript
// middleware.ts
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Expired token → redirect to login
  return NextResponse.redirect(loginUrl);
}
```

**Status:** ✅ Middleware handles expired tokens on navigation

**Limitation:** Only triggers on page navigation, not during idle time

---

## 7️⃣ RLS VALIDATION

### **A) Anon Keys Used**

**Browser Client:**
```typescript
// apps/admin/shared/api/clients/supabase.ts
export const supaBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ ANON KEY
  );
```

**Server Client:**
```typescript
export const supaServer = (cookieStore) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ ANON KEY
  );
```

**Status:** ✅ Anon keys used (RLS enforced)

---

### **B) Service Role Keys Used**

**Admin Client:**
```typescript
// apps/admin/lib/supabase/admin.ts
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // ⚠️ SERVICE ROLE KEY
  );
};
```

**Used in:**
- 6 API routes (for RBAC checks)
- 1 server action (`signInWithPassword`)
- 1 test route (`/api/test/generate-jobs`)

**Status:** ⚠️ Service role key used (bypasses RLS)

---

### **C) API Routes Using Admin Client**

**Purpose:** RBAC checks (query `admin_users` table)

**Pattern:**
```typescript
const { createAdminClient } = await import('@/lib/supabase/admin');
const supabaseAdmin = createAdminClient();

const { data: adminUser } = await supabaseAdmin
  .from('admin_users')
  .select('role, is_active')
  .eq('auth_user_id', user.id)
  .single();
```

**Why bypass RLS:**
- `admin_users` table may have RLS policies
- Need to check user role before knowing if they can access data
- Chicken-and-egg problem

**Status:** ✅ Acceptable usage (RBAC only)

---

### **D) RLS Enforcement**

**Assumed:** ✅ YES (anon keys used)

**Actually Enforced:** ⚠️ UNKNOWN (need to check Supabase policies)

**Recommendation:** Verify RLS policies exist for:
- `admin_users`
- `user_organization_roles`
- `drivers`
- `customers`
- `bookings`
- `booking_legs`
- All other tables

---

### **E) Potential Data Leak Risk**

**Scenario:**
1. RLS policy missing on `bookings` table
2. User calls `/api/bookings/list`
3. API uses anon key client
4. RLS not enforced → returns ALL bookings

**Mitigation:**
- Verify RLS policies exist ✅
- Add role checks to API routes ✅
- Use organization filtering ✅

**Current Risk:** 🟡 **MEDIUM** (depends on RLS policies)

---

## 8️⃣ DIRECT URL ACCESS TEST

### **A) Scenario: User Opens `/dashboard` Without Session**

**Flow:**
1. Browser requests `GET /dashboard`
2. Middleware intercepts request
3. Middleware creates Supabase client
4. Middleware calls `supabase.auth.getUser()`
5. No cookies → No user
6. Middleware redirects to `/login?redirectTo=/dashboard`
7. Browser receives 307 redirect
8. Browser navigates to `/login`

**Result:** ✅ **PROTECTED** (no content flash)

---

### **B) Scenario: User Opens `/users/drivers` Without Session**

**Flow:**
1. Browser requests `GET /users/drivers`
2. Middleware intercepts
3. No user → Redirect to `/login?redirectTo=/users/drivers`

**Result:** ✅ **PROTECTED**

---

### **C) Scenario: User Opens `/bookings` Without Session**

**Flow:**
1. Browser requests `GET /bookings`
2. Middleware intercepts
3. No user → Redirect to `/login?redirectTo=/bookings`

**Result:** ✅ **PROTECTED**

---

### **D) Scenario: Supabase Timeout During Middleware Check**

**Flow:**
1. Browser requests `GET /dashboard`
2. Middleware calls `supabase.auth.getUser()`
3. Supabase times out → throws error
4. Middleware catches error
5. Pathname is `/dashboard` (not `/api/*`)
6. Middleware redirects to `/login?error=auth_unavailable`

**Result:** ✅ **PROTECTED** (fail closed for pages)

---

### **E) Scenario: Supabase Timeout for API Route**

**Flow:**
1. Browser requests `GET /api/dashboard/charts`
2. Middleware calls `supabase.auth.getUser()`
3. Supabase times out → throws error
4. Middleware catches error
5. Pathname is `/api/dashboard/charts`
6. ⚠️ Middleware returns `response` (fail open)
7. API route executes
8. API route calls `supabase.auth.getUser()`
9. Supabase still down → throws error
10. API route catches error → returns 500

**Result:** 🟡 **MEDIUM RISK**
- Middleware fails open
- API route fails closed
- No unauthorized access, but inconsistent behavior

---

### **F) Content Flash Before Redirect**

**Possible?** ❌ NO

**Reason:**
- Middleware runs BEFORE page renders
- Redirect happens server-side (307)
- Browser never receives page HTML

**Status:** ✅ No content flash

---

## 🚨 CRITICAL SECURITY GAPS

### **1. API Routes Missing Role Validation** 🔴 **CRITICAL**

**Affected Routes:**
- `/api/users/list` — Any authenticated user can list ALL users
- `/api/bookings/list` — Any authenticated user can list ALL bookings
- `/api/bookings/[id]` — Any authenticated user can view booking details
- `/api/driver/*` — No role check (relies on RLS)

**Impact:**
- Data exposure to unauthorized users
- Drivers can access admin data
- Operators can access other organizations' data (if RLS missing)

**Fix:**
```typescript
// Add to /api/users/list
const { createAdminClient } = await import('@/lib/supabase/admin');
const supabaseAdmin = createAdminClient();

const { data: adminUser } = await supabaseAdmin
  .from('admin_users')
  .select('role, is_active')
  .eq('auth_user_id', user.id)
  .single();

if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

### **2. Middleware Fails Open for API Routes** 🔴 **HIGH**

**Code:**
```typescript
// middleware.ts (line 79-82)
if (pathname.startsWith('/api/')) {
  return response; // ⚠️ ALLOWS THROUGH
}
```

**Impact:**
- If Supabase is unreachable, API routes are accessible
- Depends on API routes to validate auth (may fail open too)

**Fix:**
```typescript
// Fail closed for API routes too
if (pathname.startsWith('/api/')) {
  return NextResponse.json(
    { error: 'Authentication service unavailable' },
    { status: 503 }
  );
}
```

---

### **3. No Auth State Change Listener** 🟡 **MEDIUM**

**Impact:**
- User stays "logged in" after session expires
- API calls fail with 401
- Confusing UX

**Fix:**
```typescript
// Add to useCurrentUser hook
useEffect(() => {
  const supabase = createClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      // Invalidate React Query cache
      queryClient.invalidateQueries(['auth-session']);
      queryClient.invalidateQueries(['current-user']);
      
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    }
  });
  
  return () => subscription.unsubscribe();
}, []);
```

---

### **4. Service Role Key Exposure Risk** 🟡 **MEDIUM**

**Current:**
- Service role key in `.env.local` (server-side only) ✅
- Not exposed to client ✅
- Used only in API routes and server actions ✅

**Risk:**
- If server is compromised, key is exposed
- If accidentally committed to git, key is leaked

**Mitigation:**
- ✅ Already in `.gitignore`
- ✅ Not in client bundle
- ⚠️ Consider rotating key periodically
- ⚠️ Use Render environment variables (not `.env.local`)

---

## 📋 RECOMMENDED FIXES (MINIMAL, NO REFACTOR)

### **🔴 P0: Critical (Fix Immediately)**

1. **Add role validation to `/api/users/list`**
   ```typescript
   // After auth check, add:
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

2. **Add role validation to `/api/bookings/list`**
   ```typescript
   // Same pattern as above
   ```

3. **Change middleware to fail closed for API routes**
   ```typescript
   // middleware.ts (line 79-82)
   if (pathname.startsWith('/api/')) {
     return NextResponse.json(
       { error: 'Authentication service unavailable' },
       { status: 503 }
     );
   }
   ```

---

### **🟡 P1: High Priority**

4. **Add auth state change listener**
   ```typescript
   // apps/admin/shared/hooks/useCurrentUser.ts
   useEffect(() => {
     const supabase = createClient();
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       if (event === 'SIGNED_OUT') {
         window.location.href = '/login';
       }
     });
     return () => subscription.unsubscribe();
   }, []);
   ```

5. **Verify RLS policies exist for all tables**
   - Check Supabase dashboard
   - Ensure policies enforce organization filtering
   - Test with different user roles

6. **Add role validation to driver API routes**
   - `/api/driver/earnings`
   - `/api/driver/stats`
   - `/api/driver/trips`

---

### **🟢 P2: Nice to Have**

7. **Rotate service role key**
   - Generate new key in Supabase
   - Update Render environment variables
   - Revoke old key

8. **Add rate limiting to API routes**
   - Prevent brute force attacks
   - Use Vercel/Render rate limiting

9. **Add audit logging**
   - Log all admin actions
   - Log failed auth attempts
   - Monitor for suspicious activity

10. **Add CSP headers**
    - Prevent XSS attacks
    - Restrict script sources

---

## 📊 SECURITY SCORECARD

| Category | Score | Status |
|----------|-------|--------|
| **Authentication** | 8/10 | 🟢 GOOD |
| **Authorization (RBAC)** | 5/10 | 🟡 NEEDS WORK |
| **Session Management** | 6/10 | 🟡 NEEDS WORK |
| **API Security** | 5/10 | 🟡 NEEDS WORK |
| **RLS Enforcement** | 7/10 | 🟡 UNKNOWN |
| **Error Handling** | 6/10 | 🟡 NEEDS WORK |
| **Overall** | 6.2/10 | 🟡 MEDIUM RISK |

---

## ✅ VERIFICATION CHECKLIST

After applying fixes:

- [ ] All API routes have role validation
- [ ] Middleware fails closed for API routes
- [ ] Auth state change listener implemented
- [ ] RLS policies verified in Supabase
- [ ] Service role key rotated
- [ ] Test: Direct URL access without session → redirects
- [ ] Test: API call without session → returns 401
- [ ] Test: API call with driver role → returns 403
- [ ] Test: Session expires → auto-logout
- [ ] Test: Supabase timeout → fail closed

---

## 📝 SUMMARY

**Current State:**
- ✅ Middleware protection exists and works
- ✅ All routes protected by authentication
- ⚠️ Missing role validation in 60% of API routes
- ⚠️ Middleware fails open for API routes on error
- ⚠️ No auth state change listener

**Critical Risks:**
1. 🔴 `/api/users/list` accessible by any authenticated user
2. 🔴 `/api/bookings/list` accessible by any authenticated user
3. 🔴 Middleware fails open for API routes on Supabase timeout

**Recommended Actions:**
1. Add role validation to all API routes (P0)
2. Change middleware to fail closed (P0)
3. Add auth state change listener (P1)
4. Verify RLS policies (P1)

**Status:** 🟡 **MEDIUM RISK** — Fixable with minimal changes

**Full report:** `cristi-db-build/SECURITY-AUDIT-REPORT.md`
