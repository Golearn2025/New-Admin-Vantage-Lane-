/**
 * PersonalInfoTab - TAB 1: Personal Information
 * 
 * Tab pentru informații personale (nume, email, telefon, bio).
 * Folosește noile componente reutilizabile.
 * Limită: ≤150 linii
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ProfileSection } from '@admin-shared/ui/core/ProfileSection';
import { FormField } from '@admin-shared/ui/core/FormField';
import type { AdminProfile } from '../hooks/useProfileData';

interface PersonalInfoTabProps {
  profile: AdminProfile;
  onChange: (updates: Partial<AdminProfile>) => void;
}

export function PersonalInfoTab({ profile, onChange }: PersonalInfoTabProps) {
  const [firstName, setFirstName] = useState(profile.first_name || '');
  const [lastName, setLastName] = useState(profile.last_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');

  useEffect(() => {
    setFirstName(profile.first_name || '');
    setLastName(profile.last_name || '');
    setPhone(profile.phone || '');
    setBio(profile.bio || '');
  }, [profile]);

  useEffect(() => {
    const hasChanges =
      firstName !== (profile.first_name || '') ||
      lastName !== (profile.last_name || '') ||
      phone !== (profile.phone || '') ||
      bio !== (profile.bio || '');

    if (hasChanges) {
      onChange({
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        bio: bio || null,
      });
    }
  }, [firstName, lastName, phone, bio, profile, onChange]);

  return (
    <>
      <ProfileSection
        title="Basic Information"
        icon="👤"
        description="Your personal details and contact information"
        variant="highlight"
      >
        <FormField
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="Enter your first name"
          icon="✨"
          required
        />

        <FormField
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Enter your last name"
          icon="✨"
          required
        />

        <FormField
          label="Email Address"
          value={profile.email}
          type="email"
          icon="📧"
          readOnly
          hint="Email cannot be changed"
        />

        <FormField
          label="Phone Number"
          value={phone}
          onChange={setPhone}
          type="tel"
          placeholder="+44 20 xxxx xxxx"
          icon="📱"
        />
      </ProfileSection>

      <ProfileSection
        title="About"
        icon="📝"
        description="Tell us more about yourself"
      >
        <FormField
          label="Bio"
          value={bio}
          onChange={setBio}
          type="textarea"
          placeholder="Write a short bio..."
          icon="💬"
          rows={5}
        />
      </ProfileSection>
    </>
  );
}
