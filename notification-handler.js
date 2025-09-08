// Client-side notification handler for enhanced PWA navigation
// Add this script to your main application to handle service worker messages

// Listen for messages from the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK_NAVIGATE') {
      console.log('Received navigation request from service worker:', event.data);
      
      // Handle navigation based on the URL
      const targetUrl = event.data.url;
      const notificationTag = event.data.notificationTag;
      
      try {
        // If we're already on the target URL, just ensure the app is visible
        if (window.location.href === targetUrl || window.location.pathname === new URL(targetUrl).pathname) {
          console.log('Already on target page, ensuring visibility');
          
          // Bring the app to the foreground if possible
          if (window.focus) {
            window.focus();
          }
          
          // Scroll to top to ensure user sees the content
          window.scrollTo(0, 0);
          
          // If this is an audio player notification, ensure the audio player is visible
          if (notificationTag === 'audio-player-notification') {
            // You can add specific logic here to show/focus the audio player
            // For example, if you have a specific element or component to focus on
            const audioPlayer = document.querySelector('[data-audio-player]');
            if (audioPlayer) {
              audioPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        } else {
          // Navigate to the target URL
          console.log('Navigating to:', targetUrl);
          window.location.href = targetUrl;
        }
      } catch (error) {
        console.error('Error handling notification navigation:', error);
        // Fallback: just reload the page
        window.location.reload();
      }
    }
  });
}

// Enhanced service worker registration with better update handling
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              console.log('New service worker available');
              // You can show a notification to the user about the update
              // or automatically refresh the page
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Call this function when your app loads
registerServiceWorker();

// Additional helper function to ensure proper app focus
function ensureAppFocus() {
  // Bring the app to the foreground
  if (window.focus) {
    window.focus();
  }
  
  // On mobile, try to prevent the browser from going to background
  if (document.hidden) {
    document.addEventListener('visibilitychange', function onVisibilityChange() {
      if (!document.hidden) {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.focus();
      }
    });
  }
}

// Export for use in your main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerServiceWorker,
    ensureAppFocus
  };
}

