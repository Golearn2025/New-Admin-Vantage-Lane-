# PAS 1 — ORGANIZATIONS + ROLURI

**Status:** ❌ Lipsesc toate tabelele din acest pas
**Prioritate:** 🔴 CRITICĂ — Toate celelalte tabele depind de acestea

---

## 🎯 OBIECTIV PAS 1

Creează fundația pentru **multi-tenancy** și **role-based access control (RBAC)**.

**Ce construim:**
1. `organizations` — Vantage Lane, London Cabs, etc.
2. `organization_members` — ROOT, admin, operator
3. `drivers` — șoferi per organizație
4. `customers` — clienți per organizație
5. `corporate_employees` — angajați corporate

---

## 📊 STRUCTURA RELAȚII

```
organizations
    ├─→ organization_members (root, admin, operator)
    ├─→ drivers
    ├─→ customers
    │       └─→ corporate_employees (dacă customer_type='corporate')
    └─→ bookings (va fi actualizat în PAS 3)
```

---

## 1️⃣ TABEL: `organizations`

**Scop:** Vantage Lane, London Cabs, etc. — fiecare organizație = tenant izolat

**Coloane (14):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID organizație |
| `name` | text | Da | - | Nume (ex: "Vantage Lane") |
| `org_type` | text | Da | - | 'platform_owner' / 'operator' |
| `code` | text | Da | - | Cod scurt (ex: "VL") UNIQUE |
| `contact_email` | text | Nu | - | Email contact |
| `contact_phone` | text | Nu | - | Telefon contact |
| `city` | text | Nu | - | Oraș |
| `country` | text | Da | 'GB' | Țară |
| `is_active` | boolean | Da | true | Activă sau nu |
| `rating_average` | numeric | Nu | - | Rating mediu |
| `review_count` | integer | Da | 0 | Număr review-uri |
| `created_at` | timestamptz | Da | now() | Când a fost creată |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `code`
- INDEX: `is_active`, `org_type`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede tot
- Admin vede doar organizația sa
- Operator vede doar organizația sa

**Date inițiale:**
```
1. Vantage Lane (org_type: 'platform_owner', code: 'VL')
2. London Cabs (org_type: 'operator', code: 'LC') — opțional
```

---

## 2️⃣ TABEL: `organization_members`

**Scop:** ROOT (tu + Cristi), Admini, Operatori

**Coloane (13):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID membru |
| `auth_user_id` | uuid | Da | - | → auth.users(id) UNIQUE |
| `organization_id` | uuid | Nu | - | → organizations(id) (NULL pentru ROOT) |
| `email` | text | Da | - | Email |
| `first_name` | text | Nu | - | Prenume |
| `last_name` | text | Nu | - | Nume |
| `name` | text | Nu | - | Nume complet |
| `phone` | text | Nu | - | Telefon |
| `role` | text | Da | - | 'root' / 'admin' / 'operator' |
| `permissions` | jsonb | Nu | {} | Permisiuni granulare (pentru operator) |
| `is_active` | boolean | Da | true | Activ sau nu |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `auth_user_id` → `auth.users(id)` (FK, UNIQUE)
- `organization_id` → `organizations(id)` (FK, poate fi NULL pentru ROOT)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `auth_user_id`
- INDEX: `organization_id`, `role`, `is_active`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede tot
- Admin vede doar membrii din organizația sa
- Operator vede doar membrii din organizația sa (read-only)

**Exemplu permissions (jsonb) pentru operator:**
```json
{
  "can_view_pricing": false,
  "can_approve_drivers": false,
  "can_assign_bookings": true,
  "can_view_reports": true
}
```

**Date inițiale:**
```
1. ROOT (tu): role='root', organization_id=NULL
2. ROOT (Cristi): role='root', organization_id=NULL
```

---

## 3️⃣ TABEL: `drivers`

**Scop:** Șoferi per organizație

