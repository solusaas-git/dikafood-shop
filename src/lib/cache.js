/**
 * Simple in-memory cache for API responses
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
  }

  set(key, value, ttl = 300000) { // 5 minutes default
    this.cache.set(key, value);
    this.expiry.set(key, Date.now() + ttl);
  }

  get(key) {
    const expiry = this.expiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.expiry.delete(key);
  }

  clear() {
    this.cache.clear();
    this.expiry.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instance
const apiCache = new MemoryCache();

// Cache wrapper for API routes
export function withCache(handler, ttl = 300000) {
  return async (req, context) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return handler(req, context);
    }

    // Create cache key from URL and query params
    const url = new URL(req.url);
    const cacheKey = `${url.pathname}${url.search}`;

    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT'
        }
      });
    }

    // Execute handler
    const response = await handler(req, context);
    
    // Cache successful responses
    if (response.ok) {
      try {
        const responseClone = response.clone();
        const data = await responseClone.json();
        apiCache.set(cacheKey, data, ttl);
        
        // Add cache miss header
        response.headers.set('X-Cache', 'MISS');
      } catch (error) {
        console.warn('Failed to cache response:', error);
      }
    }

    return response;
  };
}

export { apiCache };
