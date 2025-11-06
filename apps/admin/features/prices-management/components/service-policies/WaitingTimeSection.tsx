import React from 'react';
import { Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { ServicePolicies } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  policies: ServicePolicies;
  editedPolicies: ServicePolicies;
  setEditedPolicies: React.Dispatch<React.SetStateAction<ServicePolicies>>;
  isEditing: boolean;
}

export function WaitingTimeSection({ policies, editedPolicies, setEditedPolicies, isEditing }: Props) {
  type WaitingRow = {
    id: 'normal' | 'airport' | 'rate';
    policy: string;
    description: string;
  };

  const waitingData: WaitingRow[] = [
    { id: 'normal', policy: 'Free Waiting (Normal)', description: 'Free waiting time for regular pickups' },
    { id: 'airport', policy: 'Free Waiting (Airport)', description: 'Free waiting time for airport pickups' },
    { id: 'rate', policy: 'Waiting Rate', description: 'Charge per hour after free waiting time' },
  ];

  const waitingColumns: Column<WaitingRow>[] = [
    { id: 'policy', header: 'Policy', accessor: (row) => row.policy },
    {
      id: 'value',
      header: 'Value',
      accessor: () => '',
      cell: (row) => {
        if (row.id === 'normal') {
          return isEditing ? (
            <div className={styles.flexRow}>
              <Input
                type="number"
                value={policies.free_waiting_normal_minutes}
                onChange={(e) =>
                  setEditedPolicies({
                    ...editedPolicies,
                    free_waiting_normal_minutes: Number(e.target.value),
                  })
                }
                min={0}
                step={5}
                className={styles.inputNarrow}
              />
              <span>minutes</span>
            </div>
          ) : (
            `${policies.free_waiting_normal_minutes} minutes`
          );
        }
        if (row.id === 'airport') {
          return isEditing ? (
            <div className={styles.flexRow}>
              <Input
                type="number"
                value={policies.free_waiting_airport_minutes}
                onChange={(e) =>
                  setEditedPolicies({
                    ...editedPolicies,
                    free_waiting_airport_minutes: Number(e.target.value),
                  })
                }
                min={0}
                step={5}
                className={styles.inputNarrow}
              />
              <span>minutes</span>
            </div>
          ) : (
            `${policies.free_waiting_airport_minutes} minutes`
          );
        }
        return isEditing ? (
          <div className={styles.flexRow}>
            <span>£</span>
            <Input
              type="number"
              value={policies.waiting_rate_per_hour}
              onChange={(e) =>
                setEditedPolicies({
                  ...editedPolicies,
                  waiting_rate_per_hour: Number(e.target.value),
                })
              }
              min={0}
              step={0.5}
              className={styles.inputNarrow}
            />
            <span>per hour</span>
          </div>
        ) : (
          `£${policies.waiting_rate_per_hour.toFixed(2)} per hour`
        );
      },
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Waiting Time</h3>
      <EnterpriseDataTable<WaitingRow>
        columns={waitingColumns}
        data={waitingData}
        stickyHeader
      />
    </div>
  );
}
