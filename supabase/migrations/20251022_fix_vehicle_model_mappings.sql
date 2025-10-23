-- =====================================================
-- Fix Vehicle Model Mappings + Add model_code to Vehicles
-- Date: 2025-10-22
-- 
-- CORRECT MAPPING:
-- - EXEC: exec_5_series (BMW 5) | exec_e_class (Mercedes E)
-- - LUX: lux_s_class (Mercedes S) | lux_7_series (BMW 7)
-- - SUV: suv_range_rover (DOAR Range Rover!)
-- - VAN: van_v_class (DOAR Mercedes V-Class!)
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Add model_code to vehicles table
-- =====================================================
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS model_code VARCHAR(50);

-- Add index pentru filtering rapid
CREATE INDEX IF NOT EXISTS idx_vehicles_category_model 
ON vehicles(category, model_code) 
WHERE is_active = true AND is_available = true;

COMMENT ON COLUMN vehicles.model_code IS 'Model code matching booking.vehicle_model for driver filtering';

-- =====================================================
-- STEP 2: Fix WRONG bookings data (13 total)
-- =====================================================

-- Fix CB-00083: SUV cu "suv (Selected)" → suv_range_rover
UPDATE bookings 
SET vehicle_model = 'suv_range_rover'
WHERE reference = 'CB-00083' AND category = 'SUV';

-- Fix CB-00082: EXEC cu "executive (Selected)" → NULL (any)
UPDATE bookings
SET vehicle_model = NULL
WHERE reference = 'CB-00082' AND category = 'EXEC';

-- Fix EXEC bookings cu vehicle models greșite:
-- EXEC cu lux_s_class (4 bookings) → NULL
UPDATE bookings
SET vehicle_model = NULL
WHERE category = 'EXEC' 
  AND vehicle_model = 'lux_s_class'
  AND reference IN ('CB-00045', 'CB-00048', 'CB-00058', 'CB-00059');

-- EXEC cu lux_7_series (1 booking) → NULL
UPDATE bookings
SET vehicle_model = NULL
WHERE category = 'EXEC'
  AND vehicle_model = 'lux_7_series'
  AND reference = 'CB-00055';

-- EXEC cu van_v_class (4 bookings) → NULL
UPDATE bookings
SET vehicle_model = NULL
WHERE category = 'EXEC'
  AND vehicle_model = 'van_v_class'
  AND reference IN ('CB-00028', 'CB-00050', 'CB-00051', 'CB-00060');

-- EXEC cu suv_range_rover (2 bookings) → NULL
UPDATE bookings
SET vehicle_model = NULL
WHERE category = 'EXEC'
  AND vehicle_model = 'suv_range_rover'
  AND reference IN ('CB-00027', 'CB-00049');

-- =====================================================
-- STEP 3: Add CHECK constraints pentru data integrity
-- =====================================================

-- Constraint pentru bookings.vehicle_model
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS chk_vehicle_model_category;

ALTER TABLE bookings
ADD CONSTRAINT chk_vehicle_model_category CHECK (
  (category = 'EXEC' AND vehicle_model IN ('exec_5_series', 'exec_e_class') OR vehicle_model IS NULL)
  OR
  (category = 'LUX' AND vehicle_model IN ('lux_s_class', 'lux_7_series') OR vehicle_model IS NULL)
  OR
  (category = 'SUV' AND (vehicle_model = 'suv_range_rover' OR vehicle_model IS NULL))
  OR
  (category = 'VAN' AND (vehicle_model = 'van_v_class' OR vehicle_model IS NULL))
  OR
  category NOT IN ('EXEC', 'LUX', 'SUV', 'VAN')
);

-- Constraint pentru vehicles.model_code
ALTER TABLE vehicles
DROP CONSTRAINT IF EXISTS chk_vehicle_model_code;

ALTER TABLE vehicles
ADD CONSTRAINT chk_vehicle_model_code CHECK (
  model_code IN (
    'exec_5_series',
    'exec_e_class',
    'lux_s_class',
    'lux_7_series',
    'suv_range_rover',
    'van_v_class'
  ) OR model_code IS NULL
);

-- =====================================================
-- STEP 4: Validation check
-- =====================================================

-- Verificare: NU ar trebui să existe nicio eroare
DO $$
DECLARE
  wrong_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO wrong_count
  FROM bookings
  WHERE 
    (category = 'EXEC' AND vehicle_model NOT IN ('exec_5_series', 'exec_e_class') AND vehicle_model IS NOT NULL)
    OR (category = 'LUX' AND vehicle_model NOT IN ('lux_s_class', 'lux_7_series') AND vehicle_model IS NOT NULL)
    OR (category = 'SUV' AND vehicle_model != 'suv_range_rover' AND vehicle_model IS NOT NULL)
    OR (category = 'VAN' AND vehicle_model != 'van_v_class' AND vehicle_model IS NOT NULL);
  
  IF wrong_count > 0 THEN
    RAISE EXCEPTION 'Still have % bookings with wrong vehicle_model mapping!', wrong_count;
  ELSE
    RAISE NOTICE '✅ All bookings have correct vehicle_model mappings!';
  END IF;
END $$;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (for manual check)
-- =====================================================

-- Count by category + model
SELECT 
  category,
  vehicle_model,
  COUNT(*) as count
FROM bookings
WHERE category IN ('EXEC', 'LUX', 'SUV', 'VAN')
GROUP BY category, vehicle_model
ORDER BY category, vehicle_model;
