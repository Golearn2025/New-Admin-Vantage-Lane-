/**
 * UI Kit Showcase - QA Testing Page
 * 
 * This page showcases all UI core components in all states
 * for visual QA and accessibility testing.
 */

import { Button } from '@admin/shared/ui/core/Button';
import { Input } from '@admin/shared/ui/core/Input';
import { Card } from '@admin/shared/ui/core/Card';
import { FormRow } from '@admin/shared/ui/composed/FormRow';
import styles from './UIKit.module.css';

export default function UIKitPage() {
  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <h1 className={styles['title']}>UI Kit Showcase</h1>
        <p className={styles['subtitle']}>
          Visual showcase of all UI core components for QA testing and development reference.
        </p>
      </header>

      {/* Button Component Showcase */}
      <section className={styles['section']}>
        <h2 className={styles['sectionTitle']}>Button Component</h2>
        
        <div className={styles['subsection']}>
          <h3 className={styles['subsectionTitle']}>Variants</h3>
          <div className={styles['componentGrid']}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Sizes</h3>
          <div className={styles.componentGrid}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>States</h3>
          <div className={styles.componentGrid}>
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>
      </section>

      {/* Input Component Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input Component</h2>
        
        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Basic Inputs</h3>
          <div className={styles.formGrid}>
            <FormRow id="demo-email" label="Email" type="email" placeholder="Enter your email" />
            <FormRow id="demo-password" label="Password" type="password" placeholder="Enter password" />
            <FormRow id="demo-required" label="Required Field" required placeholder="This field is required" />
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>States</h3>
          <div className={styles.formGrid}>
            <FormRow id="demo-default" label="Default State" placeholder="Normal input" />
            <FormRow id="demo-error" label="Error State" error="This field is required" placeholder="Input with error" />
            <FormRow id="demo-disabled" label="Disabled State" disabled placeholder="Disabled input" />
            <FormRow id="demo-hint" label="With Hint" hint="This is a helpful hint" placeholder="Input with hint" />
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Sizes</h3>
          <div className={styles.formGrid}>
            <FormRow id="demo-sm" label="Small" size="sm" placeholder="Small input" />
            <FormRow id="demo-md" label="Medium" size="md" placeholder="Medium input" />
            <FormRow id="demo-lg" label="Large" size="lg" placeholder="Large input" />
          </div>
        </div>
      </section>

      {/* Card Component Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Card Component</h2>
        
        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Padding Variants</h3>
          <div className={styles.cardGrid}>
            <Card padding="none">
              <div className={styles.cardContent}>No Padding</div>
            </Card>
            <Card padding="sm">
              <div className={styles.cardContent}>Small Padding</div>
            </Card>
            <Card padding="md">
              <div className={styles.cardContent}>Medium Padding</div>
            </Card>
            <Card padding="lg">
              <div className={styles.cardContent}>Large Padding</div>
            </Card>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Shadow Variants</h3>
          <div className={styles.cardGrid}>
            <Card shadow="none">
              <div className={styles.cardContent}>No Shadow</div>
            </Card>
            <Card shadow="sm">
              <div className={styles.cardContent}>Small Shadow</div>
            </Card>
            <Card shadow="md">
              <div className={styles.cardContent}>Medium Shadow</div>
            </Card>
            <Card shadow="lg">
              <div className={styles.cardContent}>Large Shadow</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Design Tokens Preview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Design Tokens</h2>
        
        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Color Palette</h3>
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-accent-500)'}}>
              <span>Primary</span>
            </div>
            <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-success-default)'}}>
              <span>Success</span>
            </div>
            <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-warning-default)'}}>
              <span>Warning</span>
            </div>
            <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-danger-default)'}}>
              <span>Danger</span>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Test Area</h2>
        <p className={styles.note}>
          This section is used for Lighthouse testing to ensure:
          <br />• LCP &lt; 2s (Dashboard demo)
          <br />• CLS &lt; 0.1
          <br />• TBT &lt; 200ms
        </p>
      </section>
    </div>
  );
}
