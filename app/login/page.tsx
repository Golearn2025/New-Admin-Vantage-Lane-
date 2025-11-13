/**
 * Login Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/shared/auth-login.
 * Uses lucide-react icons (no emoji).
 */

import { LoginForm } from '@features/shared/auth-login';
import { AuthCard, BrandBackground } from '@vantage-lane/ui-core';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <BrandBackground variant="login">
      <main className={styles.page}>
        <AuthCard title="Sign In">
          <LoginForm />
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
