/**
 * Forgot Password Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/shared/auth-forgot-password.
 * Uses lucide-react icons (CheckCircle, no emoji).
 */

import { BrandBackground, AuthCard } from '@vantage-lane/ui-core';
import { ForgotPasswordForm } from '@features/shared/auth-forgot-password';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
  return (
    <BrandBackground variant="login">
      <main className={styles.page}>
        <AuthCard title="Reset Password">
          <ForgotPasswordForm />
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
