/**
 * Migration: Fix hours field for ALL non-HOURLY bookings
 * Date: 2025-10-22
 * Purpose: Remove incorrect hours=1 from ONE WAY, RETURN, and FLEET bookings
 * 
 * CRITICAL BUG FOUND:
 * - 51 out of 52 bookings have hours=1 incorrectly set
 * - Only HOURLY bookings should have hours != NULL
 * - ONE WAY, RETURN, FLEET should have hours = NULL
 */

-- Backup current state
CREATE TABLE IF NOT EXISTS bookings_hours_backup AS
SELECT id, reference, trip_type, hours, created_at
FROM bookings
WHERE hours IS NOT NULL;

-- Fix ONE WAY bookings (should NOT have hours)
UPDATE bookings 
SET hours = NULL 
WHERE trip_type = 'oneway' 
  AND hours IS NOT NULL;

-- Fix RETURN bookings (should NOT have hours)
UPDATE bookings 
SET hours = NULL 
WHERE trip_type = 'return' 
  AND hours IS NOT NULL;

-- Fix FLEET bookings (should NOT have hours)
UPDATE bookings 
SET hours = NULL 
WHERE trip_type = 'fleet' 
  AND hours IS NOT NULL;

-- HOURLY bookings keep their hours (correct behavior)
-- No change needed for trip_type = 'hourly'

-- Verification query
SELECT 
  trip_type,
  COUNT(*) as total,
  COUNT(hours) as with_hours_set,
  COUNT(*) FILTER (WHERE hours IS NULL) as hours_null,
  COUNT(*) FILTER (WHERE hours IS NOT NULL) as hours_not_null
FROM bookings
GROUP BY trip_type
ORDER BY trip_type;

-- Expected result:
-- oneway:  hours_null = 23, hours_not_null = 0
-- return:  hours_null = 21, hours_not_null = 0
-- fleet:   hours_null = 7,  hours_not_null = 0
-- hourly:  hours_null = 0,  hours_not_null = 1

-- Add constraint to prevent future bugs
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS check_hours_only_for_hourly;

ALTER TABLE bookings
ADD CONSTRAINT check_hours_only_for_hourly
CHECK (
  (trip_type = 'hourly' AND hours IS NOT NULL AND hours >= 1 AND hours <= 24)
  OR
  (trip_type != 'hourly' AND hours IS NULL)
);

COMMENT ON CONSTRAINT check_hours_only_for_hourly ON bookings IS 
'Ensures hours field is only set for HOURLY bookings (1-24 hours). ONE WAY, RETURN, and FLEET must have hours = NULL.';
