
function buildGraph(){
    var map = new Map();
    var time_stamp_list = [];
    var val_list = [];
    var obj_list = [];
    
    var graph_hd_ref = document.getElementById("graph_hd");
    graph_hd_ref.style.display = "block";

    db_ref.child(curr_path).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            //console.log(child.val(), child.val().time_stamp, child.val().gas_conc);
            map.set(child.val().time_stamp, child.val());
            obj_list.push(child.val());
            time_stamp_list.push(getTimeString(child.val().time_stamp));
            if(curr_path.includes('Gas')){
                val_list.push(child.val().gas_conc);
            }
            else if(curr_path.includes('Noise')){
                val_list.push(child.val().loudness);
            }
            else if(curr_path.includes('Fire')){
                val_list.push(child.val().gr_value);
            }
            
        });
        // console.log(curr_path);
        // console.log(map);
        // console.log(obj_list);
        // console.log(time_stamp_list);
        // console.log(val_list);

        xlabels = time_stamp_list;
        ydata = val_list;

        var main_data = {
            labels: xlabels,
            datasets: [{
                label: 'Concentration/Loudness/GR',
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
                    fontSize: 18,
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
                    fontColor: "#333",
                    fontSize: 16
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
    });
}

function getTimeString(timestamp) {
    var utc = new Date(timestamp * 1000).toUTCString();
    var d_val = new Date(utc).getDate() + "/" + (new Date(utc).getMonth() + 1) + "/" + new Date(utc).getFullYear() + " " + 
                new Date(utc).getUTCHours() + ":" + new Date(utc).getUTCMinutes();
    return d_val;
}