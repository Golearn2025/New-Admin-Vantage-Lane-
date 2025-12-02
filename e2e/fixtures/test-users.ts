/**
 * Test Users Configuration for E2E Security Tests
 * DEDICATED TEST USERS - NOT PRODUCTION USERS!
 * These users are created specifically for testing and can be safely modified
 */
export const TEST_USERS = {
  admin: {
    email: 'catalin@vantage-lane.com', // Use existing admin for now
    password: process.env.E2E_ADMIN_PASSWORD || 'Karina1986$',
    role: 'admin',
    organizationId: null, // Admin has access to all organizations
    name: 'E2E Test Admin',
  },
  
  operator: {
    email: 'den@vantage-lane.com', // Use existing operator for now
    password: process.env.E2E_OPERATOR_PASSWORD || 'Florin2025$',
    role: 'operator',
    organizationId: 'den-chauffeur-ltd', // Operator is restricted to this org
    name: 'E2E Test Operator',
  },
  
  // Future: Add driver user for testing driver routes
  driver: {
    email: 'test-driver@vantage-lane.com',
    password: process.env.E2E_DRIVER_PASSWORD || 'test123', 
    role: 'driver',
    organizationId: 'den-chauffeur-ltd',
  }
} as const;

export type TestUserType = keyof typeof TEST_USERS;

/**
 * Expected behavior for each user role
 */
export const ROLE_PERMISSIONS = {
  admin: {
    canAccess: [
      '/dashboard',
      '/business-intelligence', 
      '/users/all',
      '/users/admins',
      '/payments',
      '/bookings',
      '/notifications'
    ],
    cannotAccess: [
      // Admin can access everything
    ],
    dataScope: 'all-organizations'
  },
  
  operator: {
    canAccess: [
      '/dashboard',
      '/bookings',
      '/operator/drivers'
    ],
    cannotAccess: [
      '/business-intelligence',
      '/users/all', 
      '/users/admins',
      '/payments', // Admin-only payments
      '/settings/permissions'
    ],
    dataScope: 'single-organization'
  },
  
  driver: {
    canAccess: [
      '/driver',
      '/driver/documents'
    ],
    cannotAccess: [
      '/dashboard',
      '/business-intelligence',
      '/users/all',
      '/payments',
      '/operator/drivers'
    ],
    dataScope: 'own-data-only'
  }
} as const;
