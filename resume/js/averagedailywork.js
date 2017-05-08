$(function () {
    var chart;
    $(document).ready(function() {
    
        var colors = Highcharts.getOptions().colors,
            categories = ['Management','C#', 'Dev/Ops', 'HTML'],
            name = 'High-Level Tasks',
            data = [{
                    y: 20.0,
                    color: colors[0],
                    drilldown: {
                        name: 'Management',
                        categories: ['Coaching / Mentoring','Product Strategy','Product Ownership / User Stories'],
                        data: [10.00,3.00,7.00],
                        color: colors[0]
                    }
                }, {
                    y: 50.0,
                    color: colors[1],
                    drilldown: {
                        name: 'Development',
                        categories: ['SpecFlow / MSTest / Selenium','Code Reviews','Backend / ASP.Net Web API','DocumentDB','Azure Service Bus'],
                        data: [10.00,15.00,15.00,5.00,5.00],
                        color: colors[1]
                    }
                }, {
                    y: 16.0,
                    color: colors[2],
                    drilldown: {
                        name: 'Dev/Ops',
                        categories: ['Azure','VSTS CI/CD'],
                        data: [8.00,8.00],
                        color: colors[2]
                    }
                }, {
                    y: 14.0,
                    color: colors[3],
                    drilldown: {
                        name: 'HTML/CSS',
                        categories: ['HTML 5','CSS','AngularJS','Jasmine'],
                        data: [3.00,1.00,5.0,5.0],
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
