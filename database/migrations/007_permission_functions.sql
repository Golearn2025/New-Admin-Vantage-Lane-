-- ============================================
-- PERMISSION HELPER FUNCTIONS
-- Helper functions for permission system
-- ============================================

-- Function to get user's menu permissions
-- Returns pages the user can access (role + user overrides)
CREATE OR REPLACE FUNCTION get_user_menu_permissions(
  p_user_id UUID,
  p_role TEXT
)
RETURNS TABLE (
  page_key TEXT,
  label TEXT,
  icon TEXT,
  href TEXT,
  parent_key TEXT,
  display_order INTEGER,
  enabled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pd.page_key,
    pd.label,
    pd.icon,
    pd.href,
    pd.parent_key,
    pd.display_order,
    COALESCE(
      up.enabled,  -- User override takes precedence
      rp.enabled,  -- Fall back to role permission
      FALSE        -- Default to disabled
    ) as enabled
  FROM page_definitions pd
  LEFT JOIN role_permissions rp 
    ON rp.page_key = pd.page_key 
    AND rp.role = p_role
  LEFT JOIN user_permissions up 
    ON up.page_key = pd.page_key 
    AND up.user_id = p_user_id
  WHERE pd.is_active = TRUE
    AND COALESCE(up.enabled, rp.enabled, FALSE) = TRUE
  ORDER BY pd.display_order;
END;
$$;

-- Function to check if user has permission for a specific page
CREATE OR REPLACE FUNCTION check_user_permission(
  p_user_id UUID,
  p_role TEXT,
  p_page_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_enabled BOOLEAN;
BEGIN
  SELECT COALESCE(
    up.enabled,
    rp.enabled,
    FALSE
  ) INTO v_enabled
  FROM page_definitions pd
  LEFT JOIN role_permissions rp 
    ON rp.page_key = pd.page_key 
    AND rp.role = p_role
  LEFT JOIN user_permissions up 
    ON up.page_key = pd.page_key 
    AND up.user_id = p_user_id
  WHERE pd.page_key = p_page_key
    AND pd.is_active = TRUE;

  RETURN COALESCE(v_enabled, FALSE);
END;
$$;
