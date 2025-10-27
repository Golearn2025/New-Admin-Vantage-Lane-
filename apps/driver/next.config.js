/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vantage-lane/ui-core',
    '@vantage-lane/ui-icons',
    '@vantage-lane/formatters',
  ],
  experimental: {
    // Allow importing files from outside the app directory (monorepo packages)
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fmeonuvmlopkutbjejlo.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
