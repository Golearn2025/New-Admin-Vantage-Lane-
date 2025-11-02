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

        {/* Critical Theme - Inline to prevent flash */}
        <style id="critical-theme" dangerouslySetInnerHTML={{__html: `
          :root {
            color-scheme: dark;
            --color-bg-primary: #0b0d10;
            --color-bg-secondary: #0f1117;
            --color-bg-elevated: #141820;
            --color-surface-hover: #171b24;
            --color-border-default: #1f2530;
            --color-border-secondary: #2a2f3a;
            --color-text-primary: #f9fafb;
            --color-text-secondary: #d1d5db;
            --skeleton-base: #141820;
            --skeleton-bar: #1f2530;
            --shadow-sm: 0 1px 4px rgba(0,0,0,.25);
          }
          html, body {
            background: var(--color-bg-primary);
            color: var(--color-text-primary);
            margin: 0;
            padding: 0;
          }
        `}} />

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
