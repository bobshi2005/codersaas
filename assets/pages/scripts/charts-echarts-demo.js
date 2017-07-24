var myChart4, myChart5;
var myOption4;

jQuery(document).ready(function() {
    // ---PIE---
    if ($("#echarts_pie").length > 0) {
        myChart5 = echarts.init(document.getElementById('echarts_pie'));
        myChart5.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['在线', '正常停机', '故障停机', '离线', ]
            },
            series: [{
                    name: '在线状态',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
                    center: ['50%', 200],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    color: ['#36d7b7', '#bfcad1'],
                    data: [{
                            value: 335,
                            name: '在线',
                            selected: true
                        },
                        {
                            value: 120,
                            name: '离线'
                        }
                    ]
                },
                {
                    name: '设备状态',
                    type: 'pie',
                    radius: ['40%', '55%'],
                    color: ['#f4d03f', '#e08283'],
                    data: [{
                            value: 335,
                            name: '在线'
                        },
                        {
                            value: 98,
                            name: '正常停机'
                        },
                        {
                            value: 22,
                            name: '故障停机'
                        }
                    ]
                }
            ]
        });
    }
    // --- LINE ---
    myOption4 = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['UA', 'UB', 'UC']
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00','7:00', '8:00', '9:00', '10:00',
                    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00','17:00', '18:00', '19:00', '20:00',
                    '21:00', '22:00', '23:00']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
                name: 'UA',
                type: 'line',
                stack: '总量',
                smooth: '1',
                data: [120, 132, 101, 134, 90, 230, 210, 220, 182, 191, 234, 290, 330, 310,150, 232, 201, 234, 290, 330, 310, 134, 90, 230]
            },
            {
                name: 'UB',
                type: 'line',
                stack: '总量',
                smooth: '1',
                data: [220, 182, 191, 234, 290, 330, 310, 134, 90, 230, 210, 220, 182, 191, 234, 134, 90, 220, 182, 191, 234, 290, 290, 330]
            },
            {
                name: 'UC',
                type: 'line',
                stack: '总量',
                smooth: '1',
                data: [150, 232, 201, 154, 190, 330, 410, 191, 234, 290, 330, 310, 120, 132, 101, 134, 234, 182, 191, 234, 290, 232, 201,90]
            }
        ]
    };



});

window.onresize = function() {
    if ($("#echarts_pie").length > 0) {
        myChart5.resize();
    }
}

$('.nav-tabs li a').click(function() {　　
    $(this).addClass('active').siblings().removeClass('active');　
    var _id = $(this).attr('href');　　
    $('.tabs-contents').find('#' + _id).addClass('active').siblings().removeClass('active');
    　
    switch (_id) {　　　　
        case "#tab_1_1":
            　　　　　　break;　　　　
        case "#tab_1_2":
            　　　　　　break;　　　　
        case "#tab_1_3":
            {
              if ($("#echarts_line").length > 0) {
                  console.log(_id);　
                  var mychartContainer = document.getElementById('echarts_line');
                  mychartContainer.style.width=$('#navContainer').width()-20+'px';

                  myChart4 = echarts.init(mychartContainer);


              }
              myChart4.setOption(myOption4);　
              window.onresize=function(){
                mychartContainer.style.width=$('#navContainer').width()-20+'px';
                myChart4.resize();
              };
            }
            　　　　　
            break;
        case "#tab_1_4":
            　　　　　　break;
        case "#tab_1_5":
            　　　　　　break;
        case "#tab_1_6":
            　　　　　　break;　　　　
        default:
            　　　　　　　　　　　
            break;　　
    }
});
