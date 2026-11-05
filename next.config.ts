import type { NextConfig } from 'next';
const config: NextConfig = {
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  images: { unoptimized: true },
  experimental: {
    agentUpgrade: 'security'
  }
};
export default config;
