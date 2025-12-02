/**
 * Secure Client Helper - Alternative to createAdminClient
 * 
 * Folosește createClient() cu user context pentru securitate mai bună
 * Înlocuiește service_role acolo unde nu este necesar
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { getServerRole, type ServerRole } from './server-role';

export interface SecureClientResult {
  supabase: ReturnType<typeof createClient>;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
  role: ServerRole;
}

/**
 * Creează un client Supabase cu user context securizat
 * Înlocuiește createAdminClient() pentru queries normale care pot folosi RLS
 */
export async function createSecureClient(request: NextRequest): Promise<SecureClientResult> {
  const supabase = createClient();
  
  // Obține user-ul autentificat
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User must be authenticated');
  }

  // Obține rolul pentru verificări suplimentare
  const role = await getServerRole(request);
  
  if (role === 'unknown') {
    throw new Error('User role could not be determined');
  }

  return {
    supabase,
    user,
    role,
  };
}

/**
 * Wrapper pentru operații care necesită rol specific
 * Poate fi folosit în server actions și API routes
 */
export async function withRequiredRole<T>(
  request: NextRequest,
  requiredRole: ServerRole | ServerRole[],
  operation: (client: SecureClientResult) => Promise<T>
): Promise<T> {
  const client = await createSecureClient(request);
  
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!allowedRoles.includes(client.role)) {
    throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}, current: ${client.role}`);
  }

  return await operation(client);
}

/**
 * Helper pentru operații admin-only
 */
export async function withAdminClient<T>(
  request: NextRequest,
  operation: (client: SecureClientResult) => Promise<T>
): Promise<T> {
  return withRequiredRole(request, 'admin', operation);
}

/**
 * Helper pentru operații admin sau operator
 */
export async function withAdminOrOperatorClient<T>(
  request: NextRequest,
  operation: (client: SecureClientResult) => Promise<T>
): Promise<T> {
  return withRequiredRole(request, ['admin', 'operator'], operation);
}
