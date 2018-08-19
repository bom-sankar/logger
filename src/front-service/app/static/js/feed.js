$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'City Temperature'
        },
        xAxis: {
            categories: {{ return_obj['cities'] }}
        },
        yAxis: {
            title: {
                text: 'Temp in K'
            }
        },
        series: [{
            name: 'Temp',
            data: {{ return_obj['temps'] }}
        }],
    });
});