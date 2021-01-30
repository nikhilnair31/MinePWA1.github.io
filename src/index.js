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

        //this patch is to get stuff from rtd when online and localStorage when offline
        {
        // if(onlineStatus){
        //     db_ref.child(path).once("value", function(snapshot) {
        //         snapshot.forEach(function(child) {
        //             options.push(child.key);
        //         });
        //         for(var i = 0; i < options.length; i++) {
        //             var opt = document.createElement('option');
        //             opt.innerHTML = options[i];
        //             opt.value = options[i];
        //             document.getElementById(select_string_ref).appendChild(opt);
        //         }
        //     });
        // }
        // //get k/v by path from localStorage
        // else {
        //     var dbObj = JSON.parse(localStorage.getItem('dbObj'));
        //     console.log('loadOfOptions dbObj: ', dbObj);
        //     var findObj = deepFind(dbObj, path, '/');
        //     console.log('loadOfOptions findObj: ', findObj);
        //     for(const [key] of Object.entries(findObj)){
        //         options.push(key);
        //     }
        //     for(var i = 0; i < options.length; i++) {
        //         var opt = document.createElement('option');
        //         opt.innerHTML = options[i];
        //         opt.value = options[i];
        //         document.getElementById(select_string_ref).appendChild(opt);
        //     }
        // }
        }
        
        //odd number of things in path to get docs by path from firestore
        {
            // firestore_ref.collection(path).get().then((snapshot) => {
            //     const data = snapshot.docs.map((doc) => ({
            //         id: doc.id,
            //         ...doc.data(),
            //     }));
            //     console.log(`All data in collection\n ${JSON.stringify( data )}`); 
            //     for(var j = 0; j < data.length; j++) {
            //         options.push(data[j].id);
            //     }
            //     for(var i = 0; i < options.length; i++) {
            //         var opt = document.createElement('option');
            //         opt.innerHTML = options[i];
            //         opt.value = options[i];
            //         select_dom_ref.appendChild(opt);
            //     }
            // });
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

    var dbObj = JSON.parse(localStorage.getItem('dbObj'));
    console.log('checkGasSafetyStatus dbObj: ', dbObj);
    var findObj = deepFind(dbObj, curr_path, '/');
    console.log('checkGasSafetyStatus findObj: ', findObj);
    for(const [key, value] of Object.entries(findObj)){
        key_list.push(parseFloat(key));
        map.set(parseFloat(key), value);
    }
    debugLogPrint([curr_path, key_list, map]);

    //If input concentration is less than min then safe and if more than max then fatal
    if(gas_conc_int < Math.min.apply(Math, key_list))
        safety_status_text_ref.textContent = "All safe";
    else if(gas_conc_int > Math.max.apply(Math, key_list))
        safety_status_text_ref.textContent = "Fatal";
    else{
        for(var i = 0; i < key_list.length; i++) {
            if(gas_conc_int <= key_list[i]){
                safety_status_text_ref.textContent = map.get(key_list[i]);
                debugLogPrint([key_list[i], map.get(key_list[i])]);
                break;
            }
        }
    }

    if(onlineStatus){
        db_ref.child(`Historical Data/Gas Levels/${gas_name_select}`).push({ 
            time_stamp : Math.round((new Date()).getTime() / 1000),
            gas_conc: gas_conc_int,
            gas_unit: gas_unit_select,
            safety_status: safety_status_text_ref.textContent
        });
        {
            // db_ref.child(curr_path).once("value", function(snapshot) {
            //     snapshot.forEach(function(child) {
            //         key_list.push(parseFloat(child.key));
            //         map.set(parseFloat(child.key), child.val());
            //     });
            //     debugLogPrint([curr_path, key_list, map]);

            //     //If input concentration is less than min then safe and if more than max then fatal
            //     if(gas_conc_int < Math.min.apply(Math, key_list))
            //         safety_status_text_ref.textContent = "All safe";
            //     else if(gas_conc_int > Math.max.apply(Math, key_list))
            //         safety_status_text_ref.textContent = "Fatal";
            //     else{
            //         for(var i = 0; i < key_list.length; i++) {
            //             if(gas_conc_int <= key_list[i]){
            //                 safety_status_text_ref.textContent = map.get(key_list[i]);
            //                 debugLogPrint([key_list[i], map.get(key_list[i])]);
            //                 break;
            //             }
            //         }
            //     }
                
            //     //Add auto gen key with full deets as key-value pair
            //     db_ref.child(`Historical Data/Gas Levels/${gas_name_select}`).push({ 
            //         time_stamp : Math.round((new Date()).getTime() / 1000),
            //         gas_conc: gas_conc_int,
            //         gas_unit: gas_unit_select,
            //         safety_status: safety_status_text_ref.textContent
            //     });
            // });
        }
    }
    else{
        var gpath = `Historical Data/Gas Levels/${gas_name_select}`;
        var keyGenVal = generatePushID();
        gpath = gpath.split('/');
        len = gpath.length; 
        for (var i=0; i < len; i++){
            dbObj = dbObj[gpath[i]];
        };
        dbObj[keyGenVal] = { 
            'time_stamp' : Math.round((new Date()).getTime() / 1000),
            'gas_conc': gas_conc_int,
            'gas_unit': gas_unit_select,
            'safety_status': safety_status_text_ref.textContent
        };
        console.log('checkGasSafetyStatus dbObj: ', dbObj);
    }
}

