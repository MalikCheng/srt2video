import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';
import { setupApiRoutes } from './server/apiRoutes.mjs';

function apiDevPlugin() {
  return {
    name: 'api-dev-plugin',
    configureServer(server) {
      const app = express();
      app.use(express.json({ limit: '50mb' }));
      setupApiRoutes(app);
      server.middlewares.use(app);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    apiDevPlugin(),
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
