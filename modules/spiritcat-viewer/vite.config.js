import { defineConfig } from 'vite';
import { dirname } from 'node:path';
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
    emptyOutDir: true
  }
});
