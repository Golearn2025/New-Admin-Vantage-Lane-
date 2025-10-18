/**
 * LOGIN FORM PREMIUM
 * 
 * Luxury authentication form with:
 * - Glass background with blur
 * - Theme gradient effects
 * - Gold focus rings
 * - Social login options
 * - Smooth animations
 */

'use client';

import React, { useState, FormEvent } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { useTheme } from '../theme/ThemeProvider';
import styles from './LoginForm.module.css';

export interface LoginFormProps {
  /** Callback when form is submitted */
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  /** Show social login buttons */
  showSocialLogin?: boolean;
  /** Show "Remember me" checkbox */
  showRememberMe?: boolean;
  /** Show "Forgot password" link */
  showForgotPassword?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Custom logo URL */
  logoUrl?: string;
  /** Custom title */
  title?: string;
  /** Custom subtitle */
  subtitle?: string;
  /** Variant style */
  variant?: 'glass' | 'solid' | 'gradient';
  /** Custom className */
  className?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm({
  onSubmit,
  showSocialLogin = true,
  showRememberMe = true,
  showForgotPassword = true,
  isLoading = false,
  error,
  logoUrl,
  title = 'Welcome Back',
  subtitle = 'Sign in to your account',
  variant = 'glass',
  className = '',
}: LoginFormProps) {
  const { themeConfig } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    if (onSubmit) {
      await onSubmit({
        email,
        password,
        rememberMe,
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className={`${styles.container} ${styles[variant]} ${className}`}>
      <div className={styles.formCard}>
        {/* Logo & Header */}
        <div className={styles.header}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className={styles.logo} />
          ) : (
            <div className={styles.logoPlaceholder}>
              <div className={styles.logoIcon}>🏆</div>
            </div>
          )}
          
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.errorAlert}>
            <svg
              className={styles.errorIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              error={emailError}
              disabled={isLoading}
              required
            />

          <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              disabled={isLoading}
              required
            />

          {/* Remember Me & Forgot Password */}
          {(showRememberMe || showForgotPassword) && (
            <div className={styles.formOptions}>
              {showRememberMe && (
                <label className={styles.rememberMe}>
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
              )}

              {showForgotPassword && (
                <a href="#forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </a>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Social Login */}
        {showSocialLogin && (
          <>
            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18.17 8.37H10v3.63h4.62c-.4 2-2.39 3.5-4.62 3.5-2.82 0-5.12-2.3-5.12-5.12S7.18 5.26 10 5.26c1.27 0 2.43.47 3.33 1.24l2.67-2.67C14.46 2.39 12.35 1.5 10 1.5c-4.69 0-8.5 3.81-8.5 8.5s3.81 8.5 8.5 8.5c4.9 0 8.17-3.44 8.17-8.29 0-.55-.06-1.09-.17-1.61v-.23z"
                    fill="currentColor"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 13.7792 3.88725 16.9717 7.23317 18.0783C7.68317 18.1583 7.85167 17.8833 7.85167 17.6467C7.85167 17.4333 7.84333 16.7692 7.83917 15.92C5.45167 16.4575 4.93083 14.8142 4.93083 14.8142C4.52167 13.8442 3.94083 13.5708 3.94083 13.5708C3.14083 13.0192 4.00083 13.0308 4.00083 13.0308C4.88667 13.0917 5.35333 13.9425 5.35333 13.9425C6.145 15.3125 7.43917 14.9208 7.86833 14.6925C7.94917 14.1217 8.18417 13.73 8.44333 13.5075C6.49 13.2825 4.43667 12.5167 4.43667 9.16583C4.43667 8.25083 4.78 7.50417 5.37083 6.91833C5.28 6.6925 4.97083 5.79083 5.4575 4.56083C5.4575 4.56083 6.20583 4.32083 7.8275 5.42833C8.5325 5.23 9.27917 5.13167 10.0208 5.12833C10.7625 5.13167 11.5092 5.23 12.215 5.42833C13.8358 4.32083 14.5833 4.56083 14.5833 4.56083C15.0708 5.79083 14.7617 6.6925 14.6808 6.91833C15.2725 7.50417 15.6125 8.25083 15.6125 9.16583C15.6125 12.525 13.5558 13.2792 11.5975 13.4992C11.9192 13.7833 12.2042 14.3392 12.2042 15.1867C12.2042 16.3867 12.1942 17.355 12.1942 17.6467C12.1942 17.885 12.36 18.1625 12.8158 18.0775C16.1592 16.9692 18.5 13.7775 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </>
        )}

        {/* Sign Up Link */}
        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <a href="#signup" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
