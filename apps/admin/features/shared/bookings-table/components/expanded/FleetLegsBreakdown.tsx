/**
 * FleetLegsBreakdown Component
 * 
 * Displays detailed breakdown for FLEET bookings with multiple vehicles:
 * - Groups vehicles by category (EXEC, LUX, SUV, VAN)
 * - Shows individual vehicle pricing and driver payout
 * - Displays fleet summary with totals per category
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

import React from 'react';
import type { BookingLeg } from '@vantage-lane/contracts';
import { InfoSection } from './InfoSection';
import styles from './FleetLegsBreakdown.module.css';

interface FleetLegsBreakdownProps {
  legs: BookingLeg[];
  currency?: string;
}

interface CategoryGroup {
  category: string;
  legs: BookingLeg[];
  total: number;
}

export function FleetLegsBreakdown({ legs, currency = 'GBP' }: FleetLegsBreakdownProps) {
  if (!legs || legs.length === 0) {
    return null;
  }

  const formatPrice = (price: string | number | null | undefined): string => {
    if (!price) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return num.toFixed(2);
  };

  // Group legs by vehicle category
  const groupedLegs = legs.reduce((acc, leg) => {
    const category = leg.vehicle_category || 'UNKNOWN';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(leg);
    return acc;
  }, {} as Record<string, BookingLeg[]>);

  const categoryGroups: CategoryGroup[] = Object.entries(groupedLegs).map(([category, categoryLegs]) => ({
    category,
    legs: categoryLegs,
    total: categoryLegs.reduce((sum: number, leg: BookingLeg) => sum + parseFloat(formatPrice(leg.leg_price)), 0)
  }));

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'EXEC': '🔷',
      'LUX': '🔶',
      'SUV': '🟦',
      'VAN': '🟩',
      'UNKNOWN': '⚪'
    };
    return icons[category] || '⚪';
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      'EXEC': 'Executive',
      'LUX': 'Luxury',
      'SUV': 'SUV',
      'VAN': 'Van',
      'UNKNOWN': 'Unknown'
    };
    return names[category] || category;
  };

  const renderVehicle = (leg: BookingLeg) => {
    const legPrice = parseFloat(formatPrice(leg.leg_price));
    const driverPayout = parseFloat(formatPrice(leg.driver_payout));

    return (
      <div key={leg.id} className={styles.vehicleCard}>
        <div className={styles.vehicleHeader}>
          <span className={styles.vehicleNumber}>
            Vehicle #{leg.leg_number}
          </span>
          <span className={styles.vehiclePrice}>£{legPrice.toFixed(2)}</span>
        </div>

        <div className={styles.vehicleGrid}>
          <div className={styles.vehicleInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.infoValue}>{leg.status}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Driver:</span>
              <span className={styles.infoValue}>
                {leg.assigned_driver_id ? '✅ Assigned' : '⏳ Pending'}
              </span>
            </div>
          </div>

          <div className={styles.vehiclePricing}>
            <div className={styles.pricingItem}>
              <span className={styles.pricingLabel}>Driver Payout:</span>
              <span className={styles.pricingValueHighlight}>£{driverPayout.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (group: CategoryGroup) => {
    const icon = getCategoryIcon(group.category);
    const name = getCategoryName(group.category);
    const count = group.legs.length;
    const unitPrice = count > 0 ? group.total / count : 0;

    return (
      <div key={group.category} className={styles.categoryContainer}>
        <div className={styles.categoryHeader}>
          <span className={styles.categoryIcon}>{icon}</span>
          <h3 className={styles.categoryTitle}>
            {name} ({count} vehicle{count !== 1 ? 's' : ''})
          </h3>
          <span className={styles.categoryTotal}>
            {count} × £{unitPrice.toFixed(2)} = £{group.total.toFixed(2)}
          </span>
        </div>

        <div className={styles.vehiclesGrid}>
          {group.legs.map(renderVehicle)}
        </div>
      </div>
    );
  };

  const totalPrice = legs.reduce((sum, leg) => sum + parseFloat(formatPrice(leg.leg_price)), 0);
  const totalDriverPayout = legs.reduce((sum, leg) => sum + parseFloat(formatPrice(leg.driver_payout)), 0);
  const totalVehicles = legs.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🚙 Fleet Breakdown</h2>
        <div className={styles.headerBadges}>
          <span className={styles.badge}>{totalVehicles} Vehicles</span>
          <span className={styles.badgePrimary}>Total: £{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.categories}>
        {categoryGroups.map(renderCategory)}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Vehicles:</span>
            <span className={styles.summaryValue}>{totalVehicles}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Customer Pays:</span>
            <span className={styles.summaryValue}>£{totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Avg per Vehicle:</span>
            <span className={styles.summaryValue}>£{(totalPrice / totalVehicles).toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Driver Payout:</span>
            <span className={styles.summaryValue}>£{totalDriverPayout.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
