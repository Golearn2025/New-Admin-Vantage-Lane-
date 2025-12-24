-- Migration: Add Live Driver Tracking Support
-- Description: Adds current position and online status to drivers table
-- Version: 1.0 - Current Position Only (no historical data)

-- Add location and online status fields to drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS online_status VARCHAR(20) DEFAULT 'offline';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_online_at TIMESTAMPTZ;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS location_accuracy INTEGER; -- GPS accuracy in meters

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_drivers_online_status 
ON drivers(online_status) 
WHERE online_status != 'offline';

CREATE INDEX IF NOT EXISTS idx_drivers_location_updated 
ON drivers(location_updated_at DESC) 
WHERE online_status != 'offline';

-- Add check constraint for valid online status values
ALTER TABLE drivers ADD CONSTRAINT IF NOT EXISTS check_online_status 
CHECK (online_status IN ('offline', 'online', 'busy', 'break'));

-- Update RLS policies for location access
-- Admin can see all driver locations
CREATE POLICY IF NOT EXISTS drivers_location_admin_access ON drivers
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.auth_user_id = auth.uid() 
      AND au.role IN ('admin', 'support')
      AND au.is_active = true
  )
);

-- Operators can only see their drivers' locations  
CREATE POLICY IF NOT EXISTS drivers_location_operator_access ON drivers
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_organization_roles uor
    WHERE uor.user_id = auth.uid()
      AND uor.organization_id = drivers.organization_id
      AND uor.role = 'admin'
  )
);

-- Driver can update only their own location
CREATE POLICY IF NOT EXISTS drivers_location_self_update ON drivers
FOR UPDATE TO authenticated
USING (auth.uid()::text = auth_user_id)
WITH CHECK (auth.uid()::text = auth_user_id);

-- Add comment for documentation
COMMENT ON COLUMN drivers.online_status IS 'Driver availability status: offline, online, busy, break';
COMMENT ON COLUMN drivers.current_latitude IS 'Current GPS latitude (updated every 30 seconds when online)';
COMMENT ON COLUMN drivers.current_longitude IS 'Current GPS longitude (updated every 30 seconds when online)';
COMMENT ON COLUMN drivers.location_updated_at IS 'Timestamp of last location update from mobile app';
COMMENT ON COLUMN drivers.location_accuracy IS 'GPS accuracy in meters from mobile device';
