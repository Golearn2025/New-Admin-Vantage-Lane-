import { describe, it, expect } from 'vitest';
import { UserSchema } from './schema';

describe('User Schema', () => {
  it('validates valid user', () => {
    expect(() =>
      UserSchema.parse({
        id: '11111111-1111-4111-8111-111111111111',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'driver',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ).not.toThrow();
  });
});
