/**
 * User Profile Page (Dynamic)
 * View user profile with documents, stats, etc.
 * 
 * MODERN & PREMIUM - ZERO logic in app/ (RULES.md compliant)
 */

import { UserProfile } from '@features/user-profile';
import type { UserType } from '@features/user-profile';

interface UserProfilePageProps {
  params: { id: string };
  searchParams: { type?: UserType };
}

export default function UserProfilePage({ params, searchParams }: UserProfilePageProps) {
  const userType = searchParams.type || 'driver';
  
  return <UserProfile userId={params.id} userType={userType} />;
}
