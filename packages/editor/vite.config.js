import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { cpSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const coreRoot = dirname(require.resolve('@pix/core/package.json'));

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  base: '/pix/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    open: true
  },
  plugins: [
    {
      name: 'copy-icons',
      closeBundle() {
        try {
          cpSync(
            resolve(coreRoot, 'icons'),
            resolve(__dirname, 'dist/icons'),
            { recursive: true }
          );
          console.log(`Copied icons/ from ${coreRoot} to dist/icons/`);
        } catch (e) {
          console.warn('Could not copy icons:', e.message);
        }
      }
    }
  ]
});
