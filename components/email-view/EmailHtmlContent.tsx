import React, { useRef, useEffect } from 'react';

interface EmailHtmlContentProps {
  html: string;
}

export function EmailHtmlContent({ html }: EmailHtmlContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const adjustHeight = () => {
    try {
      if (iframeRef.current?.contentWindow) {
        const doc = iframeRef.current.contentWindow.document;
        // Scroll height gives the total content height
        const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
        iframeRef.current.style.height = `${height}px`;
      }
    } catch (e) {
      console.error('Failed to resize iframe', e);
    }
  };

  useEffect(() => {
    // We can also poll or set up an observer inside the parent 
    // to watch the iframe's body for size changes (like images loading)
    let observer: ResizeObserver | null = null;
    let timeout: NodeJS.Timeout;

    const setupObserver = () => {
      try {
        const body = iframeRef.current?.contentWindow?.document.body;
        if (body) {
          observer = new ResizeObserver(() => {
            adjustHeight();
          });
          observer.observe(body);
        } else {
          // If body isn't ready, try again
          timeout = setTimeout(setupObserver, 100);
        }
      } catch (e) {
        // cross origin or other error
      }
    };

    setupObserver();

    return () => {
      observer?.disconnect();
      clearTimeout(timeout);
    };
  }, [html]);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            background-color: #ffffff;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            padding: 24px;
            margin: 0;
            word-wrap: break-word;
          }
          a { color: #0056b3; text-decoration: none; }
          a:hover { text-decoration: underline; }
          img { max-width: 100%; height: auto; display: block; }
          table { border-collapse: collapse; max-width: 100%; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <div className="rounded-lg overflow-hidden border border-border/10 bg-white shadow-inner">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="Email Content"
        sandbox="allow-same-origin allow-popups"
        className="w-full border-0 transition-all duration-300"
        style={{ minHeight: '300px' }}
        onLoad={adjustHeight}
      />
    </div>
  );
}
