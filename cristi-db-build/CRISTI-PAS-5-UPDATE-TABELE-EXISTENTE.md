# PAS 5 — UPDATE TABELE EXISTENTE

**Status:** ❌ UPDATE-uri necesare pentru izolare completă între organizații  
**Prioritate:** 🔴 CRITICĂ — Fără acestea, NU există izolare între Vantage Lane și London Cabs  
**Dependențe:** ✅ PAS 1-4 trebuie completate PRIMUL

---

## 🎯 OBIECTIV PAS 5

Actualizează tabelele existente pentru **izolare completă între organizații** și **completare structură**.

**Ce actualizăm:**
1. `booking_legs` — ADD `organization_id` (CRITIC)
2. `booking_payments` — ADD `organization_id` (CRITIC)
3. `refunds` — ADD `organization_id` (CRITIC)
4. `organizations` — ADD coloane lipsă
5. `organization_members` — ADD coloane lipsă
6. `customers` — ADD `customer_type`

**De ce e CRITIC:**
- ❌ Fără `organization_id` pe `booking_legs`, Admin Vantage Lane vede legs London Cabs
- ❌ Fără `organization_id` pe `booking_payments`, Admin Vantage Lane vede payments London Cabs
- ❌ Fără `organization_id` pe `refunds`, Admin Vantage Lane vede refunds London Cabs
- ❌ **ZERO izolare între organizații!**

---

## 📊 STRUCTURA ACTUALIZATĂ

```
organizations (UPDATE — ADD coloane)
    ↓
    ├─→ organization_members (UPDATE — ADD coloane)
    ├─→ drivers (PAS 1 — CREATE)
    ├─→ customers (UPDATE — ADD customer_type)
    │
    └─→ bookings (există deja cu organization_id ✅)
            ↓
            ├─→ booking_legs (UPDATE — ADD organization_id) ← CRITIC
            ├─→ booking_payments (UPDATE — ADD organization_id) ← CRITIC
            └─→ refunds (UPDATE — ADD organization_id) ← CRITIC
```

---

## 1️⃣ UPDATE: `booking_legs` — ADD `organization_id`

**Problema CRITICĂ:**
- `booking_legs` NU are `organization_id`
- Admin Vantage Lane vede toate legs din toate organizațiile
- Admin London Cabs vede toate legs din toate organizațiile

**Soluție:**

```sql
-- 1. Adaugă coloana organization_id
ALTER TABLE booking_legs 
ADD COLUMN organization_id uuid;

-- 2. Adaugă FK constraint
ALTER TABLE booking_legs
ADD CONSTRAINT booking_legs_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- 3. Populează organization_id din bookings
UPDATE booking_legs bl
SET organization_id = b.organization_id
FROM bookings b
WHERE bl.booking_id = b.id;

-- 4. Setează NOT NULL (după ce toate rows au valoare)
ALTER TABLE booking_legs 
ALTER COLUMN organization_id SET NOT NULL;

-- 5. Creează index pentru performanță
CREATE INDEX idx_booking_legs_organization_id ON booking_legs(organization_id);

-- 6. Verificare
SELECT COUNT(*) as total_legs, organization_id
FROM booking_legs
GROUP BY organization_id;
-- Ar trebui să returneze legs per organizație
```

**RLS Policy (adaugă după UPDATE):**
```sql
-- Admin vede doar legs din organizația sa
CREATE POLICY "admin_sees_own_org_legs"
ON booking_legs FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE auth_user_id = auth.uid()
  )
);
```

---

## 2️⃣ UPDATE: `booking_payments` — ADD `organization_id`

**Problema CRITICĂ:**
- `booking_payments` NU are `organization_id`
- Admin Vantage Lane vede toate payments din toate organizațiile

**Soluție:**

```sql
-- 1. Adaugă coloana organization_id
ALTER TABLE booking_payments 
ADD COLUMN organization_id uuid;

-- 2. Adaugă FK constraint
ALTER TABLE booking_payments
ADD CONSTRAINT booking_payments_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- 3. Populează organization_id din bookings
UPDATE booking_payments bp
SET organization_id = b.organization_id
FROM bookings b
WHERE bp.booking_id = b.id;

-- 4. Setează NOT NULL
ALTER TABLE booking_payments 
ALTER COLUMN organization_id SET NOT NULL;

-- 5. Creează index
CREATE INDEX idx_booking_payments_organization_id ON booking_payments(organization_id);

-- 6. Verificare
SELECT COUNT(*) as total_payments, organization_id
FROM booking_payments
GROUP BY organization_id;
```

