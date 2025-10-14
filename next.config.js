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
};

export default nextConfig;