//Check noise safety status by using : curr_path to get snapshot, noise_option_dom_value to check wihich noise option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkNoiseSafetyStatus() {
    var map = new Map();
    var val_list = [];
    var key_list = [];
    var threshold_noise;

    var loudness_input_text_int = parseFloat(loudness_val);
    var loudness_val = document.getElementById('loudness_input_input').value;
    var area_text = document.getElementById('area_select').value;
    var day_time = document.getElementById('time_select').value;

    if(document.getElementById('noise_type_select').value == "Ambient Noise Levels"){
        if(onlineStatus){
            db_ref.child(curr_path).once("value", function(snapshot) {
                snapshot.forEach(function(child) {
                    val_list.push(child.val());
                    map.set(child.val(), child.key);
                });
                debugLogPrint([curr_path, val_list, map]);
        
                for (let [key, value] of map.entries()) {
                    if (value === area_text)
                        threshold_noise = key;
                }
                if(loudness_input_text_int <= threshold_noise)
                    safety_status_text_ref.textContent = 'Safe';
                else
                    safety_status_text_ref.textContent = 'UnSafe';
                
                //Add auto gen key with full deets as key-value pair
                db_ref.child('Historical Data/Noise Levels/Ambient Noise Levels').push({ 
                    time_stamp : Math.round((new Date()).getTime() / 1000),
                    day_time: day_time,
                    area_name: area_text,
                    loudness: parseInt(loudness_val),
                    safety_status: safety_status_text_ref.textContent
                });
            });
        }
        else{
            var dbObj = JSON.parse(localStorage.getItem('dbObj'));
            console.log('checkNoiseSafetyStatus dbObj: ', dbObj);
            var findObj = deepFind(dbObj, curr_path, '/');
            console.log('checkNoiseSafetyStatus findObj: ', findObj);
            for(const [key, value] of Object.entries(findObj)){
                val_list.push(parseFloat(value));
                map.set(parseFloat(value), key);
            }
            debugLogPrint([curr_path, val_list, map]);

            for (let [key, value] of map.entries()) {
                if (value === area_text)
                    threshold_noise = key;
            }
            if(loudness_input_text_int <= threshold_noise)
                safety_status_text_ref.textContent = 'Safe';
            else
                safety_status_text_ref.textContent = 'UnSafe';
            
            //Add auto gen key with full deets as key-value pair
            var gpath = `Historical Data/Noise Levels/Ambient Noise Levels`;
            var keyGenVal = generatePushID();
            gpath = gpath.split('/');
            len = gpath.length; 
            debugLogPrint([keyGenVal, gpath, len]);
            for (var i=0; i < len; i++){
                dbObj = dbObj[gpath[i]];
            };
            dbObj[keyGenVal] = {
                time_stamp : Math.round((new Date()).getTime() / 1000),
                day_time: day_time,
                area_name: area_text,
                loudness: parseInt(loudness_val),
                safety_status: safety_status_text_ref.textContent
            };
            console.log('checkNoiseSafetyStatus dbObj: ', dbObj);
        }
    }
    else if(document.getElementById('noise_type_select').value == "OSHA"){
        var loudness_val = document.getElementById('loudness_input_input').value;
        var loudness_input_text_int = parseFloat(loudness_val);
   
        if(onlineStatus){
            db_ref.child(curr_path).once("value", function(snapshot) {
                snapshot.forEach(function(child) {
                    key_list.push(parseFloat(child.key));
                    map.set(parseFloat(child.key), child.val());
                });
                debugLogPrint([curr_path, key_list, map]);
        
                if(loudness_input_text_int <= Math.min.apply(Math, key_list))
                    safety_status_text_ref.textContent = `Safe`;
                else if(loudness_input_text_int > Math.max.apply(Math, key_list))
                    safety_status_text_ref.textContent = `Completely UnSafe`;
                else{
                    for(var i = 0; i < key_list.length; i++) {
                        if(loudness_input_text_int <= key_list[i]){
                            safety_status_text_ref.textContent = `UnSafe after ${map.get(key_list[i])} hours`;
                            break;
                        }
                    }
                }

                //Add auto gen key with full deets as key-value pair
                db_ref.child('Historical Data/Noise Levels/OSHA').push({ 
                    time_stamp : Math.round((new Date()).getTime() / 1000),
                    loudness: parseInt(loudness_val),
                    safety_status: safety_status_text_ref.textContent
                });
            });
        }
        else{
            var dbObj = JSON.parse(localStorage.getItem('dbObj'));
            console.log('checkNoiseSafetyStatus dbObj: ', dbObj);
            var findObj = deepFind(dbObj, curr_path, '/');
            console.log('checkNoiseSafetyStatus findObj: ', findObj);
            for(const [key, value] of Object.entries(findObj)){
                key_list.push(parseFloat(key));
                map.set(parseFloat(key), value);
            }
            debugLogPrint([curr_path, val_list, map]);

            if(loudness_input_text_int <= Math.min.apply(Math, key_list))
                safety_status_text_ref.textContent = `Safe`;
            else if(loudness_input_text_int > Math.max.apply(Math, key_list))
                safety_status_text_ref.textContent = `Completely UnSafe`;
            else{
                for(var i = 0; i < key_list.length; i++) {
                    if(loudness_input_text_int <= key_list[i]){
                        safety_status_text_ref.textContent = `UnSafe after ${map.get(key_list[i])} hours`;
                        break;
                    }
                }
            }
            
            //Add auto gen key with full deets as key-value pair
            var gpath = `Historical Data/Noise Levels/OSHA`;
            var keyGenVal = generatePushID();
            gpath = gpath.split('/');
            len = gpath.length; 
            debugLogPrint([keyGenVal, gpath, len]);
            for (var i=0; i < len; i++){
                dbObj = dbObj[gpath[i]];
            };
            dbObj[keyGenVal] = {
                time_stamp : Math.round((new Date()).getTime() / 1000),
                loudness: parseInt(loudness_val),
                safety_status: safety_status_text_ref.textContent
            };
            console.log('checkNoiseSafetyStatus dbObj: ', dbObj);
        }
    }
}

