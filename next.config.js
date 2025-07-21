import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  images: {
    domains: ['localhost', 'backend'],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_IMAGE_HOST ?? 'http://localhost:5000';
    return [
      {
        source: '/images/:path*',
        destination: `${host}/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
