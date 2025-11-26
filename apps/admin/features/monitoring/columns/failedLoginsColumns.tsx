/**
 * Failed Logins Table Columns
 * 
 * DataTable columns pentru failed login attempts
 * Conform RULES.md: <50 linii, ui-core components
 */

import { Badge } from '@vantage-lane/ui-core';

export const failedLoginsColumns = [
  {
    id: 'email',
    header: 'Email',
    accessor: (row: any) => row.email,
    cell: (row: any, value: any) => (
      <code className="text-sm">{value}</code>
    )
  },
  {
    id: 'ip_address',
    header: 'IP Address',
    accessor: (row: any) => row.ip_address,
    cell: (row: any, value: any) => (
      <span className="font-mono text-sm">{value}</span>
    )
  },
  {
    id: 'failure_reason',
    header: 'Reason',
    accessor: (row: any) => row.failure_reason,
    cell: (row: any, value: any) => {
      const color = value === 'account_locked' ? 'danger' : 'warning';
      return (
        <Badge color={color}>
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      );
    }
  },
  {
    id: 'timestamp',
    header: 'Time',
    accessor: (row: any) => row.timestamp,
    cell: (row: any, value: any) => {
      const time = new Date(value);
      return (
        <span className="text-sm text-gray-600">
          {time.toLocaleTimeString()}
        </span>
      );
    }
  }
];
