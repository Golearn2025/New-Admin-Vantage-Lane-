/**
 * BookingRouteInputs Component
 * 
 * Handles pickup/dropoff location inputs and displays calculated distance.
 * - GooglePlacesInput for pickup (always visible)
 * - GooglePlacesInput for dropoff (hidden for hourly trips)
 * - Distance/Duration display (hidden for hourly trips)
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import { MapPin, Target, Ruler, Timer } from 'lucide-react';
import { GooglePlacesInput } from './GooglePlacesInput';
import styles from './BookingCreateForm.module.css';

interface BookingRouteInputsProps {
  tripType: string;
  pickupText: string;
  dropoffText: string;
  distanceMiles: number | null;
  durationMinutes: number | null;
  isCalculating: boolean;
  onPickupChange: (value: string, placeData?: { lat: number; lng: number; formattedAddress: string }) => void;
  onDropoffChange: (value: string, placeData?: { lat: number; lng: number; formattedAddress: string }) => void;
}

export function BookingRouteInputs({
  tripType,
  pickupText,
  dropoffText,
  distanceMiles,
  durationMinutes,
  isCalculating,
  onPickupChange,
  onDropoffChange,
}: BookingRouteInputsProps) {
  const isHourly = tripType === 'hourly';
  const showDistance = !isHourly && (distanceMiles || isCalculating);

  return (
    <>
      <GooglePlacesInput
        value={pickupText}
        onChange={onPickupChange}
        label="Pickup Location"
        icon={<MapPin size={18} strokeWidth={2} />}
        placeholder="Search for pickup location..."
      />

      {!isHourly && (
        <GooglePlacesInput
          value={dropoffText}
          onChange={onDropoffChange}
          label="Dropoff Location"
          icon={<Target size={14} />}
          placeholder="Search for dropoff location..."
        />
      )}

      {showDistance && (
        <div className={styles.distanceInfo}>
          <div className={styles.distanceCard}>
            <span className={styles.distanceIcon}><Ruler size={18} strokeWidth={2} /></span>
            <div className={styles.distanceContent}>
              <span className={styles.distanceLabel}>Distance</span>
              <span className={styles.distanceValue}>
                {isCalculating ? 'Calculating...' : `${distanceMiles?.toFixed(2)} miles`}
              </span>
            </div>
          </div>
          <div className={styles.distanceCard}>
            <span className={styles.distanceIcon}><Timer size={18} strokeWidth={2} /></span>
            <div className={styles.distanceContent}>
              <span className={styles.distanceLabel}>Duration</span>
              <span className={styles.distanceValue}>
                {isCalculating ? 'Calculating...' : `${durationMinutes} min`}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
