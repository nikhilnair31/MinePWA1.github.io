self.addEventListener('install', e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "index.html", "./src/master.css", "./src/Chart.min.js", "./src/jquery.min.js", 
                 "./src/index.js", "./src/index_rtd.js", "./src/initialize.js", "./src/connection.js", "./src/historical_graph.js", 
                 "./images/Sil_192.png", "./images/Sil_512.png", "./images/wifi_conn.png", "./images/wifi_disconn.png", 
                 "./images/bg3.jpg"]);
        })
    );
});

self.addEventListener("fetch", e => {
    console.log('%c fetch :', 'color: orange; font-weight: bold;', e.request.url);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
})