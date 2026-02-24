# PAS 2 — VEHICLES + DOCUMENTS

**Status:** ❌ Lipsesc toate tabelele din acest pas  
**Prioritate:** 🔴 CRITICĂ — Admin și Driver App au nevoie de acestea  
**Dependențe:** ✅ PAS 1 trebuie completat PRIMUL (organizations, drivers)

---

## 🎯 OBIECTIV PAS 2

Creează infrastructura pentru **vehicule** și **documente** (driver + vehicul).

**Ce construim:**
1. `vehicles` — mașinile driverilor
2. `driver_documents` — documente driver (passport, license, etc.)
3. `vehicle_documents` — documente vehicul (insurance, registration, MOT)
4. `vehicle_approval` — istoric aprobare vehicule
5. `vehicle_services` — ce servicii poate oferi vehiculul
6. `booking_legs` — UPDATE (adaugă coloane pentru assignment driveri)

---

## 📊 STRUCTURA RELAȚII

```
organizations (PAS 1)
    ↓
drivers (PAS 1)
    ↓
    ├─→ vehicles
    │       ├─→ vehicle_documents
    │       ├─→ vehicle_approval
    │       └─→ vehicle_services
    │
    └─→ driver_documents

booking_legs (existent)
    ├─→ assigned_driver_id → drivers
    └─→ assigned_vehicle_id → vehicles
```

---

## 1️⃣ TABEL: `vehicles`

**Scop:** Mașinile driverilor (date fizice, NU documente)

