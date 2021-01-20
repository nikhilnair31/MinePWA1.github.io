window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

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
        isReachable(getServerUrl()).then(function(online) {
            if (online) {
                console.log('online');
                conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#8ad6cc 0px 0px 0px) saturate(1000%)");
                conn_status_icon.src = "../images/wifi_conn.png";
            } 
            else {
                console.log('offline');
                conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
                conn_status_icon.src = "../images/wifi_disconn.png";
            }
        });
    } 
    else {
        console.log('offline');
        conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
        conn_status_icon.src = "../images/wifi_disconn.png";
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

function getServerUrl() {
    return window.location.origin;
}