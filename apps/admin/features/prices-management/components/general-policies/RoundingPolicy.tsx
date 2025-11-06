import React from 'react';
import { Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Hash, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { GeneralPolicies } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  policies: GeneralPolicies;
  editedPolicies: GeneralPolicies;
  setEditedPolicies: React.Dispatch<React.SetStateAction<GeneralPolicies>>;
  isEditing: boolean;
}

export function RoundingPolicy({ policies, editedPolicies, setEditedPolicies, isEditing }: Props) {
  type RoundingRow = {
    id: 'round_to' | 'direction';
    setting: string;
    description: string;
  };

  const data: RoundingRow[] = [
    { id: 'round_to', setting: 'Round To', description: 'Round final price to nearest multiple' },
    { id: 'direction', setting: 'Direction', description: 'Rounding direction for final price' },
  ];

  const columns: Column<RoundingRow>[] = [
    { id: 'setting', header: 'Setting', accessor: (row) => row.setting },
    {
      id: 'value',
      header: 'Value',
      accessor: () => '',
      cell: (row) => {
        if (row.id === 'round_to') {
          return isEditing ? (
            <div className={styles.flexRow}>
              <span>£</span>
              <Input
                type="number"
                value={policies.rounding.to}
                onChange={(e) =>
                  setEditedPolicies({
                    ...editedPolicies,
                    rounding: {
                      ...editedPolicies.rounding,
                      to: Number(e.target.value),
                    },
                  })
                }
                min={1}
                step={1}
                className={styles.inputNarrow}
              />
            </div>
          ) : (
            `£${policies.rounding.to}`
          );
        }
        return isEditing ? (
          <select
            value={policies.rounding.direction}
            onChange={(e) =>
              setEditedPolicies({
                ...editedPolicies,
                rounding: {
                  ...editedPolicies.rounding,
                  direction: e.target.value as 'up' | 'down' | 'nearest',
                },
              })
            }
            className={styles.selectInput}
          >
            <option value="up">Round Up</option>
            <option value="down">Round Down</option>
            <option value="nearest">Round to Nearest</option>
          </select>
        ) : (
          <span className={`${styles.statusBadge} ${styles.statusBadgePrimary}`}>
            {policies.rounding.direction === 'up' && (
              <span className={styles.flexRow}>
                <ArrowUp className="h-3 w-3" /> Round Up
              </span>
            )}
            {policies.rounding.direction === 'down' && (
              <span className={styles.flexRow}>
                <ArrowDown className="h-3 w-3" /> Round Down
              </span>
            )}
            {policies.rounding.direction === 'nearest' && (
              <span className={styles.flexRow}>
                <ArrowUpDown className="h-3 w-3" /> Round to Nearest
              </span>
            )}
          </span>
        );
      },
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <div className={styles.flexRow}>
          <Hash className="h-4 w-4" />
          Price Rounding
        </div>
      </h3>
      <EnterpriseDataTable<RoundingRow> columns={columns} data={data} stickyHeader />
    </div>
  );
}
