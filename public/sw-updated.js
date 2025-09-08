const CACHE_NAME = 'hopeful-quotes-v15';
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
      data: { url: '/', action: 'open_app' } // Enhanced data for better handling
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

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SHOW_WELCOME_NOTIFICATION':
      event.waitUntil(
        self.registration.showNotification('Notifications Enabled!', {
          body: 'Thank you for enabling notifications. You are all set!',
          icon: '/icon-192x192.png',
          tag: 'welcome-notification',
          data: { url: '/', action: 'open_app' } // Enhanced data for better handling
        })
      );
      break;

    case 'START_DAILY_SCHEDULE':
      console.log('Received command to start daily notification schedule.');
      scheduleDailyNotification();
      break;

    case 'SHOW_PLAYER_NOTIFICATION':
      event.waitUntil(
        self.registration.showNotification('Hopeful Quotes', {
          body: 'Relaxing music is playing. Tap to return to the app.',
          icon: '/icon-192x192.png',
          tag: 'audio-player-notification',
          silent: true,
          requireInteraction: true,
          data: { url: '/', action: 'open_app' } // Enhanced data for better handling
        })
      );
      break;

    case 'HIDE_PLAYER_NOTIFICATION':
      event.waitUntil(
        self.registration.getNotifications({ tag: 'audio-player-notification' })
          .then(notifications => {
            notifications.forEach(notification => notification.close());
          })
      );
      break;
  }
});


// Enhanced notification click handler for better PWA/native app integration
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  // Close the notification
  event.notification.close();

  const openApp = async () => {
    try {
      // The URL to navigate to when the app is opened or focused.
      const urlToOpen = new URL(event.notification.data?.url || '/', self.location.origin).href;
      console.log('Attempting to open URL:', urlToOpen);

      // Get all client windows with enhanced options for PWA detection
      const clientList = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      console.log('Found clients:', clientList.length);

      // Enhanced client detection and focusing
      if (clientList.length > 0) {
        // Sort clients by focus state and URL match
        const sortedClients = clientList.sort((a, b) => {
          // Prioritize focused clients
          if (a.focused && !b.focused) return -1;
          if (!a.focused && b.focused) return 1;
          
          // Prioritize clients with matching origin
          const aMatches = a.url.startsWith(self.location.origin);
          const bMatches = b.url.startsWith(self.location.origin);
          if (aMatches && !bMatches) return -1;
          if (!aMatches && bMatches) return 1;
          
          return 0;
        });
        
        const clientToFocus = sortedClients[0];
        console.log('Focusing existing client:', clientToFocus.url);
        
        // Focus the client
        await clientToFocus.focus();
        
        // For PWAs, try to navigate to ensure we're on the right page
        if ('navigate' in clientToFocus) {
          try {
            console.log('Navigating existing client to:', urlToOpen);
            await clientToFocus.navigate(urlToOpen);
          } catch (navError) {
            console.log('Navigation failed, posting message instead:', navError);
            // Fallback: send a message to the client to handle navigation
            clientToFocus.postMessage({
              type: 'NOTIFICATION_CLICK_NAVIGATE',
              url: urlToOpen,
              notificationTag: event.notification.tag
            });
          }
        } else {
          // Fallback: send a message to the client to handle navigation
          clientToFocus.postMessage({
            type: 'NOTIFICATION_CLICK_NAVIGATE',
            url: urlToOpen,
            notificationTag: event.notification.tag
          });
        }
        
        return clientToFocus;
      }

      // If no client window is found, open a new one
      console.log('No existing clients found, opening new window');
      if (clients.openWindow) {
        const newClient = await clients.openWindow(urlToOpen);
        console.log('Opened new window:', newClient ? 'success' : 'failed');
        return newClient;
      }
    } catch (error) {
      console.error('Error in notification click handler:', error);
      // Ultimate fallback: try to open a new window with just the origin
      if (clients.openWindow) {
        try {
          return await clients.openWindow(self.location.origin);
        } catch (fallbackError) {
          console.error('Fallback window opening also failed:', fallbackError);
        }
      }
    }
  };

  event.waitUntil(openApp());
});


// On fetch, use a more robust caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // For navigation requests (loading the app) and the manifest, use a network-first strategy.
    // This ensures the user always has the latest version of the app shell and its configuration,
    // while providing a robust offline fallback.
    if (request.mode === 'navigate' || url.pathname.endsWith('/manifest.json')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Good response? Cache it and return it.
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed? Check if it's a navigation request.
                    if (request.mode === 'navigate') {
                        console.log('Fetch for navigation failed. Serving app shell from cache.');
                        // For navigation, always serve the main app page ('/') from the cache.
                        // This is the key fix for offline media notification clicks.
                        return caches.match('/');
                    }
                    // For other assets like the manifest, try matching the specific request.
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

