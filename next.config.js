import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
export default {
  output: 'standalone',
  outputFileTracingRoot: root,
  poweredByHeader: false,
  sassOptions: { includePaths: [path.join(root, 'src')] },
  images: { loader: 'custom', loaderFile: './src/utils/imageLoader.ts' },
  experimental: { optimizeCss: true },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ] }];
  },
};
