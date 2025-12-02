/**
 * Driver Assignment Table Columns
 * 
 * Column definitions for EnterpriseDataTable
 * 100% reusable, type-safe
 */

import React, { useMemo } from 'react';
import type { Column } from '@vantage-lane/ui-core';
import { Badge, Button } from '@vantage-lane/ui-core';
import { UserPlus, UserMinus } from 'lucide-react';
import type { DriverAssignment } from '../types';

export function createDriverAssignmentColumns(
  onAssign: (driver: DriverAssignment) => void,
  onUnassign: (driver: DriverAssignment) => void
): Column<DriverAssignment>[] {
  return [
    {
      id: 'driver',
      header: 'Driver',
      accessor: (row) => row.driver_name,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            {row.driver_name}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {row.driver_email}
          </div>
        </div>
      ),
      sortable: true,
      width: '250px',
    },
    {
      id: 'operator',
      header: 'Assigned Operator',
      accessor: (row) => row.operator_name || '',
      cell: (row) => {
        if (!row.operator_name) {
          return <span style={{ color: 'var(--color-text-secondary)' }}>Not assigned</span>;
        }
        return (
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.operator_name}</div>
            {row.operator_email && (
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {row.operator_email}
              </div>
            )}
          </div>
        );
      },
      sortable: true,
      width: '250px',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
      cell: (row) => {
        const statusMap: Record<string, { label: string; color: 'success' | 'neutral' | 'warning' }> = {
          active: { label: 'Active', color: 'success' },
          inactive: { label: 'Inactive', color: 'neutral' },
          pending: { label: 'Pending', color: 'warning' },
        };
        const status = statusMap[row.status];
        if (!status) return <Badge color="neutral">Unknown</Badge>;
        return <Badge color={status.color}>{status.label}</Badge>;
      },
      sortable: true,
      width: '120px',
    },
    {
      id: 'assigned_at',
      header: 'Assigned Date',
      accessor: (row) => row.assigned_at || '',
      cell: (row) => {
        if (!row.assigned_at) return '-';
        return new Date(row.assigned_at).toLocaleDateString('en-GB');
      },
      sortable: true,
      width: '150px',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) => {
        const hasOperator = !!row.operator_id;
        return (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            {hasOperator ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssign(row)}
                >
                  <UserPlus size={16} />
                  Reassign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnassign(row)}
                >
                  <UserMinus size={16} />
                  Unassign
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAssign(row)}
              >
                <UserPlus size={16} />
                Assign
              </Button>
            )}
          </div>
        );
      },
      sortable: false,
    },
  ];
}
