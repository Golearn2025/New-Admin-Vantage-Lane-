-- ============================================================================
-- DOCUMENT EXPIRY NOTIFICATION SYSTEM
-- Daily CRON job to check expiring documents (7 days warning)
-- ============================================================================

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================================
-- FUNCTION: Check and notify expiring documents
-- ============================================================================
CREATE OR REPLACE FUNCTION check_expiring_documents()
RETURNS void AS $$
DECLARE
  expiring_driver_docs CURSOR FOR
    SELECT 
      dd.id,
      dd.driver_id,
      dd.document_type,
      dd.expiry_date,
      d.auth_user_id,
      COALESCE(d.first_name, '') || ' ' || COALESCE(d.last_name, '') as driver_name
    FROM driver_documents dd
    JOIN drivers d ON dd.driver_id = d.id
    WHERE dd.status = 'approved'
      AND dd.expiry_date IS NOT NULL
      AND dd.expiry_date > CURRENT_DATE
      AND dd.expiry_date <= CURRENT_DATE + INTERVAL '7 days'
      AND d.auth_user_id IS NOT NULL;
  
  expiring_vehicle_docs CURSOR FOR
    SELECT 
      vd.id,
      vd.vehicle_id,
      vd.document_type,
      vd.expiry_date,
      d.auth_user_id,
      COALESCE(d.first_name, '') || ' ' || COALESCE(d.last_name, '') as driver_name,
      v.plate_number
    FROM vehicle_documents vd
    JOIN vehicles v ON vd.vehicle_id = v.id
    JOIN drivers d ON v.driver_id = d.id
    WHERE vd.status = 'approved'
      AND vd.expiry_date IS NOT NULL
      AND vd.expiry_date > CURRENT_DATE
      AND vd.expiry_date <= CURRENT_DATE + INTERVAL '7 days'
      AND d.auth_user_id IS NOT NULL;
  
  doc_record RECORD;
  days_until_expiry INTEGER;
  notification_exists BOOLEAN;
BEGIN
  
  -- ============================================================================
  -- Check DRIVER documents
  -- ============================================================================
  FOR doc_record IN expiring_driver_docs LOOP
    days_until_expiry := doc_record.expiry_date - CURRENT_DATE;
    
    -- Check if we already sent notification today for this document
    SELECT EXISTS(
      SELECT 1 FROM notifications
      WHERE user_id = doc_record.auth_user_id
        AND type = 'document_expiring'
        AND message LIKE '%' || REPLACE(doc_record.document_type, '_', ' ') || '%'
        AND created_at::date = CURRENT_DATE
    ) INTO notification_exists;
    
    -- Only send if we haven't already sent today
    IF NOT notification_exists THEN
      -- Notify driver
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        doc_record.auth_user_id,
        'document_expiring',
        '⚠️ Document Expiring Soon',
        'Your ' || REPLACE(doc_record.document_type, '_', ' ') || ' will expire in ' || days_until_expiry || ' day(s) on ' || TO_CHAR(doc_record.expiry_date, 'DD Mon YYYY') || '. Please upload a new one.',
        'driver',
        true,
        NOW()
      );
      
      -- Notify admins
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      SELECT 
        au.auth_user_id,
        'driver_document_expiring',
        '⚠️ Driver Document Expiring',
        'Driver "' || doc_record.driver_name || '" has ' || REPLACE(doc_record.document_type, '_', ' ') || ' expiring in ' || days_until_expiry || ' day(s).',
        'admin',
        true,
        NOW()
      FROM admin_users au
      WHERE au.is_active = true
        AND au.role IN ('super_admin', 'admin')
        AND au.auth_user_id IS NOT NULL;
    END IF;
  END LOOP;
  
  -- ============================================================================
  -- Check VEHICLE documents
  -- ============================================================================
  FOR doc_record IN expiring_vehicle_docs LOOP
    days_until_expiry := doc_record.expiry_date - CURRENT_DATE;
    
    -- Check if we already sent notification today for this document
    SELECT EXISTS(
      SELECT 1 FROM notifications
      WHERE user_id = doc_record.auth_user_id
        AND type = 'document_expiring'
        AND message LIKE '%vehicle%' || REPLACE(doc_record.document_type, '_', ' ') || '%'
        AND created_at::date = CURRENT_DATE
    ) INTO notification_exists;
    
    -- Only send if we haven't already sent today
    IF NOT notification_exists THEN
      -- Notify driver
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        doc_record.auth_user_id,
        'document_expiring',
        '⚠️ Vehicle Document Expiring',
        'Your vehicle (' || doc_record.plate_number || ') ' || REPLACE(doc_record.document_type, '_', ' ') || ' will expire in ' || days_until_expiry || ' day(s) on ' || TO_CHAR(doc_record.expiry_date, 'DD Mon YYYY') || '. Please upload a new one.',
        'driver',
        true,
        NOW()
      );
      
      -- Notify admins
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      SELECT 
        au.auth_user_id,
        'driver_document_expiring',
        '⚠️ Vehicle Document Expiring',
        'Driver "' || doc_record.driver_name || '" vehicle (' || doc_record.plate_number || ') ' || REPLACE(doc_record.document_type, '_', ' ') || ' expiring in ' || days_until_expiry || ' day(s).',
        'admin',
        true,
        NOW()
      FROM admin_users au
      WHERE au.is_active = true
        AND au.role IN ('super_admin', 'admin')
        AND au.auth_user_id IS NOT NULL;
    END IF;
  END LOOP;
  
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCHEDULE CRON JOB (runs daily at 9:00 AM UTC)
-- ============================================================================
SELECT cron.schedule(
  'check-expiring-documents-daily',  -- job name
  '0 9 * * *',                        -- cron schedule (9 AM UTC every day)
  $$SELECT check_expiring_documents();$$
);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION check_expiring_documents() IS 'Checks for documents expiring within 7 days and sends notifications to drivers and admins. Runs daily via pg_cron.';
