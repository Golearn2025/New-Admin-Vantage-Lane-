/**
 * Root Layout - Fleet Portal
 * Provides base HTML structure and global styles
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fleet Management | Vantage Lane',
  description: 'Manage your drivers, vehicles, and bookings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
