/**
 * BookingPassengerInputs Component
 * 
 * Handles passenger details and additional booking information.
 * - Passenger count
 * - Bag count
 * - Child seats
 * - Flight number (optional)
 * - Notes (optional)
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import { Users, Luggage, Baby, Plane, FileText } from 'lucide-react';
import styles from './BookingCreateForm.module.css';

interface BookingPassengerInputsProps {
  passengers: number;
  bags: number;
  childSeats: number;
  flightNumber: string | undefined;
  notes: string | undefined;
  onPassengersChange: (count: number) => void;
  onBagsChange: (count: number) => void;
  onChildSeatsChange: (count: number) => void;
  onFlightNumberChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export function BookingPassengerInputs({
  passengers,
  bags,
  childSeats,
  flightNumber = '',
  notes = '',
  onPassengersChange,
  onBagsChange,
  onChildSeatsChange,
  onFlightNumberChange,
  onNotesChange,
}: BookingPassengerInputsProps) {
  return (
    <>
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Users size={14} /> Passengers</label>
          <input
            type="number"
            className={styles.input}
            min="1"
            value={passengers}
            onChange={(e) => onPassengersChange(parseInt(e.target.value))}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Luggage size={14} /> Bags</label>
          <input
            type="number"
            className={styles.input}
            min="0"
            value={bags}
            onChange={(e) => onBagsChange(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Baby size={14} /> Child Seats</label>
          <input
            type="number"
            className={styles.input}
            min="0"
            max="4"
            value={childSeats}
            onChange={(e) => onChildSeatsChange(parseInt(e.target.value))}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Plane size={14} /> Flight Number</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. BA123"
            value={flightNumber}
            onChange={(e) => onFlightNumberChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}><FileText size={14} /> Notes</label>
        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="Additional notes or special requests..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </>
  );
}
