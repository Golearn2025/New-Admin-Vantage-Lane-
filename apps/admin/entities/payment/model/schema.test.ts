import { describe, it, expect } from 'vitest';
import { PaymentSchema } from './schema';

describe('Payment Schema', () => {
  it('validates valid payment', () => {
    expect(() =>
      PaymentSchema.parse({
        id: '11111111-1111-4111-8111-111111111111',
        bookingId: '22222222-2222-4222-8222-222222222222',
        amount: 10000,
        currency: 'GBP',
        status: 'pending',
        paymentMethod: 'CARD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ).not.toThrow();
  });
});
