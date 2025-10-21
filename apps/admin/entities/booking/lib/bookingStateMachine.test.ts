/**
 * Booking State Machine - Tests
 */

import { describe, it, expect } from 'vitest';
import { canTransition, getNextStates, isTerminalState, validateTransition } from './bookingStateMachine';
import { BOOKING_STATUS } from '../model/constants';

describe('Booking State Machine', () => {
  describe('canTransition', () => {
    it('allows NEW → ASSIGNED', () => {
      const result = canTransition(BOOKING_STATUS.NEW, BOOKING_STATUS.ASSIGNED);
      expect(result.allowed).toBe(true);
    });

    it('allows NEW → CANCELLED', () => {
      const result = canTransition(BOOKING_STATUS.NEW, BOOKING_STATUS.CANCELLED);
      expect(result.allowed).toBe(true);
    });

    it('allows ASSIGNED → IN_PROGRESS', () => {
      const result = canTransition(BOOKING_STATUS.ASSIGNED, BOOKING_STATUS.IN_PROGRESS);
      expect(result.allowed).toBe(true);
    });

    it('allows IN_PROGRESS → COMPLETED', () => {
      const result = canTransition(BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.COMPLETED);
      expect(result.allowed).toBe(true);
    });

    it('blocks COMPLETED → ASSIGNED', () => {
      const result = canTransition(BOOKING_STATUS.COMPLETED, BOOKING_STATUS.ASSIGNED);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Cannot transition');
    });

    it('allows same status transition', () => {
      const result = canTransition(BOOKING_STATUS.NEW, BOOKING_STATUS.NEW);
      expect(result.allowed).toBe(true);
    });
  });

  describe('getNextStates', () => {
    it('returns correct next states for NEW', () => {
      const states = getNextStates(BOOKING_STATUS.NEW);
      expect(states).toEqual([BOOKING_STATUS.ASSIGNED, BOOKING_STATUS.CANCELLED]);
    });

    it('returns empty array for terminal states', () => {
      expect(getNextStates(BOOKING_STATUS.COMPLETED)).toEqual([]);
      expect(getNextStates(BOOKING_STATUS.CANCELLED)).toEqual([]);
    });
  });

  describe('isTerminalState', () => {
    it('identifies COMPLETED as terminal', () => {
      expect(isTerminalState(BOOKING_STATUS.COMPLETED)).toBe(true);
    });

    it('identifies CANCELLED as terminal', () => {
      expect(isTerminalState(BOOKING_STATUS.CANCELLED)).toBe(true);
    });

    it('identifies NEW as non-terminal', () => {
      expect(isTerminalState(BOOKING_STATUS.NEW)).toBe(false);
    });
  });

  describe('validateTransition', () => {
    it('does not throw for valid transition', () => {
      expect(() => {
        validateTransition(BOOKING_STATUS.NEW, BOOKING_STATUS.ASSIGNED);
      }).not.toThrow();
    });

    it('throws for invalid transition', () => {
      expect(() => {
        validateTransition(BOOKING_STATUS.COMPLETED, BOOKING_STATUS.NEW);
      }).toThrow('Cannot transition');
    });
  });
});
