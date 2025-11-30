/**
 * Feature Flags Configuration - STEP 3A
 * Safe switching between old and new implementations
 */

export const FEATURE_FLAGS = {
  // STEP 3A: React Query Integration
  USE_REACT_QUERY_BOOKINGS: true, // Set to true to enable React Query hook
  
  // Future flags
  USE_OPTIMISTIC_UPDATES: false,
  USE_ADVANCED_CACHING: false,
} as const;

/**
 * Get feature flag value with environment override
 */
export function getFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
  // Allow environment override for testing
  const envFlag = process.env[`NEXT_PUBLIC_${flag}`];
  if (envFlag !== undefined) {
    return envFlag === 'true';
  }
  
  return FEATURE_FLAGS[flag];
}
