/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // 動的APIルートを有効にするため、output: 'export' は完全に削除
};

module.exports = nextConfig;