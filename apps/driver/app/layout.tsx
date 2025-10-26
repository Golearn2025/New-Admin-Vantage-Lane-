/**
 * Root Layout - Driver Portal
 */

import type { Metadata } from 'next';
import '@vantage-lane/ui-core/tokens/index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Driver Portal | Vantage Lane',
  description: 'Your bookings, earnings, and profile',
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
