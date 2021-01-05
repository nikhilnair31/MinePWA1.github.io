if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log("SW REgistered");
        console.log(registration);
    }).catch(error => {
        console.log("SW REgistration failed");
        console.log(error);
    });
}

//If PWA online then sync local and cloud db and if offline use available local db only
//Once connection is restablished refresh/recopy db from cloud to local?
//Check if connection exists at regular intervals instead of only on load
document.getElementById("conn_status").textContent = (window.navigator.onLine) ? "PWA Is Online" : "PWA Is Offline";