'use client';

import { AppShell } from '@admin/shared/ui/composed/appshell';

export default function DashboardPage() {
  return (
    <AppShell role="admin" currentPath="/dashboard">
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Admin Dashboard - Charcoal Premium Design
        </p>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'var(--color-surface-elevated)', 
          borderRadius: '8px',
          border: '1px solid var(--color-border-default)'
        }}>
          <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 1rem 0' }}>
            ✨ Charcoal Premium AppShell Final
          </h3>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: '1.5rem' }}>
            <li>🎨 Elegant charcoal gradient background</li>
            <li>💎 Glass blur effects pe toate surfaces</li>
            <li>🌟 Premium dark aesthetic unificat</li>
            <li>👑 RBAC Admin cu 14 menu items</li>
            <li>📱 Mobile responsive cu focus trap</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
