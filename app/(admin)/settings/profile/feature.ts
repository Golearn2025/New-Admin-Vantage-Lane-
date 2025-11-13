/**
 * Settings Profile Feature Adapter
 *
 * Temporary adapter for the settings-profile feature kept in apps/admin/features.
 * When we move the feature to app/(admin)/settings/profile/, we only update this file's exports.
 * All page imports remain stable.
 */

// eslint-disable-next-line no-restricted-imports -- Adapter internal bridging to features/shared
export * from '@features/shared/settings-profile';
