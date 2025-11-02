-- Function to get notification history (bypasses RLS)
CREATE OR REPLACE FUNCTION get_notification_history(limit_count INT DEFAULT 100)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type VARCHAR,
  title VARCHAR,
  message TEXT,
  link TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP,
  target_type VARCHAR,
  is_system BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.user_id,
    n.type,
    n.title,
    n.message,
    n.link,
    n.read_at,
    n.created_at,
    n.target_type,
    n.is_system
  FROM notifications n
  WHERE n.type = 'admin_message'
    AND n.is_system = true
  ORDER BY n.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_notification_history(INT) TO authenticated;
