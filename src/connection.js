window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

//Get conn status ref and show online or offline status
var conn_status_dot = document.getElementById("conn_dot");
conn_status_dot.style.backgroundColor = (window.navigator.onLine) ? "#8ad6cc" : "#f97171";

function handleConnection() {
    if (navigator.onLine) {
        isReachable(getServerUrl()).then(function(online) {
            if (online) {
                console.log('online');
                conn_status_dot.style.backgroundColor  = "#8ad6cc";
            } 
            else {
                console.log('offline');
                conn_status_dot.style.backgroundColor  = "#f97171";
            }
        });
    } 
    else {
        console.log('offline');
        conn_status_dot.style.backgroundColor  = "#f97171";
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