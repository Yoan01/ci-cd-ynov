/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  images: {
    unoptimized: true,
  },
  basePath: '/ci-cd-ynov',
  assetPrefix: '/ci-cd-ynov/',
};

export default nextConfig;
