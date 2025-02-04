/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
    ],
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false
  },
};


export default nextConfig;
