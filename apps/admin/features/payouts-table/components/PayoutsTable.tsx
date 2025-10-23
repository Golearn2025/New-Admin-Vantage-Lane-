'use client';

/**
 * Payouts Table Component
 */

import { usePayoutsList } from '../hooks/usePayoutsList';
import { DataTable } from '@vantage-lane/ui-core';

export function PayoutsTable() {
  const { data, loading, error } = usePayoutsList();

  if (loading) return <div>Loading payouts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={data}
      columns={[
        { id: 'id', header: 'Payout ID', accessor: (row) => row.id },
        { id: 'driverId', header: 'Driver ID', accessor: (row) => row.driverId },
        {
          id: 'amount',
          header: 'Amount',
          accessor: (row) => `£${(row.amount / 100).toFixed(2)}`,
        },
        { id: 'status', header: 'Status', accessor: (row) => row.status },
        {
          id: 'createdAt',
          header: 'Created',
          accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
      ]}
    />
  );
}
