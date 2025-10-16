/**
 * Theme Helpers - Utility functions for dashboard components
 * Supports both NORMAL and NEON color palettes
 */

import { TREND_COLORS_NORMAL, TREND_COLORS_NEON, type ColorPalette } from './palettes';

export function getTrendDirection(delta: number | null | undefined): 'up' | 'down' | 'neutral' {
  if (delta === null || delta === undefined || delta === 0) return 'neutral';
  return delta > 0 ? 'up' : 'down';
}

/**
 * Get trend color with palette support
 * @param direction - up, down, or neutral
 * @param palette - 'normal' or 'neon' (default: 'neon')
 */
export function getTrendColor(
  direction: 'up' | 'down' | 'neutral',
  palette: ColorPalette = 'neon'
): string {
  const colors = palette === 'neon' ? TREND_COLORS_NEON : TREND_COLORS_NORMAL;
  return colors[direction];
}

/**
 * Get trend color (legacy - uses NEON by default)
 * @deprecated Use getTrendColor with palette parameter
 */
export function getTrendColorLegacy(direction: 'up' | 'down' | 'neutral'): string {
  return getTrendColor(direction, 'neon');
}

export function getTrendIcon(direction: 'up' | 'down' | 'neutral'): string {
  switch (direction) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    default:
      return '→';
  }
}
