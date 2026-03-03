import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  // 開発時のみリライト（本番の Azure SWA は /api/* を自前でルーティングするため不要）
  ...(isDev && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3004/api/:path*',
        },
      ];
    },
  }),
};

export default nextConfig;
