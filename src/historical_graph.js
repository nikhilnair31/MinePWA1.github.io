function buildGraph(){
    var map = new Map();
    var time_stamp_list = [];
    var conc_list = [];
    
    var graph_hd_ref = document.getElementById("graph_hd");
    graph_hd_ref.style.display = "block";

    var options = {
        responsive: true,
        title: {
          display: true,
          position: "top",
          text:"Historical Data",
          fontSize: 18,
          fontColor: "#111"
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
    };

    db_ref.child(curr_path).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            time_stamp_list.push(getTimeString(child.val().time_stamp));
            conc_list.push(child.val().gas_conc);
            map.set(child.val().time_stamp, child.val());
        });
        console.log(curr_path);
        console.log(time_stamp_list);
        console.log(conc_list);
        console.log(map);

        xlabels = time_stamp_list;
        ydata = conc_list;

        var myChart = new Chart(graph_hd_ref, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [{
                    label: 'Concentration',
                    data: ydata,
                    lineTension: 0.1,
                    fill: true,
                    borderColor: 'teal',
                    backgroundColor: 'transparent',
                    pointBorderColor: 'orange',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    pointHitRadius: 10,
                    pointBorderWidth: 1,
                }]
            },
            options: options
        });
    });
}

function getTimeString(timestamp) {
    var utc = new Date(timestamp * 1000).toUTCString();
    var d_val = new Date(utc).getDate() + "/" + (new Date(utc).getMonth() + 1) + "/" + new Date(utc).getFullYear() + " " + 
                new Date(utc).getUTCHours() + ":" + new Date(utc).getUTCMinutes();
    return d_val;
}