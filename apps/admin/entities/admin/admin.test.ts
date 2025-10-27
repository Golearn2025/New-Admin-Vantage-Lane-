/**
 * Admin Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateAdmin } from './lib/validateAdmin';

describe('Admin Entity', () => {
  it('should validate correct admin data', () => {
    const validAdmin = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'admin@vantage-lane.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+44 20 1234 5678',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    expect(() => validateAdmin(validAdmin)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
