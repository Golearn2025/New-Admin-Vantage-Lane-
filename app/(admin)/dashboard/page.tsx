export default function DashboardPage() {
  return (
    <div style={{ padding: 'var(--spacing-8)' }}>
      <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Admin Dashboard - Charcoal Premium Design
      </p>

      <div style={{
        marginTop: 'var(--spacing-8)',
        padding: 'var(--spacing-4)',
        background: 'var(--color-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-default)'
      }}>
        <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 var(--spacing-4) 0' }}>
          ✨ Charcoal Premium AppShell Final
        </h3>
        <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 'var(--spacing-6)' }}>
          <li>🎨 Elegant charcoal gradient background</li>
          <li>💎 Glass blur effects pe toate surfaces</li>
          <li>🌟 Premium dark aesthetic unificat</li>
          <li>👑 RBAC Admin cu 14 menu items</li>
          <li>📱 Mobile responsive cu focus trap</li>
        </ul>
      </div>
    </div>
  );
}
