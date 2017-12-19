angular.module('MetronicApp').controller('MonitorScreen1Controller', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi','$window',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi,$window) {
    $rootScope.menueName = 'sidebar-device';
    $rootScope.showMonitorScreen = locals.get("screenNumber");
    $rootScope.settings.layout.pageContentWhite = false;

    $scope.pmNumber = 45;
    $scope.pmPercent = 13;
    $scope.pmBarColor = 'green';
    $scope.pmfontSize = 40;
    $scope.pmWidth = 0;
    $scope.pmHeight = 0;

    $scope.co2Number = 466;
    $scope.co2Percent = 80;
    $scope.co2BarColor = 'blue';
    $scope.co2fontSize = 40;
    $scope.co2Width = 0;
    $scope.co2Height = 0;

    $scope.anionNumber = 125;
    $scope.anionPercent = 46;
    $scope.anionBarColor = 'yellow';
    $scope.anionfontSize = 40;
    $scope.anionWidth = 0;
    $scope.anionHeight = 0;
    var chart1,chart2,chart3;
    $scope.$on('$viewContentLoaded', function() {
      setchart1();
      setchart2();
      setchart3();
      updatechart();
      var resizeTimeout;
      window.onresize=function(){
        clearTimeout(resizeTimeout); //防止onresize连续调用两次
        resizeTimeout = setTimeout(function(){
          var winowHeight = $window.innerHeight; //获取窗口高度
          var headerHeight = 50;
          var footerHeight = 35;
          var paddingTop = 25;
          $('.screenContainer').css('height',(winowHeight - headerHeight - footerHeight -paddingTop) + 'px');
          setchart1();
          setchart2();
          setchart3();
          updatechart();
        },500)

      };

    });

    function getValues(){

    }

    function setchart1(){
      var pmHeight = $('.bgContainer').height();
      var pmWidth = $('.bgContainer').width();
      $('#pie-pm25').css('height',pmHeight);
      $('#pie-pm25').css('width',pmWidth);
      $scope.pmfontSize = pmHeight/5;
      chart1Container = document.getElementById('pie-pm25');
      chart1 = echarts.init(chart1Container);
    }
    function setchart2(){
      var co2Height = $('.smContainer').height();
      var co2idth = $('.smContainer').width();
      $('#pie-co2').css('height',co2Height);
      $('#pie-co2').css('width',co2idth);
      $scope.co2fontSize = co2Height/5;
      chart2Container = document.getElementById('pie-co2');
      chart2 = echarts.init(chart2Container);
    }
    function setchart3(){
      var anionHeight = $('.smContainer').height();
      var anionidth = $('.smContainer').width();
      $('#pie-Anion').css('height',anionHeight);
      $('#pie-Anion').css('width',anionidth);
      $scope.anionfontSize = anionHeight/5;
      chart3Container = document.getElementById('pie-Anion');
      chart3 = echarts.init(chart3Container);
    }

    function updatechart(){
      var option1 = setOption1();
      chart1.setOption(option1);
      chart1.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0
      });
      chart1.resize();

      var option2 = setOption2();
      chart2.setOption(option2);
      chart2.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0
      });
      chart2.resize();

      var option3 = setOption3();
      chart3.setOption(option3);
      chart3.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0
      });
      chart3.resize();
    }

    function setOption1(){
      option = {
        tooltip: {
            show:false,
        },
        color:[$scope.pmBarColor,'#c5c7c0'],
        series: [
            {
                name:'pm2.5',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                hoverAnimation:false,	//关闭 hover 在扇区上的放大动画效果。
                cursor:'default', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
                silent:true,	//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                label: {
                    normal: {
                        show: false,
                        position: 'center',

                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {
                      value:$scope.pmNumber,
                      name:$scope.pmNumber,
                      label : {
                        normal:{
                          show : true,
                          position : 'center',
                          textStyle:{
                            fontWeight:'normal',
                            fontSize:$scope.pmfontSize
                          }
                        }
                      }
                    },
                    {value:500-$scope.pmPercent, name:'novalue'},

                ]
            }
        ]
    };
    return option;
  }

  function setOption2(){
    option = {
      tooltip: {
          show:false,
      },
      color:[$scope.co2BarColor,'#c5c7c0'],
      series: [
          {
              name:'co2',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation:false,	//关闭 hover 在扇区上的放大动画效果。
              cursor:'default', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
              silent:true,	//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              label: {
                  normal: {
                      show: false,
                      position: 'center',

                  },
                  emphasis: {
                      show: false
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
                  {
                    value:$scope.co2Number,
                    name:$scope.co2Number,
                    label : {
                      normal:{
                        show : true,
                        position : 'center',
                        textStyle:{
                          fontWeight:'normal',
                          fontSize:$scope.co2fontSize
                        }
                      }
                    }
                  },
                  {value:200-$scope.co2Percent, name:'novalue'},

              ]
          }
      ]
  };
  return option;
}

function setOption3(){
  option = {
    tooltip: {
        show:false,
    },
    color:[$scope.anionBarColor,'#c5c7c0'],
    series: [
        {
            name:'anion',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation:false,	//关闭 hover 在扇区上的放大动画效果。
            cursor:'default', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
            silent:true,	//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
            label: {
                normal: {
                    show: false,
                    position: 'center',

                },
                emphasis: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {
                  value:$scope.anionNumber,
                  name:$scope.anionNumber,
                  label : {
                    normal:{
                      show : true,
                      position : 'center',
                      textStyle:{
                        fontWeight:'normal',
                        fontSize:$scope.anionfontSize
                      }
                    }
                  }
                },
                {value:200-$scope.anionPercent, name:'novalue'},

            ]
        }
    ]
  };
  return option;
  }
}]);
