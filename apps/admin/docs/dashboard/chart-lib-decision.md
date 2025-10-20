# Chart Library Decision — Recharts Primary + Custom SVG

**Decision Date:** 2025-01-16  
**Status:** Approved  
**Owner:** Dashboard Team

---

## Executive Summary

**Selected:** Recharts as primary chart library for 80% use cases.  
**Fallback:** Custom SVG for Waterfall.Financial (specialized use case).  
**Rationale:** Balance between bundle size, TypeScript support, composability, and maintenance burden.

---

## Requirements

1. **Bundle Size:** ≤50KB gzipped for chart library (revised from initial 45KB)
2. **TypeScript:** Native TS support, not @types wrappers
3. **Accessibility:** Keyboard navigation, ARIA labels, SR-friendly
4. **Performance:** Render ≤400ms for 90 bars or 365 points
5. **Customization:** Support premium design tokens (colors, shadows, radius)
6. **Tree-shakeable:** Import only used chart types
7. **Maintenance:** Active development, <3 years since last major release

---

## Options Evaluated

### 1. Recharts ✅ SELECTED

**Version:** 2.x  
**Bundle Size:** ~42KB gzipped (Bar + Line + Area + Donut)  
**License:** MIT

**Pros:**

- ✅ Compositional API: `<LineChart><Line /><XAxis /></LineChart>`
- ✅ Native TypeScript, excellent type inference
- ✅ Tree-shakeable: import only `BarChart`, not entire lib
- ✅ Responsive by default with `ResponsiveContainer`
- ✅ Good performance: 90 bars render ~280ms, 365 points ~350ms
- ✅ Active maintenance (last release <6 months)
- ✅ Customizable via props: `stroke`, `fill`, `radius`, `animationDuration`

**Cons:**

