-- ============================================================================
-- NOTIFICATION TRIGGERS SYSTEM
-- Automatic notifications for driver/document actions
-- ============================================================================

-- ============================================================================
-- 1. FUNCTION: Notify driver when document approved
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_driver_document_approved()
RETURNS TRIGGER AS $$
DECLARE
  driver_user_id UUID;
  driver_name TEXT;
  doc_type TEXT;
BEGIN
  -- Only trigger if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    
    -- Get driver's auth_user_id and name
    SELECT 
      d.auth_user_id,
      COALESCE(d.first_name, '') || ' ' || COALESCE(d.last_name, ''),
      NEW.document_type
    INTO driver_user_id, driver_name, doc_type
    FROM drivers d
    WHERE d.id = NEW.driver_id;
    
    -- Send notification if driver has auth_user_id
    IF driver_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        driver_user_id,
        'document_approved',
        '✅ Document Approved',
        'Your ' || REPLACE(doc_type, '_', ' ') || ' has been approved!',
        'driver',
        true,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. FUNCTION: Notify driver when document rejected
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_driver_document_rejected()
RETURNS TRIGGER AS $$
DECLARE
  driver_user_id UUID;
  driver_name TEXT;
  doc_type TEXT;
  rejection_msg TEXT;
BEGIN
  -- Only trigger if status changed to 'rejected'
  IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
    
    -- Get driver's auth_user_id and name
    SELECT 
      d.auth_user_id,
      COALESCE(d.first_name, '') || ' ' || COALESCE(d.last_name, ''),
      NEW.document_type
    INTO driver_user_id, driver_name, doc_type
    FROM drivers d
    WHERE d.id = NEW.driver_id;
    
    -- Prepare rejection message
    rejection_msg := 'Your ' || REPLACE(doc_type, '_', ' ') || ' was rejected.';
    IF NEW.rejection_reason IS NOT NULL THEN
      rejection_msg := rejection_msg || ' Reason: ' || NEW.rejection_reason;
    END IF;
    
    -- Send notification if driver has auth_user_id
    IF driver_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        driver_user_id,
        'document_rejected',
        '❌ Document Rejected',
        rejection_msg,
        'driver',
        true,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. FUNCTION: Notify driver when account approved
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_driver_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if is_approved changed from false to true
  IF NEW.is_approved = true AND (OLD.is_approved IS NULL OR OLD.is_approved = false) THEN
    
    -- Send notification if driver has auth_user_id
    IF NEW.auth_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        NEW.auth_user_id,
        'account_approved',
        '🎉 Account Approved!',
        'Congratulations! Your driver account has been approved. You can now receive and accept bookings.',
        'driver',
        true,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. FUNCTION: Notify driver when account activated/deactivated
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_driver_activation_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if is_active changed
  IF NEW.is_active != OLD.is_active THEN
    
    -- Send notification if driver has auth_user_id
    IF NEW.auth_user_id IS NOT NULL THEN
      
      IF NEW.is_active = true THEN
        -- Account activated
        INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
        VALUES (
          NEW.auth_user_id,
          'account_activated',
          '✅ Account Activated',
          'Your account has been activated! You are now online and can receive bookings.',
          'driver',
          true,
          NOW()
        );
      ELSE
        -- Account deactivated
        INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
        VALUES (
          NEW.auth_user_id,
          'account_deactivated',
          '⚠️ Account Deactivated',
          'Your account has been deactivated. Please contact support if you have questions.',
          'driver',
          true,
          NOW()
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. FUNCTION: Same triggers for VEHICLE documents
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_driver_vehicle_document_approved()
RETURNS TRIGGER AS $$
DECLARE
  driver_user_id UUID;
  doc_type TEXT;
BEGIN
  -- Only trigger if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    
    -- Get driver's auth_user_id from vehicle
    SELECT 
      d.auth_user_id,
      NEW.document_type
    INTO driver_user_id, doc_type
    FROM vehicles v
    JOIN drivers d ON v.driver_id = d.id
    WHERE v.id = NEW.vehicle_id;
    
    -- Send notification if driver has auth_user_id
    IF driver_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        driver_user_id,
        'document_approved',
        '✅ Vehicle Document Approved',
        'Your vehicle ' || REPLACE(doc_type, '_', ' ') || ' has been approved!',
        'driver',
        true,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_driver_vehicle_document_rejected()
RETURNS TRIGGER AS $$
DECLARE
  driver_user_id UUID;
  doc_type TEXT;
  rejection_msg TEXT;
BEGIN
  -- Only trigger if status changed to 'rejected'
  IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
    
    -- Get driver's auth_user_id from vehicle
    SELECT 
      d.auth_user_id,
      NEW.document_type
    INTO driver_user_id, doc_type
    FROM vehicles v
    JOIN drivers d ON v.driver_id = d.id
    WHERE v.id = NEW.vehicle_id;
    
    -- Prepare rejection message
    rejection_msg := 'Your vehicle ' || REPLACE(doc_type, '_', ' ') || ' was rejected.';
    IF NEW.rejection_reason IS NOT NULL THEN
      rejection_msg := rejection_msg || ' Reason: ' || NEW.rejection_reason;
    END IF;
    
    -- Send notification if driver has auth_user_id
    IF driver_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, target_type, is_system, created_at)
      VALUES (
        driver_user_id,
        'document_rejected',
        '❌ Vehicle Document Rejected',
        rejection_msg,
        'driver',
        true,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Driver documents approved
DROP TRIGGER IF EXISTS trigger_notify_driver_document_approved ON driver_documents;
CREATE TRIGGER trigger_notify_driver_document_approved
  AFTER UPDATE ON driver_documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_document_approved();

-- Driver documents rejected
DROP TRIGGER IF EXISTS trigger_notify_driver_document_rejected ON driver_documents;
CREATE TRIGGER trigger_notify_driver_document_rejected
  AFTER UPDATE ON driver_documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_document_rejected();

-- Driver approved
DROP TRIGGER IF EXISTS trigger_notify_driver_approved ON drivers;
CREATE TRIGGER trigger_notify_driver_approved
  AFTER UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_approved();

-- Driver activated/deactivated
DROP TRIGGER IF EXISTS trigger_notify_driver_activation_change ON drivers;
CREATE TRIGGER trigger_notify_driver_activation_change
  AFTER UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_activation_change();

-- Vehicle documents approved
DROP TRIGGER IF EXISTS trigger_notify_vehicle_document_approved ON vehicle_documents;
CREATE TRIGGER trigger_notify_vehicle_document_approved
  AFTER UPDATE ON vehicle_documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_vehicle_document_approved();

-- Vehicle documents rejected
DROP TRIGGER IF EXISTS trigger_notify_vehicle_document_rejected ON vehicle_documents;
CREATE TRIGGER trigger_notify_vehicle_document_rejected
  AFTER UPDATE ON vehicle_documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_vehicle_document_rejected();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION notify_driver_document_approved() IS 'Sends notification when driver document is approved';
COMMENT ON FUNCTION notify_driver_document_rejected() IS 'Sends notification when driver document is rejected';
COMMENT ON FUNCTION notify_driver_approved() IS 'Sends notification when driver account is approved';
COMMENT ON FUNCTION notify_driver_activation_change() IS 'Sends notification when driver account is activated/deactivated';
COMMENT ON FUNCTION notify_driver_vehicle_document_approved() IS 'Sends notification when vehicle document is approved';
COMMENT ON FUNCTION notify_driver_vehicle_document_rejected() IS 'Sends notification when vehicle document is rejected';
