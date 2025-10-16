/**
 * Theme Helpers - Utility functions for dashboard components
 */

export function getTrendDirection(delta: number | null | undefined): 'up' | 'down' | 'neutral' {
  if (delta === null || delta === undefined || delta === 0) return 'neutral';
  return delta > 0 ? 'up' : 'down';
}

export function getTrendColor(direction: 'up' | 'down' | 'neutral'): string {
  switch (direction) {
    case 'up':
      return 'var(--vl-trend-up, #10b981)';
    case 'down':
      return 'var(--vl-trend-down, #ef4444)';
    default:
      return 'var(--vl-trend-neutral, #6b7280)';
  }
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
