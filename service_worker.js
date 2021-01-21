self.addEventListener('install', e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            //return cache.addAll(["./", "./src/master.css", "./images/Sil_192.png", "./src/connection.js"]);
            return cache.addAll(["./", "index.html", "./src/Chart.min.js", "./src/master.css",
                 "./src/index.js", "./src/initialize.js", "./src/connection.js", "./src/historical_graph.js", 
                 "./images/Sil_192.png", "./images/wifi_conn.png", "./images/wifi_disconn.png", 
                 "./images/bg3.jpg"]);
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