/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vantage-lane/ui-core',
    '@vantage-lane/ui-icons',
    '@vantage-lane/ui-dashboard',
    '@vantage-lane/formatters',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Allow importing files from outside the app directory (monorepo packages)
    externalDir: true,
  },
};

module.exports = nextConfig;
