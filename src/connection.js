//Get conn status ref and show online or offline status
const conn_status_text = document.getElementById("conn_status");
conn_status_text.textContent = (window.navigator.onLine) ? "Online" : "Offline";
conn_status_text.style.color = (window.navigator.onLine) ? "#15e715" : "#db1c1c";

window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

function handleConnection() {
    if (navigator.onLine) {
        isReachable(getServerUrl()).then(function(online) {
            if (online) {
                console.log('Online');
                conn_status_text.textContent = "Online";
                conn_status_text.style.color = "#15e715";
            } 
            else {
                console.log('Offline');
                conn_status_text.textContent = "Offline";
                conn_status_text.style.color = "#db1c1c";
            }
        });
    } 
    else {
        console.log('offline');
        conn_status_text.textContent = "Offline";
        conn_status_text.style.color = "#db1c1c";
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
    return document.getElementById('conn_status').value || window.location.origin;
}