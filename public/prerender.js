// Prerender script for SEO - generates static HTML content
export async function prerender() {
  // Full SEO-optimized HTML content for the landing page
  const html = `
<div id="root">
  <header class="header">
    <nav class="navbar">
      <div class="logo">
        <img src="/logo.svg" alt="ViralCut AI Logo" />
        <span>ViralCutAI</span>
      </div>
      <div class="nav-links">
        <select class="language-select" aria-label="Select Language">
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
        <a href="#help" class="help-btn">Login Help</a>
        <a href="#login" class="signin-btn">Sign in</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>SRT to Video Converter</h1>
      <h2>Turn Subtitles into <strong>Viral Short Videos</strong></h2>
      <p>Upload your SRT file. Our AI Director will analyze the script and generate cinematic scenes using high-fidelity image generation and motion effects.</p>
      
      <div class="upload-area">
        <div class="upload-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <p>Click to upload or drag and drop</p>
        <span>SRT files only</span>
      </div>
    </section>

    <section class="features">
      <h2>The Ultimate SRT to Video Converter</h2>
      <p><strong>SRT2Video by ViralCut AI</strong> solves the biggest challenge for content creators: turning plain text subtitles into engaging visual stories. Unlike traditional editors where you must manually find stock footage, our tool uses Generative AI to <strong>convert subtitles to video instantly</strong>.</p>
      
      <h3>Why Choose ViralCut for Subtitle Visualization?</h3>
      <ul>
        <li>Transform to MP4 automatically .srt files</li>
        <li>No watermarks on generated scenes</li>
        <li>AI understands context, mood, and lighting</li>
        <li>Perfect for TikTok, Reels, and YouTube Shorts</li>
        <li>Support for English, Chinese, Spanish, and more</li>
      </ul>
    </section>

    <section class="how-it-works">
      <h2>How to Convert SRT to Video with AI?</h2>
      <p>Create viral content in 3 simple steps without any video editing skills.</p>
      
      <div class="steps">
        <div class="step">
          <div class="step-icon">1</div>
          <h3>Upload SRT File</h3>
          <p>Simply drag and drop your .srt subtitle file. Our system parses the timestamps and text content instantly.</p>
        </div>
        <div class="step">
          <div class="step-icon">2</div>
          <h3>AI Analysis & Style</h3>
          <p>Select a visual aesthetic (Cinematic, Anime, Minimalist). Our AI analyzes the script to generate context-aware visuals.</p>
        </div>
        <div class="step">
          <div class="step-icon">3</div>
          <h3>Download Video</h3>
          <p>Review generated scenes, regenerate if needed, and export your final MP4 video with subtitles burned in.</p>
        </div>
      </div>
    </section>

    <section class="use-cases">
      <h2>Scale Your Content Production</h2>
      
      <div class="use-case">
        <h3>Convert Subtitles to TikTok Video</h3>
        <p>Stop searching for generic stock footage. Generate original, eye-catching backgrounds that keep retention high on TikTok and Reels.</p>
      </div>
      
      <div class="use-case">
        <h3>Turn Script into AI Video</h3>
        <p>Have a video essay script? Convert it to SRT, upload it here, and get a full storyboard visualizer for your YouTube channel.</p>
      </div>
      
      <div class="use-case">
        <h3>Global Reach</h3>
        <p>We support multi-language SRT files. Create videos for global audiences by simply uploading translated subtitle files.</p>
      </div>
    </section>

    <section class="languages">
      <h2>Supported Languages for SRT to Video</h2>
      <p>ViralCut AI supports subtitle files in all major languages.</p>
      <ul class="language-list">
        <li>English (US/UK)</li>
        <li>Chinese (Simplified/Traditional)</li>
        <li>Spanish (Español)</li>
        <li>French (Français)</li>
        <li>German (Deutsch)</li>
        <li>Japanese (日本語)</li>
        <li>Korean (한국어)</li>
        <li>Portuguese</li>
        <li>Italian</li>
        <li>Russian</li>
      </ul>
    </section>

    <section class="faq">
      <h2>Frequently Asked Questions</h2>
      
      <details>
        <summary>How to add background video to SRT file?</summary>
        <p>Traditionally, you use video editors like Premiere Pro. With SRT2Video, you just upload the SRT, and our AI automatically creates and adds the background video that matches your text context.</p>
      </details>
      
      <details>
        <summary>Is SRT2Video free to use?</summary>
        <p>Yes, we provide daily free credits for all users. You can convert subtitles to video for free every day. For high-volume professional use, we offer premium API keys.</p>
      </details>
      
      <details>
        <summary>What video formats do you support?</summary>
        <p>You can export your final video in .mp4 or .webm formats. We support both vertical (9:16) aspect ratios for mobile viewing and horizontal (16:9) for desktop.</p>
      </details>
      
      <details>
        <summary>Does it work with non-English subtitles?</summary>
        <p>Absolutely. Our underlying Gemini AI models are multilingual. You can upload SRT files in Chinese, Spanish, French, Japanese, German, and many other languages.</p>
      </details>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 ViralCut AI. All rights reserved.</p>
  </footer>
</div>`;

  return {
    html,
    links: new Set(),
    meta: {
      title: 'SRT2Video by ViralCut AI - Best Subtitle to Video Converter',
      description: 'The ultimate subtitle to video converter by ViralCut AI. Instantly transform SRT files into viral short videos, turn scripts into AI video backgrounds, and burn subtitles online for free.',
      keywords: 'subtitle to video, SRT to Video, SRT2Video, convert subtitles to video, turn script into AI video, add background video to SRT, srt converter for tiktok, ViralCut AI',
    },
  };
}
