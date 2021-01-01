if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log("SW REgistered");
        console.log(registration);
    }).catch(error => {
        console.log("SW REgistration failed");
        console.log(error);
    });
}