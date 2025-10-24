/**
 * User Profile Feature - Types
 * UI-specific types for user profiles
 * 
 * MODERN & PREMIUM - Supports all user types
 */

import type { Document } from '@entities/document';

export type UserType = 'driver' | 'customer' | 'operator' | 'admin';

export type ProfileTab = 'info' | 'documents' | 'activity' | 'stats' | 'permissions';

export interface UserProfileData {
  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  isActive: boolean;
  createdAt: string;
  
  // Driver-specific
  rating?: number;
  totalReviews?: number;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  status?: 'online' | 'offline';
  
  // Stats
  totalJobs?: number;
  totalRides?: number;
  totalEarnings?: number;
  totalSpent?: number;
  totalDistance?: number;
  
  // Documents (driver only)
  documents?: Document[];
}

export interface UserProfileFilters {
  activeTab: ProfileTab;
}

export interface ProfileAction {
  type: 'edit' | 'activate' | 'deactivate' | 'delete';
  userId: string;
}
