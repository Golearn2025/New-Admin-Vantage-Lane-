/**
 * Zone Fees Tab Component
 * 
 * Displays and allows editing of congestion charges and toll fees
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
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
    return type === 'congestion' ? '🚦' : '🛣️';
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Zone Fees</h2>
      <p className={styles.sectionDescription}>
        Configure congestion charges and toll road fees
      </p>

      {/* Congestion Zones */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🚦 Congestion Charges</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Zone</th>
              <th className={styles.tableHeaderCell}>Code</th>
              <th className={styles.tableHeaderCell}>Fee</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {congestionZones.map(([code, zone]) => {
              const isEditing = editingZone === code;
              const displayFee = isEditing ? (editedFee as ZoneFee) : zone;

              return (
                <tr key={code} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                    {getZoneIcon(zone.type)} {zone.name}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{
                      background: 'var(--color-warning-alpha-20)',
                      color: 'var(--color-warning)'
                    }}>
                      {code.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={displayFee.fee}
                        onChange={(e) =>
                          setEditedFee({ ...editedFee, fee: Number(e.target.value) })
                        }
                        min={0}
                        step={0.5}
                      />
                    ) : (
                      `£${zone.fee.toFixed(2)}`
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{
                      background: 'var(--color-info-alpha-20)',
                      color: 'var(--color-info)'
                    }}>
                      Congestion
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave(code)}
                          disabled={isSaving}
                        >
                          Save
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(code, zone)}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toll Roads */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🛣️ Toll Roads</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Road</th>
              <th className={styles.tableHeaderCell}>Code</th>
              <th className={styles.tableHeaderCell}>Fee</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tollZones.map(([code, zone]) => {
              const isEditing = editingZone === code;
              const displayFee = isEditing ? (editedFee as ZoneFee) : zone;

              return (
                <tr key={code} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                    {getZoneIcon(zone.type)} {zone.name}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{
                      background: 'var(--color-success-alpha-20)',
                      color: 'var(--color-success)'
                    }}>
                      {code.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={displayFee.fee}
                        onChange={(e) =>
                          setEditedFee({ ...editedFee, fee: Number(e.target.value) })
                        }
                        min={0}
                        step={0.5}
                      />
                    ) : (
                      `£${zone.fee.toFixed(2)}`
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{
                      background: 'var(--color-success-alpha-20)',
                      color: 'var(--color-success)'
                    }}>
                      Toll
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave(code)}
                          disabled={isSaving}
                        >
                          Save
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(code, zone)}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
