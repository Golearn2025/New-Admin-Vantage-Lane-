/**
 * User Profile Feature - Main Hook
 * Data fetching for user profile
 * 
 * MODERN & PREMIUM - Type-safe hook
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import { useState, useEffect } from 'react';
import type { UserProfileData, UserType } from '../types';

export function useUserProfile(userId: string, userType: UserType) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with real API call based on userType
        // For now, mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mock profile data
        const mockProfile: UserProfileData = {
          id: userId,
          type: userType,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+44 7700 900000',
          isActive: false,
          createdAt: new Date().toISOString(),
        };
        
        setProfile(mockProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId, userType]);
  
  const refetch = () => {
    setProfile(null);
    setLoading(true);
    // Trigger re-fetch
  };
  
  return {
    profile,
    loading,
    error,
    refetch,
  };
}
