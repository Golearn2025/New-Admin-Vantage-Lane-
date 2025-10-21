/**
 * Booking Entity - State Machine
 * Business logic for booking status transitions
 * 
 * Valid transitions:
 * NEW → ASSIGNED → IN_PROGRESS → COMPLETED
 *   ↓       ↓            ↓
 * CANCELLED ← ← ← ← ← ← ←
 */

import { BOOKING_STATUS } from '../model/constants';
import type { BookingStatus } from '../model/types';

type Transition = {
  from: BookingStatus;
  to: BookingStatus;
  allowed: boolean;
  reason?: string;
};

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BOOKING_STATUS.NEW]: [BOOKING_STATUS.ASSIGNED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.ASSIGNED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.COMPLETED]: [], // Terminal state
  [BOOKING_STATUS.CANCELLED]: [], // Terminal state
};

/**
 * Check if a status transition is valid
 */
export function canTransition(from: BookingStatus, to: BookingStatus): Transition {
  // Same status is always allowed (no-op)
  if (from === to) {
    return { from, to, allowed: true };
  }
  
  const allowedTransitions = VALID_TRANSITIONS[from] || [];
  const allowed = allowedTransitions.includes(to);
  
  if (!allowed) {
    return {
      from,
      to,
      allowed: false,
      reason: `Cannot transition from ${from} to ${to}. Allowed transitions: ${allowedTransitions.join(', ') || 'none (terminal state)'}`
    };
  }
  
  return { from, to, allowed: true };
}

/**
 * Get all possible next states for a given status
 */
export function getNextStates(currentStatus: BookingStatus): BookingStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}

/**
 * Check if a status is terminal (no further transitions allowed)
 */
export function isTerminalState(status: BookingStatus): boolean {
  return (
    status === BOOKING_STATUS.COMPLETED ||
    status === BOOKING_STATUS.CANCELLED
  );
}

/**
 * Validate status transition and throw error if invalid
 */
export function validateTransition(from: BookingStatus, to: BookingStatus): void {
  const result = canTransition(from, to);
  if (!result.allowed) {
    throw new Error(result.reason || 'Invalid status transition');
  }
}
