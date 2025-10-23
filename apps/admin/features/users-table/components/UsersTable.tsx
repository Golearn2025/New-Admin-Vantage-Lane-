'use client';

/**
 * Users Table Component
 */

import { useUsersList } from '../hooks/useUsersList';
import { DataTable } from '@vantage-lane/ui-core';

export function UsersTable() {
  const { data, loading, error } = useUsersList();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={data}
      columns={[
        { id: 'id', header: 'User ID', accessor: (row) => row.id },
        { id: 'email', header: 'Email', accessor: (row) => row.email },
        {
          id: 'name',
          header: 'Name',
          accessor: (row) => `${row.firstName} ${row.lastName}`,
        },
        { id: 'role', header: 'Role', accessor: (row) => row.role },
        {
          id: 'createdAt',
          header: 'Created',
          accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
      ]}
    />
  );
}
