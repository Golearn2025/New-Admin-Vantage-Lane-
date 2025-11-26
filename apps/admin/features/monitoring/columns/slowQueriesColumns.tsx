/**
 * Slow Queries Table Columns
 * 
 * DataTable columns pentru slow database queries
 * Conform RULES.md: <30 linii
 */

import { Badge } from '@vantage-lane/ui-core';

export const slowQueriesColumns = [
  {
    id: 'query',
    header: 'Query',
    accessor: (row: any) => row.query,
    cell: (row: any, value: any) => (
      <code className="text-xs">{value.substring(0, 50)}...</code>
    )
  },
  {
    id: 'duration',
    header: 'Duration',
    accessor: (row: any) => row.duration,
    cell: (row: any, value: any) => (
      <Badge color={value > 1000 ? 'danger' : 'warning'}>
        {value}ms
      </Badge>
    )
  },
  {
    id: 'timestamp',
    header: 'Time',
    accessor: (row: any) => row.timestamp,
    cell: (row: any, value: any) => (
      <span className="text-sm">{new Date(value).toLocaleTimeString()}</span>
    )
  }
];
