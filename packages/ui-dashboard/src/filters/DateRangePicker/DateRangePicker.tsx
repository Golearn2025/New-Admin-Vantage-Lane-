/**
 * DateRangePicker Component - 100% REUSABLE
 *
 * Calendar picker for custom date ranges
 * Dark theme, accessible, keyboard navigation
 *
 * ZERO dependencies on app-specific logic
 */

'use client';

import { useState, useEffect } from 'react';
import type { DateRange } from '../../utils/dateUtils';
import { startOfDay, endOfDay, formatDateForDisplay } from '../../utils/dateUtils';
import styles from './DateRangePicker.module.css';

export interface DateRangePickerProps {
  /** Current date range */
  value?: DateRange;

  /** Callback when date range changes */
  onChange: (dateRange: DateRange) => void;

  /** Minimum allowed date */
  minDate?: Date;

  /** Maximum allowed date */
  maxDate?: Date;

  /** Show time picker (hours/minutes) */
  showTime?: boolean;

  /** Placeholder text */
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  minDate = new Date(2020, 0, 1),
  maxDate = new Date(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showTime: _showTime = false,
  placeholder = 'Select date range',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(value?.start || null);
  const [endDate, setEndDate] = useState<Date | null>(value?.end || null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (value) {
      setStartDate(value.start);
      setEndDate(value.end);
    }
  }, [value]);

  const handleApply = () => {
    if (startDate && endDate) {
      onChange({
        start: startOfDay(startDate),
        end: endOfDay(endDate),
        preset: 'custom',
        label: `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`,
      });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setStartDate(value?.start || null);
    setEndDate(value?.end || null);
    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Complete selection
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return (
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            aria-label="Previous month"
          >
            ←
          </button>
          <span className={styles.monthLabel}>
            {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className={styles.weekdays}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.days}>
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className={styles.dayEmpty} />;
            }

            const isStart = startDate && date.toDateString() === startDate.toDateString();
            const isEnd = endDate && date.toDateString() === endDate.toDateString();
            const isInRange = startDate && endDate && date > startDate && date < endDate;
            const isDisabled = date < minDate || date > maxDate;
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={`${styles.day} ${isStart ? styles.dayStart : ''} ${isEnd ? styles.dayEnd : ''} ${isInRange ? styles.dayInRange : ''} ${isToday ? styles.dayToday : ''}`}
                onClick={() => !isDisabled && handleDateClick(date)}
                disabled={isDisabled}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const displayValue =
    startDate && endDate
      ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
      : placeholder;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.triggerText}>{displayValue}</span>
        <span className={styles.triggerIcon}>📅</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={handleCancel} />
          <div className={styles.dropdown}>
            {renderCalendar()}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.applyButton}
                onClick={handleApply}
                disabled={!startDate || !endDate}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
