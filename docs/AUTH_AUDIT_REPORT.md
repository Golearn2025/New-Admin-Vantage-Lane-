# AUTH & SECURITY AUDIT – ADMIN, OPERATOR, DRIVER

## 1. Rezumat rapid

### ✅ Puncte tari (ce e deja bine):
- **Supabase Auth solid:** JWT tokens + HTTP-only cookies
- **Service role izolat:** `lib/supabase/admin.ts` DOAR server-side
- **RBAC middleware funcțional:** `lib/middleware/rbac.ts` pentru API routes
- **Client separation:** Browser/server clients corecți
- **RLS activ:** customers table protejată cu Row Level Security

### ❌ Puncte slabe (găuri, inconsistențe):
- **Operator/Driver rute neprotejate:** Middleware exclude explicit `/operator/*` și `/driver/*`
- **Client-side only protection:** useCurrentUser() poate fi bypassed prin direct URL
- **Role verification inconsistent:** Verificare în metadata vs DB tables
- **Lipsă helper-uri:** Fără `requireAdmin()`, `requireOperator()`, `requireDriver()`
- **Admin access prea permisiv:** service_role folosit în API fără verificări stricte

## 2. Protecție rute

### 2.1. Zona ADMIN

| Rută | Auth Check | Role Check | Server-side? | Status |
|------|-----------|-----------|-------------|---------|
| `/dashboard` | ✅ Middleware | ❌ Client-only | ❌ | **VULNERABLE** |
| `/users/*` | ✅ Middleware | ❌ Client-only | ❌ | **VULNERABLE** |
| `/bookings` | ✅ Middleware | ❌ Client-only | ❌ | **VULNERABLE** |
| `/business-intelligence` | ✅ Middleware | ❌ Client-only | ❌ | **VULNERABLE** |
| `/settings/*` | ✅ Middleware | ❌ Client-only | ❌ | **VULNERABLE** |

**Probleme identificate:**
- Middleware verifică doar `supabase.auth.getUser()` - nu verifică rolul
- Orice user autentificat (chiar driver/operator) poate accesa admin pages
- Role checking se face doar în `useCurrentUser()` hook (client-side)

### 2.2. Zona OPERATOR

| Rută | Auth Check | Role Check | Server-side? | Status |
|------|-----------|-----------|-------------|---------|
| `/operator/*` | ❌ EXCLUDED | ❌ Nu există | ❌ | **CRITICAL** |
| `/operator/drivers` | ❌ EXCLUDED | ❌ Nu există | ❌ | **CRITICAL** |

**Probleme critice:**
```typescript
// middleware.ts linia 66
// TEMPORARY: /operator and /driver are NOT protected (for development)
```
- Oricine poate accesa `/operator/*` fără autentificare
- Nu există verificare că userul este cu adevărat operator
- Organizarea ID nu se verifică server-side

### 2.3. Zona DRIVER

| Rută | Auth Check | Role Check | Server-side? | Status |
|------|-----------|-----------|-------------|---------|
| `/driver/*` | ❌ EXCLUDED | ❌ Nu există | ❌ | **CRITICAL** |
| `/driver/documents` | ❌ EXCLUDED | ❌ Nu există | ❌ | **CRITICAL** |

**Probleme critice:**
- Oricine poate accesa `/driver/*` fără autentificare
- Un driver poate vedea documentele altor drivers schimbând doar URL-ul
- Nu există verificare că driver-ul logat vede doar datele lui

## 3. Supabase, RLS & service_role

### ✅ Clienti Supabase corecți:
- `lib/supabase/client.ts` - Browser (anon key) ✅
- `lib/supabase/server.ts` - Server (anon key + cookies) ✅
- `lib/supabase/admin.ts` - Admin (service_role) ✅ DOAR server-side

### ❌ Service Role Usage în API routes:

| API Route | Uses service_role | Bypasses RLS | Justified? |
|-----------|------------------|--------------|------------|
| `/api/bookings/list` | ✅ | ✅ | ❓ Questionable |
| `/api/bookings/[id]` | ✅ | ✅ | ❓ Questionable |
| `/api/bookings/counts` | ✅ | ✅ | ❓ Questionable |

**Problema:** API routes folosesc `createAdminClient()` pentru queries simple care ar putea folosi RLS

### RLS Status pe tabele:

