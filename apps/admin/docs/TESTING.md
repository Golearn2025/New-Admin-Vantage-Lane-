# Testing Strategy

## Testing Pyramid

```
        E2E Tests (10%)
    Integration Tests (20%)
  Unit Tests (70%)
```

## Minimum Testing Requirements per PR

### 1. Contract Test

Pentru fiecare endpoint nou/modificat:

```typescript
// Example: booking creation contract test
describe('POST /api/bookings', () => {
  it('should create booking with valid schema', async () => {
    const response = await request(app).post('/api/bookings').send(validBookingData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchSchema(bookingResponseSchema);
  });
});
```

### 2. RLS Test

Pentru fiecare policy nou/modificat:

```sql
-- Test RLS policy pentru bookings
BEGIN;
  SET ROLE customer_role;
  SET request.jwt.claim.sub TO 'customer-uuid';

  -- Should only return customer's bookings
  SELECT COUNT(*) FROM bookings; -- Should be limited
ROLLBACK;
```

### 3. Component Test

Pentru fiecare UI component nou/modificat:

```typescript
// Example: BookingCard component test
describe('BookingCard', () => {
  it('should display booking information correctly', () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText(mockBooking.id)).toBeInTheDocument();
    expect(screen.getByText(mockBooking.status)).toBeInTheDocument();
  });
});
```

## Test Categories

### Unit Tests (Jest + React Testing Library)

- **Components**: behavior și rendering
- **Hooks**: custom hooks logic
- **Utils**: pure functions și helpers
- **Coverage**: minimum 80% per module

### Integration Tests

- **API routes**: request/response flow
- **Database operations**: CRUD operations
- **Authentication**: login/logout flow
- **Authorization**: permission checks

### E2E Tests (Playwright)

- **Critical user journeys**: happy path scenarios
- **Cross-browser**: Chrome, Firefox, Safari
- **Mobile responsiveness**: tablet și phone
- **Performance**: Core Web Vitals

## Testing Utilities

### Mock Data

```typescript
// apps/admin/tests/mocks/booking.ts
export const mockBooking = {
  id: 'booking-123',
  status: 'pending',
  customer_id: 'user-123',
  created_at: new Date().toISOString(),
};
```

### Test Helpers

```typescript
// apps/admin/tests/helpers/auth.ts
export const authenticatedUser = (role: UserRole) => ({
  sub: 'user-123',
  role,
  email: 'test@example.com',
});
```

## Database Testing

### Test Database Setup

- **Separate test DB**: isolated de development
- **Schema migrations**: automated în test environment
- **Seed data**: consistent test fixtures
- **Cleanup**: după fiecare test suite

### RLS Testing Framework

```typescript
// Test helper pentru RLS
const testRLSPolicy = async (policy: string, role: string, expectedCount: number) => {
  await db.raw('SET ROLE ?', [role]);
  const result = await db(policy.table).count();
  expect(result[0].count).toBe(expectedCount);
};
```

## Performance Testing

### Load Testing

- **Concurrent users**: 100+ simultaneous
- **Response times**: p95 <200ms
- **Error rates**: <1% for normal load
- **Stress testing**: until breaking point

### Frontend Performance

```typescript
// Lighthouse CI configuration
module.exports = {
  ci: {
    collect: {
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

## Continuous Testing

### CI Pipeline

1. **Lint & Type Check**: ESLint + TypeScript
2. **Unit Tests**: Jest cu coverage report
3. **Integration Tests**: API și database tests
4. **E2E Tests**: critical flows only
5. **Performance Tests**: Lighthouse CI

### Quality Gates

- **Unit tests**: 80%+ coverage
- **Integration tests**: all API endpoints covered
- **E2E tests**: critical user journeys pass
- **Performance**: meet Core Web Vitals targets
