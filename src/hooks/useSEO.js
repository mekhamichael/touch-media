import { useEffect } from 'react';

function setMetaTag(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[([\w-]+)="([^"]+)"\]/);
    if (match) {
      element.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export function useSEO({ title, description, ogTitle, canonical, noindex } = {}) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      setMetaTag('meta[name="description"]', 'content', description);
      setMetaTag('meta[property="og:description"]', 'content', description);
    }
    if (ogTitle || title) {
      setMetaTag('meta[property="og:title"]', 'content', ogTitle || title);
    }
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
      setMetaTag('meta[property="og:url"]', 'content', canonical);
    }
    if (noindex) {
      setMetaTag('meta[name="robots"]', 'content', 'noindex');
    }
  }, [title, description, ogTitle, canonical, noindex]);
}
