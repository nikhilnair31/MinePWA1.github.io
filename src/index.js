//initializing vars
var curr_path = "";
var safety_status_text_ref = document.getElementById('safety_status_text');

//Hide all divs in list and then load options with root path '/' and next element of id purpose_select
function intialLoadOfOptions(){
    hideOrShowAllById(['threshold_levels', 'historical_data'], 'none');
    loadOfOptions('/', 'purpose_select');
}

//Populate select reference based on path and ref
function loadOfOptions(path, select_string_ref){
    var options = [];

    //include (&& path != '/') in the if statement below, for firestore
    if(select_string_ref != ''){
        //get k/v by path from localStorage using deepFind func
        var dbObj = JSON.parse(localStorage.getItem('dbObj'));
        var findObj = deepFind(dbObj, path, '/');
        debugLogPrint(['loadOfOptions', path, dbObj, findObj]);

        for(const [key] of Object.entries(findObj)){
            options.push(key);
        }
        for(var i = 0; i < options.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = options[i];
            opt.value = options[i];
            document.getElementById(select_string_ref).appendChild(opt);
        }
    }
}

//Get path to selected node and pass to other function to fill select with options
function selectedOption(curr_select_string_ref, next_select_string_ref, addToPath) {
    if(addToPath){
        curr_path += document.getElementById(curr_select_string_ref).value + '/';
        debugLogPrint(['selectedOption curr_path', curr_path]);
    }
    loadOfOptions(curr_path, next_select_string_ref);
}

//Get value of type option chosen and show/hide aprropriate div blocks
function selectedTypeOption() {
    hideOrShowOneById('threshold_levels', 'none');
    hideOrShowOneById('historical_data', 'none');

    var next_select_string_ref = '';

    if(document.getElementById('purpose_select').value == 'Threshold Levels'){
        hideOrShowOneById('threshold_levels', 'block');
        if(document.getElementById('type_select').value == "Gas Levels"){
            hideOrShowOneById('gas_levels', 'block');
            next_select_string_ref = 'gas_select';
        }
        else if(document.getElementById('type_select').value == "Noise Levels"){
            hideOrShowOneById('noise_levels', 'block');
            next_select_string_ref = 'noise_type_select';
        }
        else if(document.getElementById('type_select').value == "Fire Levels"){
            hideOrShowOneById('fire_levels', 'block');
            next_select_string_ref = 'fire_ratio_select';
        }
    }
    else if(document.getElementById('purpose_select').value == 'Historical Data'){
        document.getElementById("button_graph_hd").style.display = "initial";
        hideOrShowOneById('historical_data', 'block');
        if(document.getElementById('type_select').value == "Gas Levels"){
            hideOrShowOneById('gas_levels_hd', 'block');
            next_select_string_ref = 'gas_select_hd';
        }
        else if(document.getElementById('type_select').value == "Noise Levels"){
            hideOrShowOneById('noise_levels_hd', 'block');
            next_select_string_ref = 'noise_type_select_hd';
        }
        else if(document.getElementById('type_select').value == "Fire Levels"){
            hideOrShowOneById('fire_levels_hd', 'block');
            next_select_string_ref = 'fire_ratio_select_hd';
        }
    }
    selectedOption('type_select', next_select_string_ref, true);
}

//Get value of type option chosen and show/hide aprropriate div blocks
function selectedGFNOption(curr_select_string_ref, addToPath) {
    if(document.getElementById(curr_select_string_ref).value == "Graham's Ratio"){
        hideOrShowAllById(['grahams_ratio'], 'block');
        next_select_string_ref = '';
    }
    else if(document.getElementById(curr_select_string_ref).value == "Ambient Noise Levels"){
        hideOrShowOneById('ambient_noise', 'block');
        next_select_string_ref = 'time_select';
    }
    else if(document.getElementById(curr_select_string_ref).value == "OSHA"){
        hideOrShowOneById('ambient_noise', 'none');
        next_select_string_ref = '';
    }
    selectedOption(curr_select_string_ref, next_select_string_ref, addToPath);
}

