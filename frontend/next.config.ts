import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';
// 本番: Azure SWA の環境変数 API_URL に App Service の URL を設定
// 例: https://vocalaid-api.azurewebsites.net
const backendUrl = process.env.API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (isDev) {
      // ローカル開発: NestJS ローカルサーバーへ転送
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3004/api/:path*',
        },
      ];
    }
    if (backendUrl) {
      // 本番: Azure App Service へ転送
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