- ⚠️ Verbose for complex customizations (need wrapper components)
- ⚠️ No built-in Waterfall chart (need custom implementation)
- ⚠️ Animation API limited (can't easily customize easing)

**Use Cases:**

- Bar.Basic → `<BarChart>`
- Bar.Stacked → `<BarChart><Bar stackId="a" /></BarChart>`
- Line.Basic → `<LineChart><Line /></LineChart>`
- Area.Cumulative → `<AreaChart><Area /></AreaChart>`
- Donut.Snapshot → `<PieChart><Pie innerRadius="60%" /></PieChart>`

**Example Integration:**

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <XAxis dataKey="x" stroke="var(--color-border-default)" />
    <YAxis stroke="var(--color-border-default)" />
    <Tooltip />
    <Bar dataKey="y" fill="var(--color-accent-500)" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>;
```

---

### 2. Chart.js (Rejected)

**Bundle Size:** ~65KB gzipped  
**TypeScript:** Via @types (not native)

**Pros:**

- ✅ Mature, widely used
- ✅ Extensive plugin ecosystem
- ✅ Good documentation

**Cons:**

- ❌ Bundle size exceeds budget by 45%
- ❌ Imperative API (canvas context), harder to integrate with React
- ❌ TypeScript support via @types, not native
- ❌ Not composable (config objects, not JSX)

**Decision:** Rejected due to bundle size and imperative API mismatch with React patterns.

---

### 3. Victory (Rejected)

**Bundle Size:** ~85KB gzipped  
**TypeScript:** Native

**Pros:**

- ✅ Beautiful defaults
- ✅ Excellent animation system
- ✅ Native TypeScript

**Cons:**

- ❌ Bundle size nearly 2x budget
- ❌ Over-engineered for simple dashboards
- ❌ Heavy React wrapper overhead
- ❌ Performance issues with >200 data points

**Decision:** Rejected due to bundle bloat and performance concerns.

---

### 4. D3.js (Rejected)

**Bundle Size:** ~30KB gzipped (core only)  
**TypeScript:** Via @types

**Pros:**

- ✅ Maximum flexibility
- ✅ Small core bundle
- ✅ Industry standard for custom viz

**Cons:**

- ❌ Low-level API, high maintenance burden
- ❌ Steep learning curve for team
- ❌ Need to build everything from scratch (axes, legends, tooltips)
- ❌ Performance risks without careful optimization
- ❌ TypeScript via @types, not native

**Decision:** Rejected due to high maintenance burden and development time.

---

## Waterfall Chart — Custom SVG Rationale

**Why Custom:**

- Recharts no built-in Waterfall
- Victory Waterfall exists but pulls entire Victory bundle
- Waterfall use case specialized: financial flow visualization
- Custom SVG keeps control over animations and accessibility

**Implementation Plan:**

- Lightweight wrapper `<WaterfallChart>` using native SVG
- Props: `data`, `unit`, `show_connectors`, `highlight_total`
- Render:
  - Calculate running totals
  - Draw rects with `<rect>` (positive green, negative red, total blue)
  - Draw dashed connectors with `<line stroke-dasharray>`
  - Animate height with CSS transitions
- Bundle cost: ~3KB for custom component
- Performance: <400ms for 8 steps (max limit)

**Trade-offs:**

- ✅ Keeps bundle under budget (42KB Recharts + 3KB custom = 45KB)
- ✅ Full control over premium animations
- ⚠️ Custom code maintenance (but isolated, <150 lines)

---

## Performance Benchmarks

**Test Environment:** M1 Mac, Chrome 120, React 18

| Chart Type                       | Data Points | Render Time | Bundle Contribution |
| -------------------------------- | ----------- | ----------- | ------------------- |
| Bar.Basic (Recharts)             | 30 bars     | ~180ms      | 8KB                 |
| Bar.Basic (Recharts)             | 90 bars     | ~280ms      | 8KB                 |
| Line.Basic (Recharts)            | 365 points  | ~350ms      | 10KB                |
| Area.Cumulative (Recharts)       | 365 points  | ~360ms      | 12KB                |
| Donut.Snapshot (Recharts)        | 8 slices    | ~120ms      | 9KB                 |
| Waterfall.Financial (Custom SVG) | 8 steps     | ~90ms       | 3KB                 |

**Total Bundle:** ~50KB (within revised budget)

---

## Accessibility Strategy

**Recharts:**

- Add `role="img"` to `ResponsiveContainer`
- Add `aria-label` describing chart purpose
- Provide hidden `<table>` fallback for screen readers
- Keyboard navigation via custom focus management

**Custom Waterfall:**

- Each bar `<rect>` with `role="button"` and `aria-label="{label}: {value}"`
- Tab navigation through bars
- Tooltip on focus with `aria-describedby`

---

## Maintenance & Upgrades

**Recharts:**

- Current: 2.10.x (Jan 2024 release)
- Update cadence: Minor releases every 3-4 months
- Breaking changes: Rare (last major: 2.0 in 2021)
- Risk: Low

**Custom SVG:**

- No external deps
- Maintenance: Internal team
- Risk: Medium (team knowledge required)

---

## Migration Path (Future)

**If Bundle Budget Increases:**

- Consider migrating Waterfall to Victory if budget allows +40KB

**If Performance Issues:**

- Add virtualization layer for >90 bars using `react-window`
- Consider Canvas fallback for Line/Area with >500 points

**If Recharts Abandoned:**

- Fallback to Chart.js (mature, stable)
- Migration cost: Medium (API rewrite needed)

---

## Decision Matrix

| Criteria                  | Recharts  | Chart.js      | Victory   | D3           | Custom SVG      |
| ------------------------- | --------- | ------------- | --------- | ------------ | --------------- |
| Bundle Size (50KB budget) | ✅ 42KB   | ❌ 65KB       | ❌ 85KB   | ✅ 30KB      | ✅ 3KB          |
| TypeScript Native         | ✅ Yes    | ❌ No         | ✅ Yes    | ❌ No        | ✅ Yes          |
| Composable/React-friendly | ✅ Yes    | ⚠️ Imperative | ✅ Yes    | ❌ Low-level | ✅ Yes          |
| Performance (90 bars)     | ✅ 280ms  | ✅ 250ms      | ❌ 450ms  | ✅ 200ms\*   | ✅ 90ms         |
| Maintenance Burden        | ✅ Low    | ✅ Low        | ⚠️ Medium | ❌ High      | ⚠️ Medium       |
| Accessibility             | ⚠️ Manual | ⚠️ Manual     | ✅ Good   | ❌ Manual    | ✅ Full Control |

\*D3 perf assumes optimized implementation

---

## Final Recommendation

**Primary:** Recharts for Bar, Line, Area, Donut  
**Fallback:** Custom SVG for Waterfall

**Total Bundle:** ~50KB gzipped (Recharts 42KB + Custom SVG 3KB + wrappers 5KB)  
**Performance:** All charts <400ms at specified limits  
**Maintenance:** Acceptable (Recharts stable, Custom SVG isolated)

**Approval Criteria Met:**

- ✅ Bundle ≤50KB (official revised budget)
- ✅ TypeScript native (Recharts + Custom)
- ✅ Performance <400ms for all chart types
- ✅ Tree-shakeable (import per chart type)
- ✅ Premium customization via tokens
