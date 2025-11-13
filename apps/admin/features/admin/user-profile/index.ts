/**
 * User Profile Feature - Public API
 * Barrel export
 * 
 * MODERN & PREMIUM
 */

export { UserProfile } from './components/UserProfile';
export { ProfileHeader } from './components/ProfileHeader';
export { ProfileDocumentsTab } from './components/ProfileDocumentsTab';
export { ProfileActivityTab } from './components/ProfileActivityTab';
export { ProfileStatsTab } from './components/ProfileStatsTab';
export { useUserProfile } from './hooks/useUserProfile';

export type {
  UserType,
  ProfileTab,
  UserProfileData,
  UserProfileFilters,
  ProfileAction,
} from './types';

export type { ProfileHeaderProps } from './components/ProfileHeader';
export type { ProfileDocumentsTabProps } from './components/ProfileDocumentsTab';
export type { ProfileActivityTabProps } from './components/ProfileActivityTab';
export type { ProfileStatsTabProps } from './components/ProfileStatsTab';
export type { UserProfileProps } from './components/UserProfile';
