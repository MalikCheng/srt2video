import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from 'vite-prerender-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    prerender({
      renderTarget: '#root',
      prerenderScript: '/prerender.js',
      routes: ['/'],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
