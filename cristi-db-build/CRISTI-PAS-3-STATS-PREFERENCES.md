# PAS 3 — STATS + PREFERENCES

**Status:** ❌ Lipsesc toate tabelele din acest pas  
**Prioritate:** 🟡 MEDIE — Importante pentru monitoring și UX  
**Dependențe:** ✅ PAS 1 trebuie completat PRIMUL (organizations, drivers)

---

## 🎯 OBIECTIV PAS 3

Creează infrastructura pentru **statistici performanță**, **preferințe app** și **istoric evenimente** driver.

**Ce construim:**
1. `driver_performance_stats` — statistici performanță driver
2. `driver_app_preferences` — setări app driver
3. `driver_notification_preferences` — setări notificări driver
4. `driver_lifecycle_events` — istoric evenimente driver

**NU construim:**
- ❌ `driver_earnings` — se calculează DINAMIC din `booking_legs.driver_payout`
- ❌ `driver_ratings` — se folosește `drivers.rating_average` + `drivers.rating_count` (PAS 1)

---

## 📊 STRUCTURA RELAȚII

```
organizations (PAS 1)
    ↓
drivers (PAS 1)
    ↓
    ├─→ driver_performance_stats (organization_id pentru queries rapide)
    ├─→ driver_app_preferences (NU organization_id - preferințe personale)
    ├─→ driver_notification_preferences (NU organization_id - preferințe personale)
    └─→ driver_lifecycle_events (NU organization_id - se obține prin driver_id)

booking_legs (PAS 2)
    └─→ Earnings calculate DINAMIC (driver_payout, completed_at)
```

---

## 1️⃣ TABEL: `driver_performance_stats`

**Scop:** Statistici performanță driver (pentru admin monitoring și driver self-tracking)

**Coloane (13):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| **Identificare** |
| `id` | uuid | Da | gen_random_uuid() | ID stats |
| `driver_id` | uuid | Da | - | → drivers(id) UNIQUE |
| `organization_id` | uuid | Da | - | → organizations(id) (pentru queries rapide admin) |
| **Cancellations** |
| `total_cancellations` | integer | Da | 0 | Total anulări all-time |
| `cancellations_this_month` | integer | Da | 0 | Anulări luna curentă |
| `cancellation_rate` | numeric | Da | 0 | Rată anulări (%) |
| `last_cancellation_at` | timestamptz | Nu | - | Ultima anulare |
| **Late Arrivals** |
| `total_late_arrivals` | integer | Da | 0 | Total întârzieri |
| `late_arrivals_this_month` | integer | Da | 0 | Întârzieri luna curentă |
| **Completed** |
| `total_completed` | integer | Da | 0 | Total jobs completate |
| `completion_rate` | numeric | Da | 100 | Rată completare (%) |
| **Warning** |
| `warning_level` | text | Da | 'none' | 'none' / 'warning' / 'critical' |
| **Audit** |
| `updated_at` | timestamptz | Da | now() | Ultima actualizare |
| `reset_at` | timestamptz | Nu | - | Când s-a resetat (pentru monthly stats) |

