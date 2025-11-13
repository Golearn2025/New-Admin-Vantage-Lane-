/**
 * useProfileForm Hook
 * 
 * Form state management for profile settings.
 * Manages form fields, pending changes, and save logic.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { AdminProfile } from './useProfileData';

export interface UseProfileFormProps {
  profile: AdminProfile;
  onSave: (updates: Partial<AdminProfile>) => Promise<boolean>;
}

export interface UseProfileFormReturn {
  // Form field values
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  
  // Field change handlers
  handleFirstNameChange: (value: string) => void;
  handleLastNameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleBioChange: (value: string) => void;
  
  // Security handlers
  handleChangePassword: () => void;
  handleEnable2FA: () => void;
  handleDeleteAccount: () => void;
  
  // Save logic
  handleSave: () => Promise<void>;
  hasPendingChanges: boolean;
  saving: boolean;
  saveSuccess: boolean;
}

export function useProfileForm({ profile, onSave }: UseProfileFormProps): UseProfileFormReturn {
  const [firstName, setFirstName] = useState(profile.first_name || '');
  const [lastName, setLastName] = useState(profile.last_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate if there are pending changes
  const hasPendingChanges = useMemo(() => {
    return (
      firstName !== (profile.first_name || '') ||
      lastName !== (profile.last_name || '') ||
      phone !== (profile.phone || '') ||
      bio !== (profile.bio || '')
    );
  }, [firstName, lastName, phone, bio, profile]);

  // Memoized change handlers
  const handleFirstNameChange = useCallback((value: string) => {
    setFirstName(value);
  }, []);

  const handleLastNameChange = useCallback((value: string) => {
    setLastName(value);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
  }, []);

  const handleBioChange = useCallback((value: string) => {
    setBio(value);
  }, []);

  // Save handler with spam protection
  const handleSave = useCallback(async () => {
    if (!hasPendingChanges || saving) return;

    setSaving(true);
    setSaveSuccess(false);

    const updates: Partial<AdminProfile> = {
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      bio: bio || null,
    };

    const success = await onSave(updates);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setSaving(false);
  }, [hasPendingChanges, saving, firstName, lastName, phone, bio, onSave]);

  // Security handlers (placeholder for now)
  const handleChangePassword = useCallback(() => {
    // TODO: Implement password change
  }, []);

  const handleEnable2FA = useCallback(() => {
    // TODO: Implement 2FA enable
  }, []);

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement account deletion
  }, []);

  return {
    firstName,
    lastName,
    phone,
    bio,
    handleFirstNameChange,
    handleLastNameChange,
    handlePhoneChange,
    handleBioChange,
    handleChangePassword,
    handleEnable2FA,
    handleDeleteAccount,
    handleSave,
    hasPendingChanges,
    saving,
    saveSuccess,
  };
}
