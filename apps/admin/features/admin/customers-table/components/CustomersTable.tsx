/**
 * CustomersTable Component
 * 
 * Wrapper around UsersTableBase for customers page
 */

import { UsersTableBase } from '@features/users-table-base';

export function CustomersTable() {
  return (
    <UsersTableBase
      userType="customer"
      title="Customers"
      createLabel="Create Customer"
      showCreateButton={true}
    />
  );
}
