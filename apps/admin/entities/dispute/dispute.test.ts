/**
 * Dispute Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateDispute } from './lib/validateDispute';

describe('Dispute Entity', () => {
  it('should validate correct dispute data', () => {
    const validDispute = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      bookingId: '223e4567-e89b-12d3-a456-426614174000',
      paymentTransactionId: '323e4567-e89b-12d3-a456-426614174000',
      stripeDisputeId: 'dp_1234567890',
      amount: 100.0,
      currency: 'GBP',
      reason: 'general' as const,
      status: 'needs_response' as const,
      evidence: null,
      evidenceDueBy: null,
      isChargeRefundable: true,
      metadata: { source: 'test' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(() => validateDispute(validDispute)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
