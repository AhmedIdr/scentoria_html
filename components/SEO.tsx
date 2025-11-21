import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Scentoria | Luxury Moroccan Candles & Home Fragrances',
  description = 'Hand-poured luxury candles inspired by Morocco. 100% vegetable wax, artisanal fragrances for your home and spa.',
  image = 'https://source.unsplash.com/1200x630/?candle,luxury,morocco',
  url = 'https://scentoria.ma',
  type = 'website'
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description, true);
    setMetaTag('keywords', 'candles, luxury candles, moroccan candles, home fragrance, spa, artisanal', true);
    setMetaTag('author', 'Scentoria', true);

    // Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:url', url);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', 'Scentoria');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', title, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);

    // Additional meta tags
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0', true);
    setMetaTag('theme-color', '#F7F0E8', true);
  }, [title, description, image, url, type]);

  return null;
};
