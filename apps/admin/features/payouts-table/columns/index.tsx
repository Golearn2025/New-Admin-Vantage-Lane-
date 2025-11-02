/**
 * Payouts Table Columns
 * Column definitions for payouts DataTable
 * < 50 lines - RULES.md compliant
 */

'use client';

import React from 'react';
import type { Column } from '@vantage-lane/ui-core';
import type { Payout } from '../types';

export function getPayoutsColumns(): Column<Payout>[] {
  return [
    {
      id: 'id',
      header: 'Payout ID',
      accessor: (row) => row.id,
      cell: (row, value) => (
        <span style={{ fontFamily: 'monospace' }}>
          {value as string}
        </span>
      ),
    },
    {
      id: 'driverName',
      header: 'Driver',
      accessor: (row) => row.driverName,
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row) => row.amount,
      cell: (row, value) => `£${(Number(value) / 100).toFixed(2)}`,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row) => row.createdAt,
      cell: (row, value) => new Date(value as string).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
  ];
}
