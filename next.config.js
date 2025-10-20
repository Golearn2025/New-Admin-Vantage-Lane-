const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // During build, we want strict TypeScript checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // During build, we want strict ESLint checking
    ignoreDuringBuilds: false,
  },
  
  webpack: (config) => {
    config.resolve.alias['@admin'] = path.resolve(__dirname, 'app/(admin)');
    config.resolve.alias['@admin-shared'] = path.resolve(__dirname, 'apps/admin/shared');
    config.resolve.alias['@contracts'] = path.resolve(__dirname, 'packages/contracts/src');
    config.resolve.alias['@ui-core'] = path.resolve(__dirname, 'packages/ui-core/src');
    config.resolve.alias['@ui-dashboard'] = path.resolve(__dirname, 'packages/ui-dashboard/src');
    config.resolve.alias['@formatters'] = path.resolve(__dirname, 'packages/formatters/src');
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'packages/styles');
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
