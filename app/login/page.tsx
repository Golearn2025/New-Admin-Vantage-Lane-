/**
 * Login Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/shared/auth-login.
 * Uses lucide-react icons (no emoji).
 */

import { AuthCard } from '@vantage-lane/ui-core/AuthCard';
import { BrandBackground } from '@vantage-lane/ui-core/BrandBackground';
import dynamic from 'next/dynamic';
import styles from './login.module.css';

const LoginForm = dynamic(
  () => import('@features/shared/auth-login').then(mod => ({ default: mod.LoginForm })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>,
    ssr: false 
  }
);

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
