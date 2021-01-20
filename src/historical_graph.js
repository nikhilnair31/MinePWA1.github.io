function buildGraph(){
    var graph_hd_ref = document.getElementById("graph_hd");
    graph_hd_ref.style.display = "block";

    xlabels = 

    var myChart = new Chart(graph_hd_ref, {
        type: 'line',
        data: {
            //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: xlabels,
            datasets: [{
                label: '# of Votes',
                //data: [12, 19, 3, 5, 2, 3],
                data: ydata,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}