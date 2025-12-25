/**
 * Reset Password Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/shared/auth-reset-password.
 */

import { BrandBackground, AuthCard } from '@vantage-lane/ui-core';
import { ResetPasswordForm } from '@features/shared/auth-reset-password';
import styles from './reset-password.module.css';

export default function ResetPasswordPage() {
  return (
    <BrandBackground variant="login">
      <main className={styles.page}>
        <AuthCard title="Set New Password">
          <ResetPasswordForm />
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
