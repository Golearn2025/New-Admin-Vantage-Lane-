'use client';

/**
 * Payments Table Component
 */

import { usePaymentsList } from '../hooks/usePaymentsList';
import { DataTable } from '@vantage-lane/ui-core';

export function PaymentsTable() {
  const { data, loading, error } = usePaymentsList();

  if (loading) return <div>Loading payments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={data}
      columns={[
        { id: 'id', header: 'Payment ID', accessor: (row) => row.id },
        { id: 'bookingId', header: 'Booking ID', accessor: (row) => row.bookingId },
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
