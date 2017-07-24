angular.module('MetronicApp').controller('DeviceMonitorController', ['$scope', '$rootScope', '$http', 'userApi', 'locals','$compile','$interval', function($scope, $rootScope, $http, userApi, locals, $compile, $interval) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-device';
    $scope.menueName = $rootScope.menueName;
    // $rootScope.showMap = false;
    // $rootScope.pagetitle = '列表模式';
    // $rootScope.listMode = '切换地图';
    var mapheight= document.body.clientHeight-180;
    $("#mapContainer").css("height",mapheight);
    $scope.changelistState = function() {
      $rootScope.showMap = !$rootScope.showMap;
      if($rootScope.showMap){
        $rootScope.listMode = '切换列表';
        $rootScope.pagetitle = '地图模式';
        var mapheight= document.body.clientHeight-180;
        $("#mapContainer").css("height",mapheight);
      } else {
        $rootScope.listMode = '切换地图';
        $rootScope.pagetitle = '列表模式';
      }
    }

    $scope.equipname = 'acw';
    $scope.latitude=31.35046;
    $scope.longitude=120.35046;
    $scope.linechartoption=[];
    $scope.lineType='最近10分钟';
    $scope.lineTab='温度曲线';
    $scope.linevarstab=[];
    $scope.selectedlinetab={};
    $scope.selectedlindex=1;
    $scope.lineLabel=$scope.lineType+$scope.lineTab;
    $scope.checktab = function checktab(selecttab){
      $scope.selectedlinetab = selecttab;
      $scope.lineTab=selecttab.name;
      getHistoryData();
    };
    $scope.setHistoryTime = function setHistoryTime(index){
      $scope.selectedlindex = index;
      getHistoryData();

      // console.log('selecttabindex',index);
    };

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
     };

    function getHistoryData(){
      var newdate = new Date();
      var endtime = Date.parse(newdate);
      var starttime = 0;

      var index = $scope.selectedlindex;
      var tab = $scope.selectedlinetab;
      switch(index){
        case 1:
          $scope.lineType ='最近10分钟';
          starttime = endtime-10*60*1000;
        break;
        case 2:
          $scope.lineType ='最近24小时';
          starttime = endtime-24*60*60*1000;
        break;
        case 3:
          $scope.lineType ='最近7天';
          starttime = endtime-7*24*60*60*1000;
        break;
      }
      $scope.lineLabel=$scope.lineType+$scope.lineTab;
      starttime = (new Date(starttime)).format('yyyy-MM-dd h:m:s');
      endtime = (new Date(endtime)).format('yyyy-MM-dd h:m:s');
      console.log(index,starttime, endtime);
      userApi.getHistory(tab.varid,starttime,endtime)
        .then(function(result) {
            if(result.data.errCode == 0) {
                 console.log(result.data,result.data.data.length);
                 var xdata=[];
                 var ydata=[];
                 for(var i=0;i<result.data.data.length;i++){
                   var xstr=result.data.data[i][0];
                   var n=xstr.indexOf(".");
                   var tempdata=xstr.substr(0,n);
                   xdata.push(tempdata);
                   ydata.push(result.data.data[i][1].toFixed(2));
                 }
                 console.log('xdata',xdata);
                 $scope.linechartoption={
                     tooltip: {
                         trigger: 'axis',
                         formatter: "{a} <br/>{b}: {c}"+tab.unit
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
                         data: xdata
                     },
                     yAxis: {
                        type: 'value',
                        scale: true,
                        axisLabel : {
                            formatter: '{value}'+tab.unit
                        },
                     },
                     series: [
                         {
                             name: tab.name,
                             type: 'line',
                             smooth: '1',
                             data:  ydata,
                         }
                     ]
                 };
                 linechart.setOption($scope.linechartoption);　

            }else {
              alert(result.data.errMsg);
            }
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
      });
    }
    $scope.map = new AMap.Map('mapContainer', {
        center: [116.397428, 39.90923],
        zoom: 4
    });
    $scope.map.plugin(["AMap.ToolBar"], function() {
        $scope.map.addControl(new AMap.ToolBar());
    });
    if (location.href.indexOf('&guide=1') !== -1) {
        $scope.map.setStatus({
            scrollWheel: false
        })
    }
    AMap.plugin('AMap.AdvancedInfoWindow',function(){
      $scope.infowindow = new AMap.AdvancedInfoWindow({
      content: '',
      offset: new AMap.Pixel(-3, -16),
      placeSearch :false,
      asOrigin :false,
      asDestination :false
     });
   })
    $scope.markers=[];


    var player = new EZUIPlayer('myPlayer');
    player.on('error', function(){
      console.log('error');
    });
    player.on('play', function(){
      console.log('play');
    });
    player.on('pause', function(){
      console.log('pause');
    });

    //$rootScope.settings.layout.pageSidebarClosed = false;
    //Cookies.set('sidebar_closed', '0');

    //UITree.init();


    function setInfoWindow(infodata){
      var content1=`
      <div>
        <div style="color: white;font-size: 14px;background-color: rgba(0,155,255,0.8);line-height: 26px; padding: 0px 0 0 6px; font-weight: lighter; varter-spacing: 1px">
          设备概况</div>
        <div style="padding: 4px;color: #666666;line-height: 35px; width: 300px">
             <img style=" float: left; margin: 3px; width: 60px" src="../assets/pages/media/works/img7.jpg">
             <a href="javascritp:void(0);" ng-click="selectNodefromMap()">${infodata.equipname}</a><br/>
             ${infodata.vendor}<br/>
        </div>
        </div>
        `;
      var content=$compile(content1)($scope);
      $scope.infowindow.setContent(content[0]);
      $scope.infowindow.open($scope.map,[infodata.longitude,infodata.latitude]);
    }

    $scope.selectNodefromMap= function(){
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			var devNodes = treeObj.getNodesByParam("id", $scope.selectedequipid, null);
			treeObj.selectNode(devNodes[0]);
      selectNode();
      $rootScope.showMap = !$rootScope.showMap;
      $scope.listMode = '地图模式';
    };

    function selectNode(){
      getEquipmentInfo($scope.selectedequipid);
      getDataModelAndValues($scope.selectedequipid);
      // console.log('tab',$scope.selectedlinetab);
      getDataModel($scope.selectedequipid);

    };

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
            {
               $scope.map.setZoomAndCenter(6, [treeNode.longitude,treeNode.latitude]);
            }
            else if(level==2)//device node
            {
                $scope.selectedequipid = treeNode.id;
                selectNode();
            }
          }
        }
      }
    };

    $scope.formatStateValue = function(state,unit) {
      if (state == 'OFF' || state == '停止' || state == 'False')
        //$scope.htmlStr='<span class="label label-warning">'+state+'</span>';
        $scope.htmlStr='<a href="javascritp:;" class="btn btn-warning">'+state+'</a>';
      else
      if (state == 'ON' || state == '开启' || state == 'True')
        //$scope.htmlStr='<span class="label label-success">'+state+'</span>';
        $scope.htmlStr='<a href="javascritp:;" class="btn green btn-info">'+state+'</a>';
      else
        //$scope.htmlStr=state+unit;
        $scope.htmlStr='<a href="javascritp:;" class="btn green btn-info">'+state+unit+'</a>';
    };

    $scope.formatStateValue2 = function(name) {
        $scope.htmlStr2='<a href="javascritp:;" class="btn blue btn-outline">'+name+'</a>';
    };

    $scope.userrole=locals.get("userrole");
    userApi.getEquipmentList($scope.userrole)
      .then(function(result) {
        // console.log('list',result);
          if(result.data.errCode == 0) {
            if(result.data.equipments.length>0){
              result.data.equipments.forEach(item => {
                var marker = new AMap.Marker({
                        position: [item.longitude, item.latitude],
                        offset: new AMap.Pixel(-12, -12),
                        zIndex: 101,
                        extData: item,
                        map: $scope.map
                    });
                marker.on('click', function(e) {
                  // console.log('sss');
                  $scope.selectedequipid = item.equipid;
                  setInfoWindow(item);
                })
                $scope.markers.push(marker);
              })
            }
            // console.log('markers',$scope.markers);
          }else {
            alert(result.errMsg);
          }
      }, function(err) {
          alert(err);
          alert('网络连接问题，请稍后再试！');
      });

    userApi.getCityTree($scope.userrole)
      .then(function(result) {
          // console.log('getCityTree',result.data);
          if(result.data.errCode == 0) {
              var data=result.data;

             //alert(data.tree);
             var zNodes=data.tree;
             var treeObj=$.fn.zTree.init($("#treeDemo"), setting, zNodes);
             treeObj.expandAll(true);
             $scope.selectedequipid = zNodes[0].children[0].children[0].id;
             var devNodes = treeObj.getNodesByParam("id", $scope.selectedequipid, null);
       			 treeObj.selectNode(devNodes[0]);
             selectNode();
          }else {
            alert(result.data.errMsg);
          }
      }, function(err) {
          alert(err);
          alert('网络连接问题，请稍后再试！');
      });
    //$.fn.zTree.init($("#treeDemo"), setting, zNodes);

    //ZUITree.init();
    ComponentsKnobDials.init();

    // TableDatatablesManaged.init();

    if($scope.selectedequipid && $scope.selectedequipid>0){
      getDataModelAndValues($scope.selectedequipid);
      getEquipmentInfo($scope.selectedequipid);
    }
    $scope.refreshData = function(){
      // console.log('refreshData',$scope.selectedequipid);
      if($scope.selectedequipid && $scope.selectedequipid>0){
        getDataModelAndValues($scope.selectedequipid);
        // getEquipmentInfo($scope.selectedequipid);
      }
    };

    var timer = $interval($scope.refreshData,10000);
    $scope.$on('$destroy',function(){
       $interval.cancel(timer);
    });

    $scope.echartValue = [];
    function formatEchartValue(origindata) {
      $scope.echartValue = [];
      if(origindata.length>0){
        for(var i=0; i<origindata.length; i++) {
          switch(origindata[i].showtype) {
            case 'pie': {
              var tempoption = {
                widgetName:origindata[i].name,
                widgetType: 'pie',
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                series: [{
                        name: origindata[i].name,
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '70%'],
                        center: ['50%', '50%'],
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
                        color: ['#36d7b7', '#cdcdcd'],
                        data: [{
                                value: origindata[i].value,
                                name: origindata[i].name + origindata[i].value +origindata[i].unit,
                                selected: true
                            },
                            {
                                value: 100-origindata[i].value,
                                name: ''
                            }
                        ]
                    }
                ]
              };
              $scope.echartValue.push(tempoption);
            }
            break;
            case 'gauge':{
              var tempoption = {
                widgetName:origindata[i].name,
                widgetType: 'gauge',
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                series : [
                    {
                        name:origindata[i].name,
                        type:'gauge',
                        splitNumber: 10,       // 分割段数，默认为5
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']],
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            show: true,        // 默认显示，属性show控制显示与否
                            length :30,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer : {
                            width : 5
                        },
                        title : {
                            show : true,
                            offsetCenter: [0, '-40%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        detail : {
                            formatter:'{value}',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto',
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: origindata[i].value, name: origindata[i].unit}]
                    }
                ]
              };
              $scope.echartValue.push(tempoption);

            }
            break;
            case 'led': {
              var tempoption = {
                widgetName:origindata[i].name,
                widgetType: 'led',
                value: origindata[i].value,
                unit: origindata[i].unit,
              }
              $scope.echartValue.push(tempoption);
            }
            break;
            default:
            break;
          }
        }
      }
    };

    function resetlineoption(){
      var xdata=[];
      var ydata=[];
      $scope.linechartoption={
          tooltip: {
              trigger: 'axis'
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
              data: xdata
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: '',
                  type: 'line',
                  smooth: '1',
                  data:  ydata
              }
          ]
      };
      linechart.setOption($scope.linechartoption);　
    };

    function getDataModel(equipid){
      $scope.selectedlinetab=[];
      $scope.lineTab='';
      $scope.lineLabel='';
      userApi.getDataModel(equipid)
      .then(function(result) {
        if(result.data.errCode == 0) {
             var dataArr=result.data.data[0].vars;
             $scope.linevarstab = [];
             for(var i=0;i<dataArr.length;i++){
               if(dataArr[i].showchart == true){
                 $scope.linevarstab.push(dataArr[i]);
               }
             }
             if($scope.linevarstab.length>0){
               $scope.selectedlinetab = $scope.linevarstab[0];
               $scope.lineTab=$scope.selectedlinetab.name;
               $scope.lineLabel=$scope.lineType+$scope.lineTab;
             }
             if($scope.selectedlinetab.name){
                 getHistoryData();
             }else{
               resetlineoption();
             }

        }else {
          alert(result.data.errMsg);
        }
      },function(err){
        alert(err);
        alert('网络连接问题，请稍后再试！');
      });

    };

    function getDataModelAndValues(equipid) {
      userApi.getDataModelAndValues(equipid)
        .then(function(result) {
            if(result.data.errCode == 0) {
                 var dataArr=result.data.data;
                 $scope.groupname0=dataArr[0].groupName;
                 $scope.varsArr0=dataArr[0].vars;
                 formatEchartValue(dataArr[0].vars);
                 $scope.groupname1=dataArr[1].groupName;
                 $scope.varsArr1=dataArr[1].vars;
            }else {
              alert(result.data.errMsg);
            }
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
      });
    };
    function getEquipmentInfo(equipid){
      userApi.getEquipmentInfo(equipid)
        .then(function(result) {
            // console.log('getEquipmentInfo',result.data, equipid);
            if(result.data.errCode == 0) {
                var data=result.data;
                gatewaySN   =data.gatewaySN;
                address     =data.address;
                phone       =data.phone;
                contactor   =data.contactor;
                equipname   =data.equipname;
                vendor      =data.vendor;
                type        =data.type;
                sn          =data.sn;
                user        =data.user;
                deliverDate =data.deliverDate;
                tryrunDate  =data.tryrunDate;
                latitude    =data.latitude;
                longitude   =data.longitude;

                $scope.gatewaySN=gatewaySN;
                $scope.address=address;
                $scope.phone=phone;
                $scope.contactor=contactor;
                $scope.equipname=equipname;
                $scope.vendor=vendor;
                $scope.type=type;
                $scope.sn=sn;
                $scope.user=user;
                $scope.deliverDate=deliverDate;
                $scope.tryrunDate=tryrunDate;
                $scope.latitude=latitude;
                $scope.longitude=longitude;

                setInfoWindow(data);

            }else {
              alert(result.data.errMsg);
            }
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });
    }