**Coloane (29):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Identificare** |
| `id` | uuid | Da | gen_random_uuid() | ID driver |
| `auth_user_id` | uuid | Da | - | → auth.users(id) UNIQUE |
| `organization_id` | uuid | Da | - | → organizations(id) |
| **Date personale** |
| `first_name` | text | Da | - | Prenume |
| `last_name` | text | Da | - | Nume |
| `name` | text | - | GENERATED | first_name \|\| ' ' \|\| last_name |
| `email` | text | Nu | - | Email |
| `phone` | text | Da | - | Telefon |
| `address` | text | Nu | - | Adresă |
| `date_of_birth` | date | Nu | - | Data nașterii |
| `profile_photo_url` | text | Nu | - | Link poză profil |
| **Status** |
| `status` | text | Da | 'pending' | 'pending' / 'active' / 'inactive' / 'suspended' |
| `is_active` | boolean | Da | false | Activ sau nu |
| `is_approved` | boolean | Da | false | Aprobat de admin |
| `is_available` | boolean | Da | false | Disponibil pentru job-uri |
| `online_status` | text | Da | 'offline' | 'online' / 'offline' |
| `profile_completed` | boolean | Da | false | A completat profilul |
| **Rating** |
| `rating_average` | numeric | Nu | - | Media rating-urilor (ex: 4.5) |
| `rating_count` | integer | Da | 0 | Câte rating-uri are |
| **Locație GPS** |
| `current_latitude` | numeric | Nu | - | Latitudine curentă |
| `current_longitude` | numeric | Nu | - | Longitudine curentă |
| `location_accuracy` | numeric | Nu | - | Precizie GPS (metri) |
| `location_updated_at` | timestamptz | Nu | - | Când a fost actualizată |
| **Device** |
| `current_device_token` | text | Nu | - | Token push notifications |
| `last_device_login_at` | timestamptz | Nu | - | Ultima logare |
| `last_online_at` | timestamptz | Nu | - | Ultima dată online |
| **Preferințe** |
| `navigation_preference` | text | Da | 'google_maps' | 'google_maps' / 'waze' / 'apple_maps' |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `auth_user_id` → `auth.users(id)` (FK, UNIQUE)
- `organization_id` → `organizations(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `auth_user_id`
- INDEX: `organization_id`, `status`, `is_active`, `is_available`, `online_status`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toți driverii
- Admin vede doar driverii din organizația sa
- Operator vede doar driverii din organizația sa
- Driver vede doar datele lui

---

## 4️⃣ TABEL: `customers`

**Scop:** Clienți (individual + corporate) per organizație

**Coloane (15):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID customer |
| `auth_user_id` | uuid | Nu | - | → auth.users(id) (NULL pentru guest) |
| `organization_id` | uuid | Da | - | → organizations(id) |
| `customer_type` | text | Da | 'individual' | 'individual' / 'corporate' |
| `email` | text | Da | - | Email |
| `first_name` | text | Nu | - | Prenume (individual) |
| `last_name` | text | Nu | - | Nume (individual) |
| `phone` | text | Nu | - | Telefon |
| `company_name` | text | Nu | - | Nume firmă (corporate) |
| `contract_number` | text | Nu | - | Număr contract (corporate) |
| `billing_email` | text | Nu | - | Email facturare (corporate) |
| `is_active` | boolean | Da | true | Activ sau nu |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `auth_user_id` → `auth.users(id)` (FK, UNIQUE, poate fi NULL)
- `organization_id` → `organizations(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `auth_user_id` (WHERE NOT NULL)
- INDEX: `organization_id`, `customer_type`, `is_active`, `email`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toți customerii
- Admin vede doar customerii din organizația sa
- Operator vede doar customerii din organizația sa
- Customer vede doar datele lui

---

## 5️⃣ TABEL: `corporate_employees`

**Scop:** Angajați din firmele corporate (pot avea login și pot comanda)

**Coloane (12):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID angajat |
| `auth_user_id` | uuid | Nu | - | → auth.users(id) (pentru login) |
| `corporate_customer_id` | uuid | Da | - | → customers(id) WHERE customer_type='corporate' |
| `employee_name` | text | Da | - | Nume angajat |
| `employee_email` | text | Da | - | Email angajat |
| `employee_phone` | text | Nu | - | Telefon |
| `department` | text | Nu | - | Department |
| `cost_center` | text | Nu | - | Cost center |
| `can_book` | boolean | Da | true | Poate face comenzi |
| `is_active` | boolean | Da | true | Activ sau nu |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |

**Relații:**
- `auth_user_id` → `auth.users(id)` (FK, UNIQUE, poate fi NULL)
- `corporate_customer_id` → `customers(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `auth_user_id` (WHERE NOT NULL)
- INDEX: `corporate_customer_id`, `is_active`, `employee_email`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toți angajații
- Admin vede doar angajații din organizația sa (prin customers)
- Corporate admin vede doar angajații companiei sale
- Employee vede doar datele lui

---

## ✅ VERIFICĂRI DUPĂ CREARE

```sql
-- 1. Verifică că toate tabelele există
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'organizations', 
  'organization_members', 
  'drivers', 
  'customers', 
  'corporate_employees'
)
ORDER BY table_name;
-- Ar trebui să returneze 5 rows

-- 2. Verifică FK-uri
SELECT 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN (
  'organization_members', 
  'drivers', 
  'customers', 
  'corporate_employees'
)
ORDER BY tc.table_name;
-- Ar trebui să returneze 6 FK-uri

-- 3. Verifică număr coloane (max 30)
SELECT 
  table_name, 
  COUNT(*) as nr_coloane
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
  'organizations', 
  'organization_members', 
  'drivers', 
  'customers', 
  'corporate_employees'
)
GROUP BY table_name
ORDER BY table_name;
-- Toate ar trebui < 30 coloane

-- 4. Verifică RLS activat
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'organizations', 
  'organization_members', 
  'drivers', 
  'customers', 
  'corporate_employees'
)
AND rowsecurity = false;
-- Ar trebui să returneze 0 rows (toate au RLS)
```

---

## 🎯 NEXT STEPS

După ce creezi aceste 5 tabele și verifici că totul funcționează:

1. ✅ Creează primul ROOT user (tu)
2. ✅ Creează prima organizație (Vantage Lane)
3. ✅ Testează login ca ROOT
4. ✅ Verifică că RLS funcționează

**Apoi mergem la PAS 2: Vehicles + Documents**

---

## 📋 PRINCIPII RESPECTATE

- ✅ **Modular:** Fiecare tabel = scop clar (10-30 coloane)
- ✅ **Scalabil:** Adaugi organizație/user nou = INSERT simplu
- ✅ **Multi-tenant:** Izolare prin `organization_id`
- ✅ **Zero duplicări:** Fiecare coloană = un singur loc
- ✅ **Standard enterprise:** Pattern folosit de Google, Salesforce, Stripe
