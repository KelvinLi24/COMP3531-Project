import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative asset paths so GitHub Pages project sites can load bundled files correctly.
  base: './',
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  }
});
