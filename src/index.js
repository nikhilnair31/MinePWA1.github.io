//Some service worker stuff for PWA
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log("SW REgistered");
        console.log(registration);
    }).catch(error => {
        console.log("SW REgistration failed");
        console.log(error);
    });
}

var firebaseConfig = {
    apiKey: "AIzaSyBl3rOUaCsWyqLLYJ4e6inczY-6fNdVyCs",
    authDomain: "minedb31.firebaseapp.com",
    databaseURL: "https://minedb31.firebaseio.com",
    projectId: "minedb31",
    storageBucket: "minedb31.appspot.com",
    messagingSenderId: "312530864481",
    appId: "1:312530864481:web:3a35beccd48a2c0bfa1d20",
    measurementId: "G-YPPBFRGP6D"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//Enable data persistance here somewhere?
//If PWA online then sync local and cloud db and if offline use available local db only
//Once connection is restablished refresh/recopy db from cloud to local?
//Check if connection exists at regular intervals instead of only on load

//Initialize variables and db and get references
const db_ref = firebase.database().ref(); 
var curr_path = "/";
var options = []; 

//Get conn status ref and show online or offline status
const conn_status_text = document.getElementById("conn_status");
conn_status_text.textContent = (window.navigator.onLine) ? "PWA Is Online" : "PWA Is Offline";

//Populate select reference based on path and ref
function initialLoadOfOptions(path, select_string_ref){
    options = [];
    if(select_string_ref != ''){
        var select_dom_ref = document.getElementById(select_string_ref);
        db_ref.child(path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                options.push(child.key);
            });
            for(var i = 0; i < options.length; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = options[i];
                opt.value = options[i];
                select_dom_ref.appendChild(opt);
            }
        });
    }
}

//Get path to selected node and pass to other function to fill select with options
function selectedOption(curr_select_string_ref, next_select_string_ref) {
    var curr_select_dom_ref = document.getElementById(curr_select_string_ref);
    curr_path += curr_select_dom_ref.value + '/';
    console.log(`curr_path : ${curr_path}`);
    initialLoadOfOptions(curr_path, next_select_string_ref);
}