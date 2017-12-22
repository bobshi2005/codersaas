angular.module('MetronicApp').controller('MonitorScreen1Controller', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi','$window','$interval',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi,$window,$interval) {

    $rootScope.settings.layout.pageContentWhite = false;
    $rootScope.menueName = 'sidebar-device';
    $rootScope.showMonitorScreen = locals.get("screenNumber");


    $scope.pmNumber = 50;
    $scope.pmPercent = 10;
    $scope.pmBarColor = '#39ee7c';
    $scope.pmfontSize = 40;
    $scope.pmWidth = 0;
    $scope.pmHeight = 0;

    $scope.co2Number = 300;
    $scope.co2Percent = 10;
    $scope.co2BarColor = '#79c4f5';
    $scope.co2fontSize = 40;
    $scope.co2Width = 0;
    $scope.co2Height = 0;

    $scope.anionNumber = 125;
    $scope.anionPercent = 46;
    $scope.anionBarColor = '#f3ff6c';
    $scope.anionfontSize = 40;
    $scope.anionWidth = 0;
    $scope.anionHeight = 0;

    $scope.Temperature = 12;
    $scope.tempFontSize= 40;
    $scope.Humidity = 65;

    $scope.deviceAir1='myLYRIe5FjfVccaA'; //室内 空气质量 检测仪
    $scope.deviceAir2='t9qSesxzfz9kzQR6'; //室外 空气质量 检测仪
    $scope.deviceAnion1='s2Va1iNCj1VALwn7'; //室内 负离子 检测仪
    $scope.deviceAnion2='ZmdeHjh06r20tUMe'; //室外 负离子 检测仪

    $scope.dataIn={}; //室内数据；
    $scope.dataOut={}; //室外数据；
    $scope.isscreen = false;
    var chart1,chart2,chart3;
    $scope.changeState = function(){
      console.log('you click bg scrren button');
      $scope.isScreen = !$scope.isScreen;
      if($scope.isScreen){
        var sidebarMenu = $('.page-sidebar-menu');
        var body = $('body');
        body.addClass("page-sidebar-closed");
        sidebarMenu.addClass("page-sidebar-menu-closed");
        $('.screenContainer').addClass('bg-screen');
      }else{
        $('.screenContainer').removeClass('bg-screen');
      }
    }
    $scope.$on('$destroy',function(){
      if($scope.timer){
        $interval.cancel($scope.timer);
      }

    });
    $scope.refreshData=function(){
      getValueIn();
      getValueOut();
    }
    $scope.$on('$viewContentLoaded', function() {
      setchart1();
      setchart2();
      setchart3();
      setchart4();
      setchart5();
      $scope.refreshData();
      updatechart();
      $scope.timer = $interval($scope.refreshData,10000);
      setTableItem();
      var resizeTimeout;
      window.onresize=function(){
        clearTimeout(resizeTimeout); //防止onresize连续调用两次
        resizeTimeout = setTimeout(function(){
          var winowHeight = $window.innerHeight; //获取窗口高度
          var headerHeight = 50;
          var footerHeight = 35;
          var paddingTop = 25;
          $('.screenContainer').css('height',(winowHeight - headerHeight - footerHeight -paddingTop) + 'px');
          // setchart1();
          // setchart2();
          // setchart3();
          // setchart4();
          // setchart5();
          setTableItem();
          // updatechart();
          $scope.refreshData();
          $interval.cancel($scope.timer);
          $scope.timer = $interval($scope.refreshData,10000);
        },500)

      };

    });

    function getValueIn(){
      //获取室内空气检测
      deviceApi.getDeviceSensorData($scope.deviceAir1)
        .then(function(result) {
            if(result.data.code == 1) {
              var dataArr=result.data.data;
              if(dataArr!=null && dataArr.length>0){
               $.each(dataArr,
                 function(i, val) {
                   if(val.type == 'analog'){
                    $scope.dataIn.pm25 = val.vars[1].value;
                    $scope.dataIn.co2 = val.vars[3].value;
                    $scope.dataIn.temperature1 = Number(val.vars[7].value).toFixed(1);
                    $scope.dataIn.Humidity1 =  Number(val.vars[8].value).toFixed(1);

                   }
                   if(val.type == 'digital'){}
                 }
               );
             }

            }else {
              $scope.dataIn.pm25 = 0;
              $scope.dataIn.co2 = 0;
              $scope.dataIn.temperature1 = 0;
              $scope.dataIn.Humidity1 = 0;
            }
            $scope.pmNumber = $scope.dataIn.pm25;
            $scope.pmPercent = Math.round($scope.dataIn.pm25*100/500);
            $scope.co2Number = $scope.dataIn.co2;
            $scope.co2Percent = Math.round($scope.dataIn.co2*100/3000);
            if($scope.pmNumber <= 35){
              $scope.pmBarColor = "#39ee7c";
            }else if($scope.pmNumber <= 75){
              $scope.pmBarColor = "#e7df2c";
            }else{
              $scope.pmBarColor = "#f7be14";
            }
            console.log('color',$scope.pmBarColor);
            setchart1();
            setchart2();
            updatechart();
        }, function(err) {
            // alert(err);
      });
      //获取室内负离子数
      deviceApi.getDeviceSensorData($scope.deviceAnion1)
        .then(function(result) {
          if(result.data.code == 1) {
            var dataArr=result.data.data;
            if(dataArr!=null && dataArr.length>0){
             $.each(dataArr,
               function(i, val) {
                 if(val.type == 'analog'){
                   var n =10;
                   switch (val.vars[1].value){
                     case 0:
                      n = 10;
                     break;
                      n = 100;
                     case 1:
                     break;
                     case2:
                      n = 1000;
                     break;
                     default:
                     break;
                   }
                  $scope.dataIn.anion = convertData(Number(val.vars[4].value),n);
                  $scope.dataIn.temperature2 =  Number(val.vars[5].value).toFixed(1);
                  $scope.dataIn.Humidity2 =  Number(val.vars[6].value).toFixed(1);
                 }
                 if(val.type == 'digital'){}
               }
             );
           }

          }else {
            $scope.dataIn.anion = 0;
            $scope.dataIn.temperature2 = 0;
            $scope.dataIn.Humidity2 = 0;
          }
          $scope.anionNumber = $scope.dataIn.anion;
          $scope.anionPercent = Math.round(($scope.dataIn.anion)*100/2000);
          $scope.Temperature = $scope.dataIn.temperature2;
          $scope.Humidity = $scope.dataIn.Humidity2;

          setchart3();
          setchart4();
          setchart5();
          updatechart();
        }, function(err) {
            // alert(err);
      });
    }

    function getValueOut(){
      //获取室外空气检测
      deviceApi.getDeviceSensorData($scope.deviceAir2)
        .then(function(result) {
            if(result.data.code == 1) {
              var dataArr=result.data.data;
              if(dataArr!=null && dataArr.length>0){
               $.each(dataArr,
                 function(i, val) {
                   if(val.type == 'analog'){
                    $scope.dataOut.pm25 = val.vars[1].value;
                    $scope.dataOut.co2 = val.vars[3].value;
                    $scope.dataOut.temperature1 = Number(val.vars[7].value).toFixed(1);
                    $scope.dataOut.Humidity1 = Number(val.vars[8].value).toFixed(1);

                   }
                   if(val.type == 'digital'){}
                 }
               );
             }

            }else {
              $scope.dataOut.pm25 = 0;
              $scope.dataOut.co2 = 0;
              $scope.dataOut.temperature1 = 0;
              $scope.dataOut.Humidity1 = 0;
            }
        }, function(err) {
            // alert(err);
      });
      //获取室外负离子数
      deviceApi.getDeviceSensorData($scope.deviceAnion2)
        .then(function(result) {
          if(result.data.code == 1) {
            var dataArr=result.data.data;
            if(dataArr!=null && dataArr.length>0){
             $.each(dataArr,
               function(i, val) {
                 if(val.type == 'analog'){
                   var n =10;
                   switch (val.vars[1].value){
                     case 0:
                      n = 10;
                     break;
                      n = 100;
                     case 1:
                     break;
                     case2:
                      n = 1000;
                     break;
                     default:
                     break;
                   }
                  $scope.dataOut.anion = convertData(Number(val.vars[4].value),n);
                  $scope.dataOut.temperature2 = Number(val.vars[5].value).toFixed(1);
                  $scope.dataOut.Humidity2 = Number(val.vars[6].value).toFixed(1);
                 }
                 if(val.type == 'digital'){}
               }
             );
           }

          }else {
            // alert(result.data.errMsg);
            $scope.dataOut.anion = 0;
            $scope.dataOut.temperature2 = 0;
            $scope.dataOut.Humidity2 = 0;
          }
        }, function(err) {
            // alert(err);
      });
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
    function setchart4(){

      var tempHeight = $('.smContainer').height();
      var tempWidth = $('.smContainer').width();
      $('.Temperature').css('height',(tempHeight-40));
      $('.Temperature').css('width',tempWidth);
      $('.Temperature').css('padding-top',(tempHeight/5));
      $('.Temperature').css('font-size',tempHeight/5*2);
    }
    function setchart5(){
      var tempHeight = $('.smContainer').height();
      var tempWidth = $('.smContainer').width();
      $('.Humidity').css('height',(tempHeight-40));
      $('.Humidity').css('width',tempWidth);
      $('.Humidity').css('padding-top',(tempHeight/5));
      $('.Humidity').css('font-size',tempHeight/5*2);
    }

    function setTableItem(){
      var Height = $('.ItemContainer').height();
      var Width = $('.ItemContainer').width();
      $('.TableItem').css('height',(Height/2));
      $('.TableItem').css('width',(Width));
      $('.TableItem').css('padding-top',(Height/5));
      $('.TableItem').css('font-size',(Height/3));
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
        title:{
          show:true,
          text:'pm2.5(μg/m3)',
          textStyle:{
            fontWeight:'normal',
            fontSize:18,
            color:'#dedede'
          },

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
                      value:$scope.pmPercent,
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
                    {
                      value:100-$scope.pmPercent,
                      name:'pm2.5(μg/m3)',

                    },

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
        title:{
          show:true,
          text:'二氧化碳（ppm）',
          textStyle:{
            fontWeight:'normal',
            fontSize:12,
            color:'#dedede'
          },

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
                      value:$scope.co2Percent,
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
                    {value:100-$scope.co2Percent,name:'二氧化碳（ppm）'},

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
        title:{
          show:true,
          text:'负离子（ions/cm3）',
          textStyle:{
            fontWeight:'normal',
            fontSize:12,
            color:'#dedede'
          },

        },
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
                      value:$scope.anionPercent,
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
                    {
                      value:100-$scope.anionPercent,
                      name:'负离子（个/cm2）',

                    },

                ]
            }
        ]
      };
      return option;
    }

    function convertData(origin,n){
      console.log('data',origin,n);
      // var origin = 65535;  //原始值 十进制
      var flag = parseInt('7fff',16).toString(10);  // 7fff转成10进制
      var bg = parseInt('10000',16).toString(10);  ///0x10000转成10进制
      console.log('10进制flag：',flag);
      console.log('10进制bg：',bg);
      if(origin > flag){
        var temp4 = (bg - origin)*n;
        return temp4;
      }else{
        var temp4 = origin*n;
        return temp4;
      }
    }

}]);
