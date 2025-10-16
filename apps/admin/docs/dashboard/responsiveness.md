# Responsiveness Specification

**Version:** 1.0.0  
**Purpose:** Grid layouts, breakpoint behavior, și limits pentru CardKit & ChartKit.

---

## 1. Breakpoint System

**Tailwind-aligned:**
```
xs: 0-639px    (mobile)
sm: 640-767px  (large mobile)
md: 768-1023px (tablet)
lg: 1024+px    (desktop)
```

**Implementation:** CSS media queries + container queries where supported.

---

## 2. CardKit Responsive Behavior

### Grid Layout

**Desktop (lg: 1024+):**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-4); /* 16px */
}
```
- 4 cards per row
- Regular variant (height: 120px)
- Full padding (16px)

**Tablet (md: 768-1023):**
```css
.card-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3); /* 12px */
}
```
- 3 cards per row
- Regular variant
- Reduced gap

**Large Mobile (sm: 640-767):**
```css
.card-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}
```
- 2 cards per row
- Compact variant (height: 80px)
- Smaller font sizes

**Mobile (xs: <640):**
```css
.card-grid {
  grid-template-columns: 1fr;
  gap: var(--spacing-2); /* 8px */
}
```
- 1 card per row (stack)
- Compact variant
- Full width utilization

### Card Variants by Breakpoint

| Breakpoint | Variant | Height | Padding | Font Size (value) |
|------------|---------|--------|---------|-------------------|
| xs (<640)  | compact | 80px   | 12px    | 20px (md)         |
| sm (640+)  | compact | 80px   | 12px    | 20px (md)         |
| md (768+)  | regular | 120px  | 16px    | 28px (lg)         |
| lg (1024+) | regular | 120px  | 16px    | 28px (lg)         |

### KPI.Trend Sparkline

| Breakpoint | Sparkline Width | Sparkline Visibility |
|------------|-----------------|----------------------|
| xs         | Hidden          | No                   |
| sm         | 48px            | Yes                  |
| md         | 72px            | Yes                  |
| lg         | 72px            | Yes                  |

**Rationale:** Sparklines hidden pe mobile pentru breathing room.

---

## 3. ChartKit Responsive Behavior

### Chart Container Heights

| Chart Type | xs | sm | md | lg |
|------------|----|----|----|----|
| Bar.Basic | 240px | 280px | 320px | 360px |
| Bar.Stacked | 240px | 280px | 320px | 360px |
| Line.Basic | 240px | 280px | 320px | 360px |
| Area.Cumulative | 240px | 280px | 320px | 360px |
| Donut.Snapshot | 220px | 260px | 300px | 300px |
| Waterfall.Financial | 260px | 300px | 340px | 380px |

### Legend Position

| Breakpoint | Legend Position | Legend Layout |
|------------|-----------------|---------------|
| xs         | Hidden OR bottom | Horizontal (icons only) |
| sm         | Bottom          | Horizontal (icons + short labels) |
| md         | Bottom          | Horizontal (full labels) |
| lg         | Right           | Vertical (full labels) |

**Rule:** Legend takes significant space. On mobile, prefer hidden or icon-only.

### Axis Labels

**X-Axis (Date labels):**

| Breakpoint | Label Count | Rotation | Font Size |
|------------|-------------|----------|-----------|
| xs         | Every 4th   | 45°      | 10px      |
| sm         | Every 3rd   | 45°      | 11px      |
| md         | Every 2nd   | 0°       | 12px      |
| lg         | All         | 0°       | 12px      |

**Y-Axis (Value labels):**

| Breakpoint | Tick Count | Font Size |
|------------|------------|-----------|
| xs         | 3          | 10px      |
| sm         | 4          | 11px      |
| md         | 5          | 12px      |
| lg         | 5          | 12px      |

### Dots/Points Visibility

| Chart Type | xs | sm | md | lg |
|------------|----|----|----|----|
| Line.Basic (dots) | Hidden | Hidden | Show (≤30 points) | Show (≤60 points) |
| Area.Cumulative (dots) | Hidden | Hidden | Show (≤30) | Show (≤60) |

**Rationale:** Dots add visual noise on small screens. Hide când space limited.

---

## 4. Data Point Limits by Breakpoint

### Bar Charts

| Breakpoint | Max Bars Displayed | Overflow Behavior |
|------------|-------------------|-------------------|
| xs         | 15                | Horizontal scroll with momentum |
| sm         | 30                | Horizontal scroll |
| md         | 60                | Fit to width (min 8px bar width) |
| lg         | 90                | Fit to width (min 8px bar width) |

**Implementation:**
- Calculate bar width: `containerWidth / barCount`
- If bar width < 8px → enable horizontal scroll
- Scroll container: `overflow-x: auto; -webkit-overflow-scrolling: touch;`

**Auto-Grouping (Daily → Weekly):**
- Trigger: When `barCount > 90` (exceeds max limit)
- Behavior: Group daily data by week (median aggregation)
- Notice: Show banner "Data grouped by week for readability"
- Example: 180 daily bars → 26 weekly bars

```typescript
if (barCount > 90) {
  data = groupByWeek(data);  // Aggregate daily → weekly
  showNotice('Data grouped by week');
}
```

### Line/Area Charts

| Breakpoint | Max Points | Decimation Strategy |
|------------|------------|---------------------|
| xs         | 90         | Show every 4th point (median aggregate) |
| sm         | 180        | Show every 2nd point |
| md         | 365        | Show all |
| lg         | 365        | Show all |

**Decimation:**
- Group points by N
- Take median of group
- Preserve visual trend, reduce clutter

### Donut Charts

| Breakpoint | Max Slices | Min Slice % to Display |
|------------|------------|------------------------|
| xs         | 5          | 5%                     |
| sm         | 6          | 3%                     |
| md         | 8          | 2%                     |
| lg         | 8          | 2%                     |

**Small slices grouped in "Other" category.**

---

## 5. Touch Interactions (Mobile)

### Tooltips
- **Desktop:** Show on hover (delay 80ms)
- **Mobile:** Show on tap, dismiss on tap outside or after 3s

### Zoom/Pan
- **Disabled by default** (overwhelming for users)
- **Optional:** Pinch-to-zoom on Line/Area for power users (feature flag)

### Scroll
- **Bar charts:** Horizontal scroll momentum for >15 bars on mobile
- **Card grids:** Vertical scroll native

---

## 6. Typography Scaling

### Card Labels

| Breakpoint | Label (title) | Sublabel | Value |
|------------|---------------|----------|-------|
| xs         | 12px          | 10px     | 20px  |
| sm         | 13px          | 11px     | 20px  |
| md         | 14px          | 12px     | 28px  |
| lg         | 14px          | 12px     | 28px  |

### Chart Text

| Breakpoint | Title | Axis Labels | Tooltip |
|------------|-------|-------------|---------|
| xs         | 14px  | 10px        | 12px    |
| sm         | 15px  | 11px        | 12px    |
| md         | 16px  | 12px        | 13px    |
| lg         | 16px  | 12px        | 13px    |

---

## 7. Spacing Adjustments

### Card Grid Gaps

| Breakpoint | Gap |
|------------|-----|
| xs         | 8px |
| sm         | 12px |
| md         | 12px |
| lg         | 16px |

### Chart Margins

| Breakpoint | Top | Right | Bottom | Left |
|------------|-----|-------|--------|------|
| xs         | 8px | 8px   | 24px   | 32px |
| sm         | 12px| 12px  | 32px   | 40px |
| md         | 16px| 16px  | 40px   | 48px |
| lg         | 16px| 16px  | 40px   | 48px |

---

## 8. Performance Considerations

### Render Throttling
- **Mobile:** Throttle chart re-renders to 30fps during scroll
- **Desktop:** 60fps target

### Lazy Loading
- **Below fold cards:** Lazy load with IntersectionObserver
- **Charts:** Render only when 80% visible in viewport

### Image Optimization
- **Icons:** SVG only (scalable)
- **Sparklines:** Render at 1x on mobile, 2x on retina desktop

---

## 9. Accessibility on Mobile

### Touch Targets
- **Minimum size:** 44×44px for all interactive elements (WCAG 2.1)
- **Spacing:** Minimum 8px between touch targets

### Focus Indicators
- **Mobile:** Larger focus ring (4px vs 2px desktop)
- **Color:** High contrast (meets WCAG AA on all backgrounds)

### Screen Reader
- **Gestures:** Support swipe navigation through chart data points
- **Announcements:** Announce "Chart loaded" when render complete
- **Fallback Table:** Hidden `<table>` with chart data for SR (aria-hidden=false when chart error)

### Reduced Motion
- **Respect `prefers-reduced-motion`:**
  - Animations disabled (card fade-in, chart transitions)
  - Chart data updates instant (no morph/transition)
  - Skeleton pulse static (no animation)
  - Hover effects instant (no ease-out)
  
```css
@media (prefers-reduced-motion: reduce) {
  .card, .chart, .skeleton {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 10. Testing Matrix

| Device | Viewport | Test Scenarios |
|--------|----------|----------------|
| iPhone SE | 375×667 | 1 card/row, compact variant, scrollable bars |
| iPhone 14 | 390×844 | 1 card/row, compact, touch tooltips |
| iPad Mini | 768×1024 | 3 cards/row, regular variant, legend bottom |
| iPad Pro | 1024×1366 | 4 cards/row, regular, legend right |
| Desktop | 1920×1080 | 4+ cards/row, all features visible |

---

## Summary Checklist

- ✅ Breakpoints: xs/sm/md/lg definite
- ✅ Card grid: 1/2/3/4 cols by breakpoint
- ✅ Card variants: compact (<md), regular (≥md)
- ✅ Chart heights adaptive (240-380px)
- ✅ Legend: hidden/bottom/right by breakpoint
- ✅ Axis labels: rotation, tick count, font size scaled
- ✅ Data limits: bar ≤90, line/area ≤365, decimation pe mobile
- ✅ Touch: tap tooltips, scroll momentum, 44px targets
- ✅ Performance: lazy load, throttle renders
- ✅ A11y: focus rings, SR announcements
