//Some service worker stuff for PWA
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service_worker.js').then(registration => {
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
var gas_levels_ref = document.getElementById("gas_levels");
var noise_levels_ref = document.getElementById("noise_levels");
var fire_levels_ref = document.getElementById("fire_levels");
var ambient_noise_ref = document.getElementById("ambient_noise");
var safety_status_ref = document.getElementById('safety_status_text');

//Get conn status ref and show online or offline status
const conn_status_text = document.getElementById("conn_status");
conn_status_text.textContent = (window.navigator.onLine) ? "Online" : "Offline";
conn_status_text.style.color = (window.navigator.onLine) ? "#15e715" : "#db1c1c";

//Hide all general divs
function hideAllDivs(){
    gas_levels_ref.style.display = "none";
    noise_levels_ref.style.display = "none";
    fire_levels_ref.style.display = "none";
    ambient_noise_ref.style.display = "none";
}

//Hide all noise divs
function hideNoiseDivs(){
    ambient_noise_ref.style.display = "none";
}

//Hide all specific divs and then load options
function intialLoadOfOptions(path, select_string_ref){
    hideAllDivs();
    loadOfOptions(path, select_string_ref);
}

//Populate select reference based on path and ref
function loadOfOptions(path, select_string_ref){
    var options = [];
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
function selectedOption(curr_select_string_ref, next_select_string_ref, addToPath) {
    if(addToPath){
        var curr_select_dom_ref = document.getElementById(curr_select_string_ref);
        curr_path += curr_select_dom_ref.value + '/';
        console.log(`curr_path : ${curr_path}`);
    }
    loadOfOptions(curr_path, next_select_string_ref);
}

//Get value of type option chosen and show/hide aprropriate div blocks
function selectedTypeOption(curr_select_string_ref, addToPath) {
    hideAllDivs();
    var curr_select_dom_value = document.getElementById(curr_select_string_ref).value;
    if(curr_select_dom_value == "Gas Levels"){
        gas_levels_ref.style.display = "block";
        next_select_string_ref = 'gas_select';
    }
    else if(curr_select_dom_value == "Noise Levels"){
        noise_levels_ref.style.display = "block";
        next_select_string_ref = 'noise_type_select';
    }
    else if(curr_select_dom_value == "Fire Levels"){
        fire_levels_ref.style.display = "block";
        next_select_string_ref = 'fire_select';
    }
    selectedOption(curr_select_string_ref, next_select_string_ref, addToPath);
}

//Get value of type option chosen and show/hide aprropriate div blocks
function selectedNoiseOption(curr_select_string_ref, addToPath) {
    hideNoiseDivs();
    var curr_select_dom_value = document.getElementById(curr_select_string_ref).value;
    if(curr_select_dom_value == "Ambient Noise Levels"){
        ambient_noise_ref.style.display = "block";
        next_select_string_ref = 'time_select';
    }
    else if(curr_select_dom_value == "OSHA"){
        ambient_noise_ref.style.display = "none";
        next_select_string_ref = '';
    }
    selectedOption(curr_select_string_ref, next_select_string_ref, addToPath);
}

//Check safety status by using curr_path, input string ref and getting key value pair from db
function checkGasSafetyStatus(input_string_ref) {
    var map = new Map();
    var key_list = [];
    db_ref.child(curr_path).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            console.log(parseFloat(child.key)+": "+child.val());
            key_list.push(parseFloat(child.key));
            map.set(parseFloat(child.key), child.val());
        });
        console.log(map);

        var input_text_text = document.getElementById(input_string_ref).value;
        var input_text_int = parseFloat(input_text_text);
        for(var i = 0; i < key_list.length; i++) {
            if(input_text_int <= key_list[i]){
                safety_status_ref.textContent = map.get(key_list[i]);
                console.log(key_list[i]);
                console.log(map.get(key_list[i]));
                break;
            }
        }
    });
}

//Check safety status by using curr_path, input string ref and getting key value pair from db
function checkNoiseSafetyStatus(loudness_input_string_ref, area_string_ref) {
    var map = new Map();
    var key_list = [];
    var val_list = [];

    var noise_option_dom_value = document.getElementById('noise_type_select').value;
    if(noise_option_dom_value == "Ambient Noise Levels"){
        db_ref.child(curr_path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                console.log(child.key+": "+child.val());
                val_list.push(child.val());
                map.set(child.val(), child.key);
            });
            console.log(map);
    
            var threshold_noise;
            var area_text = document.getElementById(area_string_ref).value;
            var loudness_input_text_int = parseFloat(document.getElementById(loudness_input_string_ref).value);
            for (let [key, value] of map.entries()) {
                if (value === area_text)
                    threshold_noise = key;
            }
            if(loudness_input_text_int <= threshold_noise)
                safety_status_ref.textContent = 'Safe';
            else
                safety_status_ref.textContent = 'UnSafe';
        });
    }
    else if(noise_option_dom_value == "OSHA"){
        db_ref.child(curr_path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                console.log(child.key+": "+child.val());
                key_list.push(parseFloat(child.key));
                map.set(parseFloat(child.key), child.val());
            });
            console.log(map);
    
            var loudness_input_text_int = parseFloat(document.getElementById(loudness_input_string_ref).value);
            for(var i = 0; i < key_list.length; i++) {
                if(loudness_input_text_int <= key_list[0]){
                    safety_status_ref.textContent = `UnSafe after ${map.get(key_list[i])}+ hours`;
                    break;
                }
                else if(loudness_input_text_int > key_list[key_list.length-1]){
                    safety_status_ref.textContent = `Completely UnSafe`;
                    break;
                }
                else if(loudness_input_text_int <= key_list[i]){
                    safety_status_ref.textContent = `UnSafe after ${map.get(key_list[i])}`;
                    break;
                }
            }
        });
    }
}