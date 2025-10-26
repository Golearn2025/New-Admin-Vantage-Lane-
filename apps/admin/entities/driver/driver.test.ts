/**
 * Driver Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validateDriver } from './lib/validateDriver';

describe('Driver Entity', () => {
  it('should validate correct driver data', () => {
    const validDriver = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'driver@vantage-lane.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '+44 20 5555 1234',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    expect(() => validateDriver(validDriver)).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
