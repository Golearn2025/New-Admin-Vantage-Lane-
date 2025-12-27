/**
 * Mapbox Map Styles Configuration
 * 
 * Mapbox standard styles + custom theme configurations
 * Conform RULES.md: Configurații separate, fără logică
 */

export type MapTheme = 'dark' | 'light' | 'navigation';

/**
 * Mapbox Standard Styles
 * https://docs.mapbox.com/api/maps/styles/
 */
export const MAPBOX_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-night-v1',
} as const;

/**
 * Map Options per Theme
 */
export const MAP_THEME_OPTIONS = {
  dark: {
    style: MAPBOX_STYLES.dark,
    backgroundColor: '#0F172A',
  },
  light: {
    style: MAPBOX_STYLES.light,
    backgroundColor: '#FFFFFF',
  },
  navigation: {
    style: MAPBOX_STYLES.navigation,
    backgroundColor: '#1E293B',
  },
} as const;

/**
 * Get style URL for theme
 */
export function getMapStyle(theme: MapTheme = 'dark'): string {
  return MAPBOX_STYLES[theme];
}
