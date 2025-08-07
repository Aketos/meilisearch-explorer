import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ignore ESLint during production builds (Docker) — runtime is unaffected
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_MEILISEARCH_HOST: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
    NEXT_PUBLIC_MEILISEARCH_API_KEY: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || '',
  },
  async redirects() {
    return [
      {
        source: '/index/:indexUid',
        destination: '/indexes/:indexUid',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
