/**
 * Secure Password Generator
 * Uses crypto.randomBytes() for cryptographically secure random generation
 * Ver 3.4 - Replace Math.random() with secure crypto
 * 
 * @server-only This module should only be used server-side
 */

import crypto from 'crypto';

/**
 * Generates a cryptographically secure random password
 * @param length - Password length (default: 16)
 * @returns Secure random password with mixed case, digits, and special characters
 */
export function generateSecurePassword(length: number = 16): string {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const randomBytes = crypto.randomBytes(length);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    // Use modulo to map random byte to charset index
    const byte = randomBytes[i];
    if (byte !== undefined) {
      password += charset[byte % charset.length];
    }
  }
  
  // Ensure password meets complexity requirements
  // At least one of each: uppercase, lowercase, digit, special
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
    // Regenerate if doesn't meet requirements (recursive, but statistically rare)
    return generateSecurePassword(length);
  }
  
  return password;
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation result and error message if any
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit' };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*)' };
  }

  return { valid: true };
}
