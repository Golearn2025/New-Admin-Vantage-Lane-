# 🗄️ DATABASE MIGRATIONS - PHASE 2

## ⚠️ IMPORTANT: Run these migrations in Supabase

All the features created require these database changes.

---

## 📋 **MIGRATION 1: Add vehicle_categories to drivers**

```sql
-- Add vehicle categories column to drivers table
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS vehicle_categories TEXT[] DEFAULT '{}';

-- Add verification status if not exists
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'
  CHECK (verification_status IN ('pending', 'docs_uploaded', 'in_review', 'verified', 'rejected'));

-- Add verified timestamp
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Add profile photo URL
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add operator assignment
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create index for operator queries
CREATE INDEX IF NOT EXISTS idx_drivers_operator_id ON drivers(operator_id);
CREATE INDEX IF NOT EXISTS idx_drivers_verification_status ON drivers(verification_status);
```

---

## 📋 **MIGRATION 2: Create notifications table**

```sql
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'driver_registered',
    'docs_uploaded',
    'driver_verified',
    'driver_activated',
    'driver_rejected',
    'driver_assigned',
    'booking_created',
    'booking_updated',
    'payment_received'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE read = FALSE;
```

---

## 📋 **MIGRATION 3: Create vehicle_categories table**

```sql
-- Create vehicle categories configuration table
CREATE TABLE IF NOT EXISTS vehicle_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK (code IN ('EXEC', 'LUX', 'VAN', 'SUV')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_multiplier DECIMAL(4,2) DEFAULT 1.0,
  icon TEXT DEFAULT '🚗',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO vehicle_categories (code, name, description, price_multiplier, icon, display_order)
VALUES
  ('EXEC', 'Executive', 'Standard executive vehicles (Mercedes S-Class, BMW 7 Series)', 1.0, '🎩', 1),
  ('LUX', 'Luxury', 'Premium luxury vehicles (Bentley, Rolls-Royce)', 2.5, '💎', 2),
  ('SUV', 'SUV', 'SUV vehicles (Range Rover, Audi Q7)', 1.5, '🚙', 3),
  ('VAN', 'Van', 'Large group transport (Mercedes Sprinter, Transit)', 1.8, '🚐', 4)
ON CONFLICT (code) DO NOTHING;
```

---

## 📋 **MIGRATION 4: Create commission settings table**

```sql
-- Create commission settings table
CREATE TABLE IF NOT EXISTS commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value DECIMAL(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default commission settings
INSERT INTO commission_settings (setting_key, setting_value, description)
VALUES
  ('platform_commission_percent', 15.0, 'Platform commission percentage'),
  ('default_operator_commission_percent', 10.0, 'Default operator commission percentage')
ON CONFLICT (setting_key) DO NOTHING;

-- Create operator-specific commissions table
CREATE TABLE IF NOT EXISTS operator_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  commission_percent DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(operator_id)
);

CREATE INDEX IF NOT EXISTS idx_operator_commissions_operator_id ON operator_commissions(operator_id);
```

---

## 📋 **MIGRATION 5: Add driver documents tracking**

```sql
-- Create driver documents table for verification
CREATE TABLE IF NOT EXISTS driver_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'license', 'insurance', 'registration', 'mot', 'pco', 'photo'
  )),
  document_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES admin_users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_documents_driver_id ON driver_documents(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_documents_verified ON driver_documents(verified) WHERE verified = FALSE;
```

---

## 🔄 **ROW LEVEL SECURITY (RLS) POLICIES**

### Drivers Table - Operator Isolation
```sql
-- Operators can only see their own drivers
CREATE POLICY "Operators can view their own drivers"
ON drivers FOR SELECT
TO authenticated
USING (
  operator_id IN (
    SELECT id FROM organizations 
    WHERE id = auth.uid() AND org_type = 'operator'
  )
);

-- Admins can see all drivers
CREATE POLICY "Admins can view all drivers"
ON drivers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  )
);
```

### Notifications Table
```sql
-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());
```

---

## 📊 **VERIFICATION WORKFLOW**

```
1. Driver registers → verification_status = 'pending'
2. Driver uploads docs → verification_status = 'docs_uploaded'
3. Admin reviews → verification_status = 'in_review'
4. Admin verifies:
   - Selects vehicle_categories: ['EXEC', 'LUX']
   - Assigns operator_id (optional)
   - verification_status = 'verified'
   - is_active = true
   - verified_at = NOW()
5. Notifications sent:
   - To driver: "Account Verified!"
   - To operator: "New Driver Assigned"
```

---

## 🎯 **TESTING QUERIES**

### Get all pending drivers
```sql
SELECT * FROM drivers
WHERE verification_status = 'pending'
ORDER BY created_at DESC;
```

### Get operator's drivers
```sql
SELECT * FROM drivers
WHERE operator_id = 'YOUR_OPERATOR_ID'
ORDER BY created_at DESC;
```

### Get drivers by category
```sql
SELECT * FROM drivers
WHERE 'EXEC' = ANY(vehicle_categories)
AND is_active = TRUE;
```

### Get unread notifications
```sql
SELECT * FROM notifications
WHERE user_id = 'USER_ID'
AND read = FALSE
ORDER BY created_at DESC;
```

---

## ✅ **MIGRATION CHECKLIST**

Run these in order:
- [ ] Migration 1: vehicle_categories column
- [ ] Migration 2: notifications table
- [ ] Migration 3: vehicle_categories config
- [ ] Migration 4: commission settings
- [ ] Migration 5: driver_documents table
- [ ] RLS Policies (operator isolation)
- [ ] Test queries to verify

---

## 🚀 **NEXT STEPS**

After migrations:
1. Test driver verification flow
2. Test operator isolation (operators see only their drivers)
3. Test notifications
4. Test category filtering
5. Configure actual commission percentages

---

**All features depend on these migrations!**
