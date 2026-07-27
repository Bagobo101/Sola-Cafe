// This service worker exists only to remove itself and any leftover
// service worker/cache from earlier versions of this site.
// Browsers check this exact file directly over the network on a
// schedule (bypassing any old worker's cache), so this reliably
// reaches every visitor's browser and cleans up stale caching,
// even ones who never revisit the unregister code in index.html.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete every cache this or any prior worker created
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister so no worker controls this site going forward
      await self.registration.unregister();

      // Force any open tabs to reload with a real network request
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