**Relații:**
- `driver_id` → `drivers(id)` (FK, UNIQUE, ON DELETE CASCADE)
- `organization_id` → `organizations(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `driver_id`
- INDEX: `organization_id`, `warning_level`, `completion_rate`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate stats
- Admin vede doar stats din organizația sa
- Operator vede doar stats din organizația sa (read-only)
- Driver vede doar stats-urile lui

**IMPORTANT:**
- ✅ Are `organization_id` pentru queries rapide admin ("toți driverii cu warning_level='critical' din org X")
- Se actualizează automat prin triggers când booking leg e completat/anulat
- `cancellations_this_month` și `late_arrivals_this_month` se resetează lunar (cron job)

**Warning Levels (din Driver App):**
- `none` — completion_rate > 90%, cancellation_rate < 10%
- `warning` — cancellation_rate >= 10% și < 15%
- `critical` — cancellation_rate >= 15%

---

## 2️⃣ TABEL: `driver_app_preferences`

**Scop:** Setări app driver (sound, vibration)

**Coloane (6):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID preferences |
| `driver_id` | uuid | Da | - | → drivers(id) UNIQUE |
| **Audio & Haptics** |
| `sound_enabled` | boolean | Da | true | Sunete activate |
| `vibration_enabled` | boolean | Da | true | Vibrații activate |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |

**Relații:**
- `driver_id` → `drivers(id)` (FK, UNIQUE, ON DELETE CASCADE)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `driver_id`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate preferințele
- Admin vede doar preferințele din organizația sa (prin drivers)
- Driver vede doar preferințele lui
- Driver poate UPDATE doar preferințele lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct — se obține prin `driver_id → drivers.organization_id`
- Se creează automat la prima deschidere app (cu defaults: sound=true, vibration=true)
- Foarte simplu — doar 2 setări (din cod Driver App)

---

## 3️⃣ TABEL: `driver_notification_preferences`

**Scop:** Setări notificări driver (ce notificări primește și cum)

**Coloane (13):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID preferences |
| `driver_id` | uuid | Da | - | → drivers(id) UNIQUE |
| **Notification Types** |
| `job_alerts` | boolean | Da | true | Alerte job-uri noi |
| `payment_updates` | boolean | Da | true | Update-uri plăți |
| `document_reminders` | boolean | Da | true | Reminder-e documente expirând |
| `app_updates` | boolean | Da | true | Update-uri app |
| `marketing` | boolean | Da | true | Notificări marketing |
| **Delivery Methods** |
| `push_enabled` | boolean | Da | true | Push notifications |
| `email_enabled` | boolean | Da | true | Email notifications |
| `sms_enabled` | boolean | Da | true | SMS notifications |
| **Audit** |
| `created_at` | timestamptz | Da | now() | Când a fost creat |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |

**Relații:**
- `driver_id` → `drivers(id)` (FK, UNIQUE, ON DELETE CASCADE)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `driver_id`
- INDEX: `job_alerts`, `push_enabled`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate preferințele
- Admin vede doar preferințele din organizația sa (prin drivers)
- Driver vede doar preferințele lui
- Driver poate UPDATE doar preferințele lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct — se obține prin `driver_id → drivers.organization_id`
- Se creează automat la prima deschidere app (cu defaults: toate true)
- Folosit de notification system pentru a verifica dacă driver vrea notificări

**Notification Types (din Driver App):**
- `job_alerts` — Notificări când apare job nou
- `payment_updates` — Notificări când primește plată
- `document_reminders` — Notificări când documente expiră în 30 zile
- `app_updates` — Notificări când e update app disponibil
- `marketing` — Notificări promoționale

---

## 4️⃣ TABEL: `driver_lifecycle_events`

**Scop:** Istoric evenimente driver (approved, suspended, reactivated, etc.)

**Coloane (8):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID event |
| `driver_id` | uuid | Da | - | → drivers(id) |
| `event_type` | text | Da | - | 'approved' / 'suspended' / 'reactivated' / 'deactivated' / 'documents_approved' / 'documents_rejected' |
| `event_reason` | text | Nu | - | Motivul evenimentului |
| `performed_by` | uuid | Nu | - | → organization_members(id) (cine a făcut acțiunea) |
| `metadata` | jsonb | Nu | - | Date suplimentare (ex: ce documente au fost aprobate) |
| `created_at` | timestamptz | Da | now() | Când s-a întâmplat |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `driver_id` → `drivers(id)` (FK, ON DELETE CASCADE)
- `performed_by` → `organization_members(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `driver_id`, `event_type`, `created_at`

**RLS:**
- ROOT vede toate event-urile
- Admin vede doar event-urile din organizația sa (prin drivers)
- Operator vede doar event-urile din organizația sa (read-only)
- Driver vede doar event-urile lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct — se obține prin `driver_id → drivers.organization_id`
- Se creează automat prin triggers când `drivers.status` se schimbă
- Audit trail complet pentru compliance

**Event Types:**
- `approved` — Driver aprobat de admin
- `suspended` — Driver suspendat (temporar)
- `reactivated` — Driver reactivat după suspendare
- `deactivated` — Driver dezactivat (permanent)
- `documents_approved` — Documente aprobate
- `documents_rejected` — Documente respinse

**Exemplu metadata (jsonb):**
```json
{
  "documents": ["driving_licence", "pco_licence"],
  "previous_status": "pending",
  "new_status": "active"
}
```

---

## 💰 EARNINGS — Calculat DINAMIC (NU tabel separat)

**De ce NU creăm `driver_earnings`:**

Driver App calculează earnings DINAMIC din `booking_legs`:
```sql
SELECT 
  SUM(driver_payout) as total_earnings,
  COUNT(*) as trip_count,
  SUM(distance_miles) as total_distance
FROM booking_legs
WHERE assigned_driver_id = 'uuid-driver'
  AND status = 'completed'
  AND completed_at >= '2024-01-01'  -- perioada dorită
  AND completed_at <= '2024-01-31'
```

**Avantaje:**
- ✅ Zero duplicare (driver_payout deja în booking_legs)
- ✅ Întotdeauna actualizat (nu trebuie triggers)
- ✅ Flexibil (poți calcula pentru orice perioadă)
- ✅ Mai puține tabele

**Admin App poate face același lucru:**
```sql
SELECT 
  d.id,
  d.first_name,
  d.last_name,
  COUNT(bl.id) as total_trips,
  SUM(bl.driver_payout) as total_earnings
FROM drivers d
LEFT JOIN booking_legs bl ON bl.assigned_driver_id = d.id 
  AND bl.status = 'completed'
  AND bl.completed_at >= '2024-01-01'
WHERE d.organization_id = 'uuid-org'
GROUP BY d.id
```

---

## ⭐ RATINGS — Folosim `drivers.rating_average` + `drivers.rating_count` (PAS 1)

**De ce NU creăm `driver_ratings`:**

Driver App folosește coloanele din `drivers` (PAS 1):
- `drivers.rating_average` — media rating-urilor (ex: 4.5)
- `drivers.rating_count` — număr total rating-uri (ex: 127)

**Dacă vrei istoric rating-uri individual:**
- Poți crea `driver_ratings` în viitor (PAS 4 sau 5)
- Dar pentru MVP, `rating_average` + `rating_count` e suficient

---

## ✅ VERIFICĂRI DUPĂ CREARE

```sql
-- 1. Verifică că toate tabelele există
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'driver_performance_stats', 
  'driver_app_preferences', 
  'driver_notification_preferences', 
  'driver_lifecycle_events'
)
ORDER BY table_name;
-- Ar trebui să returneze 4 rows

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
  'driver_performance_stats', 
  'driver_app_preferences', 
  'driver_notification_preferences', 
  'driver_lifecycle_events'
)
ORDER BY tc.table_name;
-- Ar trebui să returneze 5 FK-uri

-- 3. Verifică UNIQUE constraints pe driver_id
SELECT 
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_name IN (
  'driver_performance_stats', 
  'driver_app_preferences', 
  'driver_notification_preferences'
)
AND kcu.column_name = 'driver_id'
ORDER BY tc.table_name;
-- Ar trebui să returneze 3 rows

-- 4. Verifică RLS activat
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'driver_performance_stats', 
  'driver_app_preferences', 
  'driver_notification_preferences', 
  'driver_lifecycle_events'
)
AND rowsecurity = false;
-- Ar trebui să returneze 0 rows (toate au RLS)

-- 5. Test earnings calculation (verifică că booking_legs are driver_payout)
SELECT 
  assigned_driver_id,
  COUNT(*) as trips,
  SUM(driver_payout) as total_earnings
FROM booking_legs
WHERE status = 'completed'
  AND assigned_driver_id IS NOT NULL
GROUP BY assigned_driver_id
LIMIT 5;
-- Ar trebui să returneze earnings calculate din booking_legs
```

---

## 🎯 NEXT STEPS

După ce creezi aceste 4 tabele:

1. ✅ Creează stats pentru un driver test
2. ✅ Creează preferences pentru un driver test (defaults)
3. ✅ Testează calculation earnings din booking_legs
4. ✅ Creează un lifecycle event (ex: driver approved)
5. ✅ Verifică RLS policies
6. ➡️ Treci la PAS 4 (Comunicare: conversations, notifications)

---

## 📋 PRINCIPII RESPECTATE

- ✅ **Modular:** Fiecare tabel = scop clar (6-13 coloane)
- ✅ **Scalabil:** Adaugi driver nou = preferences se creează automat
- ✅ **Zero duplicări:** Earnings calculate din booking_legs (nu tabel separat)
- ✅ **Standard enterprise:** `organization_id` doar pe stats (aggregate data)
- ✅ **Bazat pe cod real:** Structura EXACTĂ din Driver App și Admin App
- ✅ **Relații corecte:** FK-uri clare, UNIQUE constraints pe driver_id
