/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Used by Render (or other platforms) to check if the app is healthy.
 * Tests:
 * - App is running
 * - Database connection (Supabase)
 * - Environment variables loaded
 *
 * Returns:
 * - 200 OK if healthy
 * - 503 Service Unavailable if unhealthy
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; message?: string }> = {};

  try {
    // Check 1: Environment variables
    checks.env = checkEnvironment();

    // Check 2: Supabase connection
    checks.database = await checkDatabase();

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Determine overall health
    const isHealthy = Object.values(checks).every((check) => check.status === 'ok');

    if (isHealthy) {
      return NextResponse.json(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          responseTime,
          checks,
        },
        { status: 200 }
      );
    } else {
      logger.warn('Health check failed', { checks });
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          responseTime,
          checks,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    logger.error('Health check error', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        checks,
      },
      { status: 503 }
    );
  }
}

/**
 * Check environment variables
 */
function checkEnvironment(): { status: 'ok' | 'error'; message?: string } {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing: ${missing.join(', ')}`,
    };
  }

  return { status: 'ok' };
}

/**
 * Check database connection (Supabase)
 */
async function checkDatabase(): Promise<{ status: 'ok' | 'error'; message?: string }> {
  try {
    const supabase = await createClient();

    // Simple query to check connection
    // Using a system table that always exists
    const { error } = await supabase.from('bookings').select('id').limit(1).maybeSingle();

    if (error) {
      // If table doesn't exist or RLS blocks, that's still "connected"
      // We just want to verify Supabase is reachable
      if (error.message.includes('JWT') || error.message.includes('permission')) {
        return { status: 'ok', message: 'Connected (RLS active)' };
      }

      return {
        status: 'error',
        message: error.message,
      };
    }

    return { status: 'ok', message: 'Connected' };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
