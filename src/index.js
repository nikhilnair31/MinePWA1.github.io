//Some service worker stuff for PWA
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service_worker.js').then(registration => {
        console.log("SW REgistered : ", registration);
    }).catch(error => {
        console.log("SW REgistration failed : ", error);
    });
}

//Firebase config stuff
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

//Initialize variables and db and get references
const db_ref = firebase.database().ref(); 
var curr_path = "/";
var gas_levels_ref = document.getElementById("gas_levels");
var noise_levels_ref = document.getElementById("noise_levels");
var fire_levels_ref = document.getElementById("fire_levels");
var ambient_noise_ref = document.getElementById("ambient_noise");
var grahams_ratio_ref = document.getElementById("grahams_ratio");
var bar_div_ref = document.getElementById('grahams_meter');
var safety_status_ref = document.getElementById('safety_status_text');

//Open my twitter profile
function openTwitter(){
    window.open('https://twitter.com/_silhouettte_');
}

//Hide all general divs
function hideAllDivs(){
    gas_levels_ref.style.display = "none";
    noise_levels_ref.style.display = "none";
    fire_levels_ref.style.display = "none";
    ambient_noise_ref.style.display = "none";
    grahams_ratio_ref.style.display = "none";
    bar_div_ref.style.display = "none";
}

//Hide all noise divs
function hideNoiseDivs(){
    ambient_noise_ref.style.display = "none";
}

//Hide all fire divs
function hideFireDivs(){
    grahams_ratio_ref.style.display = "none";
    bar_div_ref.style.display = "none";
}

//Hide all specific divs and then load options with root path '/' and next element of id purpose_select
function intialLoadOfOptions(){
    hideAllDivs();
    loadOfOptions('/', 'purpose_select');
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
        next_select_string_ref = 'fire_ratio_select';
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

//Get value of type option chosen and show/hide aprropriate div blocks
function selectedFireOption(curr_select_string_ref, addToPath) {
    hideFireDivs();
    var curr_select_dom_value = document.getElementById(curr_select_string_ref).value;
    if(curr_select_dom_value == "Graham's Ratio"){
        grahams_ratio_ref.style.display = "block";
        next_select_string_ref = '';
    }
    selectedOption(curr_select_string_ref, next_select_string_ref, addToPath);
}

//Check gas safety status by using : curr_path to get snapshot and input string ref to get input gas conc
function checkGasSafetyStatus() {
    var map = new Map();
    var key_list = [];
    var unit_text_string;

    var gas_conc_val = document.getElementById('gas_input_input').value;

    //need to add ppm into path since we avoid it in the unit selection part
    if(!curr_path.includes('ppm')) 
        curr_path += 'ppm/';

    db_ref.child(curr_path).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            key_list.push(parseFloat(child.key));
            map.set(parseFloat(child.key), child.val());
        });
        console.log(curr_path);
        console.log(key_list);
        console.log(map);

        gas_conc_int = parseFloat(gas_conc_val);
        unit_text_string = document.getElementById('unit_select').value;
        //Convert % to ppm
        if(unit_text_string == '%')
            gas_conc_int *= 10000;

        //If input concentration is les sthan minimum then safe and if more than maximum then fatal
        if(gas_conc_int < key_list[0])
            safety_status_ref.textContent = "All safe";
        else if(gas_conc_int > key_list[key_list.length-1])
            safety_status_ref.textContent = "Fatal";
        else{
            for(var i = 0; i < key_list.length; i++) {
                if(gas_conc_int <= key_list[i]){
                    safety_status_ref.textContent = map.get(key_list[i]);
                    console.log(`${key_list[i]} | ${map.get(key_list[i])}`);
                    break;
                }
            }
        }
        
        db_ref.child(curr_path.replace("Threshold Levels", "Historical Data")).push({ gas_conc: parseInt(gas_conc_val) });
    });
}

