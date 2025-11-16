-- ============================================================================
-- FIX NOTIFICATIONS RLS POLICIES FOR ADMIN ACCESS
-- Allow admin to delete any notification
-- ============================================================================

-- First, check if RLS is enabled on notifications table
-- If not, we don't need to do anything
-- If yes, we need proper admin policies

-- Enable RLS on notifications table (if not already enabled)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can delete any notification" ON notifications;
DROP POLICY IF EXISTS "Admin can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can update any notification" ON notifications;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- Create comprehensive admin policies
-- Admin has full access to all notifications
CREATE POLICY "Admin can view all notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.auth_user_id = auth.uid()
    )
    OR user_id = auth.uid()  -- Users can still see their own
  );

CREATE POLICY "Admin can insert notifications" ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can update any notification" ON notifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.auth_user_id = auth.uid()
    )
    OR user_id = auth.uid()  -- Users can update their own (mark as read)
  );

CREATE POLICY "Admin can delete any notification" ON notifications
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.auth_user_id = auth.uid()
    )
    OR user_id = auth.uid()  -- Users can delete their own notifications
  );

-- ============================================================================
-- ALSO CREATE A FUNCTION TO CHECK IF USER IS ADMIN
-- This makes policies more efficient
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now update policies to use the function (more efficient)
DROP POLICY IF EXISTS "Admin can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can delete any notification" ON notifications;
DROP POLICY IF EXISTS "Admin can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can update any notification" ON notifications;

CREATE POLICY "Admin can view all notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (is_admin() OR user_id = auth.uid());

CREATE POLICY "Admin can insert notifications" ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update any notification" ON notifications
  FOR UPDATE
  TO authenticated
  USING (is_admin() OR user_id = auth.uid());

CREATE POLICY "Admin can delete any notification" ON notifications
  FOR DELETE
  TO authenticated
  USING (is_admin() OR user_id = auth.uid());

-- ============================================================================
-- COMMENTS AND DEBUG INFO
-- ============================================================================

COMMENT ON FUNCTION is_admin() IS 'Check if current user is admin - used in RLS policies';

-- Log success
DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: Notifications RLS policies updated for admin access';
  RAISE NOTICE 'Admin users can now: SELECT, INSERT, UPDATE, DELETE any notification';
  RAISE NOTICE 'Regular users can: SELECT, UPDATE, DELETE their own notifications only';
END $$;