//Check noise safety status by using : curr_path to get snapshot, fire_ratio_dom_value to check wihich gas ratio option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkFireSafetyStatus() {
    var map = new Map();
    var val_list = [];
    var gas_tv_table_ref = document.getElementById('gas_tv_table');
    var fire_ratio_dom_value = document.getElementById('fire_ratio_select').value;

    if(fire_ratio_dom_value == "Graham's Ratio"){
        var grahams_ratio_value, seg_length, safety_string;
        var gpath = "Historical Data/Fire Levels/Graham's Ratio";
        var co_input_text_int = parseFloat(document.getElementById('co_conc_input').value);
        var o2_input_text_int = parseFloat(document.getElementById('o2_conc_input').value);
        var n2_input_text_int = parseFloat(document.getElementById('n2_conc_input').value);

        grahams_ratio_value = ((100 * co_input_text_int) / ((0.265 * n2_input_text_int) - o2_input_text_int)).toFixed(2);
        seg_length = 100/(val_list.length);
        safety_status_text_ref.textContent = grahams_ratio_value;

        //clear table every time button is clicked and make first row as table's titles
        gas_tv_table_ref.innerHTML = "<tr><td id='table_heading'> Effect </td> <td id='table_heading'> Graham's Ratio Value </td></tr>";

        //find fb object from localstorage and deepfind function
        var dbObj = JSON.parse(localStorage.getItem('dbObj'));
        var findObj = deepFind(dbObj, curr_path, '/');

        for (const [key, value] of Object.entries(findObj)){
            val_list.push(parseFloat(value));
            map.set(parseFloat(value), key);
    
            var tr = "<tr>";
            tr += '<td>' + key + "</td>" + "<td>" + parseFloat(value) + "</td></tr>";
            gas_tv_table_ref.innerHTML += tr;
        }
        debugLogPrint(['checkFireSafetyStatus', curr_path, val_list, map, dbObj, findObj]);

        if(grahams_ratio_value > Math.max.apply(Math, val_list)){
            safety_string = `\r\nActive Fire`;
            $('table #gas_tv_table tr:nth-child(2)').css({'background-color': 'rgb(255, 71, 95)'});
        }
        else if(grahams_ratio_value < Math.min.apply(Math, val_list)){
            safety_string= `\r\nSafe`;
            $('table #gas_tv_table tr:nth-child('+ (val_list.length+1) +')').css({'background-color': 'rgb(255, 71, 95)'});
        }
        else{
            for(var i = 0; i < val_list.length; i++) {
                if(grahams_ratio_value > val_list[i]){
                    if(val_list[i-1] - grahams_ratio_value < grahams_ratio_value - val_list[i]){
                        $('table #gas_tv_table tr:nth-child('+ (i+1) +')').css({'background-color': 'rgb(255, 71, 95)'});
                        safety_string = `\r\n${map.get(val_list[i-1])}`;
                        break;
                    }
                    else{
                        $('table #gas_tv_table tr:nth-child('+ (i+2) +')').css({'background-color': 'rgb(255, 71, 95)'});
                        safety_string = `\r\n${map.get(val_list[i])}`;
                        break;
                    }
                }
            }
        }
        safety_status_text_ref.textContent += safety_string;

        if(onlineStatus){
            db_ref.child(gpath).push({ 
                time_stamp : Math.round((new Date()).getTime() / 1000),
                gr_value: parseFloat(grahams_ratio_value),
                safety_status: safety_string
            });
        }
        else{
            var keyGenVal = generatePushID();
            gpath = gpath.split('/');
            len = gpath.length; 
            debugLogPrint([keyGenVal, gpath, len]);
            for (var i=0; i < len; i++){
                dbObj = dbObj[gpath[i]];
            };
            dbObj[keyGenVal] = {
                time_stamp : Math.round((new Date()).getTime() / 1000),
                gr_value: parseFloat(grahams_ratio_value),
                safety_status: safety_string
            };
            console.log('checkFireSafetyStatus dbObj: ', dbObj);
        }
    }
}

