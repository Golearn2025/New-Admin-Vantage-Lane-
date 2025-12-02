/**
 * Slow Queries Table Columns
 * 
 * DataTable columns pentru slow database queries
 * Conform RULES.md: <30 linii
 */

import { type Column, Badge } from '@vantage-lane/ui-core';
import React, { useMemo } from 'react';
import type { SlowQuery } from '../types';

export const slowQueriesColumns: Column<SlowQuery>[] = [
  {
    id: 'query',
    header: 'Query',
    accessor: (row: SlowQuery) => row.query,
    cell: (row: SlowQuery, value: unknown) => (
      <code className="text-xs">{String(value).substring(0, 50)}...</code>
    )
  },
  {
    id: 'duration',
    header: 'Duration',
    accessor: (row: SlowQuery) => row.duration,
    cell: (row: SlowQuery, value: unknown) => (
      <Badge color={parseInt(String(value)) > 1000 ? 'danger' : 'warning'}>
        {String(value)}ms
      </Badge>
    )
  },
  {
    id: 'timestamp',
    header: 'Time',
    accessor: (row: SlowQuery) => row.timestamp,
    cell: (row: SlowQuery, value: unknown) => (
      <span className="text-sm">{new Date(String(value)).toLocaleTimeString()}</span>
    )
  }
];
