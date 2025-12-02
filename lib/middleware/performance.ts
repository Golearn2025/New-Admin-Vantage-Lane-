/**
 * Performance Monitoring Middleware
 * 
 * Tracks API response times and logs performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export interface PerformanceMetrics {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  userAgent?: string;
}

/**
 * Performance monitoring middleware for API routes
 */
export function withPerformanceMonitoring(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async function performanceWrapper(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Execute the actual handler
      const response = await handler(request);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Prepare metrics
      const userAgent = request.headers.get('user-agent');
      const metrics: PerformanceMetrics = {
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: response.status,
        responseTime,
        timestamp,
        ...(userAgent && { userAgent }),
      };

      // Log performance metrics
      logPerformanceMetrics(metrics);

      // Add performance headers to response
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Timestamp', timestamp);

      // Warn about slow requests
      if (responseTime > 1000) {
        logger.warn('Slow API request detected', {
          path: metrics.path,
          method: metrics.method,
          responseTime: `${responseTime}ms`,
          statusCode: metrics.statusCode,
        });
      }

      return response;
    } catch (error) {
      // Calculate response time even for errors
      const responseTime = Date.now() - startTime;
      
      // Log error with performance data
      logger.error('API request failed', {
        path: request.nextUrl.pathname,
        method: request.method,
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : String(error),
      });

      // Re-throw the error
      throw error;
    }
  };
}

/**
 * Log performance metrics
 */
function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  // Log different levels based on response time
  if (metrics.responseTime > 5000) {
    logger.error('Very slow API response', metrics);
  } else if (metrics.responseTime > 2000) {
    logger.warn('Slow API response', metrics);
  } else if (metrics.responseTime > 1000) {
    logger.info('Moderate API response', metrics);
  } else {
    logger.debug('Fast API response', metrics);
  }

  // Log errors separately
  if (metrics.statusCode >= 500) {
    logger.error('API server error', metrics);
  } else if (metrics.statusCode >= 400) {
    logger.warn('API client error', metrics);
  }
}

/**
 * Get performance statistics for health checks
 */
export function getPerformanceStats(): {
  averageResponseTime: number;
  slowRequests: number;
  errorRate: number;
} {
  // In a real implementation, you'd track these metrics over time
  // For now, return placeholder values
  return {
    averageResponseTime: 250, // ms
    slowRequests: 0,
    errorRate: 0,
  };
}

/**
 * Example usage in API routes:
 * 
 * ```typescript
 * import { withPerformanceMonitoring } from '@/lib/middleware/performance';
 * 
 * export const GET = withPerformanceMonitoring(async (request: NextRequest) => {
 *   // Your API logic here
 *   return NextResponse.json({ data: 'response' });
 * });
 * ```
 */
