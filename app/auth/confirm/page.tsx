/**
 * Confirm Email Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/shared/auth-confirm-email.
 */

import { BrandBackground, AuthCard } from '@vantage-lane/ui-core';
import { ConfirmEmailStatus } from '@features/shared/auth-confirm-email';
import styles from './confirm.module.css';

export default function ConfirmEmailPage() {
  return (
    <BrandBackground variant="login">
      <main className={styles.page}>
        <AuthCard title="Email Verification">
          <ConfirmEmailStatus />
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
