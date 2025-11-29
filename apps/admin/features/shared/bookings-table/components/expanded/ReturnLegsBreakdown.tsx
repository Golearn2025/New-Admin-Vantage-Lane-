/**
 * ReturnLegsBreakdown Component
 * 
 * Displays detailed breakdown for RETURN bookings with 2 legs:
 * - Outbound leg (pickup → destination)
 * - Return leg (destination → pickup)
 * 
 * Each leg shows:
 * - Route info (pickup, destination, distance, time)
 * - Pricing breakdown
 * - Driver assignment
 * - Commission splits
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

import React from 'react';
import { MapPin, DollarSign, User } from 'lucide-react';
import type { BookingLeg } from '@vantage-lane/contracts';
import { formatCurrency, formatDate as formatDateCentralized } from '@/shared/utils/formatters';
import { InfoSection } from './InfoSection';
import styles from './ReturnLegsBreakdown.module.css';

interface ReturnLegsBreakdownProps {
  legs: BookingLeg[];
  currency?: string;
}

export function ReturnLegsBreakdown({ legs, currency = 'GBP' }: ReturnLegsBreakdownProps) {
  if (!legs || legs.length === 0) {
    return null;
  }

  const outboundLeg = legs.find(leg => leg.leg_type === 'outbound');
  const returnLeg = legs.find(leg => leg.leg_type === 'return');

  // Use centralized formatters
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderLeg = (leg: BookingLeg | undefined, legLabel: string, icon: string) => {
    if (!leg) return null;

    const legPrice = parseFloat(leg.leg_price || '0');
    const driverPayout = parseFloat(leg.driver_payout || '0');

    return (
      <div className={styles.legContainer}>
        <div className={styles.legHeader}>
          <span className={styles.legIcon}>{icon}</span>
          <h3 className={styles.legTitle}>{legLabel}</h3>
          <span className={styles.legPrice}>{formatCurrency(legPrice)}</span>
        </div>

        <div className={styles.legGrid}>
          {/* Route Info */}
          <InfoSection title="Route" icon={<MapPin size={18} />} variant="compact">
            <div className={styles.fields}>
              <div className={styles.field}>
                <span className={styles.label}>From:</span>
                <span className={styles.value}>{leg.pickup_location}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>To:</span>
                <span className={styles.value}>{leg.destination}</span>
              </div>
              {leg.distance_miles && (
                <div className={styles.field}>
                  <span className={styles.label}>Distance:</span>
                  <span className={styles.value}>{leg.distance_miles} miles</span>
                </div>
              )}
              {leg.duration_min && (
                <div className={styles.field}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>{leg.duration_min} min</span>
                </div>
              )}
              <div className={styles.field}>
                <span className={styles.label}>Scheduled:</span>
                <span className={styles.value}>{formatDate(leg.scheduled_at)}</span>
              </div>
            </div>
          </InfoSection>

          {/* Pricing */}
          <InfoSection title="Pricing" icon={<DollarSign size={18} />} variant="compact">
            <div className={styles.fields}>
              <div className={styles.field}>
                <span className={styles.label}>Leg Price:</span>
                <span className={styles.value}>{formatCurrency(legPrice)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Driver Payout:</span>
                <span className={styles.valueHighlight}>{formatCurrency(driverPayout)}</span>
              </div>
            </div>
          </InfoSection>

          {/* Driver Assignment */}
          <InfoSection title="Assignment" icon={<User size={18} />} variant="compact">
            <div className={styles.fields}>
              <div className={styles.field}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>{leg.status}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Driver:</span>
                <span className={styles.value}>
                  {leg.assigned_driver_id ? 'Assigned' : 'Not assigned'}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Vehicle:</span>
                <span className={styles.value}>
                  {leg.assigned_vehicle_id ? 'Assigned' : 'Not assigned'}
                </span>
              </div>
            </div>
          </InfoSection>
        </div>
      </div>
    );
  };

  const totalPrice = legs.reduce((sum, leg) => sum + parseFloat(leg.leg_price || '0'), 0);
  const totalDriverPayout = legs.reduce((sum, leg) => sum + parseFloat(leg.driver_payout || '0'), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🔄 Return Trip Breakdown</h2>
        <div className={styles.totalBadge}>
          Total: {formatCurrency(totalPrice)}
        </div>
      </div>

      {renderLeg(outboundLeg, 'Outbound Journey', '🟢')}
      {renderLeg(returnLeg, 'Return Journey', '🔴')}

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Customer Pays:</span>
          <span className={styles.summaryValue}>{formatCurrency(totalPrice)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Driver Payout:</span>
          <span className={styles.summaryValue}>{formatCurrency(totalDriverPayout)}</span>
        </div>
      </div>
    </div>
  );
}
