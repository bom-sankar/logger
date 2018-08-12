function dashboard(data_json) {
    if ($("#dashboard-lineChart-2-type").length) {
      var lineChartCanvas = $("#dashboard-lineChart-2-type").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'bar',
        data: {
          labels: data_json['cities'],
          datasets: [{
            data: data_json['temps'],
            pointBackgroundColor: "#fffff",
            pointBorderWidth: 1,
            backgroundColor: [
              '#3B579D',
              '#1DA1F2',
              '#FF5722'
            ],
            borderColor: [
              '#ffffff'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
            position:'left'
          },
          tooltips: {
            enabled: true
          },
          layout: {
            padding: {
              top: 5,
              bottom: 5
            }
          }
        }
      });
    }
    }