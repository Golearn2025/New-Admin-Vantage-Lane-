/**
 * Invoice Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateInvoice } from './lib/validateInvoice';

describe('Invoice Entity', () => {
  it('should validate correct invoice data', () => {
    const validInvoice = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      bookingId: '223e4567-e89b-12d3-a456-426614174000',
      invoiceNumber: 'INV-2025-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      status: 'paid' as const,
      lineItems: [
        {
          description: 'Ride service',
          quantity: 1,
          unitPrice: 50.0,
          amount: 50.0,
        },
      ],
      subtotal: 50.0,
      tax: 10.0,
      total: 60.0,
      currency: 'GBP',
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      voidedAt: null,
      metadata: { note: 'Test invoice' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(() => validateInvoice(validInvoice)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
