// SSR Server - Production optimized
import express from 'express';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 8080;

// Project paths - fixed to use dist/ instead of dist/client
const projectRoot = join(__dirname, '..');
const distPath = join(projectRoot, 'dist');

const translations = {
  en: { seo: { title: 'SRT2Video by ViralCut AI', description: 'Transform SRT to video with AI' } },
  zh: { seo: { title: 'SRT2Video AI', description: 'AI字幕转视频工具' } },
  es: { seo: { title: 'SRT2Video', description: 'Convierte SRT a video con IA' } }
};

import { setupApiRoutes } from './apiRoutes.mjs';

function createServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
  });

  setupApiRoutes(app);

  // In production, serve static files directly
  if (isProduction) {
    console.log('Serving static from:', distPath);
    app.use(express.static(distPath));
  }

  // Fallback to index.html for SPA - use regex for Express 5 compatibility
  app.use((req, res) => {
    if (isProduction) {
      const indexPath = join(distPath, 'index.html');
      if (existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    // For dev, return a simple message
    res.send('SRT2Video Server Running');
  });

  // Bind to 0.0.0.0 for Cloud Run
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SRT2Video Server running on port ${PORT}`);
  });
}

createServer();
