/**
 * Failed Logins Table Columns
 * 
 * DataTable columns pentru failed login attempts
 * Conform RULES.md: <50 linii, ui-core components
 */

import { type Column, Badge } from '@vantage-lane/ui-core';
import React, { useMemo } from 'react';
import type { FailedLogin } from '../types';

export const failedLoginsColumns: Column<FailedLogin>[] = [
  {
    id: 'email',
    header: 'Email',
    accessor: (row: FailedLogin) => row.email,
    cell: (row: FailedLogin, value: unknown) => (
      <code className="text-sm">{String(value)}</code>
    )
  },
  {
    id: 'ip_address',
    header: 'IP Address',
    accessor: (row: FailedLogin) => row.ip_address,
    cell: (row: FailedLogin, value: unknown) => (
      <span className="font-mono text-sm">{String(value)}</span>
    )
  },
  {
    id: 'failure_reason',
    header: 'Reason',
    accessor: (row: FailedLogin) => row.failure_reason,
    cell: (row: FailedLogin, value: unknown) => {
      const stringValue = String(value);
      const color = stringValue === 'account_locked' ? 'danger' : 'warning';
      return (
        <Badge color={color}>
          {stringValue.replace('_', ' ').toUpperCase()}
        </Badge>
      );
    }
  },
  {
    id: 'timestamp',
    header: 'Time',
    accessor: (row: FailedLogin) => row.timestamp,
    cell: (row: FailedLogin, value: unknown) => {
      const time = new Date(String(value));
      return (
        <span className="text-sm text-gray-600">
          {time.toLocaleTimeString()}
        </span>
      );
    }
  }
];
