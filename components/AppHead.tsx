import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { APP_DOMAIN } from '../config';

export const AppHead: React.FC = () => {
  const { language } = useLanguage();
  const seo = translations[language].seo;

  // Construct canonical URL based on language
  const canonicalUrl = language === 'en' 
    ? APP_DOMAIN 
    : `${APP_DOMAIN}/?lang=${language}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={language} />
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content="ViralCut AI" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={`${APP_DOMAIN}/og-image.jpg`} />
      <meta property="og:site_name" content="ViralCut AI" />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={`${APP_DOMAIN}/twitter-image.jpg`} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SRT2Video by ViralCut AI",
          "alternateName": "SRT to Video Converter",
          "description": seo.description,
          "url": APP_DOMAIN,
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1024"
          }
        })}
      </script>
    </Helmet>
  );
};
