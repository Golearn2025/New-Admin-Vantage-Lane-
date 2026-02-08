/**
 * Airport Fees Tab Component
 * 
 * Displays and allows editing of airport pickup/dropoff fees
 */

'use client';

import type { AirportFee, PricingConfig } from '@entities/pricing';
import type { Column } from '@vantage-lane/ui-core';
import { Button, EnterpriseDataTable, Input, Modal } from '@vantage-lane/ui-core';
import { Plane, Plus, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function AirportFeesTab({ config }: Props) {
  const { updateAirportFee, isSaving } = usePricesManagement();
  const [editingAirport, setEditingAirport] = useState<string | null>(null);
  const [editedFee, setEditedFee] = useState<Partial<AirportFee>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAirportCode, setNewAirportCode] = useState('');
  const [newAirport, setNewAirport] = useState<Partial<AirportFee>>({
    name: '',
    pickup_fee: 0,
    dropoff_fee: 0,
    free_wait_minutes: 0,
  });

  const airports = Object.entries(config.airport_fees);

  const handleEdit = (code: string, fee: AirportFee) => {
    setEditingAirport(code);
    setEditedFee(fee);
  };

  const handleSave = async (code: string) => {
    try {
      await updateAirportFee({
        airportCode: code,
        fee: editedFee,
      });
      setEditingAirport(null);
      setEditedFee({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingAirport(null);
    setEditedFee({});
  };

  type AirportRow = {
    id: string;
    name: string;
    code: string;
    pickupFee: number;
    dropoffFee: number;
    freeWaitMinutes: number;
  };

  const data: AirportRow[] = airports.map(([code, fee]) => ({
    id: code,
    name: fee.name,
    code,
    pickupFee: fee.pickup_fee,
    dropoffFee: fee.dropoff_fee,
    freeWaitMinutes: fee.free_wait_minutes,
  }));

  const columns: Column<AirportRow>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Airport',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.flexRow}>
          <Plane className="h-4 w-4" />
          {row.name}
        </div>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      accessor: (row) => row.code,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${styles.statusBadgePrimary}`}>{row.code}</span>
      ),
    },
    {
      id: 'pickupFee',
      header: 'Pickup Fee',
      accessor: (row) => row.pickupFee,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.pickup_fee ?? row.pickupFee}
            onChange={(e) => setEditedFee({ ...editedFee, pickup_fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.pickupFee}`
        ),
    },
    {
      id: 'dropoffFee',
      header: 'Dropoff Fee',
      accessor: (row) => row.dropoffFee,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.dropoff_fee ?? row.dropoffFee}
            onChange={(e) => setEditedFee({ ...editedFee, dropoff_fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.dropoffFee}`
        ),
    },
    {
      id: 'freeWaitMinutes',
      header: 'Free Wait (min)',
      accessor: (row) => row.freeWaitMinutes,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.free_wait_minutes ?? row.freeWaitMinutes}
            onChange={(e) =>
              setEditedFee({ ...editedFee, free_wait_minutes: Number(e.target.value) })
            }
            min={0}
            step={5}
          />
        ) : (
          `${row.freeWaitMinutes} min`
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingAirport === row.id ? (
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSave(row.id)}
              disabled={isSaving}
            >
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
                pickup_fee: row.pickupFee,
                dropoff_fee: row.dropoffFee,
                free_wait_minutes: row.freeWaitMinutes,
              })
            }
          >
            Edit
          </Button>
        ),
    },
  ], [editingAirport, editedFee, isSaving]);

  return (
    <div className={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h2 className={styles.sectionTitle}>Airport Fees</h2>
          <p className={styles.sectionDescription}>
            Configure pickup and dropoff fees for each airport
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Airport
        </Button>
      </div>

      <EnterpriseDataTable columns={columns} data={data} stickyHeader />

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Central London → Heathrow</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£127.50</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Heathrow Dropoff Fee:</span>
          <span className={styles.exampleValue}>
            £{config.airport_fees.LHR?.dropoff_fee.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(127.5 + (config.airport_fees.LHR?.dropoff_fee || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add New Airport Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Airport"
        size="md"
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Airport Code (IATA)</label>
            <Input
              type="text"
              value={newAirportCode}
              onChange={(e) => setNewAirportCode(e.target.value.toUpperCase())}
              placeholder="e.g., LGW"
              maxLength={4}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Airport Name</label>
            <Input
              type="text"
              value={newAirport.name}
              onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
              placeholder="e.g., London Gatwick"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Pickup Fee (£)</label>
            <Input
              type="number"
              value={newAirport.pickup_fee}
              onChange={(e) => setNewAirport({ ...newAirport, pickup_fee: Number(e.target.value) })}
              min={0}
              step={0.5}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Dropoff Fee (£)</label>
            <Input
              type="number"
              value={newAirport.dropoff_fee}
              onChange={(e) => setNewAirport({ ...newAirport, dropoff_fee: Number(e.target.value) })}
              min={0}
              step={0.5}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Free Wait Time (minutes)</label>
            <Input
              type="number"
              value={newAirport.free_wait_minutes}
              onChange={(e) => setNewAirport({ ...newAirport, free_wait_minutes: Number(e.target.value) })}
              min={0}
              step={5}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', marginTop: 'var(--spacing-4)' }}>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={async () => {
                if (!newAirportCode.trim()) return;
                try {
                  await updateAirportFee({
                    airportCode: newAirportCode.toUpperCase().trim(),
                    fee: newAirport,
                  });
                  setNewAirportCode('');
                  setNewAirport({ name: '', pickup_fee: 0, dropoff_fee: 0, free_wait_minutes: 0 });
                  setIsAddModalOpen(false);
                } catch (error) {
                  console.error('Failed to add airport:', error);
                }
              }} 
              disabled={isSaving || !newAirport.name || !newAirportCode.trim()}
            >
              <Save className="h-4 w-4" /> Add Airport
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
