self.addEventListener('install', e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "index.html", "./src/master.css", "./src/Chart.min.js", "./src/jquery.min.js", 
                 "./src/index.js", "./src/initialize.js", "./src/connection.js", "./src/historical_graph.js", 
                 "./images/wifi_conn.png", "./images/wifi_disconn.png", "./images/twitter_icon.png",
                 "./images/icon2_192.png", "./images/icon2_512.png"]);
        })
    );
});

self.addEventListener("fetch", e => {
    console.log('%c fetch :', 'color: orange;', e.request.url);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
})