**RLS Policy:**
```sql
CREATE POLICY "admin_sees_own_org_payments"
ON booking_payments FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE auth_user_id = auth.uid()
  )
);
```

---

## 3️⃣ UPDATE: `refunds` — ADD `organization_id`

**Problema CRITICĂ:**
- `refunds` NU are `organization_id`
- Admin Vantage Lane vede toate refunds din toate organizațiile

**Soluție:**

```sql
-- 1. Adaugă coloana organization_id
ALTER TABLE refunds 
ADD COLUMN organization_id uuid;

-- 2. Adaugă FK constraint
ALTER TABLE refunds
ADD CONSTRAINT refunds_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- 3. Populează organization_id din bookings
UPDATE refunds r
SET organization_id = b.organization_id
FROM bookings b
WHERE r.booking_id = b.id;

-- 4. Setează NOT NULL
ALTER TABLE refunds 
ALTER COLUMN organization_id SET NOT NULL;

-- 5. Creează index
CREATE INDEX idx_refunds_organization_id ON refunds(organization_id);

-- 6. Verificare
SELECT COUNT(*) as total_refunds, organization_id
FROM refunds
GROUP BY organization_id;
```

**RLS Policy:**
```sql
CREATE POLICY "admin_sees_own_org_refunds"
ON refunds FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE auth_user_id = auth.uid()
  )
);
```

---

## 4️⃣ UPDATE: `organizations` — ADD coloane lipsă

**Problema:**
- `organizations` are doar 7 coloane
- Lipsesc: `code`, `contact_email`, `contact_phone`, `city`, `country`, `rating_average`, `review_count`, `updated_at`, `deleted_at`

**Soluție:**

```sql
-- Adaugă coloane lipsă
ALTER TABLE organizations
ADD COLUMN code text,
ADD COLUMN contact_email text,
ADD COLUMN contact_phone text,
ADD COLUMN city text,
ADD COLUMN country text DEFAULT 'GB',
ADD COLUMN rating_average numeric DEFAULT 0,
ADD COLUMN review_count integer DEFAULT 0,
ADD COLUMN updated_at timestamptz DEFAULT now(),
ADD COLUMN deleted_at timestamptz;

-- Adaugă UNIQUE constraint pe code
ALTER TABLE organizations
ADD CONSTRAINT organizations_code_unique UNIQUE (code);

-- Creează index
CREATE INDEX idx_organizations_code ON organizations(code);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

-- Populează code pentru organizațiile existente
UPDATE organizations SET code = 'VL' WHERE name = 'Vantage Lane';
UPDATE organizations SET code = 'LC' WHERE name = 'London Cabs';

-- Verificare
SELECT id, name, code, org_type, is_active FROM organizations;
```

**Trigger pentru updated_at:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at 
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 5️⃣ UPDATE: `organization_members` — ADD coloane lipsă

**Problema:**
- `organization_members` are doar 5 coloane
- Lipsesc: `auth_user_id`, `email`, `first_name`, `last_name`, `name`, `phone`, `permissions`, `is_active`, `updated_at`, `deleted_at`

**Soluție:**

```sql
-- Adaugă coloane lipsă
ALTER TABLE organization_members
ADD COLUMN auth_user_id uuid,
ADD COLUMN email text,
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN name text,
ADD COLUMN phone text,
ADD COLUMN permissions jsonb DEFAULT '{}',
ADD COLUMN is_active boolean DEFAULT true,
ADD COLUMN updated_at timestamptz DEFAULT now(),
ADD COLUMN deleted_at timestamptz;

-- Migrează user_id la auth_user_id
UPDATE organization_members SET auth_user_id = user_id;

-- Setează auth_user_id NOT NULL
ALTER TABLE organization_members 
ALTER COLUMN auth_user_id SET NOT NULL;

-- Adaugă UNIQUE constraint pe auth_user_id
ALTER TABLE organization_members
ADD CONSTRAINT organization_members_auth_user_id_unique UNIQUE (auth_user_id);

-- Adaugă FK constraint
ALTER TABLE organization_members
ADD CONSTRAINT organization_members_auth_user_id_fkey 
FOREIGN KEY (auth_user_id) REFERENCES auth.users(id);

-- Creează index
CREATE INDEX idx_organization_members_auth_user_id ON organization_members(auth_user_id);
CREATE INDEX idx_organization_members_role ON organization_members(role);
CREATE INDEX idx_organization_members_is_active ON organization_members(is_active);

-- Verificare
SELECT id, auth_user_id, organization_id, role, is_active FROM organization_members;
```

