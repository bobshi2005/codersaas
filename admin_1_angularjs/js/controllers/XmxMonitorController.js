angular.module('MetronicApp').controller('XmxMonitorController', ['$scope', '$rootScope', '$http', 'testApi', 'locals','$compile','$interval','deviceApi','NgTableParams','$state','sharedataApi', function($scope, $rootScope, $http, testApi, locals, $compile, $interval,deviceApi,NgTableParams,$state,sharedataApi) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-device';
    $scope.menueName = $rootScope.menueName;

    $scope.message ='';
    $scope.showTree = false;
    $scope.tagPositions ={};
    $scope.linechartoption;
    var linechart;
    var machineline1;//tab2
    var machineline2;//tab2
    var machineline3;//tab3
    var machineline4;//tab3
    $scope.line4type = '';
    // $scope.equipname = '';

    $scope.savePosition = function(){
      var width = parseInt($('#main-left-container').css('width'));
      var height = parseInt($('#main-left-container').css('height'));

      // console.log('image',width,height);
      var positions=[];
      positions.push({
        "left":parseInt($('#tag1').css('left'))/width,
        "top":parseInt($('#tag1').css('top'))/height,
      });
      positions.push({
        "left":parseInt($('#tag2').css('left'))/width,
        "top":parseInt($('#tag2').css('top'))/height,
      });
      positions.push({
        "left":parseInt($('#tag3').css('left'))/width,
        "top":parseInt($('#tag3').css('top'))/height,
      });
      positions.push({
        "left":parseInt($('#tag4').css('left'))/width,
        "top":parseInt($('#tag4').css('top'))/height,
      });
      positions.push({
        "left":parseInt($('#tag5').css('left'))/width,
        "top":parseInt($('#tag5').css('top'))/height,
      });
      setTagPositions(positions);
    };
    $scope.changeTreeState = function(){
      if($('.xmx-left-bar img').attr('src') == "../assets/pages/img/right.png"){
        $scope.showTree = true;
        $('.xmx-left-bar').css('width',"180px");
        $('.xmx-left-bar img').attr('src',"../assets/pages/img/left.png");
      }else{
        $scope.showTree = false;
        $('.xmx-left-bar').css('width',"10px");
        $('.xmx-left-bar img').attr('src',"../assets/pages/img/right.png");
      }

    };
    $scope.showline = function(type){
      switch(type){
        case 1:
        console.log('hhh1');
        break;
        case 2:
        console.log('hhh2');
        break;
        case 3:
        console.log('hhh3');
        break;
        default:
        break;

      }
    }
    $scope.getHistory = function(type){
      console.log('history type',type);
      $scope.line4type = type;
      setMachinline4();
    }

    $scope.$on('$destroy',function(){
       $interval.cancel($scope.timer);
    });
    $scope.$on('$viewContentLoaded', function() {
      initTagPositions();
      var params1 = {left: 0,top: 0,currentX: 0,currentY: 0,flag: false};
      var params2 = {left: 0,top: 0,currentX: 0,currentY: 0,flag: false};
      var params3 = {left: 0,top: 0,currentX: 0,currentY: 0,flag: false};
      var params4 = {left: 0,top: 0,currentX: 0,currentY: 0,flag: false};
      var params5 = {left: 0,top: 0,currentX: 0,currentY: 0,flag: false};
      var tag1=document.getElementById('tag1');
      var testdrag1 = new DragDiv(params1,tag1);
      testdrag1.startDrag();
      var tag2=document.getElementById('tag2');
      var testdrag2 = new DragDiv(params2,tag2);
      testdrag2.startDrag();
      var tag3=document.getElementById('tag3');
      var testdrag3 = new DragDiv(params3,tag3);
      testdrag3.startDrag();
      var tag4=document.getElementById('tag4');
      var testdrag4 = new DragDiv(params4,tag4);
      testdrag4.startDrag();
      var tag5=document.getElementById('tag5');
      var testdrag5 = new DragDiv(params5,tag5);
      testdrag5.startDrag();
      var resizeTimeout;
      var mychartContainer = document.getElementById('linechart');
      linechart = echarts.init(mychartContainer);
      setLinechart();
      reloadleftbar();
      setTabClick();
      initTree(function(){
        console.log('getTreeSuccess');
      });
      window.onresize=function(){
        clearTimeout(resizeTimeout); //防止onresize连续调用两次
        resizeTimeout = setTimeout(function(){
          resetTag();
          reloadleftbar();
          linechart.resize();
        },500);
      }
    });

    function reloadleftbar(){
      var height = document.body.offsetHeight;
      $('.xmx-left-bar').css('height',height-175);
      $('.xmx-left-bar').css('line-height',height-175);
    }
    function initTree(callback){
      var zNodes=
        [{
          "total":1,"code":"320000","name":"江苏省","online":2,
          "children":[
              {"total":3,"code":"320500","name":"苏州市","online":2,"latitude":33.00000,"longitude":120.00000,
                "children":[
                  {"id":"1","name":"百事灌装线",
                    "children":[
                      {"id":'lZm1tq1hKtmd21UQ',"name":"吹瓶"},
                      {"id":'lZm1tq1hKtmd21UQ',"name":"灌装"},
                      {"id":'lZm1tq1hKtmd21UQ',"name":"打包"},
                      {"id":'lZm1tq1hKtmd21UQ',"name":"贴标"},
                      {"id":'lZm1tq1hKtmd21UQ',"name":"码垛"},
                    ]
                  },
                ]
              }
            ]
        }];
        var setting = {
          data : {
            key : { title : "name"}
          },
          view: {
            showIcon: false
          },
          callback: {
            onClick: function(event, treeId, treeNode) {
              var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
              var sNodes = treeObj.getSelectedNodes();
              if (sNodes.length > 0) {
                var level = sNodes[0].level;
                if(level==1)//city node
                {  //城市中心点 后期修改
                  //  $scope.map.setZoomAndCenter(6, [treeNode.longitude,treeNode.latitude]);
                }
                if(level==2)//device node
                {
                    $('.pro-line').removeClass('hide');
                    $('.machine').addClass('hide');
                    $scope.selectedequipid = treeNode.id;
                    selectNode();
                }else if(level==3){
                  $('.machine').removeClass('hide');
                  $('.pro-line').addClass('hide');
                    $scope.selectedequipid = treeNode.id;
                    selectNode();
                }
              }
            }
          }
        };
      var treeObj=$.fn.zTree.init($("#treeDemo"), setting, zNodes);
      treeObj.expandAll(true);
      $scope.selectedequipid = zNodes[0].children[0].children[0].id;
      var devNodes = treeObj.getNodesByParam("id", $scope.selectedequipid, null);
      if(devNodes[0].level ==2){
        $('.machine').addClass('hide');
        $('.pro-line').removeClass('hide');
      }
      if(devNodes[0].level ==3){
        $('.machine').removeClass('hide');
        $('.pro-line').addClass('hide');
      }

      treeObj.selectNode(devNodes[0]);
      selectNode();
      callback();
    }
    function selectNode(){
      $('#firstTab').addClass('active').siblings().removeClass('active');
      $('.tab-content').find('#tab_1').addClass('active').siblings().removeClass('active');
      resetTag();
      // getEquipmentInfo($scope.selectedequipid);
      // getDataModel($scope.selectedequipid);
      console.log('i select ',$scope.selectedequipid);
      reloadleftbar();

    };
    function setTabClick(){
      $('.nav-pills li a').click(function() {　
          $(this).addClass('active').siblings().removeClass('active');　
          var _id = $(this).attr('data-target');　　
          $('.tab-content').find(_id).addClass('active').siblings().removeClass('active');
          // var _id = $(this).attr('href').slice(2);
          // $('.tab-content').find('#' + _id).addClass('active').siblings().removeClass('active');
          switch (_id) {　　　　
              case "#tab_1":
                break;　　　　
              case "#tab_2":
                {
                  setMachinline2();

                  window.onresize=function(){
                    setMachinline2();
                  };
                }
                break;

              case "#tab_3":
                  {
                    setMachinline3();
                    window.onresize=function(){
                      setMachinline3();
                      if($scope.line4type.length>0){
                        setMachinline4();
                      }
                    };
                  }
                  　　　　　
                  break;
              case "#tab_4":
                  {
                    setGantt();
                  }
                  break;

               　　　
              default:
                  break;　　
          }
      });
    };
    function setGantt(){
      var width =  $('#navContainer').width() - 40;
      $('#ganttContainer').css("width",width);

      Highcharts.chart('ganttContainer', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: null,
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%m-%d %H:%M'
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['运行中', '待机中', '故障中','停机中'],
            reversed: true
        },
        tooltip: {
            dateTimeLabelFormats: {
                hour:"%m-%d,%H:%M",
            },
             pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.yCategory}</b><br/>'
        },
        legend: {
            enabled: false
        },
        colors:['#42bb38','#5da7ec','#dd532e','#a2a2a2'],
        credits: {
             enabled: false
        } ,
        series: [{
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
                x: Date.UTC(2014, 10, 21, 0,00,00),
                x2: Date.UTC(2014, 10, 21,2,00,00),
                // partialFill:0.25, //显示任务完成百分比
                y: 0
            }, {
                x: Date.UTC(2014, 10, 21, 2,00,00),
                x2: Date.UTC(2014, 10, 21,3,00,00),
                y: 1
            },{
                x: Date.UTC(2014, 10, 21, 3,00,00),
                x2: Date.UTC(2014, 10, 21,4,00,00),
                y: 2
            },{
                x: Date.UTC(2014, 10, 21, 4,00,00),
                x2: Date.UTC(2014, 10, 21,5,00,00),
                y: 3
            },{
                x: Date.UTC(2014, 10, 21, 5,00,00),
                x2: Date.UTC(2014, 10, 21,6,00,00),
                y: 1
            }],
            dataLabels: {
                enabled: false //禁止显示百分比
            }
        }]
    });
    }
    function setMachinline2(){
      var xdata=['12','13','14'];
      var ydata=[23,44,55];
      var lineoption1 = {
          title : {
            text: '吹制温度',
          },
          tooltip: {
              trigger: 'axis',
              formatter: "{a} <br/>{b}: {c}"
          },
          grid: {
              left: '5%',
              right: '5%',
              bottom: '5%',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xdata
          },
          yAxis: {
             type: 'value',
             scale: true,
             axisLabel : {
                 formatter: '{value}℃'
             },
          },
          series: [
              {
                  name: '吹制温度',
                  type: 'line',
                  smooth: '1',
                  data:  ydata,
              }
          ]
      };
      var lineoption2 = {
          title : {
            text: '吹制气压',
          },
          tooltip: {
              trigger: 'axis',

              formatter: "{b} : {c} (kPa)"
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
                  data: xdata
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  axisLabel : {
                      formatter: '{value}kPa'
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
                  data: ydata
              }
          ]
      };

      var mychartContainer1 = document.getElementById('machine_line1');
      mychartContainer1.style.width=$('#navContainer').width()*0.325+'px';
      // console.log('#navContainerwidth',$('#navContainer').width());
      machineline1 = echarts.init(mychartContainer1);
      machineline1.setOption(lineoption1);　


      var mychartContainer2 = document.getElementById('machine_line2');
      mychartContainer2.style.width=$('#navContainer').width()*0.325+'px';

      machineline2 = echarts.init(mychartContainer2);
      machineline2.setOption(lineoption2);　
      machineline1.resize();
      machineline2.resize();
    }

    function setMachinline3(){
      var ydata=[12.1,11.9,13.2,11.6,12.3,10,14,16.5,17.4,1,56.7,34.6,63.5,63.8,62,59,10,0,0,0,0,0,0,0];
      var xdata=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var lineoption3 = {
        color: ['#0bbb71'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : xdata,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'电能',
                type:'bar',
                barWidth: '60%',
                data:ydata
            }
        ]
      };


      var mychartContainer3 = document.getElementById('machine_line3');
      mychartContainer3.style.width=$('#navContainer').width()*0.59+'px';
      machineline3 = echarts.init(mychartContainer3);
      machineline3.setOption(lineoption3);　


      machineline3.resize();
    }

    function setMachinline4(){
      var ydata=[12.1,11.9,13.2,11.6,12.3,10,14,16.5,17.4,1,56.7,34.6,63.5,63.8,62,59,10,0,0,0,0,0,0,0];
      var xdata=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var lineoption4 = {
        color: ['#0bbb71'],
        title:{
          text:$scope.line4type,
          textStyle:{
            color:'#ffaa18'
          },
          left:'center',
          top:'10px',
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : xdata,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:$scope.line4type,
                type:'line',
                barWidth: '60%',
                data:ydata
            }
        ]
      };


      var mychartContainer4 = document.getElementById('machine_line4');
      mychartContainer4.style.width=$('#navContainer').width()*0.35+'px';
      machineline4 = echarts.init(mychartContainer4);
      machineline4.setOption(lineoption4);　


      machineline4.resize();
    }

    function setLinechart(){
      var xdata=['12','13','14'];
      var ydata=[23,44,55];
      $scope.linechartoption={
          tooltip: {
              trigger: 'axis',
              formatter: "{a} <br/>{b}: {c}"
          },
          grid: {
              top: '5%',
              left: '5%',
              right: '5%',
              bottom: '5%',
              containLabel: true
          },
         //  toolbox: {
         //      feature: {
         //          saveAsImage: {}
         //      }
         //  },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xdata
          },
          yAxis: {
             type: 'value',
             scale: true,
             axisLabel : {
                 formatter: '{value}'
             },
          },
          series: [
              {
                  name: '设备开机率',
                  type: 'line',
                  smooth: '1',
                  data:  ydata,
              }
          ]
      };
      linechart.setOption($scope.linechartoption);　
    }
    function resetTag(){
      var width = parseInt($('#main-left-container').css('width'));
      var height = parseInt($('#main-left-container').css('height'));
      $('#tag1').css('left',$scope.tagPositions[0].left * width+'px');
      $('#tag2').css('left',$scope.tagPositions[1].left * width+'px');
      $('#tag3').css('left',$scope.tagPositions[2].left * width+'px');
      $('#tag4').css('left',$scope.tagPositions[3].left * width+'px');
      $('#tag5').css('left',$scope.tagPositions[4].left * width+'px');

      $('#tag1').css('top',$scope.tagPositions[0].top * height+'px');
      $('#tag2').css('top',$scope.tagPositions[1].top * height+'px');
      $('#tag3').css('top',$scope.tagPositions[2].top * height+'px');
      $('#tag4').css('top',$scope.tagPositions[3].top * height+'px');
      $('#tag5').css('top',$scope.tagPositions[4].top * height+'px');
    }

    function getCss(o,key){
      return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];
    }

    function DragDiv(params,target){
      var oDrag = new Object;
      oDrag.params = params;
      oDrag.target = new Object(target);
      if(getCss(oDrag.target, "left") !== "auto"){
        oDrag.params.left = getCss(oDrag.target, "left");
      }
      if(getCss(target, "top") !== "auto"){
        oDrag.params.top = getCss(oDrag.target, "top");
      }
      oDrag.target.onselectstart=function(){return false;}
      oDrag.startDrag = function(){
        oDrag.target.onmousedown = function(event){
      		oDrag.params.flag = true;
      		if(!event){
      			event = window.event;
      			//防止IE文字选中
      			oDrag.target.onselectstart = function(){
      				return false;
      			}
      		}
      		var e = event;
      		oDrag.params.currentX = e.clientX;
      		oDrag.params.currentY = e.clientY;
      	}
        oDrag.target.onmouseup = function(){
          oDrag.params.flag = false;
      		if(getCss(oDrag.target, "left") !== "auto"){
      			oDrag.params.left = getCss(oDrag.target, "left");
      		}
      		if(getCss(oDrag.target, "top") !== "auto"){
      			oDrag.params.top = getCss(oDrag.target, "top");
      		}
          oDrag.getCurrentPosition();
          return false;
      	}
        oDrag.target.onmouseout = function(){
          oDrag.params.flag = false;
      		if(getCss(oDrag.target, "left") !== "auto"){
      			oDrag.params.left = getCss(oDrag.target, "left");
      		}
      		if(getCss(oDrag.target, "top") !== "auto"){
      			oDrag.params.top = getCss(oDrag.target, "top");
      		}
          oDrag.getCurrentPosition();
          return false;
      	}
        oDrag.target.onmousemove = function(event){
      		var e = event ? event: window.event;
      		if(oDrag.params.flag){
      			var nowX = e.clientX, nowY = e.clientY;
      			var disX = nowX - oDrag.params.currentX, disY = nowY - oDrag.params.currentY;
      			oDrag.target.style.left = parseInt(oDrag.params.left) + disX + "px";
      			oDrag.target.style.top = parseInt(oDrag.params.top) + disY + "px";
      			if (event.preventDefault) {
      				event.preventDefault();
      			}
      			return false;
      		}
      	}


      }
      oDrag.getCurrentPosition = function(){
        // console.log('position',oDrag.target.style.left,oDrag.target.style.top);
      }
      return oDrag;
    }

    function initTagPositions(){
      testApi.getPosition()
      .then(function(result){
        // console.log('position',result.data);
        $scope.tagPositions = result.data;
        resetTag()
      },function(err){
        console.log('getpositionerr',err);
      })
    }

    function setTagPositions(position){
      var positions ={};
      positions.positions = position;
      console.log('positions',JSON.stringify(positions));
      testApi.setPosition(JSON.stringify(positions))
      .then(function(result){
        console.log('result',result);
        initTagPositions();
      },function(err){
        console.log('setpositionerr',err);
      })
    }



    Date.prototype.format = function(format) {
      var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                   format = format.replace(RegExp.$1, RegExp.$1.length == 1
                          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
      }
      return format;
    }

    function changeTimeFormat(timestamp) {
      var newDate = new Date();
      newDate.setTime(timestamp);
      return newDate.format('yyyy-MM-dd');
    }
    function changeTimeFormat2(timestamp) {
      var newDate = new Date();
      newDate.setTime(timestamp);
      return newDate.format('yyyy-MM-dd hh:mm:ss');
    }

}]);
