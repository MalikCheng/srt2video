// Production Server - Simple static file server
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Note: In Docker, dist is copied to /app/dist
const DIST_PATH = path.join(__dirname, 'dist');

const app = express();

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from dist/
app.use(express.static(DIST_PATH));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_PATH, 'index.html');
  console.log('Serving index.html for:', req.url);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found at ' + indexPath);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SRT2Video Server running on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_PATH}`);
});
