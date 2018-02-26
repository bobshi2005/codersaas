angular.module('MetronicApp').controller('HomeController2', ['$scope', '$rootScope', '$http', 'userApi', 'locals','$state', function($scope, $rootScope, $http, userApi,locals,$state) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-dashboard';
    $scope.menueName = $rootScope.menueName;
    $rootScope.settings.layout.pageSidebarClosed = true;

    $scope.$on('$viewContentLoaded', function() {
          if ($("#echarts_world").length > 0) {
              mapChart = echarts.init(document.getElementById('echarts_world'));
              mapChart.setOption(worldoption);
              // mapChart.on('click', function (params) {
              //     if(params.data.name =='中国'){
              //       $rootScope.showMap = true;
              //       $rootScope.pagetitle = '地图模式';
              //       $rootScope.listMode = '切换列表';
              //       $state.go('main.device.monitor');
              //     }
              // });
          }
          if ($("#echarts_pie").length > 0) {
              pieChart = echarts.init(document.getElementById('echarts_pie'));
              pieChart.setOption(pieoption);
          }
          if ($("#echarts_line").length > 0) {
              lineChart1 = echarts.init(document.getElementById('echarts_line'));
              lineChart1.setOption(lineoption1);
          }
          if ($("#echarts_bar1").length > 0) {
              barChart1 = echarts.init(document.getElementById('echarts_bar1'));
              barChart1.setOption(baroption1);
          }
          if ($("#echarts_bar2").length > 0) {
              barChart2 = echarts.init(document.getElementById('echarts_bar2'));
              barChart2.setOption(baroption2);
          }
          window.onresize = function() {
              if ($("#echarts_world").length > 0) {
                  mapChart.resize();
              }
              if ($("#echarts_pie").length > 0) {
                  pieChart.resize();
              }
              if ($("#echarts_line").length > 0) {
                  lineChart1.resize();
              }
              if ($("#echarts_bar1").length > 0) {
                  barChart1.resize();
              }
              if ($("#echarts_bar2").length > 0) {
                  barChart2.resize();
              }
          };
    });
    var nameMap = {
        'Afghanistan':'阿富汗',
        'Angola':'安哥拉',
        'Albania':'阿尔巴尼亚',
        'United Arab Emirates':'阿联酋',
        'Argentina':'阿根廷',
        'Armenia':'亚美尼亚',
        'French Southern and Antarctic Lands':'法属南半球和南极领地',
        'Australia':'澳大利亚',
        'Austria':'奥地利',
        'Azerbaijan':'阿塞拜疆',
        'Burundi':'布隆迪',
        'Belgium':'比利时',
        'Benin':'贝宁',
        'Burkina Faso':'布基纳法索',
        'Bangladesh':'孟加拉国',
        'Bulgaria':'保加利亚',
        'The Bahamas':'巴哈马',
        'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
        'Belarus':'白俄罗斯',
        'Belize':'伯利兹',
        'Bermuda':'百慕大',
        'Bolivia':'玻利维亚',
        'Brazil':'巴西',
        'Brunei':'文莱',
        'Bhutan':'不丹',
        'Botswana':'博茨瓦纳',
        'Central African Republic':'中非共和国',
        'Canada':'加拿大',
        'Switzerland':'瑞士',
        'Chile':'智利',
        'China':'中国',
        'Ivory Coast':'象牙海岸',
        'Cameroon':'喀麦隆',
        'Democratic Republic of the Congo':'刚果民主共和国',
        'Republic of the Congo':'刚果共和国',
        'Colombia':'哥伦比亚',
        'Costa Rica':'哥斯达黎加',
        'Cuba':'古巴',
        'Northern Cyprus':'北塞浦路斯',
        'Cyprus':'塞浦路斯',
        'Czech Republic':'捷克共和国',
        'Germany':'德国',
        'Djibouti':'吉布提',
        'Denmark':'丹麦',
        'Dominican Republic':'多明尼加共和国',
        'Algeria':'阿尔及利亚',
        'Ecuador':'厄瓜多尔',
        'Egypt':'埃及',
        'Eritrea':'厄立特里亚',
        'Spain':'西班牙',
        'Estonia':'爱沙尼亚',
        'Ethiopia':'埃塞俄比亚',
        'Finland':'芬兰',
        'Fiji':'斐',
        'Falkland Islands':'福克兰群岛',
        'France':'法国',
        'Gabon':'加蓬',
        'United Kingdom':'英国',
        'Georgia':'格鲁吉亚',
        'Ghana':'加纳',
        'Guinea':'几内亚',
        'Gambia':'冈比亚',
        'Guinea Bissau':'几内亚比绍',
        'Equatorial Guinea':'赤道几内亚',
        'Greece':'希腊',
        'Greenland':'格陵兰',
        'Guatemala':'危地马拉',
        'French Guiana':'法属圭亚那',
        'Guyana':'圭亚那',
        'Honduras':'洪都拉斯',
        'Croatia':'克罗地亚',
        'Haiti':'海地',
        'Hungary':'匈牙利',
        'Indonesia':'印尼',
        'India':'印度',
        'Ireland':'爱尔兰',
        'Iran':'伊朗',
        'Iraq':'伊拉克',
        'Iceland':'冰岛',
        'Israel':'以色列',
        'Italy':'意大利',
        'Jamaica':'牙买加',
        'Jordan':'约旦',
        'Japan':'日本',
        'Kazakhstan':'哈萨克斯坦',
        'Kenya':'肯尼亚',
        'Kyrgyzstan':'吉尔吉斯斯坦',
        'Cambodia':'柬埔寨',
        'South Korea':'韩国',
        'Kosovo':'科索沃',
        'Kuwait':'科威特',
        'Laos':'老挝',
        'Lebanon':'黎巴嫩',
        'Liberia':'利比里亚',
        'Libya':'利比亚',
        'Sri Lanka':'斯里兰卡',
        'Lesotho':'莱索托',
        'Lithuania':'立陶宛',
        'Luxembourg':'卢森堡',
        'Latvia':'拉脱维亚',
        'Morocco':'摩洛哥',
        'Moldova':'摩尔多瓦',
        'Madagascar':'马达加斯加',
        'Mexico':'墨西哥',
        'Macedonia':'马其顿',
        'Mali':'马里',
        'Myanmar':'缅甸',
        'Montenegro':'黑山',
        'Mongolia':'蒙古',
        'Mozambique':'莫桑比克',
        'Mauritania':'毛里塔尼亚',
        'Malawi':'马拉维',
        'Malaysia':'马来西亚',
        'Namibia':'纳米比亚',
        'New Caledonia':'新喀里多尼亚',
        'Niger':'尼日尔',
        'Nigeria':'尼日利亚',
        'Nicaragua':'尼加拉瓜',
        'Netherlands':'荷兰',
        'Norway':'挪威',
        'Nepal':'尼泊尔',
        'New Zealand':'新西兰',
        'Oman':'阿曼',
        'Pakistan':'巴基斯坦',
        'Panama':'巴拿马',
        'Peru':'秘鲁',
        'Philippines':'菲律宾',
        'Papua New Guinea':'巴布亚新几内亚',
        'Poland':'波兰',
        'Puerto Rico':'波多黎各',
        'North Korea':'北朝鲜',
        'Portugal':'葡萄牙',
        'Paraguay':'巴拉圭',
        'Qatar':'卡塔尔',
        'Romania':'罗马尼亚',
        'Russia':'俄罗斯',
        'Rwanda':'卢旺达',
        'Western Sahara':'西撒哈拉',
        'Saudi Arabia':'沙特阿拉伯',
        'Sudan':'苏丹',
        'South Sudan':'南苏丹',
        'Senegal':'塞内加尔',
        'Solomon Islands':'所罗门群岛',
        'Sierra Leone':'塞拉利昂',
        'El Salvador':'萨尔瓦多',
        'Somaliland':'索马里兰',
        'Somalia':'索马里',
        'Republic of Serbia':'塞尔维亚共和国',
        'Suriname':'苏里南',
        'Slovakia':'斯洛伐克',
        'Slovenia':'斯洛文尼亚',
        'Sweden':'瑞典',
        'Swaziland':'斯威士兰',
        'Syria':'叙利亚',
        'Chad':'乍得',
        'Togo':'多哥',
        'Thailand':'泰国',
        'Tajikistan':'塔吉克斯坦',
        'Turkmenistan':'土库曼斯坦',
        'East Timor':'东帝汶',
        'Trinidad and Tobago':'特里尼达和多巴哥',
        'Tunisia':'突尼斯',
        'Turkey':'土耳其',
        'United Republic of Tanzania':'坦桑尼亚联合共和国',
        'Uganda':'乌干达',
        'Ukraine':'乌克兰',
        'Uruguay':'乌拉圭',
        'United States of America':'美国',
        'Uzbekistan':'乌兹别克斯坦',
        'Venezuela':'委内瑞拉',
        'Vietnam':'越南',
        'Vanuatu':'瓦努阿图',
        'West Bank':'西岸',
        'Yemen':'也门',
        'South Africa':'南非',
        'Zambia':'赞比亚',
        'Zimbabwe':'津巴布韦'
    };
    var data = [
       {name: '中国', value: 3422},
       {name: '加拿大', value: 132},
       {name: '法国', value: 45},
       {name: '希腊', value: 78},
       {name: '澳大利亚', value: 1200},
       {name: '美国', value: 330},
       {name: '土耳其', value: 16},

    ];
    var geoCoordMap = {
      '中国':[116.3671875,39.9771201],
      '加拿大':[-120.579648,51.825812],
      '法国':[1.651992,46.728275],
      '希腊':[21.668251,39.289613],
      '澳大利亚':[135.87867,-23.655727],
      '美国':[-92.348996,38.628852],
      '土耳其':[35.208662,39.403894],

    };

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });

        }
    }
    return res;

};
    var worldoption = {
      backgroundColor: '#fff',
      title: {
          text: '全球设备分布情况',
          left: 'center',
          top: 'top',
          textStyle: {
              color: '#000'
          }
      },
      tooltip : {
          trigger: 'item',
          formatter: function(params) {
              var res = params.name+': ';
              res+=params.data.value[2];
              return res;
        }
      },
      geo: {
        map: 'world',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        selectedMode : 'single',
        itemStyle:{
             emphasis:{
               label:{
                 show:false
               },
               areaColor: '#2a333d'
             },
             normal: {
               label:{show:false},
                 areaColor: '#338af2',
                 borderColor: '#fff'
             },
        },
    },
      series : [
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: 20,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
      ]
    };

    var pieoption = {
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          x: 'left',
          data: ['在线', '离线','正常运行', '故障停机',  ]
      },
      series: [{
              name: '在线状态',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '70%'],
              center: ['40%', 100],
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
              color: ['#36d7b7', '#e08283'],
              data: [{
                      value: 1980,
                      name: '在线',
                      selected: true
                  },
                  {
                      value: 340,
                      name: '离线'
                  }
              ]
          },
          {
                  name: '运行状态',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '70%'],
                  center: ['80%', 100],
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
                  color: ['#57ceed', '#d9d23b'],
                  data: [{
                          value: 1980,
                          name: '正常运行',
                          selected: true
                      },
                      {
                          value: 340,
                          name: '故障停机'
                      }
                  ]
              }
      ]
    };
    $scope.energyeXdata=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    $scope.energyeYdata=[120, 159, 340, 290, 430, 540, 480, 430,390, 320, 430, 230];
    $scope.checkoption1 = function(){
      $scope.energyeXdata=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      $scope.energyeYdata=[120, 159, 340, 290, 430, 540, 480, 430,390, 320, 430, 230];
      // console.log('option1',$scope.energyeYdata);
      lineChart1.setOption({
        xAxis: {
          data: $scope.energyeXdata
          },
        series: [{
        data:$scope.energyeYdata}]
      });

    };
    $scope.checkoption2 = function(){
      $scope.energyeXdata=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
      $scope.energyeYdata=[7.8, 12.3, 11.9, 16.5, 20.9, 18.4, 13.8, 12.4, 11.5, 6.7, 5.5, 5.9, 9.4,3.0, 5.7,9, 18.4, 13.8,11.9, 16.5, 20.9,12.3, 11.9, 16.5, 20.9, 18.4, 12.8, 12.9, 10.5, 8.7];
      // console.log('option2',$scope.energyeYdata);
      lineChart1.setOption({
        xAxis: {
          data: $scope.energyeXdata
          },
        series: [{
        data:$scope.energyeYdata}]
      });

    };
    $scope.checkoption3 = function(){
      $scope.energyeXdata=['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',];
      $scope.energyeYdata=[0.5, 0.9, 0.6, 0.3, 0.5, 0.8, 0.34, 0.44,0.65, 0.58, 0.43, 0.26,0.5, 0.9, 0.6, 0.3, 0.59, 0.78, 0.24, 0.84,0.15, 0.38, 0.48, 0.29,];
      // console.log('option3',$scope.energyeYdata);
      lineChart1.setOption({
        xAxis: {
          data: $scope.energyeXdata
          },
        series: [{
        data:$scope.energyeYdata}]
      });

    };
    var lineoption1 = {
        title : {
          text: '能耗',
        },
        tooltip: {
            trigger: 'axis',

            formatter: "{b} : {c} (kwh)"
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                // data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
                data: $scope.energyeXdata
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel : {
                    formatter: '{value}kwh'
                },
                splitNumber:10
            }
        ],
        series: [
            {
                name:'当年能耗',
                type:'line',
                smooth: '1',
                itemStyle : {
                      normal : {
                          color:'#d973e6'
                      }
                  },
                data: $scope.energyeYdata
                // data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
            }
        ]
    };

    var baroption1 = {
      title : {
        text: '开机率',
      },
      tooltip : {
          trigger: 'axis',
          formatter: "{a} <br/>{b}: {c} (%)"
      },
      toolbox: {
          show : true,
          feature : {
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
          }
      },
      grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
      },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}%'
              },
              splitNumber:10
          }
      ],
      series : [
          {
              name:'开机率',
              type:'bar',
              itemStyle : {
                    normal : {
                      color:'#1ab0b0'
                    }
                },
              data:[25, 13, 32, 28, 46, 75, 46, 43, 32.6, 20.0, 16.4, 53.3],
              markPoint : {
                  data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                  ]
              },
              markLine : {
                  data : [
                      {type : 'average', name: '平均值'}
                  ]
              }
          }
      ]
    };
    var baroption2 = {
      title : {
        text: '合格率',
      },
      tooltip : {
          trigger: 'axis',
          formatter: "{a} <br/>{b}: {c} (%)"
      },
      toolbox: {
          show : true,
          feature : {
              // dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
          }
      },
      grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
      },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}%'
              },
              splitNumber:10
          }
      ],
      series : [
        {
          name:'合格率',
          type:'bar',
          itemStyle : {
                normal : {
                  color:'#f1c321'
                }
            },
          data:[89, 92.3, 87.5, 82.8, 93.1, 90.7, 86.3, 88.9, 95.6, 88, 88.3, 87.6],
          markPoint : {
              data : [
                  {name : '年最高', value : 95.6, xAxis: 8, yAxis: 95.6},
                  {name : '年最低', value : 82.8, xAxis: 3, yAxis: 82.8}
              ]
          },
          markLine : {
              data : [
                  {type : 'average', name : '平均值'}
              ]
          }
        }
      ]
    };


  $('#table_Alarm_1').dataTable({
      "language": {
          "aria": {
              "sortAscending": ": activate to sort column ascending",
              "sortDescending": ": activate to sort column descending"
          },
          "emptyTable": "没有数据",
          "info": "显示 _START_ 到 _END_    共 _TOTAL_ 条",
          "infoEmpty": "没有记录",
          "infoFiltered": "(filtered1 from _MAX_ total entries)",
          "lengthMenu": "_MENU_ 条记录/页",
          "search": "搜索:",
          "zeroRecords": "没有符合条件的查询记录"
      },
      searching : false,
      bLengthChange: false,
      buttons: [],
      bFilter: false,
      "pageLength": 5,
      "dom": '<"top"i>rt<"bottom"flp><"clear">'
  });

}]);
