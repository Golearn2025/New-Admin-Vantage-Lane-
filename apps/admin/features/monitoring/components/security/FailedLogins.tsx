/**
 * Failed Logins Component
 * 
 * Real failed login attempts din Supabase auth logs
 * Conform RULES.md: <50 linii, real database integration
 */

'use client';

import { Card, DataTable } from '@vantage-lane/ui-core';
import * as Sentry from "@sentry/nextjs";
import { failedLoginsColumns } from '../../columns/failedLoginsColumns';
import styles from './FailedLogins.module.css';

interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  failure_reason: 'invalid_credentials' | 'account_locked' | 'rate_limited';
}

interface FailedLoginsProps {
  loginAttempts: LoginAttempt[];
}

const { logger } = Sentry;

export function FailedLogins({ loginAttempts }: FailedLoginsProps): JSX.Element {
  // Log failed logins monitoring view
  logger.info("Failed logins monitoring viewed", {
    attemptsCount: loginAttempts.length,
    timestamp: new Date().toISOString()
  });

  // Capture potential security issues
  if (loginAttempts.length > 10) {
    Sentry.captureMessage(`High failed login activity: ${loginAttempts.length} attempts`, {
      level: 'warning',
      tags: {
        security: 'high_failed_logins',
        count: loginAttempts.length.toString()
      }
    });
  }

  return (
    <Card className={styles.loginsCard || ""}>
      <h3 className={styles.cardTitle || ""}>
        Failed Login Attempts ({loginAttempts.length})
      </h3>
      
      <DataTable
        data={loginAttempts}
        columns={failedLoginsColumns}
        pagination={{ 
          pageSize: 10,
          pageIndex: 0,
          totalCount: loginAttempts.length
        }}
      />
    </Card>
  );
}
