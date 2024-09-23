import api from '../services/api';

export const handleDevToolsRequest = () => {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string' && input.includes('/auth/login') && init?.method === 'GET') {
      console.log('Intercepted DevTools GET request to /auth/login');
      return Promise.resolve(new Response(JSON.stringify({ success: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    return originalFetch.apply(this, arguments as any);
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    if (method.toLowerCase() === 'get' && url.toString().includes('/auth/login')) {
      console.log('Intercepted DevTools XHR GET request to /auth/login');
      this.abort();
      return;
    }
    originalXHROpen.apply(this, arguments as any);
  };
};