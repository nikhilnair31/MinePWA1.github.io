//Event listeners to check for connection status changes
window.addEventListener('offline', handleConnection);
window.addEventListener('online', handleConnection);

//Get conn status ref and show online or offline status
var conn_status_icon = document.getElementById("conn_icon");
if(window.navigator.onLine){
    conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#8ad6cc 0px 0px 0px) saturate(1000%)");
    conn_status_icon.src = "../images/wifi_conn.png";
}
else{
    conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
    conn_status_icon.src = "../images/wifi_disconn.png";
}

function handleConnection() {
    if (navigator.onLine) {
        isReachable(window.location.origin).then(function(online) {
            connStatusSwitch(online);
        });
    } 
    else {
        connStatusSwitch(false);
    }
}

function isReachable(url) {
    return fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(function(resp) {
            return resp && (resp.ok || resp.type === 'opaque');
        })
        .catch(function(err) {
            console.warn('[conn test failure]:', err);
        });
}

function connStatusSwitch(isOnline) {
    if (isOnline) {
        console.log('online');
        conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#8ad6cc 0px 0px 0px) saturate(1000%)");
        conn_status_icon.src = "../images/wifi_conn.png";
        // const url = 'https://minedb31.firebaseio.com/.json'
        // fetch(url).then((res) => {
        //     return caches.open('v1').then((cache) => {
        //         return cache.put(url, res)
        //     })
        // })
    } 
    else {
        console.log('offline');
        conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
        conn_status_icon.src = "../images/wifi_disconn.png";
    }
}