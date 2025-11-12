/**
 * Driver Entity - Public API
 */

export * from './model/schema';
export * from './model/types';
export * from './lib/validateDriver';

// API exports
export { 
  listDrivers,
  getDriverById,
  getDriverWithDocuments,
  createDriver,
  updateDriver,
  deleteDriver,
  activateDriver,
  deactivateDriver,
  getDriverDocuments,
  approveDocument,
  rejectDocument
} from './api/driverApi';

export { listPendingDrivers } from './api/listPendingDrivers';
export type { PendingDriverData } from './api/listPendingDrivers';
