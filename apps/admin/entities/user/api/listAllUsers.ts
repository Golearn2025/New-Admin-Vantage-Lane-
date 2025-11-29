/**
 * User Entity - List All Users API
 * 
 * PERFORMANCE: Uses API endpoint instead of 4 separate client queries
 * ENTERPRISE: Auth + RLS compliant
 */

import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';
import type { UnifiedUser } from '../model/types';

interface UsersListResponse {
  data: UnifiedUser[];
  total: number;
  performance: {
    query_duration_ms: number;
    cache_hit: boolean;
  };
}

/**
 * List all users - ENTERPRISE PERFORMANCE
 * 
 * @returns Promise<UnifiedUser[]> Array of all users with common fields
 */
export async function listAllUsers(): Promise<UnifiedUser[]> {
  // Single API call instead of 4 client queries - PERFORMANCE
  const response = await fetchAuthedJson<UsersListResponse>('/api/users/list');
  
  return response.data;
}
