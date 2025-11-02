/**
 * Chart Constants - Reusable configuration
 * All values come from CSS tokens for 100% portability
 */

// Default chart margin (Recharts format)
export const CHART_MARGIN = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 5,
} as const;

// Chart animation duration (ms) - should match CSS var(--motion-duration-normal)
export const CHART_ANIMATION_DURATION = 800;

// Chart stroke dash pattern
export const CHART_STROKE_DASH = '3 3';

// Chart border radius for bars
export const CHART_BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];

// Dot sizes for line charts
export const CHART_DOT_RADIUS = 4;
export const CHART_ACTIVE_DOT_RADIUS = 6;

// Donut chart padding
export const CHART_PADDING_ANGLE = 2;

// Default chart height fallback
export const CHART_DEFAULT_HEIGHT = 300;
