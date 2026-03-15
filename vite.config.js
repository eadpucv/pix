import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync } from 'fs';

export default defineConfig({
  base: './',
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
