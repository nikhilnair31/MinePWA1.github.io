self.addEventListener('install', e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            //return cache.addAll(["./", "./src/master.css", "./images/Sil_192.png", "./src/connection.js"]);
            return cache.addAll(["./", "./src/Chart.min.js", "./images/Sil_192.png"]);
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