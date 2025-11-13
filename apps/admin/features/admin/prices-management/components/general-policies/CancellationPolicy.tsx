import React from 'react';
import { Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { X } from 'lucide-react';
import type { GeneralPolicies } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  policies: GeneralPolicies;
  editedPolicies: GeneralPolicies;
  setEditedPolicies: React.Dispatch<React.SetStateAction<GeneralPolicies>>;
  isEditing: boolean;
}

export function CancellationPolicy({ policies, editedPolicies, setEditedPolicies, isEditing }: Props) {
  type CancellationRow = {
    id: 'free_hours' | 'charge_rate';
    setting: string;
    description: string;
  };

  const data: CancellationRow[] = [
    { id: 'free_hours', setting: 'Free Cancellation', description: 'Free cancellation window before trip' },
    { id: 'charge_rate', setting: 'Cancellation Charge', description: 'Charge rate for late cancellations' },
  ];

  const columns: Column<CancellationRow>[] = [
    { id: 'setting', header: 'Setting', accessor: (row) => row.setting },
    {
      id: 'value',
      header: 'Value',
      accessor: () => '',
      cell: (row) => {
        if (row.id === 'free_hours') {
          return isEditing ? (
            <div className={styles.flexRow}>
              <Input
                type="number"
                value={policies.cancellation.free_hours}
                onChange={(e) =>
                  setEditedPolicies({
                    ...editedPolicies,
                    cancellation: {
                      ...editedPolicies.cancellation,
                      free_hours: Number(e.target.value),
                    },
                  })
                }
                min={0}
                step={1}
                className={styles.inputNarrow}
              />
              <span>hours before</span>
            </div>
          ) : (
            `${policies.cancellation.free_hours} hours before`
          );
        }
        return isEditing ? (
          <div className={styles.flexRow}>
            <Input
              type="number"
              value={policies.cancellation.charge_rate * 100}
              onChange={(e) =>
                setEditedPolicies({
                  ...editedPolicies,
                  cancellation: {
                    ...editedPolicies.cancellation,
                    charge_rate: Number(e.target.value) / 100,
                  },
                })
              }
              min={0}
              max={100}
              step={5}
              className={styles.inputNarrow}
            />
            <span>% of trip cost</span>
          </div>
        ) : (
          `${(policies.cancellation.charge_rate * 100).toFixed(0)}% of trip cost`
        );
      },
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <div className={styles.flexRow}>
          <X className="h-4 w-4" />
          Cancellation Policy
        </div>
      </h3>
      <EnterpriseDataTable<CancellationRow> columns={columns} data={data} stickyHeader />
    </div>
  );
}
