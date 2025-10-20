/**
 * LOGIN FORM DEMO PAGE
 * 
 * Showcase pentru LoginForm Premium cu toate variants
 */

'use client';

import { useState } from 'react';
import { ThemeProvider, LoginForm, ThemeSwitcher, type LoginFormData } from '@vantage-lane/ui-core';
import styles from './demo-login.module.css';

export default function LoginDemoPage() {
  const [variant, setVariant] = useState<'glass' | 'solid' | 'gradient'>('glass');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (data: LoginFormData) => {
    console.log('Login attempt:', data);
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate error for demo
    if (data.email === 'error@test.com') {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    alert(`Login successful!\nEmail: ${data.email}\nRemember Me: ${data.rememberMe}`);
  };

  return (
    <ThemeProvider defaultTheme="vantageGold">
      <div className={styles.demoPage}>
        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <div className={styles.controls}>
            <div>
              <h2>🎨 Login Form Premium</h2>
              <p>Luxury authentication with theme system</p>
            </div>

            <div className={styles.controlGroup}>
              <label>Theme:</label>
              <ThemeSwitcher compact />
            </div>

            <div className={styles.controlGroup}>
              <label>Variant:</label>
              <div className={styles.variantButtons}>
                <button
                  className={variant === 'glass' ? styles.active : ''}
                  onClick={() => setVariant('glass')}
                >
                  Glass
                </button>
                <button
                  className={variant === 'solid' ? styles.active : ''}
                  onClick={() => setVariant('solid')}
                >
                  Solid
                </button>
                <button
                  className={variant === 'gradient' ? styles.active : ''}
                  onClick={() => setVariant('gradient')}
                >
                  Gradient
                </button>
              </div>
            </div>

            <div className={styles.testInfo}>
              <h3>🧪 Test Credentials</h3>
              <ul>
                <li><strong>Normal:</strong> any@email.com / anypassword</li>
                <li><strong>Error Demo:</strong> error@test.com / anypassword</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Login Form Display */}
        <div className={styles.formDisplay}>
          <LoginForm
            variant={variant}
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
            showSocialLogin={true}
            showRememberMe={true}
            showForgotPassword={true}
            title="Welcome Back"
            subtitle="Sign in to your account"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
