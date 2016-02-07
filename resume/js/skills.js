$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'skills',
                type: 'bar'
            },
            title: {
                text: 'Skill Rating (out of 10)'
            },
            xAxis: {
                categories: ['C#', 'PHP', 'ASP.Net', 'SQL', 'SharePoint', 'HTML', 'CSS', 'Javascript', 'Agile'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Skill Level',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function() {
                    return '' +
                        this.series.name +': '+ this.y + ' / 10';
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: false,
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Skill Level',
                data: [ 8.0, 8.0, 7.0, 6.0, 6.0, 6.0, 5.0, 5.0 ]
            }]
        });
    });
    
});