//Check noise safety status by using : curr_path to get snapshot, noise_option_dom_value to check wihich noise option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkNoiseSafetyStatus() {
    var map = new Map();
    var val_list = [];
    var key_list = [];
    var threshold_noise, area_text, loudness_input_text_int;

    var noise_option_dom_value = document.getElementById('noise_type_select').value;
    var loudness_val = document.getElementById('loudness_input_input').value;

    if(noise_option_dom_value == "Ambient Noise Levels"){
        db_ref.child(curr_path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                val_list.push(child.val());
                map.set(child.val(), child.key);
            });
            console.log(curr_path);
            console.log(map);
            console.log(val_list);
    
            area_text = document.getElementById('area_select').value;
            loudness_input_text_int = parseFloat(loudness_val);
            for (let [key, value] of map.entries()) {
                if (value === area_text)
                    threshold_noise = key;
            }
            if(loudness_input_text_int <= threshold_noise)
                safety_status_ref.textContent = 'Safe';
            else
                safety_status_ref.textContent = 'UnSafe';
            
            db_ref.child(curr_path.replace("Threshold Levels", "Historical Data")+area_text+'/').push({ loudness: parseInt(loudness_val) });
        });
    }
    else if(noise_option_dom_value == "OSHA"){
        var loudness_input_text_int;
        var loudness_val = document.getElementById('loudness_input_input').value;

        db_ref.child(curr_path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                key_list.push(parseFloat(child.key));
                map.set(parseFloat(child.key), child.val());
            });
            console.log(curr_path);
            console.log(map);
            console.log(key_list);
    
            loudness_input_text_int = parseFloat(loudness_val);
            if(loudness_input_text_int <= key_list[0])
                safety_status_ref.textContent = `Safe`;
            else if(loudness_input_text_int > key_list[key_list.length-1])
                safety_status_ref.textContent = `Completely UnSafe`;
            else{
                for(var i = 0; i < key_list.length; i++) {
                    if(loudness_input_text_int <= key_list[i]){
                        safety_status_ref.textContent = `UnSafe after ${map.get(key_list[i])} hours`;
                        break;
                    }
                }
            }

            db_ref.child(curr_path.replace("Threshold Levels", "Historical Data")).push({ loudness: parseInt(loudness_val) });
        });
    }
}

//Check noise safety status by using : curr_path to get snapshot, fire_ratio_dom_value to check wihich gas ratio option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkFireSafetyStatus() {
    var map = new Map();
    var val_list = [];
    var grahams_ratio_value, seg_length;

    var fire_ratio_dom_value = document.getElementById('fire_ratio_select').value;

    if(fire_ratio_dom_value == "Graham's Ratio"){
        db_ref.child(curr_path).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                val_list.push(child.val());
                map.set(child.val(), child.key);
            });
            barSplit(val_list);
            console.log(curr_path);
            console.log(map);
            console.log(val_list);
    
            var indicator_ref = document.getElementById('indicator');
            var co_input_text_int = parseFloat(document.getElementById('co_conc_input').value);
            var o2_input_text_int = parseFloat(document.getElementById('o2_conc_input').value);
            var n2_input_text_int = parseFloat(document.getElementById('n2_conc_input').value);
            grahams_ratio_value = ((100 * co_input_text_int) / ((0.265 * n2_input_text_int) - o2_input_text_int)).toFixed(1);
            seg_length = 100/(val_list.length);
            safety_status_ref.textContent = grahams_ratio_value;

            if(grahams_ratio_value > val_list[0]){
                safety_status_ref.textContent += `\nActive Fire`;
                indicator_ref.style.marginLeft = `${0}%`;
                indicator_ref.style.marginRight = `${85}%`;
            }
            else if(grahams_ratio_value < val_list[val_list.length-1]){
                safety_status_ref.textContent += `\nSafe`;
                indicator_ref.style.marginLeft = `${85}%`;
                indicator_ref.style.marginRight = `${0}%`;
            }
            else{
                for(var i = 0; i < val_list.length; i++) {
                    if(grahams_ratio_value > val_list[i]){
                        safety_status_ref.textContent += `\n${map.get(val_list[i])}`;
                        var m_l = 0 + (i * seg_length);
                        indicator_ref.style.marginLeft = `${m_l}%`;
                        indicator_ref.style.marginRight = `${100 - seg_length - m_l}%`;
                        break;
                    }
                }
            }

            db_ref.child(curr_path.replace("Threshold Levels", "Historical Data")).push({ gr_value: parseFloat(grahams_ratio_value) });
        });
    }
}

function barSplit(keys_list){
    var bar_div_seg_ref = document.getElementById('grahams_meter_seg');
    
    bar_div_ref.style.display = "block";

    var r_int = 255;
    var g_int = 0;
    var color_segs_int = 255/(keys_list.length-1);
    for(var i = 0; i < keys_list.length; i++) {
        var opt = document.createElement('div');
        opt.innerHTML = keys_list[i];
        opt.value = keys_list[i];
        if(i == 0){
            r_int = 255;
            g_int = 0;
        }
        else if(i == keys_list.length-1){
            r_int = 0;
            g_int = 255;
        }
        else{
            r_int -= color_segs_int;
            g_int += color_segs_int;
        }
        opt.style.backgroundColor  = `rgb(${r_int}, ${g_int}, 0)`;
        bar_div_seg_ref.appendChild(opt);
    }
}