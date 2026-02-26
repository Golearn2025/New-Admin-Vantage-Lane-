/**
 * Settings Route - Admin
 * Commission settings and platform configuration
 */

import dynamic from 'next/dynamic';

const SettingsCommissions = dynamic(
  () => import('@features/admin/settings-commissions').then(mod => ({ default: mod.SettingsCommissions })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>,
    ssr: false 
  }
);

export default function SettingsPage() {
  return <SettingsCommissions />;
}
