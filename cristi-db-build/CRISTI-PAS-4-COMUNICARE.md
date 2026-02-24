# PAS 4 — COMUNICARE (Notifications + Chat)

**Status:** ❌ Lipsesc toate tabelele din acest pas  
**Prioritate:** 🟡 MEDIE — Importante pentru comunicare admin-driver și notificări  
**Dependențe:** ✅ PAS 1 trebuie completat PRIMUL (organizations, drivers)

---

## 🎯 OBIECTIV PAS 4

Creează infrastructura pentru **notificări** și **chat live** cu izolare completă între organizații.

**Ce construim:**
1. `notifications` — notificări sistem (admin → drivers, customers)
2. `live_chat_sessions` — sesiuni chat driver ↔ admin/operator
3. `live_chat_messages` — mesaje în sesiuni chat

**Principiu CRITIC:**
- ✅ Admin Vantage Lane vede DOAR notifications/chat Vantage Lane
- ✅ Admin London Cabs vede DOAR notifications/chat London Cabs
- ✅ Izolare completă prin `organization_id` și RLS

---

## 📊 STRUCTURA RELAȚII

```
organizations (PAS 1)
    ↓
    ├─→ notifications (organization_id direct)
    │
    └─→ drivers (PAS 1)
            ↓
            └─→ live_chat_sessions (organization_id prin driver_id)
                    ↓
                    └─→ live_chat_messages (organization_id prin session_id)
```

---

## 1️⃣ TABEL: `notifications`

**Scop:** Notificări sistem (admin → drivers, customers, broadcast)

**Coloane (11):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID notificare |
| `organization_id` | uuid | Da | - | → organizations(id) (pentru izolare) |
| `user_id` | uuid | Da | - | → auth.users(id) (cine primește) |
| `type` | text | Da | - | 'booking_created' / 'driver_approved' / 'document_rejected' / 'payment_received' / 'system' |
| `title` | text | Da | - | Titlu notificare |
| `message` | text | Nu | - | Mesaj notificare |
| `link` | text | Nu | - | Link către resursă (ex: /bookings/123) |
| `read_at` | timestamptz | Nu | - | Când a fost citită |
| `created_at` | timestamptz | Da | now() | Când a fost creată |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `organization_id` → `organizations(id)` (FK)
- `user_id` → `auth.users(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `organization_id`, `user_id`, `read_at`, `created_at`, `type`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate notificările
- Admin vede doar notificările din organizația sa
- Operator vede doar notificările din organizația sa
- Driver vede doar notificările lui
- Customer vede doar notificările lui

**IMPORTANT:**
- ✅ Are `organization_id` DIRECT pentru izolare
- Admin Vantage Lane NU vede notificări London Cabs
- Folosit de Admin App pentru broadcast și history
- Driver App folosește push notifications locale (nu din DB)

**Notification Types:**
- `booking_created` — Booking nou creat
- `booking_updated` — Booking actualizat
- `booking_cancelled` — Booking anulat
- `driver_approved` — Driver aprobat
- `driver_suspended` — Driver suspendat
- `document_uploaded` — Document încărcat
- `document_approved` — Document aprobat
- `document_rejected` — Document respins
- `payment_received` — Plată primită
- `payment_failed` — Plată eșuată
- `system` — Notificare sistem
- `test_realtime` — Test realtime

**Exemplu:**
```json
{
  "organization_id": "uuid-vantage-lane",
  "user_id": "uuid-driver-1",
  "type": "document_approved",
  "title": "Document Approved",
  "message": "Your driving licence has been approved",
  "link": "/documents"
}
```

---

## 2️⃣ TABEL: `live_chat_sessions`

**Scop:** Sesiuni chat driver ↔ admin/operator

**Coloane (8):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID sesiune |
| `driver_id` | uuid | Da | - | → drivers(id) |
| `topic` | text | Da | - | Subiect chat (ex: "Document Issue", "Payment Question") |
| `status` | text | Da | 'active' | 'active' / 'closed' |
| `started_at` | timestamptz | Da | now() | Când a început |
| `closed_at` | timestamptz | Nu | - | Când s-a închis |
| `created_at` | timestamptz | Da | now() | Când a fost creată |
| `updated_at` | timestamptz | Da | now() | Ultima modificare |

**Relații:**
- `driver_id` → `drivers(id)` (FK, ON DELETE CASCADE)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `driver_id`, `status`, `started_at`

**Trigger:**
- `update_updated_at_column()` pe UPDATE

**RLS:**
- ROOT vede toate sesiunile
- Admin vede doar sesiunile din organizația sa (prin `driver_id → drivers.organization_id`)
- Operator vede doar sesiunile din organizația sa
- Driver vede doar sesiunile lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct (se obține prin `driver_id → drivers.organization_id`)
- Admin Vantage Lane vede doar chat cu drivers Vantage Lane
- Admin London Cabs vede doar chat cu drivers London Cabs
- Realtime subscriptions pe INSERT/UPDATE pentru notificări instant

**Exemplu RLS:**
```sql
-- Admin vede doar sesiuni din organizația sa
CREATE POLICY "admin_sees_own_org_sessions"
ON live_chat_sessions FOR SELECT
TO authenticated
USING (
  driver_id IN (
    SELECT id FROM drivers 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE auth_user_id = auth.uid()
    )
  )
);
```

---

## 3️⃣ TABEL: `live_chat_messages`

**Scop:** Mesaje în sesiuni chat

**Coloane (11):**

| Coloană | Tip | Obligatoriu | Default | Scop |
|---------|-----|-------------|---------|------|
| `id` | uuid | Da | gen_random_uuid() | ID mesaj |
| `session_id` | uuid | Da | - | → live_chat_sessions(id) |
| `driver_id` | uuid | Da | - | → drivers(id) (pentru queries rapide) |
| `sender_id` | uuid | Da | - | → auth.users(id) (cine trimite) |
| `sender_type` | text | Da | - | 'driver' / 'operator' / 'admin' |
| `message` | text | Da | - | Conținut mesaj |
| `message_type` | text | Da | 'text' | 'text' / 'image' / 'system' |
| `image_url` | text | Nu | - | URL imagine (dacă message_type='image') |
| `read_at` | timestamptz | Nu | - | Când a fost citit |
| `created_at` | timestamptz | Da | now() | Când a fost trimis |
| `deleted_at` | timestamptz | Nu | - | Soft delete |

**Relații:**
- `session_id` → `live_chat_sessions(id)` (FK, ON DELETE CASCADE)
- `driver_id` → `drivers(id)` (FK)
- `sender_id` → `auth.users(id)` (FK)

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `session_id`, `driver_id`, `created_at`, `read_at`

**RLS:**
- ROOT vede toate mesajele
- Admin vede doar mesajele din organizația sa (prin `driver_id → drivers.organization_id`)
- Operator vede doar mesajele din organizația sa
- Driver vede doar mesajele lui

**IMPORTANT:**
- ❌ NU are `organization_id` direct (se obține prin `driver_id → drivers.organization_id`)
- Admin Vantage Lane vede doar mesaje cu drivers Vantage Lane
- Admin London Cabs vede doar mesaje cu drivers London Cabs
- Realtime subscriptions pe INSERT pentru chat instant

**Sender Types:**
- `driver` — Mesaj trimis de driver
- `operator` — Mesaj trimis de operator
- `admin` — Mesaj trimis de admin

**Message Types:**
- `text` — Mesaj text normal
- `image` — Imagine (cu `image_url`)
- `system` — Mesaj sistem (ex: "Session started", "Session closed")

**Exemplu:**
```json
{
  "session_id": "uuid-session-1",
  "driver_id": "uuid-driver-vantage-lane",
  "sender_id": "uuid-admin-vantage-lane",
  "sender_type": "admin",
  "message": "Your document has been reviewed",
  "message_type": "text"
}
```

**Exemplu RLS:**
```sql
-- Admin vede doar mesaje din organizația sa
CREATE POLICY "admin_sees_own_org_messages"
ON live_chat_messages FOR SELECT
TO authenticated
USING (
  driver_id IN (
    SELECT id FROM drivers 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE auth_user_id = auth.uid()
    )
  )
);
```

---

## 🔔 REALTIME SUBSCRIPTIONS

### **Driver App — Realtime pentru chat:**

```typescript
// Subscribe la mesaje noi în sesiunea driver-ului
supabase
  .channel(`chat:${driverId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'live_chat_messages',
    filter: `driver_id=eq.${driverId}`,
  }, (payload) => {
    // Afișează mesaj nou
  })
  .subscribe();
```

### **Admin App — Realtime pentru chat:**

```typescript
// Subscribe la mesaje noi în toate sesiunile organizației
supabase
  .channel(`chat:org:${organizationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'live_chat_messages',
  }, (payload) => {
    // Verifică dacă driver_id aparține organizației
    // Afișează mesaj nou
  })
  .subscribe();