**Trigger pentru updated_at:**
```sql
CREATE TRIGGER update_organization_members_updated_at 
BEFORE UPDATE ON organization_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Exemplu permissions (jsonb) pentru operator:**
```json
{
  "can_view_pricing": false,
  "can_approve_drivers": false,
  "can_assign_bookings": true,
  "can_view_reports": true
}
```

---

## 6️⃣ UPDATE: `customers` — ADD `customer_type`

**Problema:**
- `customers` NU are `customer_type`
- Nu poate distinge între individual și corporate

**Soluție:**

```sql
-- Adaugă coloana customer_type
ALTER TABLE customers
ADD COLUMN customer_type text DEFAULT 'individual';

-- Adaugă CHECK constraint
ALTER TABLE customers
ADD CONSTRAINT customers_customer_type_check 
CHECK (customer_type IN ('individual', 'corporate'));

-- Creează index
CREATE INDEX idx_customers_customer_type ON customers(customer_type);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);

-- Verificare
SELECT COUNT(*) as total, customer_type 
FROM customers 
GROUP BY customer_type;
```

---

## ✅ VERIFICĂRI DUPĂ UPDATE

```sql
-- 1. Verifică că toate coloanele au fost adăugate
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('booking_legs', 'booking_payments', 'refunds', 'organizations', 'organization_members', 'customers')
AND column_name IN ('organization_id', 'code', 'auth_user_id', 'customer_type')
ORDER BY table_name, column_name;

-- 2. Verifică FK-uri noi
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
AND tc.table_name IN ('booking_legs', 'booking_payments', 'refunds', 'organization_members')
AND kcu.column_name IN ('organization_id', 'auth_user_id')
ORDER BY tc.table_name;

-- 3. Verifică că organization_id e populat corect
SELECT 
  'booking_legs' as tabel,
  COUNT(*) as total_rows,
  COUNT(organization_id) as rows_with_org_id
FROM booking_legs
UNION ALL
SELECT 
  'booking_payments',
  COUNT(*),
  COUNT(organization_id)
FROM booking_payments
UNION ALL
SELECT 
  'refunds',
  COUNT(*),
  COUNT(organization_id)
FROM refunds;
-- Toate ar trebui să aibă organization_id populat

-- 4. Test izolare organizații
-- Admin Vantage Lane NU vede legs London Cabs
SELECT COUNT(*) 
FROM booking_legs
WHERE organization_id = (SELECT id FROM organizations WHERE code = 'LC');
-- Dacă admin e din Vantage Lane, ar trebui să returneze 0 (RLS)

-- 5. Verifică indexes noi
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('booking_legs', 'booking_payments', 'refunds', 'organizations', 'organization_members', 'customers')
AND indexname LIKE '%organization_id%' OR indexname LIKE '%auth_user_id%' OR indexname LIKE '%customer_type%'
ORDER BY tablename;
```

---

## 🎯 NEXT STEPS

După ce faci aceste UPDATE-uri:

1. ✅ Verifică că toate UPDATE-urile au reușit
2. ✅ Testează izolare: Admin Vantage Lane NU vede date London Cabs
3. ✅ Testează queries Admin App — ar trebui să funcționeze normal
4. ✅ Verifică RLS policies — toate tabelele au izolare corectă
5. ➡️ Treci la PAS 1-4 pentru a crea tabelele lipsă (drivers, vehicles, documents, stats, notifications, chat)

---

## 📋 PRINCIPII RESPECTATE

- ✅ **Izolare completă:** Admin Vantage Lane NU vede date London Cabs după UPDATE-uri
- ✅ **Backward compatible:** Toate queries existente continuă să funcționeze
- ✅ **Safe migration:** UPDATE-uri cu verificări la fiecare pas
- ✅ **Standard enterprise:** `organization_id` pe toate tabelele relevante
- ✅ **Performanță:** Indexes pe toate coloanele noi pentru queries rapide

---

## ⚠️ IMPORTANT — ORDINEA EXECUȚIEI

**Execută UPDATE-urile în această ordine:**

1. ✅ UPDATE `organizations` (adaugă coloane)
2. ✅ UPDATE `organization_members` (adaugă coloane)
3. ✅ UPDATE `customers` (adaugă customer_type)
4. ✅ UPDATE `booking_legs` (adaugă organization_id) ← CRITIC
5. ✅ UPDATE `booking_payments` (adaugă organization_id) ← CRITIC
6. ✅ UPDATE `refunds` (adaugă organization_id) ← CRITIC

**NU schimba ordinea — FK-urile depind de ea!**
