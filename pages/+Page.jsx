// SSR Page Component - Server-Side Rendered with react-dom/server
export { render };

import React from 'react';
import { renderToString } from 'react-dom/server';
import { translations } from '../utils/translations';

function render({ is404, url, lang }) {
  const langKey = lang || 'en';
  const t = translations[langKey] || translations.en;
  const seo = t.seo || translations.en.seo;

  const html = `
<!DOCTYPE html>
<html lang="${langKey}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    <link rel="canonical" href="https://srt2video.com/" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://srt2video.com/" />
    <meta property="og:site_name" content="ViralCut AI (SRT2Video)" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    
    <!-- JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SRT2Video by ViralCut AI",
      "description": "${seo.description}",
      "url": "https://srt2video.com/",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
    </script>
    
    <link rel="icon" href="/favicon.svg" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        background-color: #0f0f12;
        color: #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div style="min-height: 100vh; background-color: #0f0f12; color: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 2rem; text-align: center;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">SRT2Video by ViralCut AI</h1>
        <p style="color: #94a3b8; margin-bottom: 2rem; max-width: 600px;">${seo.description}</p>
        <p style="color: #64748b;">Loading your AI video generator...</p>
      </div>
    </div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`;

  return html;
}
