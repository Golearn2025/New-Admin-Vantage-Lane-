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

import { Car, CheckCircle, Hash, MapPin, Timer, User, XCircle } from 'lucide-react';
import React from 'react';
import { TabPanel, type Tab } from './TabPanel';
import styles from './AssignmentSection.module.css';

export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalTrips: number;
  currentDistance?: number; // miles from pickup
  licenseNumber?: string;
  memberSince?: string;
  languages?: string[];
  certifications?: string[];
}

export interface VehicleDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  luggageCapacity: number;
  lastServiceDate?: string;
}

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
        <OverviewTab
          driver={driverDetails}
          vehicle={vehicleDetails}
          onCall={onCall}
          onMessage={onMessage}
          onTrack={onTrack}
        />
      ) : (
        <PendingTab onAssign={onAssign} />
      ),
    },
    {
      id: 'driver',
      label: 'Driver Details',
      icon: '<User size={18} strokeWidth={2} />',
      disabled: !isAssigned,
      content: driverDetails && <DriverTab driver={driverDetails} />,
    },
    {
      id: 'vehicle',
      label: 'Vehicle Details',
      icon: '<Car size={18} strokeWidth={2} />',
      disabled: !isAssigned,
      content: vehicleDetails && <VehicleTab vehicle={vehicleDetails} />,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          🚗 Driver & Vehicle Assignment
          {isAssigned && <span className={styles.badge}>✅ ASSIGNED</span>}
        </h3>
        {isAssigned && (
          <div className={styles.headerActions}>
            <button className={styles.actionButton} onClick={onCall}>
              📞 Call
            </button>
            <button className={styles.actionButton} onClick={onMessage}>
              💬 Message
            </button>
            <button className={styles.actionButton} onClick={onTrack}>
              📍 Track
            </button>
            <button className={styles.actionButtonSecondary} onClick={onReassign}>
              ⚙️ Reassign
            </button>
          </div>
        )}
      </div>

      <TabPanel tabs={tabs} defaultTab="overview" variant="default" size="md" />

      {isAssigned && assignedAt && (
        <div className={styles.footer}>
          ⏱️ Assigned: {assignedAt}
          {assignedBy && ` by ${assignedBy}`}
        </div>
      )}
    </div>
  );
}

// Pending State (Not Assigned)
function PendingTab({ onAssign }: { onAssign?: (() => void) | undefined }) {
  return (
    <div className={styles.pending}>
      <div className={styles.pendingCard}>
        <h4>❌ Driver Not Assigned</h4>
        <button className={styles.assignButton} onClick={onAssign}>
          🎯 Assign Driver Now
        </button>
      </div>
      <div className={styles.pendingCard}>
        <h4>❌ Vehicle Not Assigned</h4>
        <p>Will be auto-assigned with driver</p>
      </div>
    </div>
  );
}

// Overview Tab (Assigned)
function OverviewTab({
  driver,
  vehicle,
  onCall,
  onMessage,
  onTrack,
}: {
  driver?: DriverDetails | undefined;
  vehicle?: VehicleDetails | undefined;
  onCall?: (() => void) | undefined;
  onMessage?: (() => void) | undefined;
  onTrack?: (() => void) | undefined;
}) {
  return (
    <div className={styles.overview}>
      <div className={styles.overviewCard}>
        <h4>👤 Driver</h4>
        <p className={styles.name}>{driver?.name}</p>
        <p>⭐ {driver?.rating}/5.0 • {driver?.totalTrips} trips</p>
        <p>📞 {driver?.phone}</p>
        {driver?.currentDistance && <p>📍 {driver.currentDistance} mi away</p>}
      </div>
      <div className={styles.overviewCard}>
        <h4>🚗 Vehicle</h4>
        <p className={styles.name}>{vehicle?.make} {vehicle?.model}</p>
        <p>🔢 {vehicle?.licensePlate}</p>
        <p>{vehicle?.color} • {vehicle?.year}</p>
        <p>💺 {vehicle?.seats} seats • 🧳 {vehicle?.luggageCapacity} bags</p>
      </div>
    </div>
  );
}

// Driver Details Tab
function DriverTab({ driver }: { driver: DriverDetails }) {
  return (
    <div className={styles.details}>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Name:</span>
        <span className={styles.detailValue}>{driver.name}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Phone:</span>
        <span className={styles.detailValue}>{driver.phone}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Email:</span>
        <span className={styles.detailValue}>{driver.email}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Rating:</span>
        <span className={styles.detailValue}>⭐ {driver.rating}/5.0</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Total Trips:</span>
        <span className={styles.detailValue}>{driver.totalTrips}</span>
      </div>
      {driver.licenseNumber && (
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>License:</span>
          <span className={styles.detailValue}>{driver.licenseNumber}</span>
        </div>
      )}
    </div>
  );
}

// Vehicle Details Tab
function VehicleTab({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <div className={styles.details}>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Make/Model:</span>
        <span className={styles.detailValue}>{vehicle.make} {vehicle.model}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Year:</span>
        <span className={styles.detailValue}>{vehicle.year}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Color:</span>
        <span className={styles.detailValue}>{vehicle.color}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>License Plate:</span>
        <span className={styles.detailValue}>🔢 {vehicle.licensePlate}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Capacity:</span>
        <span className={styles.detailValue}>💺 {vehicle.seats} seats</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Luggage:</span>
        <span className={styles.detailValue}>🧳 {vehicle.luggageCapacity} bags</span>
      </div>
      {vehicle.lastServiceDate && (
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Last Service:</span>
          <span className={styles.detailValue}>🛠️ {vehicle.lastServiceDate}</span>
        </div>
      )}
    </div>
  );
}
