/**
 * API Configuration - Centralized Constants
 *
 * NO MAGIC NUMBERS! All constants in one place.
 */

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  /** Default cache TTL: 5 minutes */
  DEFAULT_TTL: 5 * 60 * 1000,

  /** Dashboard metrics cache: 5 minutes */
  DASHBOARD_METRICS_TTL: 5 * 60 * 1000,

  /** Dashboard charts cache: 5 minutes */
  DASHBOARD_CHARTS_TTL: 5 * 60 * 1000,

  /** User profile cache: 15 minutes */
  USER_PROFILE_TTL: 15 * 60 * 1000,
} as const;

/**
 * SWR configuration
 */
export const SWR_CONFIG = {
  /** Refresh interval: 5 minutes */
  REFRESH_INTERVAL: 5 * 60 * 1000,

  /** Dedupe interval: 60 seconds */
  DEDUPE_INTERVAL: 60 * 1000,

  /** Revalidate on focus */
  REVALIDATE_ON_FOCUS: false,

  /** Revalidate on reconnect */
  REVALIDATE_ON_RECONNECT: false,

  /** Keep previous data */
  KEEP_PREVIOUS_DATA: true,
} as const;

/**
 * API Rate Limiting
 */
export const RATE_LIMIT = {
  /** Max requests per window */
  MAX_REQUESTS: 100,

  /** Window duration: 1 minute */
  WINDOW_MS: 60 * 1000,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,

  /** Max page size */
  MAX_PAGE_SIZE: 100,
} as const;
