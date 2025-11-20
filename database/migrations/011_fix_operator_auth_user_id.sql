-- ============================================
-- Migration 011: Fix Operator auth_user_id
-- ============================================
-- Purpose: Ensure operators have correct auth_user_id
-- Author: Cascade AI
-- Date: 2025-11-20
-- ============================================

-- First, let's see what admin_users exist
-- This query will show current admin_users state
SELECT 
  id, 
  auth_user_id, 
  email, 
  name, 
  role, 
  is_active, 
  default_operator_id
FROM admin_users 
WHERE role IN ('operator', 'admin', 'super_admin')
ORDER BY role, email;

-- ============================================
-- SEED DATA: Create test operator if needed
-- ============================================

-- This will create a test operator if one doesn't exist
-- Replace with real auth_user_id from Supabase auth.users
DO $$
BEGIN
  -- Check if we have any operators
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE role = 'operator'
  ) THEN
    -- Create organizations table if it doesn't exist
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Insert test organization
    INSERT INTO organizations (id, name, email)
    VALUES ('12345678-1234-5678-9012-123456789012', 'Test Operator Org', 'operator@vantage-lane.com')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create admin_users table structure if needed
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      auth_user_id UUID UNIQUE, -- Links to auth.users.id
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      avatar_url TEXT,
      job_title TEXT,
      department TEXT,
      bio TEXT,
      preferred_language TEXT DEFAULT 'en',
      timezone TEXT DEFAULT 'UTC',
      role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'operator', 'support')),
      is_active BOOLEAN DEFAULT TRUE,
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      notification_settings JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      approved_by UUID,
      approved_at TIMESTAMP WITH TIME ZONE,
      default_operator_id UUID REFERENCES organizations(id)
    );
    
    -- Insert test operator (auth_user_id will need to be updated manually)
    INSERT INTO admin_users (
      auth_user_id,
      email,
      name,
      first_name,
      last_name,
      role,
      is_active,
      default_operator_id
    ) VALUES (
      NULL, -- This needs to be set to actual auth.users.id from Supabase
      'operator@vantage-lane.com',
      'Test Operator',
      'Test',
      'Operator',
      'operator',
      TRUE,
      '12345678-1234-5678-9012-123456789012'
    ) ON CONFLICT (email) DO NOTHING;
    
    RAISE NOTICE 'Test operator created. Please update auth_user_id manually.';
  END IF;
END $$;

-- ============================================
-- HELPER: Update auth_user_id for existing operator
-- ============================================

-- To update an existing operator with correct auth_user_id:
-- UPDATE admin_users 
-- SET auth_user_id = '[ACTUAL_AUTH_USER_ID_FROM_SUPABASE]'
-- WHERE email = 'operator@vantage-lane.com' AND role = 'operator';

-- You can get the auth_user_id from Supabase dashboard:
-- Authentication > Users > [find your operator user] > copy the ID

COMMENT ON TABLE admin_users IS 'Stores admin and operator users with auth integration';
COMMENT ON COLUMN admin_users.auth_user_id IS 'Links to auth.users.id from Supabase Auth';
COMMENT ON COLUMN admin_users.default_operator_id IS 'For operators: their organization ID';
