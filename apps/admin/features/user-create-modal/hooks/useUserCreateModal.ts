/**
 * useUserCreateModal Hook
 * 
 * Business logic for user creation
 */

'use client';

import { useState } from 'react';
import type { UserCreateFormData, UserType } from '../types';

export interface UseUserCreateModalReturn {
  formData: UserCreateFormData;
  isSubmitting: boolean;
  error: string | null;
  updateField: <K extends keyof UserCreateFormData>(
    field: K,
    value: UserCreateFormData[K]
  ) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const initialFormData: UserCreateFormData = {
  userType: 'customer',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
};

export function useUserCreateModal(
  onSuccess: () => void
): UseUserCreateModalReturn {
  const [formData, setFormData] = useState<UserCreateFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof UserCreateFormData>(
    field: K,
    value: UserCreateFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: Implement API call
      console.log('Creating user:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
  };

  return {
    formData,
    isSubmitting,
    error,
    updateField,
    handleSubmit,
    resetForm,
  };
}
