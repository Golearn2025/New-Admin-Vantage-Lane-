/**
 * BrandBackground Demo - toate variantele
 * 
 * Demonstrează toate variantele de BrandBackground reutilizabil
 * cu Cristi's 6-layer carbon fiber design.
 */

'use client';

import { BrandBackground } from '@admin/shared/ui/composed/BrandBackground';
import styles from './background.module.css';

export default function BackgroundDemo() {
  return (
    <div className={styles.demoContainer}>
      <h1 className={styles.title}>BrandBackground - All Variants</h1>
      <p className={styles.subtitle}>
        Cristi&apos;s 6-layer carbon fiber background cu variante reutilizabile
      </p>

      <div className={styles.variantGrid}>
        {/* Login Variant */}
        <div className={styles.variantCard}>
          <h3 className={styles.variantTitle}>Login Variant</h3>
          <p className={styles.variantDesc}>Opacity 0.95 - Subtil pentru login page</p>
          <div className={styles.preview}>
            <BrandBackground variant="login" className={styles.miniPreview}>
              <div className={styles.previewContent}>
                <p>Login Background</p>
                <small>6 layers cu intensitate redusă</small>
              </div>
            </BrandBackground>
          </div>
        </div>

        {/* Shell Variant */}
        <div className={styles.variantCard}>
          <h3 className={styles.variantTitle}>Shell Variant</h3>
          <p className={styles.variantDesc}>Opacity 1.0 - Full intensity pentru AppShell</p>
          <div className={styles.preview}>
            <BrandBackground variant="shell" className={styles.miniPreview}>
              <div className={styles.previewContent}>
                <p>Scroll pentru parallax... it&apos;s beautiful!</p>
                <small>6 layers cu intensitate full</small>
              </div>
            </BrandBackground>
          </div>
        </div>

        {/* Topbar Variant */}
        <div className={styles.variantCard}>
          <h3 className={styles.variantTitle}>Topbar Variant</h3>
          <p className={styles.variantDesc}>Opacity 0.8 - Foarte subtil pentru topbar</p>
          <div className={styles.preview}>
            <BrandBackground variant="topbar" className={styles.miniPreview}>
              <div className={styles.previewContent}>
                <p>Topbar Background</p>
                <small>6 layers foarte subtile</small>
              </div>
            </BrandBackground>
          </div>
        </div>
      </div>

      <div className={styles.usage}>
        <h2>Usage Examples</h2>
        <pre className={styles.codeBlock}>
{`// Login page
<BrandBackground variant="login">
  <AuthCard>...</AuthCard>
</BrandBackground>

// AppShell
<BrandBackground variant="shell">
  <AppShell>...</AppShell>  
</BrandBackground>

// Topbar component
<BrandBackground variant="topbar">
  <TopbarContent>...</TopbarContent>
</BrandBackground>`}
        </pre>
      </div>
    </div>
  );
}
