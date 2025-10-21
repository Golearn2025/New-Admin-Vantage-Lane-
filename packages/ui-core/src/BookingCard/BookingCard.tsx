/**
 * BookingCard Component
 * Enterprise-grade React component for displaying booking information
 */

import React from 'react';
import styles from './BookingCard.module.css';
import type { BookingCardProps } from './types';

/**
 * BookingCard - Displays booking details in a card format
 * @param booking - Booking data to display
 * @param onClick - Handler for card click
 * @param onEdit - Handler for edit action
 * @param onAssignDriver - Handler for assign driver action
 * @param className - Additional CSS classes
 */
export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  onEdit,
  onAssignDriver,
  className = '',
}) => {
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      event.preventDefault();
      onClick(booking.id);
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit(booking.id);
    }
  };

  const handleAssignDriver = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onAssignDriver) {
      onAssignDriver(booking.id);
    }
  };

  const getTripTypeIcon = (tripType: string): string => {
    const icons: Record<string, string> = {
      oneway: '→',
      return: '⇄',
      hourly: '🕐',
      fleet: '🚗🚗',
    };
    return icons[tripType] || '→';
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatAmount = (amount: number, currency: string): string => {
    try {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const customerFullName = `${booking.customer.firstName} ${booking.customer.lastName}`;

  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      aria-label={`Booking ${booking.reference}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.reference}>
          <span className={styles.tripIcon}>{getTripTypeIcon(booking.tripType)}</span>
          <span>{booking.reference}</span>
        </div>
        <div className={`${styles.statusBadge} ${styles[booking.bookingStatus]}`}>
          {booking.bookingStatus.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Customer */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Customer</div>
          <div className={styles.customer}>
            <div className={styles.customerName}>{customerFullName}</div>
            <div className={styles.customerContact}>
              {booking.customer.email} • {booking.customer.phone}
            </div>
          </div>
        </div>

        {/* Route */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Route</div>
          <div className={styles.route}>
            <span className={styles.routeLocation}>{booking.route.pickupLabel}</span>
            <span className={styles.routeArrow}>→</span>
            <span className={styles.routeLocation}>{booking.route.dropoffLabel}</span>
          </div>
          <div className={styles.routeDetails}>
            <span>{booking.route.distanceMiles} miles</span>
            <span>•</span>
            <span>{booking.route.durationMin} min</span>
            <span>•</span>
            <span>{formatDate(booking.startAt)}</span>
          </div>
        </div>

        {/* Vehicle */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Vehicle</div>
          <div className={styles.vehicle}>
            <div className={styles.vehicleCategory}>{booking.vehicleCategory}</div>
            <div className={styles.vehicleModel}>
              {booking.vehicleModel} • {booking.passengerCount} passengers
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.payment}>
          <div className={styles.amount}>{formatAmount(booking.totalAmount, booking.currency)}</div>
          <div className={`${styles.paymentStatus} ${styles[booking.paymentStatus]}`}>
            {booking.paymentStatus.toUpperCase()}
          </div>
        </div>

        <div className={styles.actions}>
          {onAssignDriver && (
            <button
              className={styles.actionButton}
              onClick={handleAssignDriver}
              aria-label="Assign driver"
            >
              Assign Driver
            </button>
          )}
          {onEdit && (
            <button className={styles.actionButton} onClick={handleEdit} aria-label="Edit booking">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
