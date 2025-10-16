/**
 * Theme Palettes - Maps to CSS variables from @vantage-lane/styles
 * NO hardcoded colors - all values reference design tokens
 */

export const GRADIENT_PRESETS = {
  purple: {
    from: 'var(--vl-grad-purple-from, #667eea)',
    to: 'var(--vl-grad-purple-to, #764ba2)',
  },
  pink: {
    from: 'var(--vl-grad-pink-from, #f093fb)',
    to: 'var(--vl-grad-pink-to, #f5576c)',
  },
  blue: {
    from: 'var(--vl-grad-blue-from, #4facfe)',
    to: 'var(--vl-grad-blue-to, #00f2fe)',
  },
  green: {
    from: 'var(--vl-grad-green-from, #43e97b)',
    to: 'var(--vl-grad-green-to, #38f9d7)',
  },
  orange: {
    from: 'var(--vl-grad-orange-from, #fa709a)',
    to: 'var(--vl-grad-orange-to, #fee140)',
  },
} as const;

export const CHART_COLORS = {
  primary: 'var(--vl-chart-primary, #667eea)',
  success: 'var(--vl-chart-success, #10b981)',
  warning: 'var(--vl-chart-warning, #f59e0b)',
  danger: 'var(--vl-chart-danger, #ef4444)',
  info: 'var(--vl-chart-info, #3b82f6)',
} as const;

export type GradientPreset = keyof typeof GRADIENT_PRESETS;
export type ChartColor = keyof typeof CHART_COLORS;
