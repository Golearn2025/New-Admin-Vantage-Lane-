/**
 * Design Tokens - FROZEN
 *
 * These design tokens are frozen and cannot be modified without freeze-exception.
 * Any changes require ADR and multi-team approval.
 *
 * Usage:
 * import { tokens } from '@admin-shared/config/design-tokens';
 * const primaryColor = tokens.colors.accent[500];
 */

import colors from './colors.json';
import typography from './typography.json';
import spacing from './spacing.json';
import radius from './radius.json';
import shadow from './shadow.json';
import zIndex from './zindex.json';
import motion from './motion.json';
import breakpoints from './breakpoints.json';

export const tokens = {
  colors: colors.colors,
  typography: typography.typography,
  spacing: spacing.spacing,
  semanticSpacing: spacing.semanticSpacing,
  radius: radius.radius,
  semanticRadius: radius.semanticRadius,
  shadow: shadow.shadow,
  semanticShadow: shadow.semanticShadow,
  zIndex: zIndex.zIndex,
  motion: motion.motion,
  semanticMotion: motion.semanticMotion,
  breakpoints: breakpoints.breakpoints,
  mediaQueries: breakpoints.mediaQueries,
} as const;

// Type exports for TypeScript
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type BreakpointToken = keyof typeof tokens.breakpoints;

// CSS Custom Properties generator
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(tokens.colors).forEach(([category, values]) => {
    if (typeof values === 'object') {
      Object.entries(values).forEach(([variant, value]) => {
        cssVars[`--color-${category}-${variant}`] = value as string;
      });
    } else {
      cssVars[`--color-${category}`] = values as string;
    }
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  return cssVars;
};
