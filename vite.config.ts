import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    vike(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg'],
});
