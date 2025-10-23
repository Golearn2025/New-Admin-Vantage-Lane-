/**
 * Migration: Add source tracking to bookings table
 * Date: 2025-10-22
 * Purpose: Track booking origin (web landing page, app, call center, API)
 */

-- Add source column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) 
CHECK (source IN ('app', 'web', 'call_center', 'partner_api'));

-- Set default to 'web' for existing bookings (assume they came from landing page)
UPDATE bookings 
SET source = 'web' 
WHERE source IS NULL;

-- Create index for filtering by source
CREATE INDEX IF NOT EXISTS idx_bookings_source_created_at 
ON bookings(source, created_at DESC);

-- Add comment
COMMENT ON COLUMN bookings.source IS 'Origin of booking: app (mobile), web (landing page), call_center (phone), partner_api (external)';
