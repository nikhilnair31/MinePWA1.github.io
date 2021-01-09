window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

function handleConnection() {
    if (navigator.onLine) {
        isReachable(getServerUrl()).then(function(online) {
            if (online) {
                console.log('Online');
                document.getElementById("conn_status").textContent = "Online";
                document.getElementById("conn_status").style.color = "#15e715";
            } 
            else {
                console.log('Offline');
                document.getElementById("conn_status").textContent = "Offline";
                document.getElementById("conn_status").style.color = "#db1c1c";
            }
        });
    } 
    else {
        console.log('offline');
        document.getElementById("conn_status").textContent = "Offline";
        document.getElementById("conn_status").style.color = "#db1c1c";
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