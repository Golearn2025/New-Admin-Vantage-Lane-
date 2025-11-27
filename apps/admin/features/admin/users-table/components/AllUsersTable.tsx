/**
 * AllUsersTable Component
 *
 * Wrapper around UsersTableBase for all users page
 */

import { UsersTableBase } from '@features/admin/users-table-base';

export function AllUsersTable() {
  return (
    <UsersTableBase
      userType="all"
      title="All Users"
      createLabel="Create User"
      showCreateButton={true}
    />
  );
}