| Tabel | RLS Enabled | Policies | Protected Data |
|-------|-------------|----------|----------------|
| `admin_users` | ❌ | None | **SENSITIVE** - Admin roles |
| `organizations` | ❌ | None | Operator companies |
| `drivers` | ❌ | None | **SENSITIVE** - Driver data |
| `customers` | ✅ | Unknown | Customer PII |
| `bookings` | ❌ | None | **SENSITIVE** - All ride data |
| `user_organization_roles` | ❌ | None | **CRITICAL** - Role mappings |

**CRITICAL:** Majoritatea tabelelor sensibile NU au RLS activat!

## 4. Probleme concrete găsite

### [SEVERITY: CRITICAL] Operator/Driver rute complet neprotejate
- **Zonă:** operator + driver  
- **Fișier:** `middleware.ts` linia 66-67  
- **Descriere:** Rutele `/operator/*` și `/driver/*` sunt excluse explicit din protecție cu comentariul "TEMPORARY: for development"
- **Cum se abuzează:** Oricine poate accesa `/operator/drivers` sau `/driver/documents` direct în browser
- **Fix propus:** Activează protecția și adaugă role verification în middleware

### [SEVERITY: HIGH] Admin pages accesibile oricui autentificat
- **Zonă:** admin  
- **Fișier:** `middleware.ts` + `app/(admin)/layout.tsx`  
- **Descriere:** Middleware verifică doar autentificarea, nu rolul. Un driver logat poate accesa `/dashboard`
- **Cum se abuzează:** Driver se loghează → navigare directă la `/users` → vede toate datele admin
- **Fix propus:** Adaugă role verification în middleware server-side

### [SEVERITY: HIGH] Service role prea permisiv în API  
- **Zonă:** API routes  
- **Fișier:** `app/api/bookings/*`  
- **Descriere:** API routes folosesc service_role pentru queries simple, bypass RLS complet
- **Cum se abuzează:** Orice request la API returnează date fără restricții per rol
- **Fix propus:** Folosește RLS policies și user context în loc de service_role

### [SEVERITY: HIGH] RLS lipsește pe tabele critice
- **Zonă:** Database  
- **Fișier:** Supabase schema  
- **Descriere:** `admin_users`, `drivers`, `bookings`, `user_organization_roles` NU au RLS
- **Cum se abuzează:** Query direct din browser sau API leak poate expune toate datele
- **Fix propus:** Activează RLS + policies pe toate tabelele sensibile

### [SEVERITY: MEDIUM] Client-side role verification
- **Zonă:** admin layout  
- **Fișier:** `apps/admin/shared/hooks/useCurrentUser.ts`  
- **Descriere:** Role mapping se face doar client-side în useCurrentUser hook
- **Cum se abuzează:** Developer tools sau URL manipulation poate bypass verificările
- **Fix propus:** Mutare role verification pe server-side

### [SEVERITY: MEDIUM] Inconsistență role storage
- **Zonă:** auth system  
- **Fișier:** Multiple  
- **Descriere:** Rolurile se găsesc în `user_metadata.role` ȘI în tabele separate (`admin_users`, `organizations`)
- **Cum se abuzează:** Divergențe între surse pot crea confusion și acces neautorizat
- **Fix propus:** Single source of truth pentru roluri

## 5. Recomandări de structură pentru auth

### Helper-uri de creat:
```typescript
// lib/auth/helpers.ts
export async function requireAdmin(request: NextRequest): Promise<AdminUser>
export async function requireOperator(request: NextRequest): Promise<OperatorUser>  
export async function requireDriver(request: NextRequest): Promise<DriverUser>
export async function getCurrentUserRole(userId: string): Promise<UserRole>
```

### Middleware îmbunătățit:
- **Nivel 1:** Auth verification (există deja)
- **Nivel 2:** Role verification pe route patterns
- **Nivel 3:** Organization/entity access verification

### RLS Policies de implementat:
```sql
-- admin_users: doar super_admin poate vedea alți admini
-- drivers: doar admin + operator din aceeași organizație + driver însuși  
-- bookings: admin vede toate, operator vede doar din organizația lui
-- customers: admin + operator pentru bookings active
```

### Server-side protection:
- **Layout-uri:** Server components cu role verification
- **API routes:** RBAC middleware obligatoriu
- **Database:** RLS policies pentru toate tabelele sensibile

### Arhitectură propusă:
```
middleware.ts → role check → layout server component → API with RLS
     ↓              ↓              ↓                    ↓
   Auth only    Role verify    Final check         Data filtering
```
