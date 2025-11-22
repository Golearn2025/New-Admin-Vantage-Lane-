-- ============================================
-- Migration 008: Operator Fleet Portal RLS
-- ============================================
-- Purpose: Enable Row-Level Security for operator scoping
-- Author: Cascade AI
-- Date: 2025-10-26
-- ============================================

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's operator ID
CREATE OR REPLACE FUNCTION current_operator_id()
RETURNS UUID AS $$
  SELECT default_operator_id 
  FROM admin_users 
  WHERE auth_user_id = auth.uid()
  AND is_active = true
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')  -- ✅ Accept both admin and super_admin
    AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is operator
CREATE OR REPLACE FUNCTION is_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'operator'
    AND is_active = true
    AND default_operator_id IS NOT NULL
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- BOOKINGS RLS POLICIES
-- ============================================

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "operators_see_own_bookings" ON bookings;

-- Operators see only bookings from their organization
CREATE POLICY "operators_see_own_bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  is_super_admin() 
  OR organization_id = current_operator_id()
  OR (auth.jwt()->>'role' = 'admin' AND current_operator_id() IS NULL)
);

-- Operators can update their own bookings
CREATE POLICY "operators_update_own_bookings"
ON bookings FOR UPDATE
TO authenticated
USING (
  is_super_admin() 
  OR organization_id = current_operator_id()
)
WITH CHECK (
  organization_id = current_operator_id()
);

-- ============================================
-- DRIVERS RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "operators_see_own_drivers" ON drivers;
DROP POLICY IF EXISTS "operators_update_own_drivers" ON drivers;

-- Operators see only their own drivers
CREATE POLICY "operators_see_own_drivers"
ON drivers FOR SELECT
TO authenticated
USING (
  is_super_admin() 
  OR organization_id = current_operator_id()
  OR (auth.jwt()->>'role' = 'admin' AND current_operator_id() IS NULL)
);

-- Operators can update their own drivers
CREATE POLICY "operators_update_own_drivers"
ON drivers FOR UPDATE
TO authenticated
USING (
  organization_id = current_operator_id()
)
WITH CHECK (
  organization_id = current_operator_id()
);

-- ============================================
-- VEHICLES RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "operators_see_own_vehicles" ON vehicles;
DROP POLICY IF EXISTS "operators_update_own_vehicles" ON vehicles;

-- Operators see only their own vehicles
CREATE POLICY "operators_see_own_vehicles"
ON vehicles FOR SELECT
TO authenticated
USING (
  is_super_admin() 
  OR organization_id = current_operator_id()
  OR (auth.jwt()->>'role' = 'admin' AND current_operator_id() IS NULL)
);

-- Operators can update their own vehicles
CREATE POLICY "operators_update_own_vehicles"
ON vehicles FOR UPDATE
TO authenticated
USING (
  organization_id = current_operator_id()
)
WITH CHECK (
  organization_id = current_operator_id()
);

-- ============================================
-- BOOKING_PRICING RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "operators_see_own_pricing" ON booking_pricing;

-- Operators see pricing only for their bookings
CREATE POLICY "operators_see_own_pricing"
ON booking_pricing FOR SELECT
TO authenticated
USING (
  is_super_admin()
  OR booking_id IN (
    SELECT id FROM bookings 
    WHERE organization_id = current_operator_id()
  )
  OR (auth.jwt()->>'role' = 'admin' AND current_operator_id() IS NULL)
);

-- ============================================
-- BOOKING_SEGMENTS RLS (already exists, add operator)
-- ============================================

-- Update existing policy to include operators
DROP POLICY IF EXISTS "operators_see_own_segments" ON booking_segments;

CREATE POLICY "operators_see_own_segments"
ON booking_segments FOR SELECT
TO authenticated
USING (
  is_super_admin()
  OR booking_id IN (
    SELECT id FROM bookings 
    WHERE organization_id = current_operator_id()
  )
);

