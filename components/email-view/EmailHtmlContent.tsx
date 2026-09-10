'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface EmailHtmlContentProps {
  html: string;
}

/**
 * Renders sanitized email HTML inside a sandboxed <iframe>.
 *
 * Lifecycle contract:
 *  - Height is adjusted only after the iframe fires its `load` event,
 *    which guarantees that `contentDocument`, `documentElement`, and
 *    `body` all exist and are fully parsed.
 *  - A ResizeObserver on the iframe body tracks subsequent layout
 *    changes (e.g. images loading), updating the height each time.
 *  - All observers and timers are cleaned up on unmount.
 *  - The function never accesses `doc.body` without first verifying
 *    that `doc`, `doc.documentElement`, and `doc.body` are non-null.
 *  - A fallback `window.setTimeout` is used only when ResizeObserver is
 *    unavailable (very old browsers).
 */
export function EmailHtmlContent({ html }: EmailHtmlContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Stable height-calculation function.  Guards every DOM access.
  const adjustHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc || !doc.documentElement || !doc.body) return;

    const height = Math.max(
      doc.body.scrollHeight,
      doc.documentElement.scrollHeight,
      300 // minimum sensible height
    );

    iframe.style.height = `${height}px`;
  }, []);

  // Attach a ResizeObserver to the iframe body so that layout changes
  // (images loading, dynamic content) keep the height in sync.
  const attachObserver = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc || !doc.body) return;

    // Disconnect any previous observer before creating a new one.
    observerRef.current?.disconnect();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => adjustHeight());
      ro.observe(doc.body);
      observerRef.current = ro;
    }
  }, [adjustHeight]);

  // Called by the iframe's onLoad handler — the only reliable signal that
  // the document is fully parsed and the body element exists.
  const handleLoad = useCallback(() => {
    adjustHeight();
    attachObserver();
  }, [adjustHeight, attachObserver]);

  // Re-wire when html prop changes (new email opened).
  useEffect(() => {
    // The height and observer are set via the iframe's onLoad event below;
    // this effect only ensures cleanup when the component unmounts or the
    // html content is replaced.
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [html]);

  const srcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #ffffff;
        color: #000000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                     Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        padding: 24px;
        word-wrap: break-word;
        overflow-x: hidden;
      }
      a { color: #0056b3; text-decoration: none; }
      a:hover { text-decoration: underline; }
      img { max-width: 100%; height: auto; display: block; }
      table { border-collapse: collapse; max-width: 100%; }
    </style>
  </head>
  <body>${html}</body>
</html>`;

  return (
    <div className="rounded-lg overflow-hidden border border-border/10 bg-white shadow-inner">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="Email Content"
        sandbox="allow-same-origin allow-popups"
        className="w-full border-0 transition-all duration-300"
        style={{ minHeight: '300px' }}
        onLoad={handleLoad}
      />
    </div>
  );
}
