const CACHE_NAME = 'hopeful-quotes-v11';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/quotes.json'
];

let dailyNotificationTimer = null;

function scheduleDailyNotification() {
  // Clear any existing timer to prevent scheduling duplicates
  if (dailyNotificationTimer) {
    clearTimeout(dailyNotificationTimer);
  }

  const now = new Date();
  // Set target time to 6:00 AM today
  const nextNotificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);

  // If it's already past 6:00 AM today, schedule it for 6:00 AM tomorrow
  if (now.getTime() > nextNotificationTime.getTime()) {
    nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
  }

  const delay = nextNotificationTime.getTime() - now.getTime();

  console.log(`Daily quote notification scheduled for ${nextNotificationTime}`);

  dailyNotificationTimer = setTimeout(() => {
    console.log('Showing daily quote notification.');
    self.registration.showNotification('Hopeful Quotes', {
      body: 'Want to read the quote of the day?',
      icon: '/icon-192x192.png',
      tag: 'daily-quote-notification', // Use a tag to ensure previous notifications are replaced
      renotify: true, // Vibrate/play sound even if a previous notification with the same tag exists
    });

    // Once the notification is shown, schedule the next one for the following day
    scheduleDailyNotification();
  }, delay);
}


// On install, cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache and caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).catch(err => {
            console.error('Failed to cache static assets:', err);
        })
    );
    self.skipWaiting();
});

// On activate, clean up old caches and ensure notification schedule is active
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            self.clients.claim();
            // This self-healing mechanism ensures that if the service worker is ever terminated,
            // it will attempt to restart the notification schedule the next time it activates.
            if (self.Notification && self.Notification.permission === 'granted') {
                console.log('Service Worker activated. Ensuring daily notification is scheduled.');
                scheduleDailyNotification();
            }
        })
    );
});

// Listen for messages from the client to trigger notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_WELCOME_NOTIFICATION') {
    event.waitUntil(
      self.registration.showNotification('Notifications Enabled!', {
        body: 'Thank you for enabling notifications. You are all set!',
        icon: '/icon-192x192.png',
        tag: 'welcome-notification'
      })
    );
  }
  if (event.data && event.data.type === 'START_DAILY_SCHEDULE') {
    console.log('Received command to start daily notification schedule.');
    scheduleDailyNotification();
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window for the app is already open, focus it.
      // We'll try to focus a visible client first.
      const visibleClient = clientList.find(c => c.visibilityState === 'visible');
      if (visibleClient) {
        return visibleClient.focus();
      }
      // Otherwise, focus the first client in the list.
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // If no clients are open, open a new window.
      return clients.openWindow('/');
    })
  );
});


// On fetch, use a more robust caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;

    // For navigation requests (loading the app), use a network-first strategy.
    // This ensures the user always has the latest version of the app shell,
    // while providing an offline fallback from the cache.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Good response? Cache it and return it.
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    // Network failed? Serve from the cache.
                    return caches.match(request);
                })
        );
        return;
    }

    // For all other requests (assets like CSS, images, music), use a cache-first strategy.
    // This is fast and efficient for static files that don't change often.
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                // Return from cache if available.
                return cachedResponse;
            }

            // Otherwise, fetch from the network.
            return fetch(request).then(networkResponse => {
                // Don't cache unsuccessful responses or chrome extension requests.
                if (!networkResponse || networkResponse.status !== 200 || request.url.startsWith('chrome-extension://')) {
                    return networkResponse;
                }

                // Cache the new response for future requests.
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseToCache);
                });
                return networkResponse;
            });
        })
    );
});