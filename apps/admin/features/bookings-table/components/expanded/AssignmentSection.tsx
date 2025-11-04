/**
 * AssignmentSection Component - Driver & Vehicle Assignment
 * 
 * Tabbed interface for driver and vehicle assignment details.
 * Shows pending state when not assigned, full details when assigned.
 * 
 * Features:
 * - Overview tab (quick summary)
 * - Driver Details tab (full profile)
 * - Vehicle Details tab (complete specs)
 * - Assignment actions (call, message, track, reassign)
 * 
 * Compliant: <200 lines, TypeScript strict, uses reusable TabPanel
 */

'use client';

import { Car, CheckCircle, Phone, MessageSquare, Navigation, Settings, Clock } from 'lucide-react';
import React from 'react';
import { TabPanel, type Tab } from './TabPanel';
import { PendingAssignmentTab } from './PendingAssignmentTab';
import { AssignmentOverviewTab } from './AssignmentOverviewTab';
import { DriverDetailsTab } from './DriverDetailsTab';
import { VehicleDetailsTab } from './VehicleDetailsTab';
import type { DriverDetails, VehicleDetails } from './AssignmentSection.types';
import styles from './AssignmentSection.module.css';

export type { DriverDetails, VehicleDetails };

export interface AssignmentSectionProps {
  driverId: string | null;
  vehicleId: string | null;
  driverDetails?: DriverDetails | undefined;
  vehicleDetails?: VehicleDetails | undefined;
  assignedAt?: string | undefined;
  assignedBy?: string | undefined;
  onAssign?: (() => void) | undefined;
  onCall?: (() => void) | undefined;
  onMessage?: (() => void) | undefined;
  onTrack?: (() => void) | undefined;
  onReassign?: (() => void) | undefined;
}

export function AssignmentSection({
  driverId,
  vehicleId,
  driverDetails,
  vehicleDetails,
  assignedAt,
  assignedBy,
  onAssign,
  onCall,
  onMessage,
  onTrack,
  onReassign,
}: AssignmentSectionProps) {
  const isAssigned = !!driverId && !!vehicleId;

  // Build tabs
  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '<ClipboardList size={18} strokeWidth={2} />',
      content: isAssigned ? (
        <AssignmentOverviewTab
          driver={driverDetails}
          vehicle={vehicleDetails}
          onCall={onCall}
          onMessage={onMessage}
          onTrack={onTrack}
        />
      ) : (
        <PendingAssignmentTab onAssign={onAssign} />
      ),
    },
    {
      id: 'driver',
      label: 'Driver Details',
      icon: '<User size={18} strokeWidth={2} />',
      disabled: !isAssigned,
      content: driverDetails && <DriverDetailsTab driver={driverDetails} />,
    },
    {
      id: 'vehicle',
      label: 'Vehicle Details',
      icon: '<Car size={18} strokeWidth={2} />',
      disabled: !isAssigned,
      content: vehicleDetails && <VehicleDetailsTab vehicle={vehicleDetails} />,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Car size={18} /> Driver & Vehicle Assignment
          {isAssigned && <span className={styles.badge}><CheckCircle size={14} /> ASSIGNED</span>}
        </h3>
        {isAssigned && (
          <div className={styles.headerActions}>
            <button className={styles.actionButton} onClick={onCall}>
              <Phone size={14} /> Call
            </button>
            <button className={styles.actionButton} onClick={onMessage}>
              <MessageSquare size={14} /> Message
            </button>
            <button className={styles.actionButton} onClick={onTrack}>
              <Navigation size={14} /> Track
            </button>
            <button className={styles.actionButtonSecondary} onClick={onReassign}>
              <Settings size={14} /> Reassign
            </button>
          </div>
        )}
      </div>

      <TabPanel tabs={tabs} defaultTab="overview" variant="default" size="md" />

      {isAssigned && assignedAt && (
        <div className={styles.footer}>
          <Clock size={14} /> Assigned: {assignedAt}
          {assignedBy && ` by ${assignedBy}`}
        </div>
      )}
    </div>
  );
}
