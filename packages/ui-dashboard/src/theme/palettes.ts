/**
 * Theme Palettes - Dual System (NORMAL + NEON)
 * Maps to CSS variables from @vantage-lane/styles
 * All values reference design tokens for consistency
 */

/* ============================================ */
/* GRADIENT PRESETS (Shared for Cards)         */
/* ============================================ */
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
  gold: {
    from: 'var(--vl-grad-gold-from, #f1d16a)',
    to: 'var(--vl-grad-gold-to, #d4a307)',
  },
} as const;

/* ============================================ */
/* CHART COLORS - NORMAL (Professional)        */
/* ============================================ */
export const CHART_COLORS_NORMAL = {
  primary: '#667eea',   // Purple
  success: '#10b981',   // Green
  warning: '#f59e0b',   // Orange
  danger: '#ef4444',    // Red
  info: '#3b82f6',      // Blue
  gold: '#f1d16a',      // Gold
} as const;

/* ============================================ */
/* CHART COLORS - NEON (Vibrant/Modern)        */
/* ============================================ */
export const CHART_COLORS_NEON = {
  primary: '#a78bfa',   // Purple Neon
  success: '#10f77e',   // Green Neon
  warning: '#fbbf24',   // Yellow Neon
  danger: '#ff2d55',    // Pink-Red Neon
  info: '#0af5ff',      // Cyan Neon
  gold: '#ffd60a',      // Gold Neon
} as const;

/* ============================================ */
/* DEFAULT EXPORT (uses CSS vars - respects globals.css) */
/* ============================================ */
export const CHART_COLORS = {
  primary: 'var(--vl-chart-primary, #a78bfa)',
  success: 'var(--vl-chart-success, #10f77e)',
  warning: 'var(--vl-chart-warning, #fbbf24)',
  danger: 'var(--vl-chart-danger, #ff2d55)',
  info: 'var(--vl-chart-info, #0af5ff)',
  gold: 'var(--vl-chart-gold, #ffd60a)',
} as const;

/* ============================================ */
/* TREND COLORS - NORMAL                        */
/* ============================================ */
export const TREND_COLORS_NORMAL = {
  up: '#10b981',     // Green
  down: '#ef4444',   // Red
  neutral: '#94a3b8', // Gray
} as const;

/* ============================================ */
/* TREND COLORS - NEON                          */
/* ============================================ */
export const TREND_COLORS_NEON = {
  up: '#00ff88',     // Neon Green
  down: '#ff2d55',   // Neon Pink-Red
  neutral: 'rgba(255, 255, 255, 0.7)', // White
} as const;

/* ============================================ */
/* TYPES                                        */
/* ============================================ */
export type GradientPreset = keyof typeof GRADIENT_PRESETS;
export type ChartColor = keyof typeof CHART_COLORS;
export type ColorPalette = 'normal' | 'neon';
