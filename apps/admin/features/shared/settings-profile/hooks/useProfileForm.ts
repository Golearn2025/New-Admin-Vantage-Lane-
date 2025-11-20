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
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  handleFirstNameChange: (value: string) => void;
  handleLastNameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleBioChange: (value: string) => void;
  handleChangePassword: () => void;
  handleEnable2FA: () => void;
  handleDeleteAccount: () => void;
  handleSave: () => Promise<void>;
  hasPendingChanges: boolean;
  saving: boolean;
  saveSuccess: boolean;
  showChangePasswordModal: boolean;
  setShowChangePasswordModal: (show: boolean) => void;
}

export function useProfileForm({ profile, onSave }: UseProfileFormProps): UseProfileFormReturn {
  const [firstName, setFirstName] = useState(profile.first_name || '');
  const [lastName, setLastName] = useState(profile.last_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Calculate if there are pending changes
  const hasPendingChanges = useMemo(() => {
    const changes = {
      firstName: firstName !== (profile.first_name || ''),
      lastName: lastName !== (profile.last_name || ''),
      phone: phone !== (profile.phone || ''),
      bio: bio !== (profile.bio || '')
    };
    
    const hasChanges = Object.values(changes).some(Boolean);
    
    console.log('🔍 PROFILE FORM: Pending changes check', {
      changes,
      hasChanges,
      currentValues: { firstName, lastName, phone, bio },
      profileValues: { 
        first_name: profile.first_name, 
        last_name: profile.last_name, 
        phone: profile.phone, 
        bio: profile.bio 
      }
    });
    
    return hasChanges;
  }, [firstName, lastName, phone, bio, profile.first_name, profile.last_name, profile.phone, profile.bio]);

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
    console.log('🚀 PROFILE FORM: handleSave called', { hasPendingChanges, saving });
    
    if (!hasPendingChanges || saving) {
      console.log('❌ PROFILE FORM: Save blocked', { 
        reason: !hasPendingChanges ? 'No pending changes' : 'Already saving' 
      });
      return;
    }

    console.log('🔄 PROFILE FORM: Starting save process...');
    setSaving(true);
    setSaveSuccess(false);

    const updates: Partial<AdminProfile> = {
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      bio: bio || null,
    };

    console.log('🔄 PROFILE FORM: Calling onSave with updates', updates);
    const success = await onSave(updates);
    console.log('🔄 PROFILE FORM: Save result', success);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setSaving(false);
  }, [hasPendingChanges, saving, firstName, lastName, phone, bio, onSave]);

  // Security handlers
  const handleChangePassword = useCallback(() => {
    console.log('🔐 CHANGE PASSWORD: Opening change password modal');
    setShowChangePasswordModal(true);
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
    showChangePasswordModal,
    setShowChangePasswordModal,
  };
}
