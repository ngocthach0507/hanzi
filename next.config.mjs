/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/hsk/:level/lesson/:lesson',
        destination: '/giao-trinh/hsk:level/bai-:lesson',
      },
      {
        source: '/hsk/:level',
        destination: '/giao-trinh/hsk:level',
      }
    ]
  },
};

export default nextConfig;
