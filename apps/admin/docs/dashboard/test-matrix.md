# Test Matrix — QA & Validation

**Version:** 1.0.0  
**Purpose:** Comprehensive test coverage for CardKit, ChartKit, și dashboard integration.

---

## 1. Test Categories

| Category | Tool | Coverage Target | Pass Criteria |
|----------|------|-----------------|---------------|
| **A11y** | axe-core, NVDA, VoiceOver | WCAG 2.1 AA | 0 violations |
| **Visual** | Chromatic, Percy | Snapshots per state | 100% match or approved diff |
| **Performance** | Lighthouse CI | FCP, LCP, TBT | Card <200ms, Chart <400ms |
| **Unit** | Jest, RTL | Props, state, formatters | 100% branch coverage |
| **Integration** | Jest, MSW | API → UI flow | All scenarios covered |
| **E2E** | Playwright | User journeys | Critical paths only |

---

## 2. Accessibility Tests

### Automated (axe-core)

**Test Scope:**
- All CardKit variants (Basic, Trend, MetricPair, Target, Alert)
- All ChartKit types (Bar, Line, Area, Donut, Waterfall)
- All states (loading, success, empty, error, N/A)

**Rules Checked:**
- Color contrast ≥4.5:1 (WCAG AA)
- Focus indicators visible
- ARIA labels present and descriptive
- Keyboard navigable (no mouse traps)
- Form controls accessible
- Landmarks present (`role="status"`, `role="alert"`)

**Command:**
```bash
npm run test:a11y
# Runs axe-core against all component states
```

**Pass Criteria:** 0 violations across all components × all states.

---

### Manual (Screen Reader)

**Tools:** NVDA (Windows), VoiceOver (Mac)

**Test Cases:**

| Component | State | Expected Announcement |
|-----------|-------|----------------------|
| KPI.Basic | success | "GMV Completed: £1,234.56, This month" |
| KPI.Basic | loading | "GMV Completed, Loading data" (aria-busy) |
| KPI.Basic | empty | "GMV Completed, No data for selected period" |
| KPI.Basic | error | "Error: Failed to load GMV Completed" |
| KPI.Basic | N/A | "GMV Completed: Not applicable, Feature disabled" |
| Bar.Basic | success | "Bar chart: Daily Completed Bookings, 30 data points" |
| Bar.Basic | keyboard | Navigate bars with arrows, Enter shows tooltip |
| Bar.Basic | fallback | Hidden table with data accessible when chart fails |
| Donut.Snapshot | legend | "Toggle Completed bookings, currently shown" |
| ChartKit | reduced-motion | All animations disabled, instant transitions |

**Pass Criteria:**
- All states announced correctly
- Keyboard navigation fluid (Tab, Arrow keys, Enter, Esc)
- Tooltip content accessible via `aria-describedby`
- Fallback `<table>` present with chart data (hidden unless error)
- `prefers-reduced-motion` respected (no animations)

---

### Keyboard Navigation

**Test Sequence:**

1. **Tab** into dashboard → First card receives focus (visible ring)
2. **Tab** through cards → Focus moves sequentially
3. **Enter** on card → Opens detail modal (if interactive)
4. **Tab** into chart → Chart container focused
5. **Arrow keys** → Navigate bars/points
6. **Enter** → Show tooltip for focused element
7. **Esc** → Dismiss tooltip
8. **Tab** out → Focus moves to next chart

**Pass Criteria:**
- Focus order logical (cards top-to-bottom, left-to-right)
- Focus ring visible (2px offset, primary color)
- No keyboard traps
- All interactive elements reachable

---

## 3. Visual Regression Tests

### Tool: Chromatic (or Percy)

**Snapshot Matrix:**

| Component | Variants | States | Total Snapshots |
|-----------|----------|--------|-----------------|
| KPI.Basic | compact, regular | 5 (loading, success, empty, error, N/A) | 10 |
| KPI.Trend | compact, regular | 5 | 10 |
| KPI.MetricPair | horizontal, vertical | 5 | 10 |
| KPI.Target | compact, regular | 5 | 10 |
| KPI.Alert | compact, regular | 6 (+ alert triggered) | 12 |
| Bar.Basic | default | 5 | 5 |
| Bar.Stacked | default | 5 | 5 |
| Line.Basic | default | 5 | 5 |
| Area.Cumulative | default | 5 | 5 |
| Donut.Snapshot | default | 5 | 5 |
| Waterfall.Financial | default | 5 | 5 |
| **TOTAL** | | | **82 snapshots** |

**Breakpoints Tested:**
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

**Total with Breakpoints:** 82 × 3 = **246 snapshots**

**Pass Criteria:**
- 100% match OR approved visual diff
- No unintended layout shifts
- Colors match design tokens

---

## 4. Performance Tests

### Lighthouse CI

**Metrics:**

