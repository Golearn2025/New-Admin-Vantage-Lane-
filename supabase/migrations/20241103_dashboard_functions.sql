-- Dashboard Functions for Metrics and Charts
-- Created: 2024-11-03
-- Purpose: Provide aggregated data for admin dashboard

-- ============================================================================
-- FUNCTION 1: get_dashboard_metrics
-- Returns aggregated financial and operational metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    -- Row 1: Financial Overview (convert £ to pence by * 100)
    'total_revenue_pence', COALESCE(CAST(SUM(bp.price) * 100 AS INTEGER), 0),
    'total_bookings', COUNT(b.id),
    'avg_booking_pence', COALESCE(CAST(AVG(bp.price) * 100 AS INTEGER), 0),
    'platform_commission_pence', COALESCE(CAST(SUM(bp.platform_fee) * 100 AS INTEGER), 0),
    
    -- Row 2: Operations & Future
    'operator_payout_pence', COALESCE(CAST(SUM(bp.operator_net) * 100 AS INTEGER), 0),
    'cancelled_count', COUNT(*) FILTER (WHERE b.status = 'CANCELLED'),
    'refunds_total_pence', COALESCE(
      (SELECT CAST(SUM(amount) * 100 AS INTEGER) 
       FROM refunds r
       WHERE (p_start_date IS NULL OR r.created_at::DATE >= p_start_date)
         AND (p_end_date IS NULL OR r.created_at::DATE <= p_end_date)
      ), 0
    ),
    'scheduled_count', COUNT(*) FILTER (WHERE b.status IN ('NEW', 'ASSIGNED') AND b.start_at > NOW())
  ) INTO v_result
  FROM bookings b
  LEFT JOIN booking_pricing bp ON b.id = bp.booking_id
  WHERE (p_start_date IS NULL OR b.created_at::DATE >= p_start_date)
    AND (p_end_date IS NULL OR b.created_at::DATE <= p_end_date);
    
  RETURN v_result;
END;
$$;

-- ============================================================================
-- FUNCTION 2: get_dashboard_charts
-- Returns chart data for dashboard visualizations
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_charts(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_grouping TEXT DEFAULT 'day'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
  v_date_trunc TEXT;
BEGIN
  -- Determine date truncation based on grouping
  v_date_trunc := CASE 
    WHEN p_grouping = 'hour' THEN 'hour'
    WHEN p_grouping = 'week' THEN 'week'
    WHEN p_grouping = 'month' THEN 'month'
    WHEN p_grouping = 'year' THEN 'year'
    ELSE 'day'
  END;

  SELECT json_build_object(
    -- Weekly Activity (bookings count by date)
    'weekly_activity', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'x', TO_CHAR(date_trunc(v_date_trunc, b.created_at), 'YYYY-MM-DD'),
          'y', COUNT(*)
        ) ORDER BY date_trunc(v_date_trunc, b.created_at)
      ), '[]'::json)
      FROM bookings b
      WHERE (p_start_date IS NULL OR b.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR b.created_at::DATE <= p_end_date)
      GROUP BY date_trunc(v_date_trunc, b.created_at)
    ),
    
    -- Revenue Trend (revenue in pence by date)
    'revenue_trend', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'x', TO_CHAR(date_trunc(v_date_trunc, b.created_at), 'YYYY-MM-DD'),
          'y', COALESCE(CAST(SUM(bp.price) * 100 AS INTEGER), 0)
        ) ORDER BY date_trunc(v_date_trunc, b.created_at)
      ), '[]'::json)
      FROM bookings b
      LEFT JOIN booking_pricing bp ON b.id = bp.booking_id
      WHERE (p_start_date IS NULL OR b.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR b.created_at::DATE <= p_end_date)
      GROUP BY date_trunc(v_date_trunc, b.created_at)
    ),
    
    -- Status Distribution
    'status_distribution', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'name', COALESCE(b.status, 'UNKNOWN'),
          'value', COUNT(*)
        )
      ), '[]'::json)
      FROM bookings b
      WHERE (p_start_date IS NULL OR b.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR b.created_at::DATE <= p_end_date)
      GROUP BY b.status
    ),
    
    -- Operator Performance (bookings, revenue, commission by operator)
    'operator_performance', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'x', b.operator_id,
          'bookings', COUNT(*),
          'revenue', COALESCE(CAST(SUM(bp.price) * 100 AS INTEGER), 0),
          'commission', COALESCE(CAST(SUM(bp.platform_fee) * 100 AS INTEGER), 0)
        )
      ), '[]'::json)
      FROM bookings b
      LEFT JOIN booking_pricing bp ON b.id = bp.booking_id
      WHERE (p_start_date IS NULL OR b.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR b.created_at::DATE <= p_end_date)
      GROUP BY b.operator_id
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_dashboard_metrics(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_charts(DATE, DATE, TEXT) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_dashboard_metrics IS 'Returns aggregated dashboard metrics (revenue, bookings, etc.) in pence';
COMMENT ON FUNCTION get_dashboard_charts IS 'Returns chart data for dashboard visualizations (activity, revenue, status, operators)';
