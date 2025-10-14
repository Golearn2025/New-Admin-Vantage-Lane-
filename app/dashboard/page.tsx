'use client';

import { AppShell } from '@admin/shared/ui/composed/appshell';

export default function DashboardPage() {
  return (
    <AppShell role="admin" currentPath="/dashboard" variant="minimal">
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Main admin dashboard cu AppShell complet - Varianta Minimal
        </p>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'var(--color-surface-elevated)', 
          borderRadius: '8px',
          border: '1px solid var(--color-border-default)'
        }}>
          <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 1rem 0' }}>
            Acesta este AppShell Minimal în acțiune!
          </h3>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Sidebar persistent cu meniu RBAC</li>
            <li>Topbar cu search și user menu</li>
            <li>Navigation functional între pagini</li>
            <li>Dark theme cu design tokens</li>
            <li>Mobile responsive cu drawer</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
