// Build script to generate sitemap.xml
import fs from 'fs';
import path from 'path';

const APP_DOMAIN = 'https://srt2video.com';
const languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'];
const today = new Date().toISOString().split('T')[0];

// Generate sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add base URL
sitemap += `  <url>
    <loc>${APP_DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

// Add language-specific URLs
languages.forEach(lang => {
  sitemap += `  <url>
    <loc>${APP_DOMAIN}/?lang=${lang}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

sitemap += `</urlset>`;

// Write to public folder
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
