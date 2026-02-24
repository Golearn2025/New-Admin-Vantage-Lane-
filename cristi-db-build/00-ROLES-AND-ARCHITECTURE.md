# 00 — ROLURI, RLS ȘI ARHITECTURĂ MULTI-TENANT

---

## 1. Rolurile Supabase — Ce sunt și ce fac

Supabase are **3 roluri de sistem** (nu le poți schimba, sunt fixe):

| Rol | Cine îl folosește | Ce poate face |
|---|---|---|
| `anon` | Oricine fără cont (vizitator) | Doar ce îi permiți explicit prin RLS |
| `authenticated` | Orice user logat (indiferent de tip) | Doar ce îi permiți prin RLS |
| `service_role` | Serverul tău (backend, Edge Functions) | **TOT** — bypass complet RLS. NICIODATĂ în client! |

> ⚠️ **Regula de aur:** `anon` și `authenticated` sunt roluri Postgres. RLS controlează ce vede fiecare. `service_role` e pentru server-side only.

---

## 2. Rolurile Custom ale Aplicației

Acestea sunt roluri **ale aplicației tale**, stocate în tabele, nu roluri Postgres:

| Rol App | Tabel unde e stocat | Ce poate face |
|---|---|---|
| `super_admin` | `admin_users.role` | Tot — toate organizațiile, toate datele |
| `admin` | `admin_users.role` | Tot în organizația sa |
| `support` | `admin_users.role` | Citire + tickete, fără ștergere |
| `operator` | `user_organization_roles.role` | Manageriază driveri + bookings din org sa |
| `driver` | `drivers` tabel | Vede doar propriile job-uri, documente, earnings |
| `customer` | `customers` tabel | Vede doar propriile bookings (app customer — viitor) |
| `corporate` | viitor — `billing_entities` | Cont corporativ cu facturare separată |

### Cum funcționează în cod:

```
auth.users (Supabase Auth)
    │
    ├── admin_users (auth_user_id FK) → role: super_admin / admin / support
    ├── user_organization_roles (user_id FK) → role: operator
    ├── drivers (auth_user_id FK) → rol implicit: driver
    └── customers (auth_user_id FK) → rol implicit: customer
```

**Fluxul de autentificare:**
1. User face login → Supabase Auth creează sesiune
2. App verifică în `admin_users` → dacă există = admin/operator
3. App verifică în `drivers` → dacă există = driver
4. App verifică în `customers` → dacă există = customer

---

## 3. Arhitectura Multi-Tenant cu `organizations`

### Ce este un tenant?

Un **tenant** = o organizație separată cu datele ei izolate.

**Exemplu concret:**
- Tenant 1: **Vantage Lane** (voi) — driveri, bookings, clienți proprii
- Tenant 2: **London Cabs Ltd** (client viitor) — driveri, bookings, clienți proprii
- Tenant 3: **Paris Transfers** (alt client viitor) — idem

Fiecare tenant vede **DOAR** datele lui. Nu se amestecă niciodată.

### Răspuns direct la întrebarea ta: **DA, este posibil!**

Arhitectura cu `organization_id` pe toate tabelele relevante permite exact asta:
- Dai la "chirie" app-ul driver și app-ul admin pentru altcineva
- Ei au propria organizație în DB
- Datele lor sunt complet separate de ale voastre
- Voi (super_admin) puteți vedea toate organizațiile dacă vreți

### Structura `organizations`:

```sql
organizations
├── id uuid PK
├── name text                    -- "Vantage Lane", "London Cabs Ltd"
├── org_type text                -- 'platform_owner' | 'operator' | 'corporate'
├── code text UNIQUE             -- 'VL', 'LC', 'PT'
├── contact_email text
├── contact_phone text
├── city text
├── country text
├── is_active boolean
├── rating_average numeric
├── review_count integer
├── created_at timestamptz
└── updated_at timestamptz
```

**Tipuri de organizații:**
- `platform_owner` — Vantage Lane (voi) — există o singură dată
- `operator` — parteneri care folosesc platforma (white-label)
- `corporate` — companii cu conturi corporative (facturare separată)

