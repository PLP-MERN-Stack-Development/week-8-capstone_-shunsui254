const CACHE_NAME = 'mybudgeteer-v1';
const STATIC_CACHE_NAME = 'mybudgeteer-static-v1';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Create a simple offline fallback page
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/transactions/,
  /\/api\/budgets/,
  /\/api\/goals/,
  /\/api\/bills/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle other requests (images, scripts, etc.)
  event.respondWith(handleGenericRequest(request));
});

// Cache-first strategy for API requests
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Check if this API endpoint should be cached
    const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
    
    if (!shouldCache) {
      return fetch(request);
    }

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // If we have a cached response and we're offline, return it
    if (cachedResponse && !navigator.onLine) {
      console.log('Serving cached API response:', request.url);
      return cachedResponse;
    }

    try {
      // Try to fetch from network
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses
        const responseClone = networkResponse.clone();
        await cache.put(request, responseClone);
        console.log('API response cached:', request.url);
      }
      
      return networkResponse;
    } catch (networkError) {
      // Network failed, return cached response if available
      if (cachedResponse) {
        console.log('Network failed, serving cached API response:', request.url);
        return cachedResponse;
      }
      
      // Return a custom offline response for API requests
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'This data is not available offline',
          cached: false
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error handling API request:', error);
    return new Response('Service Worker Error', { status: 500 });
  }
}

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('Serving cached static asset:', request.url);
      return cachedResponse;
    }

    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('Static asset cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error handling static asset:', error);
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Network-first strategy for other requests
async function handleGenericRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving cached response:', request.url);
      return cachedResponse;
    }
    
    // No cached response available
    return new Response('Content not available offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Sync pending transactions when back online
async function syncTransactions() {
  try {
    console.log('Syncing pending transactions...');
    
    // Get pending transactions from IndexedDB or localStorage
    const pendingTransactions = await getPendingTransactions();
    
    if (pendingTransactions.length === 0) {
      console.log('No pending transactions to sync');
      return;
    }

    // Sync each pending transaction
    for (const transaction of pendingTransactions) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });

        if (response.ok) {
          await removePendingTransaction(transaction.id);
          console.log('Transaction synced successfully:', transaction.id);
        } else {
          console.error('Failed to sync transaction:', transaction.id, response.statusText);
        }
      } catch (error) {
        console.error('Error syncing transaction:', transaction.id, error);
      }
    }

    console.log('Transaction sync completed');
  } catch (error) {
    console.error('Error during transaction sync:', error);
  }
}

// Helper functions for pending transactions (would typically use IndexedDB)
async function getPendingTransactions() {
  try {
    // In a real implementation, this would use IndexedDB
    // For demo purposes, we'll use a simple approach
    const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    return syncQueue;
  } catch (error) {
    console.error('Error getting pending transactions:', error);
    return [];
  }
}

async function removePendingTransaction(transactionId) {
  try {
    // In a real implementation, this would use IndexedDB
    const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    const updatedQueue = syncQueue.filter(t => t.id !== transactionId);
    localStorage.setItem('sync_queue', JSON.stringify(updatedQueue));
  } catch (error) {
    console.error('Error removing pending transaction:', error);
  }
}

// Message handling for communication with the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'CACHE_TRANSACTION') {
    // Cache a new transaction for offline access
    cacheTransaction(event.data.transaction);
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    // Return cache status to the main thread
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
});

// Cache a transaction for offline access
async function cacheTransaction(transaction) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const request = new Request(`/api/transactions/${transaction.id}`);
    const response = new Response(JSON.stringify(transaction), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(request, response);
    console.log('Transaction cached:', transaction.id);
  } catch (error) {
    console.error('Error caching transaction:', error);
  }
}

// Get cache status information
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    let itemCount = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      itemCount += keys.length;
      
      // Estimate cache size (rough calculation)
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const text = await response.text();
          totalSize += text.length;
        }
      }
    }

    return {
      cacheNames,
      totalSize,
      itemCount,
      isOnline: navigator.onLine
    };
  } catch (error) {
    console.error('Error getting cache status:', error);
    return {
      cacheNames: [],
      totalSize: 0,
      itemCount: 0,
      isOnline: navigator.onLine
    };
  }
}
