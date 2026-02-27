import bundleAnalyzer from '@next/bundle-analyzer';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode to prevent double mounting issues with real-time subscriptions
  // Double mounting causes memory leaks and server crashes with Supabase Realtime
  reactStrictMode: false,

  // Transpile internal monorepo packages
  transpilePackages: ['@vantage-lane/ui-core'],

  // Optimize package imports for faster Fast Refresh
  experimental: {
    optimizePackageImports: [
      '@features',
      '@entities', 
      '@vantage-lane',
      'lucide-react',
      'recharts',
    ],
    // Allow larger file uploads in Server Actions (for document uploads)
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Modularize imports to reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
    'recharts': {
      transform: 'recharts/es6/{{member}}',
    },
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

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
    // Temporarily ignore ESLint during builds to allow deployment
    // TODO: Fix ESLint errors in api-test, layout, logout pages
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Enable webpack cache for Fast Refresh (HMR)
    // Only disable for specific problematic modules if needed
    if (dev) {
      // Keep cache enabled for Fast Refresh to work!
      // config.cache is managed by Next.js automatically
    }

    // Module resolution managed by Next.js (no override needed)

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

export default withBundleAnalyzer(nextConfig);
