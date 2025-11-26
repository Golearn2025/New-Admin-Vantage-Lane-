/**
 * Health Domain Types
 * 
 * Type definitions pentru health monitoring system
 * Conform RULES.md: TypeScript strict, exported interfaces
 */

export interface HealthCheck {
  status: 'ok' | 'error';
  message?: string;
}

export interface HealthData {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  responseTime: number;
  checks: {
    env: HealthCheck;
    database: HealthCheck;
    performance?: HealthCheck;
  };
}

export interface PerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  activeUsers: number;
  databaseConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  cacheHitRate: number;
  requestsPerHour: number;
  responseTimeTrend: number;
  requestGrowth: number;
}

export interface SlowRequest {
  id: string;
  method: string;
  path: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
  userAgent?: string;
}

export interface SystemEvent {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface MonitoringAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}
