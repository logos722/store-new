import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  includePaths: [path.resolve(__dirname, 'src')],
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
};