/*
    $scope.userrole=locals.get("userrole");

    userApi.getEquipmentList($scope.userrole)
        .then(function(result) {
            console.log('getEquipmentList:',result.data);
            if(result.data.errCode == 0) {



            //  $state.go('home.dashboard');
            }else {
              alert(result.data.errMsg);
            }
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });
*/
    // var option = {
    //     tooltip: {
    //         trigger: 'axis'
    //     },
    //     legend: {
    //         data: ['设备温度']
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '5%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     toolbox: {
    //         feature: {
    //             saveAsImage: {}
    //         }
    //     },
    //     xAxis: {
    //         type: 'category',
    //         boundaryGap: false,
    //         data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00','7:00', '8:00', '9:00', '10:00',
    //                 '11:00', '12:00', '13:00', '14:00', '15:00', '16:00','17:00', '18:00', '19:00', '20:00',
    //                 '21:00', '22:00', '23:00']
    //     },
    //     yAxis: {
    //         type: 'value'
    //     },
    //     series: [
    //         {
    //             name: '设备温度',
    //             type: 'line',
    //             smooth: '1',
    //             data: [13.1, 13.7, 12.9, 14.6, 16.3, 17.3, 18.2, 15.6, 14.8, 13.9, 14.5, 14.8, 15.8, 13.9, 15.6, 14.7, 15, 15.1, 14.8, 13.9, 13.5, 13.8, 13.6,14.0]
    //         }
    //     ]
    // };
    var linechart;
    $('.nav-pills li a').click(function() {　
        // console.log('click');
        　
        $(this).addClass('active').siblings().removeClass('active');　
        var _id = $(this).attr('href');　　
        $('.tabs-contents').find('#' + _id).addClass('active').siblings().removeClass('active');
        　
        switch (_id) {　　　　
            case "/#tab_1_1":
              break;　　　　
            case "/#tab_1_2":
              $scope.refreshData();
              $interval.cancel(timer);
              timer = $interval($scope.refreshData,10000);
              window.onresize=function(){
                $scope.refreshData();
                $interval.cancel(timer);
                timer = $interval($scope.refreshData,10000);
              };
              break;

            case "/#tab_1_3":
                {
                  if ($("#echarts_line").length > 0) {
                      var mychartContainer = document.getElementById('echarts_line');
                      mychartContainer.style.width=$('#navContainer').width()-20+'px';
                      linechart = echarts.init(mychartContainer);
                      // linechart.setOption($scope.linechartoption);　
                      if($scope.selectedlinetab.name){
                          getHistoryData();
                      }
                  }

                  window.onresize=function(){
                    mychartContainer.style.width=$('#navContainer').width()-20+'px';
                    linechart.resize();
                  };
                }
                　　　　　
                break;
            case "/#tab_1_4":
                　　　　　　break;
            case "/#tab_1_5":
                　　　　　　break;
            case "/#tab_1_6":
                　　　　　　break;　　　　
            default:
                　　　　　　　　　　　
                break;　　
        }
    });

}]);