| Metric | Card Target | Chart Target | Measurement |
|--------|-------------|--------------|-------------|
| **FCP** (First Contentful Paint) | <200ms | <400ms | Time to skeleton |
| **LCP** (Largest Contentful Paint) | <200ms | <400ms | Time to data render |
| **TBT** (Total Blocking Time) | <50ms | <100ms | Main thread blocking |
| **CLS** (Cumulative Layout Shift) | 0 | <0.1 | Layout stability |
| **FPS** (Scroll) | ≥55fps | ≥55fps | Smooth scrolling |

**Test Scenarios:**

1. **Card Render:**
   - Load dashboard with 7 cards
   - Measure FCP for first card
   - Pass: <200ms from mount to skeleton visible

2. **Chart Render (90 bars):**
   - Load Bar.Basic with 90 bars
   - Measure LCP for chart fully rendered
   - Pass: <400ms

3. **Chart Render (365 points):**
   - Load Line.Basic with 365 points
   - Measure LCP
   - Pass: <400ms

4. **Scroll Performance:**
   - Scroll dashboard with 7 cards + 4 charts
   - Measure FPS via Chrome DevTools
   - Pass: ≥55fps, no jank

5. **Hover Interaction:**
   - Hover over 20 bars sequentially
   - Measure layout shift (CLS)
   - Pass: CLS <0.1

**Command:**
```bash
npm run test:perf
# Runs Lighthouse CI with custom budgets
```

**Pass Criteria:**
- All metrics green
- No performance regressions vs baseline

---

## 5. Unit Tests (Jest + React Testing Library)

### Props Validation

**Test: Unit Mismatch Error**

```typescript
describe('CardKit - Unit Mismatch', () => {
  it('throws UnitMismatchError when API unit differs from spec', () => {
    const spec: CardSpec = {
      key: 'gmv_completed',
      unit: 'GBP_pence',
      // ... other props
    };

    // Mock API returns count instead of GBP_pence
    mockAPI.mockResolvedValue({
      gmv_completed: 100,
      unit: 'count' // ❌ Mismatch!
    });

    render(<CardKit spec={spec} />);

    // Expect error state with specific message
    expect(screen.getByText(/Unit mismatch/i)).toBeInTheDocument();
    expect(screen.getByText(/expected GBP_pence, got count/i)).toBeInTheDocument();
  });
});
```

**Test: Null Value Handling**

```typescript
describe('CardKit - Null Values', () => {
  it('renders N/A when value is null and fallback provided', () => {
    const spec: CardSpec = {
      value: null,
      unit: 'GBP_pence',
      fallback_reason: 'No refunds recorded'
    };

    render(<MetricCard {...spec} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.getByText('No refunds recorded')).toBeInTheDocument();
  });
});
```

**Test: Pence Conversion**

```typescript
describe('Formatters', () => {
  it('converts pence to GBP correctly', () => {
    expect(formatCurrency(12345)).toBe('£123.45');
    expect(formatCurrency(100)).toBe('£1.00');
    expect(formatCurrency(0)).toBe('£0.00');
    expect(formatCurrency(null)).toBe('N/A');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-12345)).toBe('-£123.45');
  });
});
```

---

### State Transitions

```typescript
describe('CardKit - State Machine', () => {
  it('transitions: idle → loading → success', async () => {
    mockAPI.mockResolvedValue({ value: 100, unit: 'count' });

    render(<CardKit spec={...} />);

    // Initially loading
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.getByRole('status', { busy: true })).toBeInTheDocument();

    // After fetch
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('transitions: idle → loading → empty', async () => {
    mockAPI.mockResolvedValue({ data: [], code: 'NO_DATA' });

    render(<CardKit spec={...} />);

    await waitFor(() => {
      expect(screen.getByText('No data for selected period')).toBeInTheDocument();
    });
  });

  it('transitions: idle → loading → error → retry → loading', async () => {
    mockAPI
      .mockRejectedValueOnce({ code: 'DATABASE_ERROR' })
      .mockResolvedValueOnce({ value: 100 });

    render(<CardKit spec={...} />);

    // Error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    // Click retry
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    // Success after retry
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('handles RATE_LIMITED with Retry-After countdown', async () => {
    mockAPI.mockRejectedValue({
      code: 'RATE_LIMITED',
      message: 'Too many requests',
      meta: { retry_after: 10 }  // 10 seconds
    });

    render(<CardKit spec={...} />);

    await waitFor(() => {
      expect(screen.getByText(/Too many requests/i)).toBeInTheDocument();
    });

    // Retry button initially disabled
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeDisabled();

    // Countdown visible
    expect(screen.getByText(/Retry available in 10s/i)).toBeInTheDocument();

    // After 10 seconds, button enabled
    await waitFor(() => {
      expect(retryButton).not.toBeDisabled();
    }, { timeout: 11000 });
  });
});
```

---

### RBAC Tests

