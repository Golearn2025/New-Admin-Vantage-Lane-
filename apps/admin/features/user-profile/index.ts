/**
 * User Profile Feature - Public API
 * Barrel export
 * 
 * MODERN & PREMIUM
 */

export { UserProfile } from './components/UserProfile';
export { ProfileHeader } from './components/ProfileHeader';
export { ProfileDocumentsTab } from './components/ProfileDocumentsTab';
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
export type { UserProfileProps } from './components/UserProfile';
