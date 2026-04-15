import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: currentDir,
  base: './',
  server: {
    host: true,
    port: 5188
  },
  preview: {
    host: true,
    port: 4188
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        vault: resolve(currentDir, 'index.html'),
        guardian: resolve(currentDir, 'guardian.html'),
        hangzhou: resolve(currentDir, 'hangzhou.html'),
        classic: resolve(currentDir, 'classic.html')
      }
    }
  }
});
