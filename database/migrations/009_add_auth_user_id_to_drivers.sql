/**
 * Add auth_user_id to drivers table
 * Links driver records to Supabase Auth users
 */

-- Add auth_user_id column
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_drivers_auth_user_id 
ON drivers(auth_user_id);

-- Add comment
COMMENT ON COLUMN drivers.auth_user_id IS 'Foreign key to auth.users - links driver to authentication';

-- Optional: Populate existing drivers (if any test data exists)
-- UPDATE drivers 
-- SET auth_user_id = (
--   SELECT id FROM auth.users 
--   WHERE auth.users.email = drivers.email 
--   LIMIT 1
-- )
-- WHERE auth_user_id IS NULL;
