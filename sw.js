// sw.js - Basic fetch rewrite proxy
const PROXY_PREFIX = '/proxy/';

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith(PROXY_PREFIX)) {
    const encoded = url.pathname.slice(PROXY_PREFIX.length);
    let targetUrl;
    try {
      targetUrl = decodeURIComponent(atob(encoded));
    } catch (e) {
      return event.respondWith(new Response('Bad URL', { status: 400 }));
    }

    // Fetch the real site, but rewrite origins
    event.respondWith(
      fetch(targetUrl, {
        method: event.request.method,
        headers: event.request.headers,
        redirect: 'follow',
        credentials: 'include'  // Allow logins/cookies where possible
      }).then(response => {
        // Clone and modify response if needed (e.g. rewrite HTML links)
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;"); // Relax for proxy

        return response.text().then(text => {
          // Basic link rewriting (replace absolute URLs)
          let rewritten = text.replace(/(href|src|action)=["']\/([^"']+)["']/g, `$1="/proxy/${btoa('$2')}"`);
          rewritten = rewritten.replace(/(href|src|action)=["'](https?:\/\/[^"']+)["']/g, (m, attr, fullUrl) => {
            return `${attr}="/proxy/${btoa(fullUrl)}"`;
          });

          return new Response(rewritten, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        });
      }).catch(() => new Response('Proxy error', { status: 502 }))
    );
  } else {
    // Normal files (index.html, etc.)
    event.respondWith(fetch(event.request));
  }
});

function btoa(str) { return self.btoa(str); } // Ensure available
