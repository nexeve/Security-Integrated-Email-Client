import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'div', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'hr', 'i', 'img', 'label', 'li', 'ol', 'p', 'span', 'strong', 
      'table', 'td', 'th', 'tr', 'u', 'ul', 'style'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'color', 
      'width', 'height', 'align', 'valign', 'cellpadding', 'cellspacing', 'border'
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}
