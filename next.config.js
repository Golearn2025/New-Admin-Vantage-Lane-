import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Optimize package imports for faster Fast Refresh
  experimental: {
    optimizePackageImports: ['@features', '@entities', '@vantage-lane'],
    // Allow larger file uploads in Server Actions (for document uploads)
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Configure on-demand entries for better HMR
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  typescript: {
    // During build, we want strict TypeScript checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // During build, we want strict ESLint checking
    ignoreDuringBuilds: false,
  },

  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in development for Server Actions
    if (dev) {
      config.cache = false;
    }

    // Improve module resolution for faster rebuilds
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };

    // Alias configuration
    config.resolve.alias['@admin'] = resolve(__dirname, 'app/(admin)');
    config.resolve.alias['@admin-shared'] = resolve(__dirname, 'apps/admin/shared');
    config.resolve.alias['@contracts'] = resolve(__dirname, 'packages/contracts/src');
    config.resolve.alias['@ui-core'] = resolve(__dirname, 'packages/ui-core/src');
    config.resolve.alias['@ui-dashboard'] = resolve(__dirname, 'packages/ui-dashboard/src');
    config.resolve.alias['@formatters'] = resolve(__dirname, 'packages/formatters/src');
    config.resolve.alias['@styles'] = resolve(__dirname, 'packages/styles');
    
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
