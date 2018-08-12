// chart loader function for dashboard
function dashboard(data_json) {
    if($("#growth-chart").length) {
      $("#growth-chart").sparkline('html', {
        enableTagOptions: true,
        type: 'bar',
        width: '100%',
        height: '50',
        fillColor: 'false',
        stackedBarColor: ['#497dc6', '#FF44A4'],
        barWidth: 8,
        barSpacing: 4,
        chartRangeMin: 0
      });
    }
    if ($("#dashboard-lineChart-2-type").length) {
      var lineChartCanvas = $("#dashboard-lineChart-2-type").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'bar',
        data: {
          labels: ["Fb", "Tw", "News"],
          datasets: [{
            data: [data_json['sentiment_dist']['fb']['neg']+data_json['sentiment_dist']['fb']['pos'],
                     data_json['sentiment_dist']['tw']['neg']+data_json['sentiment_dist']['tw']['pos'],
                     data_json['sentiment_dist']['news']['neg']+data_json['sentiment_dist']['news']['pos']],
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
    if ($("#dashboard-lineChart-2x").length) {
      var lineChartCanvas = $("#dashboard-lineChart-2x").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'bar',
        data: {
          labels: data_json['disturbing_posts']['label'],
          datasets: [{
            data: data_json['disturbing_posts']['data'],
            pointBackgroundColor: "#fffff",
            pointBorderWidth: 1,
            backgroundColor: [
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5',
              '#FF74A5'
            ],
            borderColor: [
              '#f49e42'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              gridLines: {
                drawBorder: true,
                display: true
              },
              ticks: {
                display: false,
              }
            }],
            yAxes: [{
              gridLines: {
                drawBorder: true,
                display: true,
              },
              ticks: {
                display: true,
              }
            }]
          },
          legend: {
            display: false
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

    if ($("#dashboard-lineChart-2-page").length) {
      var lineChartCanvas = $("#dashboard-lineChart-2-page").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: {
          labels: data_json['post_trend']['date_array'],
          datasets: [{
            data: data_json['audience']['distAudience'],
            pointBackgroundColor: "#fffff",
            pointBorderWidth: 1,
            backgroundColor: [
              '#ff0000'
            ],
            borderColor: [
              '#ff0000'
            ],
            borderWidth: 1,
            fill:false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              gridLines: {
                drawBorder: false,
                display: true
              },
              ticks: {
                display: false,
              }
            }],
            yAxes: [{
              gridLines: {
                drawBorder: false,
                display: true,
              },
              ticks: {
                display: false,
              }
            }]
          },
          legend: {
            display: false
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
    if ($("#dashboard-lineChart-3").length) {
      var lineChartCanvas = $("#dashboard-lineChart-3").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: {
          labels: data_json['post_trend']['date_array'],
          datasets: [{
            data: data_json['audience']['allAudience'],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            backgroundColor: [
              'rgba(0,0,0,0)'
            ],
            borderColor: [
              '#fff'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              gridLines: {
                drawBorder: false,
                display: false
              },
              ticks: {
                display: false,
              }
            }],
            yAxes: [{
              gridLines: {
                drawBorder: false,
                display: false,
              },
              ticks: {
                display: false,
              }
            }]
          },
          legend: {
            display: false
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
    if ($("#dashboard-donut-chart").length) {
      $(function() {
        var total = 62;
        var browsersChart = Morris.Donut({
          element: 'dashboard-donut-chart',
          data: data_json['page_impact']['impact'],
          resize: true,
          colors: ['#03a9f3', '#00c292', '#dddddd'],
          formatter: function(value, data) {
          console.log(value, total);
            return Math.floor(value / data_json['page_impact']['negReach'] * 100) + '%';
          }
        });

        browsersChart.options.data.forEach(function(label, i) {
          var legendItem = $('<span></span>').text(label['label']).prepend('<span>&nbsp;</span>');
          legendItem.find('span')
            .css('backgroundColor', browsersChart.options.colors[i]);
          $('#legend').append(legendItem)
        });
      });
    }

    }

// filter on change function
$('#selectPlatform').change(function(){
    dashboardFilter('platform');
})

$('#selectPage').change(function(){
    dashboardFilter('page');
})
$('#datepicker-popup').change(function(){
    dashboardFilter('fromDate');
})