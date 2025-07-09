import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://localhost:5000/images/:path*'
      }
    ]
  }
};

export default nextConfig;
