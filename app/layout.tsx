import { ReactNode } from 'react';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Vantage Lane Admin</title>
        <meta name="description" content="Vantage Lane Administration Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons - Using real brand logo */}
        <link rel="icon" href="/brand/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload brand logo for faster LCP */}
        <link rel="preload" href="/brand/logo.png" as="image" />
      </head>
      <body>{children}</body>
    </html>
  );
}
