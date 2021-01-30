//idk some function to build a graph from data stored in localStorage
function buildGraph(){
    var map = new Map();
    var time_stamp_list = [];
    var val_list = [];
    var obj_list = [];
    var type_label;
    
    var graph_hd_ref = document.getElementById("graph_hd");
    graph_hd_ref.style.display = "block";

    var dbObj = JSON.parse(localStorage.getItem('dbObj'));
    var findObj = deepFind(dbObj, curr_path, '/');

    for(const [key, value] of Object.entries(findObj)){
        map.set(value.time_stamp, value);
        obj_list.push(value);
        time_stamp_list.push(getTimeString(value.time_stamp));
        if(curr_path.includes('Gas')){
            val_list.push(value.gas_conc);
            type_label = 'Gas Concentration';
        }
        else if(curr_path.includes('Noise')){
            val_list.push(value.loudness);
            type_label = 'Noise Loudness';
        }
        else if(curr_path.includes('Fire')){
            val_list.push(value.gr_value);
            type_label = 'Gas Ratio';
        }
    }
    debugLogPrint(['buildGraph', curr_path, dbObj, findObj, map, obj_list, time_stamp_list, val_list]);

    xlabels = time_stamp_list;
    ydata = val_list;

    var main_data = {
            labels: xlabels,
            datasets: [{
                label: type_label,
                data: ydata,
                lineTension: 0.2,
                fill: true,
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                pointBorderColor: 'white',
                pointRadius: 5,
                pointHoverRadius: 10,
                pointHitRadius: 10,
                pointBorderWidth: 2,
            },{
                label: 'Extras',
                data: obj_list,
            }]
    };

    var myChart = new Chart(graph_hd_ref, {
            type: 'line',
            data: main_data,
            options: {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text:"Historical Data",
                    fontSize: 14,
                    fontColor: "white"
                },
                tooltips: {
                    enabled: true,
                    maintainAspectRatio: false,
                    mode: 'nearest',
                    titleAlign: 'left',
                    bodyAlign: 'left',
                    callbacks: {
                        label: function(tooltipItems, main_data) { 
                            var multistringText = [];
                            var idk = main_data.datasets[1].data[tooltipItems.index];
                            console.log(idk, typeof idk);
                            for (const [key, value] of Object.entries(idk)) {
                                var key_val_str = key+' : '+value;
                                multistringText.push(key_val_str);
                            }
                            return multistringText;
                        }
                    }
                },
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    fontColor: "white",
                    fontSize: 14
                  }
                },
                scales: {
                    xAxes: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                'millisecond': 'MMM DD',
                                'second': 'MMM DD',
                                'minute': 'MMM DD',
                                'hour': 'MMM DD',
                                'day': 'MMM DD',
                                'week': 'MMM DD',
                                'month': 'MMM DD',
                                'quarter': 'MMM DD',
                                'year': 'MMM DD'
                            }
                        }
                    }
                }
            }
    });

    {
        // db_ref.child(curr_path).once("value", function(snapshot) {
        //     snapshot.forEach(function(child) {
        //         //console.log(child.val(), child.val().time_stamp, child.val().gas_conc);
        //         map.set(child.val().time_stamp, child.val());
        //         obj_list.push(child.val());
        //         time_stamp_list.push(getTimeString(child.val().time_stamp));
        //         if(curr_path.includes('Gas')){
        //             val_list.push(child.val().gas_conc);
        //             type_label = 'Gas Concentration';
        //         }
        //         else if(curr_path.includes('Noise')){
        //             val_list.push(child.val().loudness);
        //             type_label = 'Noise Loudness';
        //         }
        //         else if(curr_path.includes('Fire')){
        //             val_list.push(child.val().gr_value);
        //             type_label = 'Gas Ratio';
        //         }
                
        //     });
        //     debugLogPrint(['buildGraph', curr_path, map, obj_list, time_stamp_list, val_list]);

        //     xlabels = time_stamp_list;
        //     ydata = val_list;

        //     var main_data = {
        //         labels: xlabels,
        //         datasets: [{
        //             label: type_label,
        //             data: ydata,
        //             lineTension: 0.2,
        //             fill: true,
        //             borderColor: 'white',
        //             backgroundColor: 'rgba(255, 255, 255, 0.1)',
        //             pointBorderColor: 'white',
        //             pointRadius: 5,
        //             pointHoverRadius: 10,
        //             pointHitRadius: 10,
        //             pointBorderWidth: 2,
        //         },{
        //             label: 'Extras',
        //             data: obj_list,
        //         }]
        //     };

        //     var myChart = new Chart(graph_hd_ref, {
        //         type: 'line',
        //         data: main_data,
        //         options: {
        //             responsive: true,
        //             title: {
        //                 display: true,
        //                 position: "top",
        //                 text:"Historical Data",
        //                 fontSize: 14,
        //                 fontColor: "white"
        //             },
        //             tooltips: {
        //                 enabled: true,
        //                 maintainAspectRatio: false,
        //                 mode: 'nearest',
        //                 titleAlign: 'left',
        //                 bodyAlign: 'left',
        //                 callbacks: {
        //                     label: function(tooltipItems, main_data) { 
        //                         var multistringText = [];
        //                         var idk = main_data.datasets[1].data[tooltipItems.index];
        //                         console.log(idk, typeof idk);
        //                         for (const [key, value] of Object.entries(idk)) {
        //                             var key_val_str = key+' : '+value;
        //                             multistringText.push(key_val_str);
        //                         }
        //                         return multistringText;
        //                     }
        //                 }
        //             },
        //             legend: {
        //             display: true,
        //             position: "bottom",
        //             labels: {
        //                 fontColor: "white",
        //                 fontSize: 14
        //             }
        //             },
        //             scales: {
        //                 xAxes: {
        //                     type: 'time',
        //                     time: {
        //                         displayFormats: {
        //                             'millisecond': 'MMM DD',
        //                             'second': 'MMM DD',
        //                             'minute': 'MMM DD',
        //                             'hour': 'MMM DD',
        //                             'day': 'MMM DD',
        //                             'week': 'MMM DD',
        //                             'month': 'MMM DD',
        //                             'quarter': 'MMM DD',
        //                             'year': 'MMM DD'
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // });
    }
}

function getTimeString(timestamp) {
    var utc = new Date(timestamp * 1000).toUTCString();
    var d_val = new Date(utc).getDate() + "/" + (new Date(utc).getMonth() + 1) + "/" + new Date(utc).getFullYear() + " " + 
                new Date(utc).getUTCHours() + ":" + new Date(utc).getUTCMinutes();
    return d_val;
}