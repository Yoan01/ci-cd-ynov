/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  images: {
    unoptimized: true,
  },
  basePath: '/ci-cd-ynov', // à retirer quand on dev en local permet d'avoir le css dans le deploiement
  assetPrefix: '/ci-cd-ynov/', // à retirer quand on dev en local permet d'avoir le css dans le deploiement
};

export default nextConfig;
