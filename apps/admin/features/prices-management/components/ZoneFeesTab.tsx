/**
 * Zone Fees Tab Component
 * 
 * Displays and allows editing of congestion charges and toll fees
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { OctagonAlert, Route } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, ZoneFee } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function ZoneFeesTab({ config }: Props) {
  const { updateZoneFee, isSaving } = usePricesManagement();
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editedFee, setEditedFee] = useState<Partial<ZoneFee>>({});

  const zones = Object.entries(config.zone_fees);
  const congestionZones = zones.filter(([_, zone]) => zone.type === 'congestion');
  const tollZones = zones.filter(([_, zone]) => zone.type === 'toll');

  const handleEdit = (code: string, fee: ZoneFee) => {
    setEditingZone(code);
    setEditedFee(fee);
  };

  type ZoneRow = {
    id: string;
    name: string;
    code: string;
    fee: number;
    type: 'congestion' | 'toll';
  };

  const congestionData: ZoneRow[] = congestionZones.map(([code, zone]) => ({
    id: code,
    name: zone.name,
    code: code.toUpperCase(),
    fee: zone.fee,
    type: 'congestion',
  }));

  const tollData: ZoneRow[] = tollZones.map(([code, zone]) => ({
    id: code,
    name: zone.name,
    code: code.toUpperCase(),
    fee: zone.fee,
    type: 'toll',
  }));

  const commonColumns: Column<ZoneRow>[] = [
    {
      id: 'name',
      header: 'Zone/Road',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.flexRow}>
          {getZoneIcon(row.type)}
          {row.name}
        </div>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      accessor: (row) => row.code,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.type === 'congestion' ? styles.statusBadgeWarning : styles.statusBadgeSuccess}`}>
          {row.code}
        </span>
      ),
    },
    {
      id: 'fee',
      header: 'Fee',
      accessor: (row) => row.fee,
      cell: (row) =>
        editingZone === row.id ? (
          <Input
            type="number"
            value={editedFee.fee ?? row.fee}
            onChange={(e) => setEditedFee({ ...editedFee, fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.fee.toFixed(2)}`
        ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row) => row.type,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.type === 'congestion' ? styles.statusBadgeInfo : styles.statusBadgeSuccess}`}>
          {row.type === 'congestion' ? 'Congestion' : 'Toll'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingZone === row.id ? (
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="sm" onClick={() => handleSave(row.id)} disabled={isSaving}>
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              handleEdit(row.id, {
                name: row.name,
                fee: row.fee,
                type: row.type,
              } as ZoneFee)
            }
          >
            Edit
          </Button>
        ),
    },
  ];

  const handleSave = async (code: string) => {
    try {
      await updateZoneFee({
        zoneCode: code,
        fee: editedFee,
      });
      setEditingZone(null);
      setEditedFee({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingZone(null);
    setEditedFee({});
  };

  const getZoneIcon = (type: string) => {
    return type === 'congestion' 
      ? <OctagonAlert className="h-4 w-4" /> 
      : <Route className="h-4 w-4" />;
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Zone Fees</h2>
      <p className={styles.sectionDescription}>
        Configure congestion charges and toll road fees
      </p>

      {/* Congestion Zones */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <div className={styles.flexRow}>
            <OctagonAlert className="h-4 w-4" />
            Congestion Charges
          </div>
        </h3>
        <EnterpriseDataTable columns={commonColumns} data={congestionData} stickyHeader />
      </div>

      {/* Toll Roads */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <div className={styles.flexRow}>
            <Route className="h-4 w-4" />
            Toll Roads
          </div>
        </h3>
        <EnterpriseDataTable columns={commonColumns} data={tollData} stickyHeader />
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Central London Trip</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£80.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Central London Charge:</span>
          <span className={styles.exampleValue}>
            £{config.zone_fees.central_london?.fee.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>ULEZ Charge:</span>
          <span className={styles.exampleValue}>
            £{config.zone_fees.ulez?.fee.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(
              80 + 
              (config.zone_fees.central_london?.fee || 0) + 
              (config.zone_fees.ulez?.fee || 0)
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
