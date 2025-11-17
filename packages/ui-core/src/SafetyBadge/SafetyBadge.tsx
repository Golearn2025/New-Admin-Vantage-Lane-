/**
 * SafetyBadge Component
 * 
 * Indicator pentru safety issues și investigation status.
 * 100% design tokens, responsive.
 */

'use client';

import React from 'react';
import { Badge } from '../Badge';
import styles from './SafetyBadge.module.css';

export type SafetySeverity = 1 | 2 | 3 | 4;
export type InvestigationStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface SafetyBadgeProps {
  /** Safety incident severity level */
  severity?: SafetySeverity;
  /** Investigation status */
  status?: InvestigationStatus;
  /** Show penalty applied indicator */
  penaltyApplied?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export function SafetyBadge({
  severity,
  status,
  penaltyApplied = false,
  className,
  onClick,
}: SafetyBadgeProps) {
  // Determine badge props based on severity and status
  const getBadgeProps = () => {
    if (status) {
      switch (status) {
        case 'pending':
          return {
            color: 'warning' as const,
            text: 'Pending Review'
          };
        case 'investigating':
          return {
            color: 'info' as const,
            text: 'Under Investigation'
          };
        case 'resolved':
          return {
            color: 'success' as const,
            text: 'Resolved'
          };
        case 'dismissed':
          return {
            color: 'neutral' as const,
            text: 'Dismissed'
          };
        default:
          return {
            color: 'neutral' as const,
            text: 'Unknown'
          };
      }
    }

    if (severity) {
      switch (severity) {
        case 1:
          return {
            color: 'info' as const,
            text: 'Minor Issue'
          };
        case 2:
          return {
            color: 'warning' as const,
            text: 'Moderate Issue'
          };
        case 3:
          return {
            color: 'danger' as const,
            text: 'Severe Issue'
          };
        case 4:
          return {
            color: 'danger' as const,
            text: 'Critical Issue'
          };
        default:
          return {
            color: 'neutral' as const,
            text: 'Safety Issue'
          };
      }
    }

    return {
      color: 'neutral' as const,
      text: 'Safety'
    };
  };

  const badgeProps = getBadgeProps();
  const containerClasses = [
    styles.container,
    penaltyApplied && styles.withPenalty,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} onClick={onClick}>
      <Badge
        color={badgeProps.color}
        variant="solid"
        size="sm"
      >
        {badgeProps.text}
      </Badge>
      
      {penaltyApplied && (
        <div className={styles.penaltyIndicator}>
          <span className={styles.penaltyText}>Penalty Applied</span>
        </div>
      )}
    </div>
  );
}

SafetyBadge.displayName = 'SafetyBadge';
