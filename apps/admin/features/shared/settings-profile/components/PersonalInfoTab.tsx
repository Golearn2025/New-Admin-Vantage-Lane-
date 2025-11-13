/**
 * PersonalInfoTab - TAB 1: Personal Information
 *
 * Tab pentru informații personale (nume, email, telefon, bio).
 * Folosește noile componente reutilizabile.
 * Limită: ≤150 linii
 */

'use client';

import React from 'react';
import { ProfileSection } from '@vantage-lane/ui-core';
import { FormField } from '@vantage-lane/ui-core';
import type { AdminProfile } from '../hooks/useProfileData';

interface PersonalInfoTabProps {
  profile: AdminProfile;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function PersonalInfoTab({
  profile,
  firstName,
  lastName,
  phone,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onBioChange,
}: PersonalInfoTabProps) {

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
          onChange={onFirstNameChange}
          placeholder="Enter your first name"
          icon="✨"
          required
        />

        <FormField
          label="Last Name"
          value={lastName}
          onChange={onLastNameChange}
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
          onChange={onPhoneChange}
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
          onChange={onBioChange}
          type="textarea"
          placeholder="Write a short bio..."
          icon="💬"
          rows={5}
        />
      </ProfileSection>
    </>
  );
}
