/**
 * PendingAssignmentTab Component
 * 
 * Displays pending state when driver/vehicle not assigned.
 * Shows call-to-action to assign driver.
 * 
 * Compliant: <200 lines, TypeScript strict, 100% design tokens
 */

'use client';

import { XCircle, Target } from 'lucide-react';
import styles from './AssignmentSection.module.css';

interface PendingAssignmentTabProps {
  onAssign: (() => void) | undefined;
}

export function PendingAssignmentTab({ onAssign }: PendingAssignmentTabProps) {
  return (
    <div className={styles.pending}>
      <div className={styles.pendingCard}>
        <h4><XCircle size={16} /> Driver Not Assigned</h4>
        <button className={styles.assignButton} onClick={onAssign}>
          <Target size={14} /> Assign Driver Now
        </button>
      </div>
      <div className={styles.pendingCard}>
        <h4><XCircle size={16} /> Vehicle Not Assigned</h4>
        <p>Will be auto-assigned with driver</p>
      </div>
    </div>
  );
}