//Check gas safety status by using : curr_path to get snapshot and input string ref to get input gas conc
function checkGasSafetyStatus() {
    var map = new Map();
    var key_list = [];

    var gas_conc_val = document.getElementById('gas_input_input').value;
    var gas_name_select = document.getElementById('gas_select').value;
    var gas_unit_select = document.getElementById('unit_select').value;

    //need to add ppm into path since we avoid it in the unit selection part
    if(!curr_path.includes('ppm')) curr_path += 'ppm/';
    gas_conc_int = parseFloat(gas_conc_val);

    //Convert % to ppm
    if(gas_unit_select == '%')
        gas_conc_int *= 10000;

    //find table ref and add errything from object into it
    //clear table every time button is clicked and make first row as table's titles
    var gas_tv_table_ref = document.getElementById('gas_tv_table');
    gas_tv_table_ref.innerHTML = '<tr><td id="table_heading"> Concentration </td> <td id="table_heading"> Effect </td></tr>';
    
    //find db object from localstorage and deepfind function
    var dbObj = JSON.parse(localStorage.getItem('dbObj'));
    var findObj = deepFind(dbObj, curr_path, '/');
    //add values in list, map and rows for tables
    for (const [key, value] of Object.entries(findObj)){
        key_list.push(parseFloat(key));
        map.set(parseFloat(key), value);
        var tr = "<tr>";
        tr += '<td>' + parseFloat(key) + " ppm </td>" + "<td>" + value + "</td></tr>";
        gas_tv_table_ref.innerHTML += tr;
    }
    //add last row for > max conc and completely unsafe
    var lastVal = Object.keys(findObj)[Object.keys(findObj).length - 1];
    gas_tv_table_ref.innerHTML += "<tr><td> >" + parseFloat(lastVal) + "</td>" + "<td> fatal </td></tr>";
    debugLogPrint(['checkGasSafetyStatus', curr_path, key_list, map, dbObj, findObj]);

    //If input concentration is less than min then safe and if more than max then fatal
    if(gas_conc_int < Math.min.apply(Math, key_list)){
        safety_status_text_ref.textContent = "All safe";
        $('table #gas_tv_table tr:nth-child(2)').css({'background-color': 'rgb(255, 71, 95)'});
    }
    else if(gas_conc_int > Math.max.apply(Math, key_list)){
        safety_status_text_ref.textContent = "Fatal";
        $('table #gas_tv_table tr:nth-child('+ (key_list.length+2) +')').css({'background-color': 'rgb(255, 71, 95)'});
    }
    else{
        for(var i = 0; i < key_list.length; i++) {
            if(gas_conc_int <= key_list[i]){
                if(gas_conc_int - key_list[i-1] < key_list[i] - gas_conc_int){
                    $('table #gas_tv_table tr:nth-child('+ (i+1) +')').css({'background-color': 'rgb(255, 71, 95)'});
                    safety_status_text_ref.textContent = map.get(key_list[i-1]);
                    break;
                }
                else{
                    $('table #gas_tv_table tr:nth-child('+ (i) +')').css({'background-color': 'rgb(255, 71, 95)'});
                    safety_status_text_ref.textContent = map.get(key_list[i]);
                    break;
                }
            }
        }
    }

    //saving either online or locally depending on online status
    if(onlineStatus){
        db_ref.child(`Historical Data/Gas Levels/${gas_name_select}`).push({ 
            'time_stamp' : Math.round((new Date()).getTime() / 1000),
            'gas_conc': gas_conc_int,
            'gas_unit': gas_unit_select,
            'safety_status': safety_status_text_ref.textContent
        });
    }
    else{
        var gpath = `Historical Data/Gas Levels/${gas_name_select}`;
        var keyGenVal = generatePushID();
        gpath = gpath.split('/');
        len = gpath.length; 
        debugLogPrint([keyGenVal, gpath, len]);
        for (var i=0; i < len; i++){
            dbObj = dbObj[gpath[i]];
        };
        dbObj[keyGenVal] = { 
            'time_stamp' : Math.round((new Date()).getTime() / 1000),
            'gas_conc': gas_conc_int,
            'gas_unit': gas_unit_select,
            'safety_status': safety_status_text_ref.textContent
        };
        debugLogPrint(['offline dbObj', dbObj]);
    }
}

