/**
 * Driver Entity - API Layer Index
 * 
 * Re-exports all driver operations from focused modules
 * Refactored: Split 372 lines into focused domain files
 */

// CRUD Operations
export {
  listDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} from './driverCrudOperations';

// Document Management
export {
  getDriverDocuments,
  approveDocument,
  rejectDocument,
} from './driverDocuments';

// Stats and Bookings
export {
  getDriverBookings,
  getDriverVehicle,
  getDriverStats,
  getDriverWithDocuments,
} from './driverStats';

// Driver Lifecycle
export {
  assignVehicleServiceTypes,
  activateDriver,
  deactivateDriver,
} from './driverLifecycle';
