self.addEventListener('install', e => {
    console.log('install :', e.request.url);
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./src/master.css", "./images/logo192.png"]);
        })
    );
});

self.addEventListener("fetch", e => {
    console.log('fetch :', e.request.url);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
})