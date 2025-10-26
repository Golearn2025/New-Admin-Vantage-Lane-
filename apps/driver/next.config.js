/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vantage-lane/ui-core',
    '@vantage-lane/formatters',
  ],
  images: {
    domains: ['fmeonuvmlopkutbjejlo.supabase.co'],
  },
};

module.exports = nextConfig;
