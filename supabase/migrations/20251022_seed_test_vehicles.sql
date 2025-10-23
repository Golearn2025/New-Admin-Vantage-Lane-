-- =====================================================
-- Seed Test Vehicles cu Model Codes Corecte
-- Date: 2025-10-22
-- 
-- Crează 6 vehicles (1 pentru fiecare model) linked la driver John Smith
-- =====================================================

BEGIN;

-- =====================================================
-- VARIABLES
-- =====================================================
DO $$
DECLARE
  org_id UUID := 'f8e6aeba-5215-4134-956d-4ff9a058ab35'; -- Premium Chauffeurs
  driver_id UUID := 'b3b93b5f-d46c-4314-ba39-f162d30556ad'; -- John Smith
BEGIN

-- =====================================================
-- 1. BMW 5 Series (EXEC)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'EXEC',
  'exec_5_series',
  'BMW',
  '5 Series',
  2024,
  'Black',
  'VL24 EX1',
  5,
  3,
  '2026-12-31',
  true,  -- PRIMARY vehicle
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Mercedes E-Class (EXEC)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'EXEC',
  'exec_e_class',
  'Mercedes-Benz',
  'E-Class',
  2024,
  'Silver',
  'VL24 EX2',
  5,
  3,
  '2026-12-31',
  false, -- backup vehicle
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. Mercedes S-Class (LUX)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'LUX',
  'lux_s_class',
  'Mercedes-Benz',
  'S-Class',
  2024,
  'Black',
  'VL24 LX1',
  4,
  3,
  '2026-12-31',
  false,
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. BMW 7 Series (LUX)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'LUX',
  'lux_7_series',
  'BMW',
  '7 Series',
  2024,
  'White',
  'VL24 LX2',
  4,
  3,
  '2026-12-31',
  false,
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. Range Rover (SUV)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'SUV',
  'suv_range_rover',
  'Land Rover',
  'Range Rover',
  2024,
  'Grey',
  'VL24 SUV',
  5,
  4,
  '2026-12-31',
  false,
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. Mercedes V-Class (VAN)
-- =====================================================
INSERT INTO vehicles (
  id,
  organization_id,
  driver_id,
  category,
  model_code,
  make,
  model,
  year,
  color,
  license_plate,
  passenger_capacity,
  luggage_capacity,
  insurance_expiry,
  is_active,
  is_available
) VALUES (
  gen_random_uuid(),
  org_id,
  driver_id,
  'VAN',
  'van_v_class',
  'Mercedes-Benz',
  'V-Class',
  2024,
  'Black',
  'VL24 VAN',
  7,
  5,
  '2026-12-31',
  false,
  true
)
ON CONFLICT DO NOTHING;

RAISE NOTICE '✅ Seeded 6 test vehicles for driver John Smith';

END $$;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 
  v.model_code,
  v.category,
  v.make || ' ' || v.model as vehicle,
  v.license_plate,
  v.is_active,
  d.first_name || ' ' || d.last_name as driver
FROM vehicles v
LEFT JOIN drivers d ON d.id = v.driver_id
ORDER BY v.category, v.model_code;
