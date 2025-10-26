-- ============================================
-- PERMISSIONS SYSTEM MIGRATIONS
-- Admin can control what each role/user sees
-- ============================================

-- STEP 1: Create page_definitions table
-- All available pages in the system
CREATE TABLE IF NOT EXISTS page_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  href TEXT NOT NULL,
  parent_key TEXT,
  display_order INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create role_permissions table
-- Default permissions for each role
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'driver', 'customer', 'auditor')),
  page_key TEXT NOT NULL REFERENCES page_definitions(page_key) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, page_key)
);

-- STEP 3: Create user_permissions table
-- User-specific permission overrides
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  page_key TEXT NOT NULL REFERENCES page_definitions(page_key) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, page_key)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_page_key ON role_permissions(page_key);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_page_key ON user_permissions(page_key);
CREATE INDEX IF NOT EXISTS idx_page_definitions_parent_key ON page_definitions(parent_key);

-- ============================================
-- SEED DATA: Define all available pages
-- ============================================

INSERT INTO page_definitions (page_key, label, icon, href, parent_key, display_order, description) VALUES
-- Admin pages
('dashboard', 'Dashboard', 'dashboard', '/dashboard', NULL, 1, 'Main admin dashboard'),
('bookings', 'Bookings', 'calendar', '/bookings', NULL, 2, 'View and manage bookings'),
('bookings-active', 'Active Bookings', 'calendar', '/bookings/active', 'bookings', 1, 'Currently active bookings'),
('bookings-past', 'Past Bookings', 'calendar', '/bookings/past', 'bookings', 2, 'Historical bookings'),
('bookings-new', 'New Booking', 'calendar', '/bookings/new', 'bookings', 3, 'Create new booking'),

('users', 'Users', 'users', '/users', NULL, 3, 'Manage all users'),
('users-all', 'All Users', 'users', '/users/all', 'users', 1, 'View all users'),
('users-drivers', 'Drivers', 'users', '/users/drivers', 'users', 2, 'Manage drivers'),
('users-drivers-pending', 'Pending Drivers', 'users', '/users/drivers/pending', 'users', 3, 'Drivers awaiting verification'),
('users-customers', 'Customers', 'users', '/users/customers', 'users', 4, 'Manage customers'),
('users-operators', 'Operators', 'users', '/users/operators', 'users', 5, 'Manage operators'),
('users-admins', 'Admins', 'users', '/users/admins', 'users', 6, 'Manage admins'),

('documents', 'Documents', 'documents', '/documents', NULL, 4, 'Document management'),
('support', 'Support', 'support', '/support-tickets', NULL, 5, 'Support tickets'),
('prices', 'Prices', 'prices', '/prices', NULL, 6, 'Price management'),
('payments', 'Payments', 'creditCard', '/payments', NULL, 7, 'Payment processing'),
('refunds', 'Refunds', 'refunds', '/refunds', NULL, 8, 'Refund management'),
('disputes', 'Disputes', 'disputes', '/disputes', NULL, 9, 'Dispute resolution'),
('payouts', 'Payouts', 'banknote', '/payouts', NULL, 10, 'Driver payouts'),
('monitoring', 'Monitoring', 'monitoring', '/monitoring', NULL, 11, 'System monitoring'),
('project-health', 'Project Health', 'projectHealth', '/project-health', NULL, 12, 'Project health metrics'),
('audit-history', 'Audit History', 'auditHistory', '/audit-history', NULL, 13, 'Audit logs'),

('settings', 'Settings', 'settings', '/settings', NULL, 14, 'System settings'),
('settings-vehicle-categories', 'Vehicle Categories', 'settings', '/settings/vehicle-categories', 'settings', 1, 'Manage vehicle categories'),
('settings-commissions', 'Commissions', 'settings', '/settings/commissions', 'settings', 2, 'Configure commissions'),
('settings-permissions', 'Permissions', 'settings', '/settings/permissions', 'settings', 3, 'Manage user permissions'),

-- Operator-specific pages
('operator-dashboard', 'Dashboard', 'dashboard', '/operator/dashboard', NULL, 1, 'Operator dashboard'),
('operator-drivers', 'My Drivers', 'users', '/operator/drivers', NULL, 2, 'Operator drivers list')

ON CONFLICT (page_key) DO NOTHING;

-- ============================================
-- SEED DATA: Default admin permissions (all enabled)
-- ============================================

INSERT INTO role_permissions (role, page_key, enabled)
SELECT 'admin', page_key, TRUE
FROM page_definitions
WHERE page_key NOT LIKE 'operator-%'
ON CONFLICT (role, page_key) DO NOTHING;

-- ============================================
-- SEED DATA: Default operator permissions
-- ============================================

INSERT INTO role_permissions (role, page_key, enabled) VALUES
('operator', 'operator-dashboard', TRUE),
('operator', 'operator-drivers', TRUE),
('operator', 'bookings', TRUE),
('operator', 'bookings-active', TRUE),
('operator', 'bookings-past', TRUE),
('operator', 'documents', TRUE),
('operator', 'support', TRUE)
ON CONFLICT (role, page_key) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE page_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Page definitions: Everyone can read
CREATE POLICY "Page definitions are readable by authenticated users"
ON page_definitions FOR SELECT
TO authenticated
USING (TRUE);

-- Role permissions: Everyone can read their own role
CREATE POLICY "Users can read permissions for their role"
ON role_permissions FOR SELECT
TO authenticated
USING (TRUE);

-- User permissions: Users can read their own permissions
CREATE POLICY "Users can read their own permissions"
ON user_permissions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can modify permissions
CREATE POLICY "Only admins can modify page definitions"
ON page_definitions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Only admins can modify role permissions"
ON role_permissions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Only admins can modify user permissions"
ON user_permissions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
