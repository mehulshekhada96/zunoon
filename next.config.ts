import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  images: { unoptimized: true },
  experimental: {
    agentUpgrade: 'security'
  }
};
export default config;