```

---

## ✅ VERIFICĂRI DUPĂ CREARE

```sql
-- 1. Verifică că toate tabelele există
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'notifications', 
  'live_chat_sessions', 
  'live_chat_messages'
)
ORDER BY table_name;
-- Ar trebui să returneze 3 rows

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
  'notifications', 
  'live_chat_sessions', 
  'live_chat_messages'
)
ORDER BY tc.table_name;
-- Ar trebui să returneze 5 FK-uri

-- 3. Verifică RLS activat
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'notifications', 
  'live_chat_sessions', 
  'live_chat_messages'
)
AND rowsecurity = false;
-- Ar trebui să returneze 0 rows (toate au RLS)

-- 4. Test izolare organizații
-- Admin Vantage Lane NU vede chat London Cabs
SELECT COUNT(*) 
FROM live_chat_messages lcm
JOIN drivers d ON lcm.driver_id = d.id
WHERE d.organization_id = 'uuid-london-cabs'
  AND EXISTS (
    SELECT 1 FROM organization_members 
    WHERE auth_user_id = auth.uid() 
    AND organization_id = 'uuid-vantage-lane'
  );
-- Ar trebui să returneze 0 (izolare corectă)
```

---

## 🎯 NEXT STEPS

După ce creezi aceste 3 tabele:

1. ✅ Creează notificare test pentru un driver Vantage Lane
2. ✅ Creează sesiune chat test între driver și admin Vantage Lane
3. ✅ Trimite mesaj test în sesiune
4. ✅ Verifică că admin London Cabs NU vede chat-ul (RLS)
5. ✅ Testează realtime subscriptions
6. ➡️ Treci la PAS 5 (Workflow: bookings, payments, refunds)

---

## 📋 PRINCIPII RESPECTATE

- ✅ **Izolare completă:** Admin Vantage Lane NU vede chat/notifications London Cabs
- ✅ **Modular:** Fiecare tabel = scop clar (8-11 coloane)
- ✅ **Scalabil:** Adaugi organizație nouă = izolare automată prin RLS
- ✅ **Standard enterprise:** `organization_id` doar pe `notifications` (direct), chat prin relații
- ✅ **Realtime-ready:** Subscriptions pentru chat instant
- ✅ **Bazat pe cod real:** Structura EXACTĂ din Driver App și Admin App
