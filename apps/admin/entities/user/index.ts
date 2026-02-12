/**
 * User Entity - Public API
 */

export * from './api/bulkDeleteUsers';
export * from './api/bulkSetOnlineStatus';
export * from './api/bulkUpdateUsers';
export * from './api/hardDeleteUsers';
export * from './api/listAllUsers';
export * from './api/listDeletedUsers';
export * from './api/restoreUsers';
export * from './api/userApi';
export * from './model/constants';
export * from './model/schema';
export type { UnifiedUser } from './model/types'; // Export only UnifiedUser to avoid conflict
// export * from './api/createUser'; // Deprecated - use createUserAction instead
export * from './api/assignDriverToOperator';
export * from './api/createUserAction';
export * from './api/getOperatorDrivers';
export * from './api/listOperators';
export * from './api/updateUser';
export * from './api/verifyDriver';
export * from './lib/validateUser';

