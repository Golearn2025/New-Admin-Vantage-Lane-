/**
 * ChangePasswordModal - MODAL SCHIMBARE PAROLĂ
 *
 * Modal pentru schimbarea parolei cu validare și Supabase auth.
 * Limită: ≤180 linii
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal, Input, SaveButton } from '@vantage-lane/ui-core';
import { createClient } from '@/lib/supabase/client';
import styles from './ChangePasswordModal.module.css';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const isValidPassword = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword && newPassword && confirmPassword && isValidPassword && passwordsMatch && !isLoading;

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 CHANGE PASSWORD: Starting password change...');

      const supabase = createClient();
      
      // Update password using Supabase auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ CHANGE PASSWORD: Update failed', updateError);
        setError(updateError.message || 'Failed to update password');
        return;
      }

      console.log('✅ CHANGE PASSWORD: Password updated successfully');
      setSuccess(true);
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal after short delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      console.error('❌ CHANGE PASSWORD: Unexpected error', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [canSubmit, newPassword, onClose]);

  const handleClose = useCallback(() => {
    if (isLoading) return; // Don't close while loading
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  }, [isLoading, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="md"
    >
      <div className={styles.container}>
        {success ? (
          <div className={styles.successState}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h3 className={styles.successTitle}>Password Updated!</h3>
            <p className={styles.successMessage}>
              Your password has been successfully updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorBanner}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div className={styles.field}>
              <label className={styles.label}>
                <Lock size={16} />
                Current Password *
              </label>
              <div className={styles.passwordField}>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className={styles.field}>
              <label className={styles.label}>
                <Lock size={16} />
                New Password *
              </label>
              <div className={styles.passwordField}>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && !isValidPassword && (
                <p className={styles.validation}>
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
              <label className={styles.label}>
                <Lock size={16} />
                Confirm New Password *
              </label>
              <div className={styles.passwordField}>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className={styles.validation}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className={styles.actions}>
              <SaveButton
                onClick={handleSubmit}
                variant="primary"
                loading={isLoading}
                disabled={!canSubmit}
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </SaveButton>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
