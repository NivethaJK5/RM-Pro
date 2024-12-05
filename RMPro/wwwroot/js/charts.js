chart1();
chart2();
chart3();
$('#loadingGear').hide();

$('#save').hide();
$('#clear').hide();
function chart1() {
    document.addEventListener('DOMContentLoaded', function () {
        initializeChart();
    });

    function initializeChart() {
        var dom = document.getElementById('chart1');
        var myChart = echarts.init(dom);

        var option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '0%',
                left: 'center'
            },
            series: [
                {
                    //name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 10
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 15.55, name: 'Raw Material' },
                        { value: 10.12, name: 'Consumables' },
                        { value: 8.35, name: 'Tools' },
                        { value: 2.78, name: 'Packing' },
                        { value: 5.32, name: 'Others' }
                    ]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }
}

function chart2() {
    document.addEventListener('DOMContentLoaded', function () {
        initializeChart();
    });

    function initializeChart() {
        var dom = document.getElementById('chart2');
        var myChart = echarts.init(dom);

        const rawData = [
            [5.35, 8.14, 7.05, 2.78, 4.02],
            [10.15, 1.98, 1.30, 0, 1.3]
        ];
        const grid = {
            left: 100,
            right: 100,
            top: 50,
            bottom: 50
        };
        const series = [
            'Prospective', 'Retrospective'
        ].map((name, sid) => {
            return {
                name,
                type: 'bar',
                stack: 'total',
                barWidth: '60%',
                label: {
                    show: false, // Hide the label
                },
                data: rawData[sid]
            };
        });
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '0%',
                left: 'center'
            },
            grid,
            yAxis: {
                type: 'value'
            },
            xAxis: {
                type: 'category',
                data: ['Raw Material', 'Consumables', 'Tools', 'Packing', 'Others'],
                axisLabel: {
                    rotate: 30, // Rotate labels vertically
                    overflow: 'truncate' // Truncate long labels
                }
            },
            series
        };


        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
}         



function chart3() {
    document.addEventListener('DOMContentLoaded', function () {
        initializeChart();
    });

    function initializeChart() {
        var dom = document.getElementById('chart3');
        var myChart = echarts.init(dom);

        option = {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '2021', '2022', '2023'],
                source: [
                    { product: 'Raw Material', 2021: 13.3, 2022: -7.35, 2023: 15.5 },
                    { product: 'Consumables', 2021: 8.1, 2022: -7.34, 2023: 10.12 },
                    { product: 'Tools', 2021: -3.2, 2022: 0.15, 2023: 8.35 },
                    { product: 'Packing', 2021: -6.5, 2022: 1.32, 2023: 2.78 },
                    { product: 'Others', 2021: -3.5, 2022: 3.56, 2023: 5.32 }
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
}   