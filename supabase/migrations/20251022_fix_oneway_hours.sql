/**
 * Migration: Fix hours field for ONE WAY bookings
 * Date: 2025-10-22
 * Purpose: ONE WAY bookings should NOT have hours set (only HOURLY trips)
 */

-- Set hours to NULL for all non-hourly bookings
UPDATE bookings 
SET hours = NULL 
WHERE trip_type != 'hourly' 
  AND hours IS NOT NULL;

-- Add comment
COMMENT ON COLUMN bookings.hours IS 'Number of hours for HOURLY bookings only. NULL for oneway/return/fleet.';

-- Verify fix
SELECT 
  trip_type,
  COUNT(*) as total,
  COUNT(hours) as with_hours,
  COUNT(*) FILTER (WHERE hours IS NOT NULL) as hours_not_null
FROM bookings
GROUP BY trip_type;