```typescript
describe('CardKit - RBAC', () => {
  it('throws error when operator accesses without organization_id', async () => {
    mockAuth.mockReturnValue({ role: 'operator', organization_id: null });

    render(<CardKit spec={...} />);

    await waitFor(() => {
      expect(screen.getByText('Access denied')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    });
  });

  it('allows admin to access without organization_id', async () => {
    mockAuth.mockReturnValue({ role: 'admin', organization_id: null });
    mockAPI.mockResolvedValue({ value: 100 });

    render(<CardKit spec={...} />);

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });
});
```

---

## 6. Integration Tests (API → UI)

### Mock Service Worker (MSW)

**Test: Full Flow**

```typescript
describe('Dashboard Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches metrics and renders cards', async () => {
    server.use(
      rest.get('/api/dashboard/metrics', (req, res, ctx) => {
        return res(ctx.json({
          bookings_completed: 47,
          gmv_completed_pence: 123456,
          currency: 'GBP',
          window: 'this_month',
          cached_at: '2025-01-16T10:00:00Z'
        }));
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('47')).toBeInTheDocument(); // bookings
      expect(screen.getByText('£1,234.56')).toBeInTheDocument(); // GMV
    });
  });

  it('handles API timeout gracefully', async () => {
    server.use(
      rest.get('/api/dashboard/metrics', (req, res, ctx) => {
        return res(ctx.delay(6000), ctx.status(504)); // Timeout
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Request timed out')).toBeInTheDocument();
    }, { timeout: 7000 });
  });
});
```

---

## 7. E2E Tests (Playwright)

**Critical User Journeys:**

### Journey 1: View Dashboard

```typescript
test('User views dashboard with all metrics', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for cards to load
  await expect(page.locator('[data-testid="card-bookings"]')).toBeVisible();

  // Check values displayed
  await expect(page.locator('[data-testid="card-bookings"]')).toContainText('47');
  await expect(page.locator('[data-testid="card-gmv"]')).toContainText('£1,234.56');

  // Check charts rendered
  await expect(page.locator('[data-testid="chart-bar-daily"]')).toBeVisible();
  await expect(page.locator('[data-testid="chart-line-cumulative"]')).toBeVisible();
});
```

### Journey 2: Filter by Window

```typescript
test('User changes time window filter', async ({ page }) => {
  await page.goto('/dashboard');

  // Select "Last Week"
  await page.selectOption('[data-testid="window-filter"]', 'last_week');

  // Wait for re-fetch
  await expect(page.locator('[data-testid="card-bookings"]')).toContainText('34'); // Different value

  // Check URL updated
  await expect(page).toHaveURL('/dashboard?window=last_week');
});
```

### Journey 3: Retry on Error

```typescript
test('User retries failed request', async ({ page }) => {
  // Mock initial failure
  await page.route('/api/dashboard/metrics', (route) => {
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'DATABASE_ERROR' }) });
  });

  await page.goto('/dashboard');

  // See error
  await expect(page.locator('text=Failed to load data')).toBeVisible();

  // Mock success for retry
  await page.route('/api/dashboard/metrics', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ bookings_completed: 47 }) });
  });

  // Click retry
  await page.click('button:has-text("Retry")');

  // Success
  await expect(page.locator('text=47')).toBeVisible();
});
```

---

## 8. Responsive Tests

**Breakpoint Snapshots:**

```typescript
describe('Responsive Layout', () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  breakpoints.forEach(({ name, width, height }) => {
    it(`renders correctly on ${name}`, () => {
      viewport({ width, height });
      render(<DashboardPage />);

      // Take snapshot
      expect(screen.getByTestId('dashboard')).toMatchSnapshot(`dashboard-${name}`);
    });
  });
});
```

---

## 9. Test Coverage Requirements

| Layer | Target | Tool |
|-------|--------|------|
| **Unit** | 100% branch | Jest coverage report |
| **Integration** | All API scenarios | MSW + Jest |
| **E2E** | Critical paths only | Playwright (3 journeys) |
| **A11y** | 0 violations | axe-core |
| **Visual** | 246 snapshots | Chromatic |
| **Performance** | All budgets green | Lighthouse CI |

---

## 10. CI/CD Integration

**GitHub Actions Workflow:**

```yaml
name: Dashboard Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:a11y

  visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_TOKEN }}

  perf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: http://localhost:3000/dashboard
          uploadArtifacts: true

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## Summary Checklist

- ✅ A11y: axe-core (0 violations) + manual SR testing (keyboard nav, announcements)
- ✅ Visual: 246 snapshots (82 components × 3 breakpoints)
- ✅ Performance: Card <200ms, Chart <400ms, Scroll ≥55fps
- ✅ Unit: Props validation, state transitions, formatters, unit mismatch, N/A handling
- ✅ RBAC: Operator requires org_id, admin optional
- ✅ Integration: API→UI full flow with MSW
- ✅ E2E: 3 critical journeys (view, filter, retry)
- ✅ Responsive: 3 breakpoints tested
- ✅ CI/CD: All tests in GitHub Actions
- ✅ Coverage: 100% branch for unit tests
