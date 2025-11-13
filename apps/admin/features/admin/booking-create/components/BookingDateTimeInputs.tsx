/**
 * BookingDateTimeInputs Component
 * 
 * Handles date, time, and hours input for bookings.
 * - Date picker
 * - Time picker
 * - Hours input (only for hourly trips)
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import { Calendar, Clock } from 'lucide-react';
import styles from './BookingCreateForm.module.css';

interface BookingDateTimeInputsProps {
  tripType: string;
  date: string;
  time: string;
  hours: number | undefined;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onHoursChange: (hours: number) => void;
}

export function BookingDateTimeInputs({
  tripType,
  date,
  time,
  hours = 1,
  onDateChange,
  onTimeChange,
  onHoursChange,
}: BookingDateTimeInputsProps) {
  return (
    <>
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Calendar size={14} /> Date</label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}><Clock size={14} /> Time</label>
          <input
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>

      {tripType === 'hourly' && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>⏰ Hours</label>
          <input
            type="number"
            className={styles.input}
            min="1"
            max="12"
            value={hours}
            onChange={(e) => onHoursChange(parseInt(e.target.value))}
          />
        </div>
      )}
    </>
  );
}
