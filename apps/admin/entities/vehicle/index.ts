/**
 * Vehicle Entity - Public API
 * 
 * Barrel export pentru toate funcțiile vehicle-related.
 * Clean separation între API și business logic.
 */

// API exports
export { createVehicle } from './api/createVehicle';
export { listVehicles } from './api/listVehicles';
export { listVehicleDocuments } from './api/listVehicleDocuments';
export { uploadVehicleDocument } from './api/uploadVehicleDocument';
export { deleteVehicle } from './api/deleteVehicle';
export { updateVehicle } from './api/updateVehicle';
export { getDriverVehicle, approveVehicle, rejectVehicle } from './api/vehicleApi';
export { listJobCategories, getDriverJobTypes, updateDriverJobTypes } from './api/jobCategoryApi';

// Model exports
export {
  VEHICLE_OPTIONS,
  VEHICLE_STATUS,
  getVehicleCategory,
  getVehicleMakes,
  isValidVehicle,
} from './model/constants';

export type {
  VehicleCategory,
  VehicleStatus,
  VehicleYear,
  VehicleColor,
  VehicleOption,
} from './model/constants';

export type {
  Vehicle,
  AddVehicleFormData,
  ApproveVehicleData,
  RejectVehicleData,
  VehicleWithDriver,
} from './model/types';

export type { DriverVehicle } from './api/listVehicles';
export type { VehicleDocument } from './api/listVehicleDocuments';
export type { Vehicle as VehicleApproval, VehicleFormData, VehicleApprovalData, JobCategory, DriverJobType } from './types';
export { VEHICLE_YEARS, VEHICLE_COLORS, VEHICLE_MAKES, VEHICLE_MODELS, getModelsForMake, getSuggestedCategory } from './constants/vehicleData';