//Check noise safety status by using : curr_path to get snapshot, noise_option_dom_value to check wihich noise option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkNoiseSafetyStatus() {
    var map = new Map();

    if(document.getElementById('noise_type_select').value == "Ambient Noise Levels"){
        var val_list = [];
        var threshold_noise;
        var gpath = `Historical Data/Noise Levels/Ambient Noise Levels`;
        var area_text = document.getElementById('area_select').value;
        var day_time = document.getElementById('time_select').value;
        var loudness_val = document.getElementById('loudness_input_input').value;
        var loudness_input_text_int = parseFloat(loudness_val);

        //find db object from localstorage and deepfind function
        var dbObj = JSON.parse(localStorage.getItem('dbObj'));
        var findObj = deepFind(dbObj, curr_path, '/');
        //add values in list, map and rows for tables
        for(const [key, value] of Object.entries(findObj)){
            val_list.push(parseFloat(value));
            map.set(parseFloat(value), key);
        }
        debugLogPrint(['checkNoiseSafetyStatus', curr_path, val_list, map, dbObj, findObj]);

        //find threshold noise level for selected time and area
        for (let [key, value] of map.entries()) {
            if (value === area_text)
                threshold_noise = key;
        }

        //check if input noise > or < than threshold noise
        if(loudness_input_text_int <= threshold_noise)
            safety_status_text_ref.textContent = 'safe';
        else
            safety_status_text_ref.textContent = 'unsafe';

        if(onlineStatus){
            db_ref.child(gpath).push({ 
                'time_stamp' : Math.round((new Date()).getTime()/1000),
                'day_time': day_time,
                'area_name': area_text,
                'loudness': parseInt(loudness_val),
                'safety_status': safety_status_text_ref.textContent
            });
        }
        else{
            var keyGenVal = generatePushID();
            gpath = gpath.split('/');
            len = gpath.length; 
            debugLogPrint([keyGenVal, gpath, len]);
            for (var i=0; i < len; i++){
                dbObj = dbObj[gpath[i]];
            };
            dbObj[keyGenVal] = {
                'time_stamp' : Math.round((new Date()).getTime() / 1000),
                'day_time': day_time,
                'area_name': area_text,
                'loudness': parseInt(loudness_val),
                'safety_status': safety_status_text_ref.textContent
            };
            debugLogPrint(['offline dbObj', dbObj]);
        }
    }
    else if(document.getElementById('noise_type_select').value == "OSHA"){
        var key_list = [];
        var gpath = `Historical Data/Noise Levels/OSHA`;
        var loudness_val = document.getElementById('loudness_input_input').value;
        var loudness_input_text_int = parseFloat(loudness_val);

        //find table ref and add errything from object into it
        //clear table every time button is clicked and make first row as table's titles
        var gas_tv_table_ref = document.getElementById('gas_tv_table');
        gas_tv_table_ref.innerHTML = '<tr><td id="table_heading"> Loudness </td> <td id="table_heading"> Hours </td></tr>';
        
        //find db object from localstorage and deepfind function
        var dbObj = JSON.parse(localStorage.getItem('dbObj'));
        var findObj = deepFind(dbObj, curr_path, '/');

        //add first row for <90 db(A) and completely safe
        var firstVal = Object.keys(findObj)[0];
        gas_tv_table_ref.innerHTML += "<tr><td> <" + parseFloat(firstVal) + "</td>" + "<td> completely safe </td></tr>";
        //add values in list, map and rows for tables
        for (const [key, value] of Object.entries(findObj)){
            key_list.push(parseFloat(key));
            map.set(parseFloat(key), value);
            var tr = "<tr>";
            tr += '<td>' + parseFloat(key) + " dB(A) </td>" + "<td>" + value + " h </td></tr>";
            gas_tv_table_ref.innerHTML += tr;
        }
        //add last row for >115 db(A) and completely unsafe
        var lastVal = Object.keys(findObj)[Object.keys(findObj).length - 1];
        gas_tv_table_ref.innerHTML += "<tr><td> >" + parseFloat(lastVal) + "</td>" + "<td> completely unsafe </td></tr>";
        debugLogPrint(['checkNoiseSafetyStatus', curr_path, key_list, map, dbObj, findObj]);

        //If input loudness is less than min then completely safe and if more than max then completely unsafe
        if(loudness_input_text_int <= Math.min.apply(Math, key_list)){
            safety_status_text_ref.textContent = `Safe`;
            $('table #gas_tv_table tr:nth-child(2)').css({'background-color': 'rgb(255, 71, 95)'});
        }
        else if(loudness_input_text_int > Math.max.apply(Math, key_list)){
            safety_status_text_ref.textContent = `Completely UnSafe`;
            $('table #gas_tv_table tr:nth-child('+ (key_list.length+3) +')').css({'background-color': 'rgb(255, 71, 95)'});
        }
        else{
            for(var i = 0; i < key_list.length; i++) {
                if(loudness_input_text_int <= key_list[i]){
                    debugLogPrint(['checkNoiseSafetyStatus', loudness_input_text_int, loudness_input_text_int - key_list[i-1], key_list[i] - loudness_input_text_int, i]);
                    if(loudness_input_text_int - key_list[i-1] < key_list[i] - loudness_input_text_int){
                        $('table #gas_tv_table tr:nth-child('+ (i+2) +')').css({'background-color': 'rgb(255, 71, 95)'});
                        safety_status_text_ref.textContent = `UnSafe after ${map.get(key_list[i-1])} hours`;
                        break;
                    }
                    else{
                        $('table #gas_tv_table tr:nth-child('+ (i+3) +')').css({'background-color': 'rgb(255, 71, 95)'});
                        safety_status_text_ref.textContent = `UnSafe after ${map.get(key_list[i])} hours`;
                        break;
                    }
                }
            }
        }

        //saving either online or locally depending on online status
        if(onlineStatus){
            db_ref.child(gpath).push({ 
                'time_stamp' : Math.round((new Date()).getTime() / 1000),
                'loudness': parseInt(loudness_val),
                'safety_status': safety_status_text_ref.textContent
            });
        }
        else{
            var keyGenVal = generatePushID();
            gpath = gpath.split('/');
            len = gpath.length; 
            debugLogPrint([keyGenVal, gpath, len]);
            for (var i=0; i < len; i++){
                dbObj = dbObj[gpath[i]];
            };
            dbObj[keyGenVal] = {
                'time_stamp' : Math.round((new Date()).getTime() / 1000),
                'loudness': parseInt(loudness_val),
                'safety_status': safety_status_text_ref.textContent
            };
            debugLogPrint(['offline dbObj', dbObj]);
        }
    }
}

//Hide or Show all divs of an id
function hideOrShowAllById(idToShowOrHide, toShowOrHide){
    for(var j = 0; j < idToShowOrHide.length; j++){
        var parentID = document.getElementById(idToShowOrHide[j]);
        parentID.style.display = toShowOrHide;
        var innerDiv = parentID.getElementsByTagName('div');
        for(var i = 0; i < innerDiv.length; i++){
            var a = innerDiv[i];
            a.style.display = toShowOrHide;
        }
        debugLogPrint(['hideOrShowAllById', idToShowOrHide, toShowOrHide]);
    }
}

//Hide one element by id
function hideOrShowOneById(idToShowOrHide, toShowOrHide){
    document.getElementById(idToShowOrHide).style.display = toShowOrHide;
    debugLogPrint(['hideOrShowOneById', idToShowOrHide, toShowOrHide]);
}

//function to accept array of objs and print them in console
function debugLogPrint(varList){
    varList.forEach(function(entry) {
        console.log('%c debugLogPrint -\n', 'color: red; font-weight: bold;', entry);
    });
}

//Open my twitter profile
function openTwitter(){
    window.open('https://twitter.com/_silhouettte_');
}