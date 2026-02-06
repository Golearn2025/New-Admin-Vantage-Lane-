/**
 * Bookings Columns - Services & Assignment Cell Renderers
 * Separated from cells-details.tsx for RULES.md compliance (<200 lines)
 */

'use client';

import { Car, Gift, Phone, ShieldCheck, User } from 'lucide-react';
import styles from './columns.module.css';
import { formatDate, formatServiceName, formatTime } from './helpers';
import type { BookingColumn } from './schema';

export const getServicesColumn = (): BookingColumn => ({
  id: 'services',
  header: 'Services',
  accessor: (row) => (row.paid_services || []).length + (row.free_services || []).length,
  width: '130px',
  align: 'left',
  resizable: true,
  sortable: false,
  cell: (row) => {
    const paid = row.paid_services || [];
    const free = row.free_services || [];
    const hasServices = paid.length > 0 || free.length > 0;

    if (!hasServices) {
      return <div className={styles.servicesEmpty}>No extras</div>;
    }

    return (
      <div className={styles.servicesCell}>
        {paid.map((s, i) => (
          <div key={`p-${i}`} className={styles.servicePaid}>
            <ShieldCheck size={12} />
            <span>{formatServiceName(s.service_code)}</span>
            <span className={styles.servicePrice}>£{(s.unit_price * s.quantity).toFixed(2)}</span>
          </div>
        ))}
        {free.map((s, i) => (
          <div key={`f-${i}`} className={styles.serviceFree}>
            <Gift size={12} />
            <span>{formatServiceName(s.service_code)}</span>
            {s.notes && <span className={styles.serviceNotes}>({s.notes})</span>}
          </div>
        ))}
      </div>
    );
  },
});

export const getAssignmentColumn = (): BookingColumn => ({
  id: 'assignment',
  header: 'Assignment',
  accessor: (row) => row.driver_name,
  width: '160px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => {
    const hasDriver = !!row.driver_name;
    const hasVehicle = !!row.vehicle_make || !!row.vehicle_model_name;

    if (!hasDriver && !hasVehicle) {
      return (
        <div className={styles.assignmentEmpty}>
          <span>Unassigned</span>
        </div>
      );
    }

    return (
      <div className={styles.assignmentCell}>
        {hasDriver && (
          <>
            <div className={styles.assignmentDriver}>
              <User size={13} />
              <span className={styles.assignmentDriverName}>{row.driver_name}</span>
            </div>
            {row.driver_phone && (
              <div className={styles.assignmentDetail}>
                <Phone size={12} />
                <span>{row.driver_phone}</span>
              </div>
            )}
          </>
        )}
        {hasVehicle && (
          <div className={styles.assignmentVehicle}>
            <Car size={13} />
            <span>{[row.vehicle_make, row.vehicle_model_name].filter(Boolean).join(' ')}</span>
            {row.vehicle_year && <span>({row.vehicle_year})</span>}
          </div>
        )}
        {row.vehicle_color && (
          <div className={styles.assignmentDetail}>
            <span>{row.vehicle_color}</span>
          </div>
        )}
        {row.vehicle_plate && (
          <div className={styles.assignmentPlate}>{row.vehicle_plate}</div>
        )}
        {row.assigned_at && (
          <div className={styles.assignmentTime}>
            <span>Assigned: {formatDate(row.assigned_at)} {formatTime(row.assigned_at)}</span>
          </div>
        )}
      </div>
    );
  },
});
