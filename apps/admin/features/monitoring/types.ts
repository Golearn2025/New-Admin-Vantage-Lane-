/**
 * Monitoring Feature - Types
 * 
 * Centralized type definitions for all monitoring components
 */

// Slow Query interface
export interface SlowQuery {
  id: string;
  query: string;
  duration: number; // in milliseconds
  timestamp: string;
  database?: string;
  user?: string;
}

// Failed Login interface (aligned with LoginAttempt)
export interface FailedLogin {
  id: string;
  email: string;
  ip_address: string; // Match database column name
  user_agent: string; // Required for LoginAttempt compatibility
  timestamp: string;
  userAgent?: string;
  failure_reason: 'account_locked' | 'invalid_credentials' | 'rate_limited'; // Match LoginAttempt types
}

// Security Event interface (aligned with SecurityAlert)
export interface SecurityEvent {
  id: string;
  type: 'auth_failure' | 'rate_limit' | 'sql_injection' | 'xss_attempt'; // Match SecurityAlert types
  severity: 'low' | 'medium' | 'high'; // Match SecurityAlert severity levels
  description: string;
  message: string; // Required for SecurityAlert compatibility
  timestamp: string;
  userId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

// Performance Metrics interface
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  threshold?: number;
}

// Project Status interface
export interface ProjectStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  lastCheck: string;
  uptime?: number;
  responseTime?: number;
  errorRate?: number;
}
