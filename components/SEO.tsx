import React, { useEffect } from 'react';
import { config } from '../lib/config';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Discover premium women's fashion at HerAura. Shop our exclusive collection of dresses, tops, and accessories designed for the modern muse.",
  image = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200", 
  type = 'website'
}) => {
  useEffect(() => {
    const appName = config.app.name;
    const fullTitle = title === appName ? title : `${title} | ${appName}`;
    
    // Update Title
    document.title = fullTitle;

    // Meta tags to update
    const metaTags = {
      'description': description,
      'og:title': fullTitle,
      'og:description': description,
      'og:image': image,
      'og:type': type,
      'og:site_name': appName,
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': image,
    };

    // Update or Create Meta Tags
    Object.entries(metaTags).forEach(([name, content]) => {
      let selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:')) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    // Cleanup isn't strictly necessary for meta tags in a SPA as they get overwritten, 
    // but good practice if we wanted to revert to defaults.
  }, [title, description, image, type]);

  return null;
};