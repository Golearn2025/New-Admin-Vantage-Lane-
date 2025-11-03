-- CLEANUP TEST BOOKINGS
-- Run this AFTER verifying dashboard filters work correctly
-- This will delete all test bookings created for filter verification

-- Delete pricing first (foreign key constraint)
DELETE FROM booking_pricing
WHERE booking_id IN (
  SELECT id FROM bookings WHERE notes = '🧪 TEST BOOKING - DELETE ME'
);

-- Delete bookings
DELETE FROM bookings
WHERE notes = '🧪 TEST BOOKING - DELETE ME';

-- Verify deletion
SELECT 
  COUNT(*) as remaining_test_bookings
FROM bookings
WHERE notes = '🧪 TEST BOOKING - DELETE ME';

-- Should return: remaining_test_bookings = 0
