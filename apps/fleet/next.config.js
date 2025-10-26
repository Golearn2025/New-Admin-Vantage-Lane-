/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vantage-lane/ui-core',
    '@vantage-lane/ui-dashboard',
    '@vantage-lane/formatters',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: ['fmeonuvmlopkutbjejlo.supabase.co'],
  },
};

module.exports = nextConfig;
