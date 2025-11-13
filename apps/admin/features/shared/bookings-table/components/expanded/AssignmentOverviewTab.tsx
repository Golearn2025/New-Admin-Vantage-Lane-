/**
 * AssignmentOverviewTab Component
 * 
 * Quick summary of assigned driver and vehicle.
 * Shows key details at a glance.
 * 
 * Compliant: <200 lines, TypeScript strict, 100% design tokens
 */

'use client';

import { Car, Hash, MapPin, Phone, Star, User, Users, Briefcase } from 'lucide-react';
import type { DriverDetails, VehicleDetails } from './AssignmentSection.types';
import styles from './AssignmentSection.module.css';

interface AssignmentOverviewTabProps {
  driver: DriverDetails | undefined;
  vehicle: VehicleDetails | undefined;
  onCall: (() => void) | undefined;
  onMessage: (() => void) | undefined;
  onTrack: (() => void) | undefined;
}

export function AssignmentOverviewTab({
  driver,
  vehicle,
}: AssignmentOverviewTabProps) {
  return (
    <div className={styles.overview}>
      <div className={styles.overviewCard}>
        <h4><User size={16} /> Driver</h4>
        <p className={styles.name}>{driver?.name}</p>
        <p><Star size={14} /> {driver?.rating}/5.0 • {driver?.totalTrips} trips</p>
        <p><Phone size={14} /> {driver?.phone}</p>
        {driver?.currentDistance && <p><MapPin size={14} /> {driver.currentDistance} mi away</p>}
      </div>
      <div className={styles.overviewCard}>
        <h4><Car size={16} /> Vehicle</h4>
        <p className={styles.name}>{vehicle?.make} {vehicle?.model}</p>
        <p><Hash size={14} /> {vehicle?.licensePlate}</p>
        <p>{vehicle?.color} • {vehicle?.year}</p>
        <p><Users size={14} /> {vehicle?.seats} seats • <Briefcase size={14} /> {vehicle?.luggageCapacity} bags</p>
      </div>
    </div>
  );
}