-- ============================================
-- BOOKING_SERVICES RLS (already exists, add operator)
-- ============================================

DROP POLICY IF EXISTS "operators_see_own_services" ON booking_services;

CREATE POLICY "operators_see_own_services"
ON booking_services FOR SELECT
TO authenticated
USING (
  is_super_admin()
  OR booking_id IN (
    SELECT id FROM bookings 
    WHERE organization_id = current_operator_id()
  )
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Ensure indexes exist for operator queries
CREATE INDEX IF NOT EXISTS idx_bookings_organization_id 
  ON bookings(organization_id) 
  WHERE organization_id IS NOT NULL;
  
CREATE INDEX IF NOT EXISTS idx_drivers_organization_id 
  ON drivers(organization_id) 
  WHERE organization_id IS NOT NULL;
  
CREATE INDEX IF NOT EXISTS idx_vehicles_organization_id 
  ON vehicles(organization_id) 
  WHERE organization_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id 
  ON admin_users(auth_user_id) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_admin_users_default_operator_id 
  ON admin_users(default_operator_id) 
  WHERE default_operator_id IS NOT NULL;

-- ============================================
-- MATERIALIZED VIEW: Operator Dashboard Stats
-- ============================================

-- Drop if exists
DROP MATERIALIZED VIEW IF EXISTS operator_dashboard_stats;

-- Create materialized view for fast dashboard queries
CREATE MATERIALIZED VIEW operator_dashboard_stats AS
SELECT 
  b.organization_id,
  o.name as operator_name,
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT b.assigned_driver_id) as active_drivers,
  COUNT(DISTINCT b.assigned_vehicle_id) as active_vehicles,
  SUM(CASE WHEN b.status IN ('completed', 'in_progress') THEN 1 ELSE 0 END) as completed_bookings,
  SUM(bp.operator_net) FILTER (WHERE b.status = 'completed') as total_revenue,
  SUM(bp.operator_net - bp.driver_payout) FILTER (WHERE b.status = 'completed') as total_earnings,
  SUM(bp.driver_payout) FILTER (WHERE b.status = 'completed') as total_driver_payouts,
  AVG(bp.operator_net) FILTER (WHERE b.status = 'completed') as avg_booking_value,
  MAX(b.created_at) as last_booking_date
FROM bookings b
LEFT JOIN booking_pricing bp ON bp.booking_id = b.id
LEFT JOIN organizations o ON o.id = b.organization_id
WHERE b.organization_id IS NOT NULL
GROUP BY b.organization_id, o.name;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_operator_stats_organization_id 
  ON operator_dashboard_stats(organization_id);

-- Grant access
GRANT SELECT ON operator_dashboard_stats TO authenticated;

-- Function to refresh stats
CREATE OR REPLACE FUNCTION refresh_operator_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY operator_dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANTS
-- ============================================

-- Ensure authenticated users can execute helper functions
GRANT EXECUTE ON FUNCTION current_operator_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_operator() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_operator_stats() TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION current_operator_id() IS 'Returns the default_operator_id for the current authenticated user';
COMMENT ON FUNCTION is_super_admin() IS 'Returns true if current user is a super admin';
COMMENT ON FUNCTION is_operator() IS 'Returns true if current user is an operator';
COMMENT ON MATERIALIZED VIEW operator_dashboard_stats IS 'Pre-aggregated statistics for operator dashboards';
COMMENT ON FUNCTION refresh_operator_stats() IS 'Refreshes the operator dashboard statistics materialized view';

-- ============================================
-- VERIFICATION QUERIES (commented out)
-- ============================================

/*
-- Test queries to verify RLS:

-- As super admin (should see all):
SELECT COUNT(*) FROM bookings;

-- As operator (should see only their bookings):
SELECT COUNT(*) FROM bookings;

-- Check operator stats:
SELECT * FROM operator_dashboard_stats 
WHERE organization_id = current_operator_id();

-- Refresh stats manually:
SELECT refresh_operator_stats();
*/
