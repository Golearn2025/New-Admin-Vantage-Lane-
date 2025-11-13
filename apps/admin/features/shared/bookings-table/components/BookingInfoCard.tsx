/**
 * Booking Info Card - Reusable Section Component
 * Compliant: <50 lines
 * Refactored: All inline styles moved to CSS module
 */

import React, { ReactNode } from 'react';
import styles from './BookingInfoCard.module.css';

interface BookingInfoCardProps {
  icon: string;
  title: string;
  children: ReactNode;
}

export function BookingInfoCard({ icon, title, children }: BookingInfoCardProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>
        {icon} {title}
      </h4>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
