/**
 * Environment Variables Validation
 * 
 * Validates all required environment variables at app startup.
 * Throws explicit errors if any variable is missing.
 * 
 * Run this ONCE at app initialization to fail fast.
 */

/**
 * Required environment variables
 */
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

/**
 * Optional environment variables (with warnings)
 */
const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'GOOGLE_MAPS_API_KEY_SERVER',
] as const;

/**
 * Validate environment variables
 * Call this at app startup (in layout.tsx or middleware)
 */
export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
    }
  }

  // Check optional variables (just warnings)
  for (const varName of optionalEnvVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      warnings.push(varName);
    }
  }

  // Throw error for missing required variables
  if (missing.length > 0) {
    const errorMessage = [
      '❌ MISSING REQUIRED ENVIRONMENT VARIABLES:',
      '',
      ...missing.map(v => `  - ${v}`),
      '',
      'Please create .env.local file with required variables.',
      'See .env.example for reference.',
    ].join('\n');

    throw new Error(errorMessage);
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Optional environment variables not set:');
    warnings.forEach(v => console.warn(`  - ${v}`));
    console.warn('Some features may not work correctly.');
  }
}

/**
 * Get typed environment variables
 * Only use this AFTER validateEnv() has been called
 */
export const env = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Google Maps
  googleMaps: {
    clientKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    serverKey: process.env.GOOGLE_MAPS_API_KEY_SERVER,
  },
  
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Validate Supabase URL format
 */
export function validateSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('.supabase.co') || 
           parsed.hostname === 'localhost';
  } catch {
    return false;
  }
}

// Auto-validate on import (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // In development, log error but don't crash during module resolution
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    } else {
      // In production, crash immediately
      throw error;
    }
  }
}
