# AUTH MAP – ADMIN, OPERATOR, DRIVER

## 1. Sistem de autentificare

**Stack de autentificare:**
- **Auth Provider:** Supabase Auth (JWT-based)
- **Session Storage:** HTTP-only cookies via @supabase/ssr
- **Client Types:**
  - `lib/supabase/client.ts` - Browser client (anon key)
  - `lib/supabase/server.ts` - Server client (anon key + cookies)
  - `lib/supabase/admin.ts` - Admin client (service_role key) - DOAR server-side

**Obținerea user-ului logat:**
- **Client-side:** `apps/admin/shared/hooks/useCurrentUser.ts`
- **Server-side:** `await supabase.auth.getUser()` în API routes
- **Middleware:** `middleware.ts` verifică auth pentru rute protejate

## 2. Roluri și sursa lor

| Rol | Tabel sursă | Coloană/Determinare | Cum se verifică în cod |
|-----|-------------|-------------------|----------------------|
| `super_admin` | `admin_users` | `role = 'super_admin'` | `useCurrentUser()` mapează din `user_metadata.role` |
| `admin` | `admin_users` | `role = 'admin'` | `useCurrentUser()` mapează din `user_metadata.role` |
| `operator` | `organizations` | `auth_user_id` match + `org_type = 'operator'` | `useCurrentUser()` fetch din organizations table |
| `driver` | `drivers` | `auth_user_id` match | `useCurrentUser()` verifică `user_metadata.role === 'driver'` |
| `customer` | `customers` | `auth_user_id` match + RLS activ | Nu se loghează în admin (au app separat) |

**Determinarea rolului în cod:**
```typescript
// useCurrentUser.ts - linia 47-61
const userRole = session.user.user_metadata?.role || 'operator';
if (userRole === 'admin' || userRole === 'super_admin') {
  appShellRole = 'admin';
} else if (userRole === 'driver') {
  appShellRole = 'driver';  
} else {
  appShellRole = 'operator';
}
```

## 3. Zone și rute principale

### 3.1. Zona ADMIN (super_admin + admin)

| Rută / Grup | Exemplu path | Roluri permise | Cum se face verificarea acum |
|-------------|--------------|----------------|------------------------------|
| `app/(admin)/dashboard` | `/dashboard` | super_admin, admin | Middleware + useCurrentUser |
| `app/(admin)/users` | `/users/*` | super_admin, admin | Middleware + useCurrentUser |
| `app/(admin)/bookings` | `/bookings/*` | super_admin, admin | Middleware + useCurrentUser |
| `app/(admin)/business-intelligence` | `/business-intelligence` | super_admin, admin | Middleware + useCurrentUser |
| `app/(admin)/settings` | `/settings/*` | super_admin, admin | Middleware + useCurrentUser |

### 3.2. Zona OPERATOR

| Rută / Grup | Exemplu path | Roluri permise | Cum se face verificarea acum |
|-------------|--------------|----------------|------------------------------|
| `app/(admin)/operator` | `/operator/*` | operator | **❌ NU protejată în middleware** |
| `app/(admin)/operator/drivers` | `/operator/drivers` | operator | **❌ NU protejată în middleware** |

### 3.3. Zona DRIVER

| Rută / Grup | Exemplu path | Roluri permise | Cum se face verificarea acum |
|-------------|--------------|----------------|------------------------------|
| `app/(admin)/driver` | `/driver/*` | driver | **❌ NU protejată în middleware** |
| `app/(admin)/driver/documents` | `/driver/documents` | driver | **❌ NU protejată în middleware** |

## 4. Mecanisme de protecție

### 4.1. Middleware (`middleware.ts`)
- **Unde:** Root-level middleware
- **Protejează:** DOAR rutele admin principale (dashboard, users, bookings, etc.)
- **Nu protejează:** `/operator/*` și `/driver/*` (marcat TEMPORARY în cod)
- **Verifică:** Doar prezența user-ului autentificat, NU rolul

### 4.2. Layout Protection (`app/(admin)/layout.tsx`)
- **Unde:** Layout wrapper pentru toate rutele (admin)
- **Folosește:** `useCurrentUser()` hook
- **Verifică:** Role și mapează pentru AppShell
- **Problema:** Client-side only, poate fi bypassed

### 4.3. RBAC Middleware (`lib/middleware/rbac.ts`)
- **Unde:** Server-side pentru API routes
- **Verifică:** admin_users table pentru role verification
- **Folosit în:** API routes cu `checkAdminAccess()`
- **Suportă:** `super_admin`, `admin`, `operator` roles

### 4.4. Helper-uri de rol
**❌ NU EXISTĂ:** 
- `requireAdmin()` 
- `requireOperator()`
- `requireDriver()`
- `requireAuth()`

**✅ EXISTĂ:**
- `checkAdminAccess()` - doar pentru API routes
- `useCurrentUser()` - client-side hook
