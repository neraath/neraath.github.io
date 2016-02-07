$(function () {
    var chart;
    $(document).ready(function() {
    
        var colors = Highcharts.getOptions().colors,
            categories = ['C#', 'PHP', 'Dev/Ops', 'HTML'],
            name = 'High-Level Tasks',
            data = [{
                    y: 33.3,
                    color: colors[0],
                    drilldown: {
                        name: 'C# Work',
                        categories: ['SharePoint', 'MSTest', 'ASP.Net', 'WCF', 'WIF', 'WPF'],
                        data: [12.21, 4.95, 8.58, 3.3, 2.64, 1.65],
                        color: colors[0]
                    }
                }, {
                    y: 19.6,
                    color: colors[1],
                    drilldown: {
                        name: 'PHP Work',
                        categories: ['Zend Framework', 'Behat', 'PHPUnit', 'CakePHP'],
                        data: [11.76, 2.94, 1.96, 2.94],
                        color: colors[1]
                    }
                }, {
                    y: 40.1,
                    color: colors[2],
                    drilldown: {
                        name: 'Dev/Ops',
                        categories: ['SharePoint', 'Windows', 'Linux', 'Puppet', 'Cloud'],
                        data: [11.228, 11.228, 10.426, 4.01, 3.208],
                        color: colors[2]
                    }
                }, {
                    y: 7.0,
                    color: colors[3],
                    drilldown: {
                        name: 'HTML/CSS',
                        categories: ['HTML 5', 'XHTML 1.0', 'CSS', 'Javascript'],
                        data: [2.59, 1.75, 2.1, 0.7],
                        color: colors[3]
                    }
                }];
    
    
        // Build the data arrays
        var dailyWork = [];
        var tasksData = [];
        for (var i = 0; i < data.length; i++) {
    
            // add browser data
            dailyWork.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
            });
    
            // add version data
            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                tasksData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
        }
    
        // Create the chart
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'averageweeklywork',
                type: 'pie'
            },
            title: {
                text: 'Average Weekly Work',
            },
            yAxis: {
                title: {
                    text: 'Percent Weekly Work'
                }
            },
            plotOptions: {
                pie: {
                    shadow: true
                }
            },
            tooltip: {
                valueSuffix: '%'
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Daily Work',
                data: dailyWork,
                size: '60%',
                dataLabels: {
                    formatter: function() {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: 'white',
                    distance: -30
                }
            }, {
                name: 'Tasks',
                data: tasksData,
                innerSize: '60%',
                dataLabels: {
                    formatter: function() {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +'%'  : null;
                    }
                }
            }]
        });
    });
    
});
