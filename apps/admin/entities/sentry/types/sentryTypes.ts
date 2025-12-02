/**
 * Sentry Domain Types
 * 
 * Real Sentry API types for monitoring
 * Conform RULES.md: TypeScript strict, exported interfaces
 */

export interface SentryProject {
  id: string;
  slug: string;
  name: string;
  platform: string;
  status: 'active' | 'inactive' | 'pending';
  dateCreated: string;
  team: {
    id: string;
    name: string;
  };
}

export interface SentryError {
  id: string;
  title: string;
  level: 'error' | 'warning' | 'info' | 'fatal';
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  status: 'resolved' | 'unresolved' | 'ignored';
  platform: string;
  permalink: string;
  shortId: string;
  metadata: {
    type: string;
    value: string;
  };
}

export interface SentryStats {
  projectId: string;
  projectName: string;
  errorCount: number;
  transactionCount: number;
  sessionCount: number;
  crashFreeRate: number;
  apdex: number;
  throughput: number;
  errorRate: number;
  p95: number;
  period: '24h' | '7d' | '30d';
}

export interface SentryRelease {
  version: string;
  dateCreated: string;
  dateReleased: string;
  adoptionStages: {
    adopted: number;
    low_adoption: number;
    replaced: number;
  };
  crashFreeRate: {
    sessions: number;
    users: number;
  };
  totalSessions: number;
  totalUsers: number;
}

export interface SentryTransaction {
  id: string;
  transaction: string;
  project: string;
  timestamp: string;
  duration: number;
  op: string;
  user: {
    id?: string;
    email?: string;
  };
  tags: Record<string, string>;
  measurements: Record<string, number>;
}

export interface CrossProjectMetrics {
  adminDashboard: SentryStats | null;
  landingPage: SentryStats | null;
  backendPrices: SentryStats | null;
  driverApp: SentryStats | null;
  clientApp: SentryStats | null;
  totalErrors: number;
  totalUsers: number;
  overallHealth: 'healthy' | 'warning' | 'critical';
}
