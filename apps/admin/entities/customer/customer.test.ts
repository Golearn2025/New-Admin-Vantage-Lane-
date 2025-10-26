/**
 * Customer Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateCustomer } from './lib/validateCustomer';

describe('Customer Entity', () => {
  it('should validate correct customer data', () => {
    const validCustomer = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'customer@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+44 20 9876 5432',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    expect(() => validateCustomer(validCustomer)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
