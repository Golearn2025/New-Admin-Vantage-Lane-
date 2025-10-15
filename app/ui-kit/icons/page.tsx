/**
 * Icons Demo Page - UI Kit
 * 
 * Prezentare completa a setului de iconi\u021be cu preview \u0219i exemple de utilizare.
 */

import { Icon, IconName } from '@admin/shared/ui/icons';
import styles from './icons.module.css';

// Toate iconițele disponibile pentru demo
const allIcons: { name: IconName; label: string; category: string }[] = [
  // Navigation
  { name: 'dashboard', label: 'Dashboard', category: 'Navigation' },
  { name: 'calendar', label: 'Calendar', category: 'Navigation' },
  { name: 'users', label: 'Users', category: 'Navigation' },
  { name: 'documents', label: 'Documents', category: 'Navigation' },
  { name: 'support', label: 'Support', category: 'Navigation' },
  { name: 'settings', label: 'Settings', category: 'Navigation' },
  
  // Business
  { name: 'payments', label: 'Payments', category: 'Business' },
  { name: 'refunds', label: 'Refunds', category: 'Business' },
  { name: 'disputes', label: 'Disputes', category: 'Business' },
  { name: 'payouts', label: 'Payouts', category: 'Business' },
  { name: 'prices', label: 'Prices', category: 'Business' },
  { name: 'creditCard', label: 'Credit Card', category: 'Business' },
  { name: 'banknote', label: 'Banknote', category: 'Business' },
  
  // System
  { name: 'monitoring', label: 'Monitoring', category: 'System' },
  { name: 'projectHealth', label: 'Project Health', category: 'System' },
  { name: 'auditHistory', label: 'Audit History', category: 'System' },
  
  // UI Elements  
  { name: 'menu', label: 'Menu', category: 'UI Elements' },
  { name: 'chevronDown', label: 'Chevron Down', category: 'UI Elements' },
];

// Groupare pe categorii
const groupedIcons = allIcons.reduce((acc, icon) => {
  if (!acc[icon.category]) {
    acc[icon.category] = [];
  }
  acc[icon.category]!.push(icon);
  return acc;
}, {} as Record<string, typeof allIcons>);

export default function IconsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Icons - Design System</h1>
        <p className={styles.subtitle}>
          Set complet de iconițe SVG tree-shakable. Consistent style: 24×24px, stroke 1.5, currentColor.
        </p>
      </div>

      {/* Exemple de utilizare */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage Examples</h2>
        <div className={styles.usageGrid}>
          <div className={styles.usageExample}>
            <h3>Default Size (24px)</h3>
            <div className={styles.iconRow}>
              <Icon name="dashboard" />
              <Icon name="users" />
              <Icon name="settings" />
            </div>
            <code className={styles.code}>
              {'<Icon name="dashboard" />'}
            </code>
          </div>

          <div className={styles.usageExample}>
            <h3>Custom Sizes</h3>
            <div className={styles.iconRow}>
              <Icon name="calendar" size={16} />
              <Icon name="calendar" size={24} />
              <Icon name="calendar" size={32} />
              <Icon name="calendar" size={48} />
            </div>
            <code className={styles.code}>
              {'<Icon name="calendar" size={32} />'}
            </code>
          </div>

          <div className={styles.usageExample}>
            <h3>With Styling</h3>
            <div className={styles.iconRow}>
              <Icon name="support" className={styles.iconMuted} />
              <Icon name="support" className={styles.iconActive} />
              <Icon name="support" className={styles.iconDanger} />
            </div>
            <code className={styles.code}>
              {'<Icon name="support" className="active" />'}
            </code>
          </div>
        </div>
      </section>

      {/* Grid complet cu toate iconițele */}
      {Object.entries(groupedIcons).map(([category, icons]) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>{category}</h2>
          <div className={styles.iconGrid}>
            {icons.map((icon) => (
              <div key={icon.name} className={styles.iconCard}>
                <div className={styles.iconPreview}>
                  <Icon name={icon.name} size={24} />
                </div>
                <div className={styles.iconInfo}>
                  <span className={styles.iconLabel}>&quot;{icon.name}&quot;</span>
                  <code className={styles.iconName}>{icon.name}</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bundle info */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Tree-shakable</h3>
            <p>Import doar iconițele folosite pentru bundle size optimal.</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Zero Dependencies</h3>
            <p>Fără icon libraries externe. Pure SVG components.</p>
          </div>
          <div className={styles.infoCard}>
            <h3>A11y Ready</h3>
            <p>Support pentru aria-label și role=&quot;img&quot; automat.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
