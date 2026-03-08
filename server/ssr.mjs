// Simple SSR Server - Real Server-Side Rendering
import express from 'express';
import { createServer as createViteServer } from 'vite';

const translations = {
  en: {
    seo: {
      title: 'SRT2Video by ViralCut AI - Best Subtitle to Video Converter',
      description: 'Transform SRT subtitle files into viral short videos instantly with AI. Generate cinematic scenes, add background videos, and burn subtitles. Free daily credits.',
      keywords: 'subtitle to video, SRT to Video, SRT2Video, convert subtitles to video, turn script into AI video'
    }
  },
  zh: {
    seo: {
      title: 'SRT2Video (ViralCut AI) - 字幕转视频工具',
      description: 'AI字幕转视频工具，一键将SRT字幕文件转换成TikTok、Reels短视频。使用AI生成电影级场景，每日免费额度。',
      keywords: '字幕转视频, SRT转视频, AI视频生成'
    }
  },
  es: {
    seo: {
      title: 'SRT2Video - Convertidor de Subtitulos a Video',
      description: 'Convierte archivos SRT a videos virales con IA. Genera escenas cinematograficas automaticamente.',
      keywords: 'subtitle to video, SRT a video'
    }
  }
};

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use(async (req, res) => {
    const url = req.originalUrl;
    try {
      const lang = getLanguage(req);
      const html = renderSSRPage(url, lang);
      res.setHeader('Content-Type', 'text/html').send(html);
    } catch (e) {
      console.error('SSR Error:', e);
      res.status(500).send('Internal Server Error');
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SSR Server running at http://0.0.0.0:${PORT}`);
  });
}

function renderSSRPage(url, lang) {
  const t = translations[lang] || translations.en;
  const seo = t.seo;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <meta name="keywords" content="${seo.keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://srt2video.com/${lang === 'en' ? '' : '?lang=' + lang}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://srt2video.com/${lang === 'en' ? '' : '?lang=' + lang}">
  <meta property="og:site_name" content="ViralCut AI (SRT2Video)">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.description}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SRT2Video by ViralCut AI",
    "description": "${seo.description}",
    "url": "https://srt2video.com/",
    "applicationCategory": "MultimediaApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }
  </script>
  
  <link rel="icon" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0f0f12; color: #e2e8f0; margin: 0; font-family: system-ui, sans-serif; }
    .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #fff; }
    .hero p { color: #94a3b8; margin-bottom: 2rem; max-width: 600px; }
    .loading { color: #64748b; }
  </style>
</head>
<body>
  <div id="root">
    <div class="hero">
      <h1>${seo.title}</h1>
      <p>${seo.description}</p>
      <p class="loading">Loading your AI video generator...</p>
    </div>
  </div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;
}

function getLanguage(req) {
  const urlParams = new URL(req.url, `http://${req.headers.host}`);
  const langParam = urlParams.searchParams.get('lang');
  if (langParam) return langParam;
  
  const acceptLang = req.headers['accept-language'];
  if (acceptLang) {
    const preferred = acceptLang.split(',')[0].split('-')[0];
    const supported = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'];
    if (supported.includes(preferred)) return preferred;
  }
  
  return 'en';
}

createServer();
