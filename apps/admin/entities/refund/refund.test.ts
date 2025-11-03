/**
 * Refund Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateRefund } from './lib/validateRefund';

describe('Refund Entity', () => {
  it('should validate correct refund data', () => {
    const validRefund = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      bookingId: '223e4567-e89b-12d3-a456-426614174000',
      paymentTransactionId: '323e4567-e89b-12d3-a456-426614174000',
      stripeRefundId: 're_1234567890',
      amount: 50.0,
      currency: 'GBP',
      reason: 'client_cancellation' as const,
      status: 'succeeded' as const,
      failureReason: null,
      metadata: { note: 'Test refund' },
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(() => validateRefund(validRefund)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