**Coloane (15):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Identificare** |
| `id` | uuid | Da | gen_random_uuid() | ID vehicul |
| `driver_id` | uuid | Da | - | → drivers(id) |
| `organization_id` | uuid | Da | - | → organizations(id) |
| **Date fizice mașină** |
| `make` | text | Da | - | Marcă (Mercedes, BMW, Ford) |
| `model` | text | Da | - | Model (E-Class, X5, Transit) |
| `year` | integer | Da | - | An fabricație |
| `color` | text | Nu | - | Culoare |
| `license_plate` | text | Da | - | Număr înmatriculare UNIQUE |
| `passenger_capacity` | integer | Da | 4 | Câți pasageri |
| `luggage_capacity` | integer | Da | 2 | Câte bagaje |
| **Status** |
| `is_active` | boolean | Da | false | Activ sau nu |
| `approval_status` | text | Da | 'pending' | 'pending' / 'approved' / 'rejected' |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `driver_id` → `drivers(id)` (FK, ON DELETE CASCADE)
- `organization_id` → `organizations(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `license_plate` (WHERE deleted_at IS NULL)
- INDEX: `driver_id`, `organization_id`, `is_active`, `approval_status`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate vehiculele
- Admin vede doar vehiculele din organizația sa
- Operator vede doar vehiculele din organizația sa
- Driver vede doar vehiculele lui

**IMPORTANT:** 
- ❌ NU pune `insurance_expiry` aici — merge în `vehicle_documents`
- ❌ NU pune `category` aici — folosim `vehicle_services` pentru servicii

---

## 2️⃣ TABEL: `driver_documents`

**Scop:** Documente driver (passport, license, background check, etc.)

**Coloane (17):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Identificare** |
| `id` | uuid | Da | gen_random_uuid() | ID document |
| `driver_id` | uuid | Da | - | → drivers(id) |
| **Document info** |
| `document_type` | text | Da | - | 'driving_licence' / 'electronic_counterpart' / 'pco_licence' / 'bank_statement' / 'profile_photo' / 'proof_of_identity' / 'proof_of_address' |
| `document_category` | text | Nu | - | Categorie suplimentară |
| `file_name` | text | Da | - | Nume fișier original |
| `file_url` | text | Da | - | Link către fișier (Supabase Storage) |
| `file_size` | integer | Nu | - | Mărime fișier (bytes) |
| `mime_type` | text | Nu | - | Tip fișier (image/jpeg, application/pdf) |
| **Status și review** |
| `status` | text | Da | 'pending' | 'required' / 'pending' / 'approved' / 'rejected' / 'expired' / 'expiring_soon' |
| `notes` | text | Nu | - | Note admin |
| `upload_date` | timestamptz | Da | now() | Când a fost încărcat |
| `expiry_date` | date | Nu | - | Când expiră (dacă aplicabil) |
| `reviewed_by` | uuid | Nu | - | → organization_members(id) |
| `reviewed_at` | timestamptz | Nu | - | Când a fost verificat |
| `rejection_reason` | text | Nu | - | Motivul respingerii |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `driver_id` → `drivers(id)` (FK, ON DELETE CASCADE)
- `reviewed_by` → `organization_members(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `driver_id`, `document_type`, `status`, `expiry_date`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate documentele
- Admin vede doar documentele din organizația sa (prin drivers)
- Operator vede doar documentele din organizația sa (read-only)
- Driver vede doar documentele lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct — se obține prin `driver_id → drivers.organization_id`

**Document Types (din Driver App):**
- `driving_licence` — Permis conducere (OBLIGATORIU)
- `electronic_counterpart` — Counterpart electronic (OBLIGATORIU)
- `pco_licence` — Licență PCO - Private Hire Driver (UK) (OBLIGATORIU)
- `bank_statement` — Extras bancar
- `profile_photo` — Poză profil
- `proof_of_identity` — Dovadă identitate (OBLIGATORIU)
- `proof_of_address` — Dovadă adresă

**Statusuri (din Driver App):**
- `required` — Document lipsește, trebuie încărcat
- `pending` — Document încărcat, așteaptă review admin
- `approved` — Document aprobat de admin
- `rejected` — Document respins de admin
- `expired` — Document expirat
- `expiring_soon` — Document expiră în curând (reminder)

---

## 3️⃣ TABEL: `vehicle_documents`

**Scop:** Documente vehicul (insurance, registration, MOT, etc.)

**Coloane (17):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Identificare** |
| `id` | uuid | Da | gen_random_uuid() | ID document |
| `vehicle_id` | uuid | Da | - | → vehicles(id) |
| **Document info** |
| `document_type` | text | Da | - | 'phv_licence' / 'mot_certificate' / 'insurance_certificate' / 'v5c_logbook' / 'hire_agreement' / 'vehicle_schedule' / 'driver_schedule' |
| `document_category` | text | Nu | - | Categorie suplimentară |
| `file_name` | text | Da | - | Nume fișier original |
| `file_url` | text | Da | - | Link către fișier (Supabase Storage) |
| `file_size` | integer | Nu | - | Mărime fișier (bytes) |
| `mime_type` | text | Nu | - | Tip fișier (image/jpeg, application/pdf) |
| **Status și review** |
| `status` | text | Da | 'pending' | 'required' / 'pending' / 'approved' / 'rejected' / 'expired' / 'expiring_soon' |
| `notes` | text | Nu | - | Note admin |
| `upload_date` | timestamptz | Da | now() | Când a fost încărcat |
| `expiry_date` | date | Nu | - | Când expiră (IMPORTANT pentru insurance) |
| `reviewed_by` | uuid | Nu | - | → organization_members(id) |
| `reviewed_at` | timestamptz | Nu | - | Când a fost verificat |
| `rejection_reason` | text | Nu | - | Motivul respingerii |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `vehicle_id` → `vehicles(id)` (FK, ON DELETE CASCADE)
- `reviewed_by` → `organization_members(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `vehicle_id`, `document_type`, `status`, `expiry_date`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate documentele
- Admin vede doar documentele din organizația sa (prin vehicles)
- Operator vede doar documentele din organizația sa (read-only)
- Driver vede doar documentele vehiculelor lui

**IMPORTANT:**
- ✅ Aici se pune `insurance_expiry` (în `expiry_date` pentru `document_type='insurance_certificate'`)
- ❌ NU are `organization_id` direct — se obține prin `vehicle_id → vehicles.organization_id`

**Document Types (din Driver App):**
- `phv_licence` — Licență PHV (Private Hire Vehicle - UK) (OBLIGATORIU)
- `mot_certificate` — Certificat MOT (UK roadworthiness test) (OBLIGATORIU)
- `insurance_certificate` — Certificat asigurare (OBLIGATORIU)
- `v5c_logbook` — V5C Logbook (UK vehicle registration) (OBLIGATORIU)
- `hire_agreement` — Contract închiriere (opțional)
- `vehicle_schedule` — Program vehicul (opțional)
- `driver_schedule` — Program șofer (opțional)

**Statusuri (din Driver App):**
- `required` — Document lipsește, trebuie încărcat
- `pending` — Document încărcat, așteaptă review admin
- `approved` — Document aprobat de admin
- `rejected` — Document respins de admin
- `expired` — Document expirat
- `expiring_soon` — Document expiră în curând (reminder)

---

## 4️⃣ TABEL: `vehicle_approval`

**Scop:** Istoric aprobare vehicule (cine, când, de ce)

**Coloane (8):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID aprobare |
| `vehicle_id` | uuid | Da | - | → vehicles(id) |
| `approval_status` | text | Da | - | 'pending' / 'approved' / 'rejected' |
| `reviewed_by` | uuid | Da | - | → organization_members(id) |
| `approved_at` | timestamptz | Nu | - | Când a fost aprobat |
| `rejection_reason` | text | Nu | - | Motivul respingerii |
| `notes` | text | Nu | - | Note suplimentare |
| `created_at` | timestamptz | Da | now() | Când a fost creat |

**Relații:**
- `vehicle_id` → `vehicles(id)` (FK, ON DELETE CASCADE)
- `reviewed_by` → `organization_members(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `vehicle_id`, `approval_status`, `reviewed_by`

**RLS:**
- ROOT vede tot istoricul
- Admin vede doar istoricul din organizația sa
- Operator vede doar istoricul din organizația sa (read-only)
- Driver vede doar istoricul vehiculelor lui

**IMPORTANT:**
- Fiecare schimbare de status = un nou rând (istoric complet)

---

## 5️⃣ TABEL: `vehicle_services`

**Scop:** Ce servicii poate oferi vehiculul (executive, standard, van, luxury, etc.)

**Coloane (7):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID serviciu |
| `vehicle_id` | uuid | Da | - | → vehicles(id) |
| `service_type` | text | Da | - | 'executive' / 'standard' / 'van' / 'luxury' / 'airport_transfer' / 'hourly' / 'daily' |
| `approved_by` | uuid | Nu | - | → organization_members(id) |
| `approved_at` | timestamptz | Nu | - | Când a fost aprobat |
| `is_active` | boolean | Da | true | Activ sau nu |
| `created_at` | timestamptz | Da | now() | Când a fost creat |

**Relații:**
- `vehicle_id` → `vehicles(id)` (FK, ON DELETE CASCADE)
- `approved_by` → `organization_members(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `vehicle_id`, `service_type`, `is_active`
- UNIQUE: `vehicle_id, service_type` (WHERE deleted_at IS NULL)

**RLS:**
- ROOT vede toate serviciile
- Admin vede doar serviciile din organizația sa
- Operator vede doar serviciile din organizația sa
- Driver vede doar serviciile vehiculelor lui

**IMPORTANT:**
- Un vehicul poate avea MULTIPLE servicii (de ex: Mercedes E-Class poate fi "executive" și "standard")
- Admin controlează ce servicii poate face fiecare vehicul

---

## 6️⃣ ACTUALIZARE: `booking_legs`

**Scop:** Adaugă coloane pentru assignment driveri și tracking job

**Coloane de adăugat (dacă nu există):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Assignment** |
| `assigned_driver_id` | uuid | Nu | - | → drivers(id) |
| `assigned_vehicle_id` | uuid | Nu | - | → vehicles(id) |
| `assigned_at` | timestamptz | Nu | - | Când a fost asignat |
| **Tracking job** |
| `started_at` | timestamptz | Nu | - | Când driver a început job-ul |
| `arrived_at_pickup` | timestamptz | Nu | - | Când driver a ajuns la pickup |
| `passenger_onboard_at` | timestamptz | Nu | - | Când pasagerul a urcat |
| `completed_at` | timestamptz | Nu | - | Când job-ul a fost completat |
| `cancelled_at` | timestamptz | Nu | - | Când job-ul a fost anulat |
| `cancel_reason` | text | Nu | - | Motivul anulării |
| `cancelled_by` | text | Nu | - | 'driver' / 'customer' / 'admin' / 'system' |

**SQL pentru actualizare:**

```sql
-- Adaugă coloane pentru assignment
ALTER TABLE booking_legs
ADD COLUMN IF NOT EXISTS assigned_driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at timestamptz;

-- Adaugă coloane pentru tracking
ALTER TABLE booking_legs
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS arrived_at_pickup timestamptz,
ADD COLUMN IF NOT EXISTS passenger_onboard_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz,
ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
ADD COLUMN IF NOT EXISTS cancel_reason text,
ADD COLUMN IF NOT EXISTS cancelled_by text;

-- Adaugă indexes
CREATE INDEX IF NOT EXISTS idx_booking_legs_assigned_driver ON booking_legs(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_booking_legs_assigned_vehicle ON booking_legs(assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_booking_legs_status ON booking_legs(status);
```

---

## ✅ VERIFICĂRI DUPĂ CREARE

```sql
-- 1. Verifică că toate tabelele există
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'vehicles', 
  'driver_documents', 
  'vehicle_documents', 
  'vehicle_approval', 
  'vehicle_services'
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
  'vehicles', 
  'driver_documents', 
  'vehicle_documents', 
  'vehicle_approval', 
  'vehicle_services'
)
ORDER BY tc.table_name;
-- Ar trebui să returneze 10+ FK-uri

-- 3. Verifică număr coloane (max 20)
SELECT 
  table_name, 
  COUNT(*) as nr_coloane
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
  'vehicles', 
  'driver_documents', 
  'vehicle_documents', 
  'vehicle_approval', 
  'vehicle_services'
)
GROUP BY table_name
ORDER BY table_name;
-- Toate ar trebui < 20 coloane

-- 4. Verifică actualizare booking_legs
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'booking_legs'
AND column_name IN (
  'assigned_driver_id',
  'assigned_vehicle_id',
  'assigned_at',
  'started_at',
  'completed_at'
)
ORDER BY column_name;
-- Ar trebui să returneze 5 rows

-- 5. Verifică RLS activat
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'vehicles', 
  'driver_documents', 
  'vehicle_documents', 
  'vehicle_approval', 
  'vehicle_services'
)
AND rowsecurity = false;
-- Ar trebui să returneze 0 rows (toate au RLS)
```

---

## 🎯 NEXT STEPS

După ce creezi aceste 5 tabele + actualizezi `booking_legs`:

1. ✅ Creează primul vehicul pentru un driver test
2. ✅ Încarcă un document test (insurance)
3. ✅ Aprobă vehiculul ca admin
4. ✅ Asignează servicii vehiculului (ex: "executive")
5. ✅ Testează assignment vehicul la booking leg
6. ➡️ Treci la PAS 3 (Stats + Earnings)

---

## 📋 PRINCIPII RESPECTATE

- ✅ **Modular:** Fiecare tabel = scop clar (7-17 coloane)
- ✅ **Scalabil:** Adaugi vehicul/document nou = INSERT simplu
- ✅ **Zero duplicări:** `insurance_expiry` DOAR în `vehicle_documents`
- ✅ **Flexibil:** Un vehicul poate avea multiple servicii
- ✅ **Istoric:** `vehicle_approval` păstrează tot istoricul
- ✅ **Multi-tenant:** Izolare prin `organization_id` (pe vehicles)