//Check noise safety status by using : curr_path to get snapshot, fire_ratio_dom_value to check wihich gas ratio option is picked
//input loudness ref for dB(A) and input area ref for type of area
function checkFireSafetyStatus() {
    var map = new Map();
    var val_list = [];
    var grahams_ratio_value, seg_length, safety_string;

    var fire_ratio_dom_value = document.getElementById('fire_ratio_select').value;

    if(fire_ratio_dom_value == "Graham's Ratio"){
        var indicator_ref = document.getElementById('indicator');
        var co_input_text_int = parseFloat(document.getElementById('co_conc_input').value);
        var o2_input_text_int = parseFloat(document.getElementById('o2_conc_input').value);
        var n2_input_text_int = parseFloat(document.getElementById('n2_conc_input').value);

        grahams_ratio_value = ((100 * co_input_text_int) / ((0.265 * n2_input_text_int) - o2_input_text_int)).toFixed(1);
        seg_length = 100/(val_list.length);
        safety_status_text_ref.textContent = grahams_ratio_value;

        if(onlineStatus){
            db_ref.child(curr_path).once("value", function(snapshot) {
                snapshot.forEach(function(child) {
                    val_list.push(child.val());
                    map.set(child.val(), child.key);
                });
                barSplit(val_list);
                debugLogPrint([curr_path, val_list, map]);

                if(grahams_ratio_value > val_list[0]){
                    safety_string = `\r\nActive Fire`;
                    indicator_ref.style.marginLeft = `${0}%`;
                    indicator_ref.style.marginRight = `${85}%`;
                }
                else if(grahams_ratio_value < val_list[val_list.length-1]){
                    safety_string = `\r\nSafe`;
                    indicator_ref.style.marginLeft = `${85}%`;
                    indicator_ref.style.marginRight = `${0}%`;
                }
                else{
                    for(var i = 0; i < val_list.length; i++) {
                        if(grahams_ratio_value > val_list[i]){
                            safety_string = `\r\n${map.get(val_list[i])}`;
                            var m_l = 0 + (i * seg_length);
                            indicator_ref.style.marginLeft = `${m_l}%`;
                            indicator_ref.style.marginRight = `${100 - seg_length - m_l}%`;
                            break;
                        }
                    }
                }
                safety_status_text_ref.textContent += safety_string;

                //Add auto gen key with full deets as key-value pair
                db_ref.child("Historical Data/Fire Levels/Graham's Ratio").push({ 
                    time_stamp : Math.round((new Date()).getTime() / 1000),
                    gr_value: parseFloat(grahams_ratio_value),
                    safety_status: safety_string
                });
            });
        }
        else{
            var dbObj = JSON.parse(localStorage.getItem('dbObj'));
            console.log('checkNoiseSafetyStatus dbObj: ', dbObj);
            var findObj = deepFind(dbObj, curr_path, '/');
            console.log('checkNoiseSafetyStatus findObj: ', findObj);
            for(const [key, value] of Object.entries(findObj)){
                val_list.push(value);
                map.set(value, key);
            }
            barSplit(val_list);
            debugLogPrint([curr_path, val_list, map]);

            if(grahams_ratio_value > val_list[0]){
                safety_string = `\r\nActive Fire`;
                indicator_ref.style.marginLeft = `${0}%`;
                indicator_ref.style.marginRight = `${85}%`;
            }
            else if(grahams_ratio_value < val_list[val_list.length-1]){
                safety_string = `\r\nSafe`;
                indicator_ref.style.marginLeft = `${85}%`;
                indicator_ref.style.marginRight = `${0}%`;
            }
            else{
                for(var i = 0; i < val_list.length; i++) {
                    if(grahams_ratio_value > val_list[i]){
                        safety_string = `\r\n${map.get(val_list[i])}`;
                        var m_l = 0 + (i * seg_length);
                        indicator_ref.style.marginLeft = `${m_l}%`;
                        indicator_ref.style.marginRight = `${100 - seg_length - m_l}%`;
                        break;
                    }
                }
            }
            safety_status_text_ref.textContent += safety_string;
            
            //Add auto gen key with full deets as key-value pair
            var gpath = `Historical Data/Fire Levels/Graham's Ratio`;
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
        {
            // firestore_ref.collection(curr_path).get().then((snapshot) => {
            //     const data = snapshot.docs.map((doc) => ({
            //         //id: doc.id,
            //         ...doc.data(),
            //     }));
            //     console.log(`All data in collection\n ${JSON.stringify( data )}`); 
            //     for (const [key, value] of Object.entries(data[0])) {
            //         val_list.push(key);
            //         console.log(key, value, data[0], data[0][key]);
            //     }
            //     //delete val_list[0];   
            //     console.log('val_list\n', val_list); 

            //     grahams_ratio_value = ((100 * co_input_text_int) / ((0.265 * n2_input_text_int) - o2_input_text_int)).toFixed(1);
            //     seg_length = 100/(val_list.length);
            //     safety_status_text_ref.textContent = grahams_ratio_value;
            //     console.log(`Vals are:\n ${grahams_ratio_value}\n ${seg_length}`); 

            //     console.log('Check:\n', Math.max.apply(Math, val_list), Math.min.apply(Math, val_list), data[0], Object.keys(data[0])[0], Object.values(data[0])[0]); 
            //     if(grahams_ratio_value > Math.max.apply(Math, val_list)){
            //         safety_string = `\r\nActive Fire`;
            //         indicator_ref.style.marginLeft = `${0}%`;
            //         indicator_ref.style.marginRight = `${85}%`;
            //     }
            //     else if(grahams_ratio_value < Math.min.apply(Math, val_list)){
            //         safety_string = `\r\nSafe`;
            //         indicator_ref.style.marginLeft = `${85}%`;
            //         indicator_ref.style.marginRight = `${0}%`;
            //     }
            //     else{
            //         for(var i = 0; i < val_list.length; i++) {
            //             if(grahams_ratio_value > val_list[i]){
            //                 console.log('grahams_ratio_value > val_list[i] :\n', Object.values(data[0])[i]);
            //                 safety_string = `\r\n${Object.values(data[0])[i]}`;
            //                 var m_l = 0 + (i * seg_length);
            //                 indicator_ref.style.marginLeft = `${m_l}%`;
            //                 indicator_ref.style.marginRight = `${100 - seg_length - m_l}%`;
            //             }
            //             else break;
            //         }
            //     }
            //     safety_status_text_ref.textContent += safety_string;
            // });
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

//function for bar split??
function barSplit(keys_list){
    hideOrShowAllById(['grahams_meter'], 'block');
    var bar_div_seg_ref = document.getElementById('grahams_meter_seg');
    hideOrShowOneById('grahams_meter_seg', 'grid');

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