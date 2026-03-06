// Simple Prerender Script - Generates SEO-friendly HTML
import fs from 'fs';
import path from 'path';

const translations = {
  en: {
    seo: {
      title: 'SRT2Video by ViralCut AI - Best Subtitle to Video Converter',
      description: 'Transform SRT subtitle files into viral short videos instantly with AI. Generate cinematic scenes, add background videos, and burn subtitles. Free daily credits.',
      keywords: 'subtitle to video, SRT to Video, SRT2Video, convert subtitles to video, turn script into AI video, add background video to SRT, srt converter for tiktok, AI video generator'
    }
  },
  zh: {
    seo: {
      title: 'SRT2Video (ViralCut AI) - 字幕转视频工具',
      description: 'AI字幕转视频工具，一键将SRT字幕文件转换成TikTok、Reels短视频。使用AI生成电影级场景，每日免费额度。',
      keywords: '字幕转视频, SRT转视频, AI视频生成, 短视频制作, TikTok视频'
    }
  },
  es: {
    seo: {
      title: 'SRT2Video - Convertidor de Subtitulos a Video',
      description: 'Convierte archivos SRT a videos virales con IA. Genera escenas cinematograficas automaticamente.',
      keywords: 'subtitle to video, SRT a video, convertir subtitulos'
    }
  }
};

function generateHTML(lang = 'en') {
  const t = translations[lang] || translations.en;
  const { title, description, keywords } = t.seo;
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://srt2video.com/${lang === 'en' ? '' : '?lang=' + lang}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://srt2video.com/${lang === 'en' ? '' : '?lang=' + lang}">
  <meta property="og:site_name" content="ViralCut AI (SRT2Video)">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SRT2Video by ViralCut AI",
    "description": "${description}",
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
  <div class="hero">
    <h1>SRT2Video by ViralCut AI</h1>
    <p>${description}</p>
    <p class="loading">Loading your AI video generator...</p>
  </div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;
}

// Generate HTML files
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Generate for each language
Object.keys(translations).forEach(lang => {
  const html = generateHTML(lang);
  const filename = lang === 'en' ? 'index.html' : `index.${lang}.html`;
  fs.writeFileSync(path.join(distDir, filename), html);
  console.log(`Generated: ${filename}`);
});

console.log('Prerendering complete!');
