import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, readFileSync } from 'fs';

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
        // Copy icons directory to dist for production build
        try {
          cpSync(
            resolve(__dirname, 'icons'),
            resolve(__dirname, 'dist/icons'),
            { recursive: true }
          );
          console.log('Copied icons/ to dist/icons/');
        } catch (e) {
          console.warn('Could not copy icons:', e.message);
        }
      }
    }
  ]
});