### Cum se izolează datele prin RLS:

```sql
-- Exemplu RLS pe tabelul drivers:
-- Operatorul vede DOAR driverii din organizația sa
CREATE POLICY "operators_see_own_org_drivers"
ON drivers FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM user_organization_roles
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Super admin vede TOT
CREATE POLICY "super_admin_sees_all_drivers"
ON drivers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = auth.uid()
    AND role = 'super_admin'
  )
);
```

---

## 4. Tabelele de Autentificare și Roluri

### `admin_users` — Adminii și Operatorii platformei

```sql
admin_users
├── id uuid PK
├── auth_user_id uuid UNIQUE FK → auth.users(id)
├── organization_id uuid FK → organizations(id)  -- nullable pentru super_admin
├── email text NOT NULL
├── name text
├── first_name text
├── last_name text
├── phone text
├── role text NOT NULL  -- 'super_admin' | 'admin' | 'support'
├── is_active boolean DEFAULT true
├── created_at timestamptz
└── updated_at timestamptz
```

### `user_organization_roles` — Operatorii per organizație

```sql
user_organization_roles
├── id uuid PK
├── user_id uuid FK → auth.users(id)   -- auth_user_id
├── organization_id uuid FK → organizations(id)
├── role text NOT NULL  -- 'operator' | 'manager' | 'dispatcher'
├── is_active boolean DEFAULT true
├── created_at timestamptz
└── updated_at timestamptz
```

### `role_permissions` — Ce poate face fiecare rol

```sql
role_permissions
├── id uuid PK
├── role text NOT NULL          -- 'super_admin' | 'admin' | 'operator' | etc.
├── resource text NOT NULL      -- 'bookings' | 'drivers' | 'documents' | etc.
├── can_create boolean DEFAULT false
├── can_read boolean DEFAULT false
├── can_update boolean DEFAULT false
├── can_delete boolean DEFAULT false
├── created_at timestamptz
└── updated_at timestamptz
```

---

## 5. Realtime — Ce tabele au nevoie de Realtime

| Tabel | De ce Realtime | Cine ascultă |
|---|---|---|
| `booking_legs` | Status updates live (assigned→en_route→completed) | Admin map, Driver app |
| `notifications` | Notificări instant | Admin, Driver |
| `live_chat_messages` | Chat live | Driver, Admin/Operator |
| `live_chat_sessions` | Status sesiune chat | Admin/Operator |
| `drivers` | Online status, locație heartbeat | Admin map |

**Locația driverului** folosește **Broadcast** (nu DB writes):
- GPS update la 1s → Broadcast Realtime la 3s (zero DB writes)
- Heartbeat DB la fiecare 15s → `drivers.current_latitude/longitude`

---

## 6. Edge Functions — Ce funcții sunt necesare

| Funcție | Scop |
|---|---|
| `send-push-notification` | Trimite push via Expo/FCM la driver |
| `broadcast-notification` | Trimite notificare la toți driverii sau grup |
| `get-dashboard-charts` | RPC pentru date BI (deja există ca RPC) |
| `process-driver-approval` | Activează driver după aprobare documente |
| `calculate-driver-earnings` | Calculează câștiguri după completare job |

---

## 7. Triggers necesare

| Trigger | Pe tabel | Când | Ce face |
|---|---|---|---|
| `on_booking_leg_completed` | `booking_legs` | AFTER UPDATE status='completed' | Creează înregistrare în `driver_earnings` |
| `on_driver_approved` | `drivers` | AFTER UPDATE is_approved=true | Creează `driver_performance_stats` row |
| `on_new_notification` | `notifications` | AFTER INSERT | Trimite push notification (via Edge Function) |
| `update_updated_at` | toate tabelele | BEFORE UPDATE | Setează `updated_at = now()` |
| `generate_booking_reference` | `bookings` | BEFORE INSERT | Generează reference unic (VL-2026-XXXX) |
