angular.module('MetronicApp').controller('DeviceMonitorController', ['$scope', '$rootScope', '$http', 'userApi', 'locals','$compile','$interval','deviceApi','NgTableParams', function($scope, $rootScope, $http, userApi, locals, $compile, $interval,deviceApi,NgTableParams) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-device';
    $scope.menueName = $rootScope.menueName;

    $scope.message ='';
    $scope.equipname = '';
    $scope.latitude=31.35046;
    $scope.longitude=120.35046;
    $scope.linechartoption=[];
    $scope.historyType='line'; //历史数据显示方式 line为曲线 table为表格
    $scope.lineType='最近10分钟';  //历史曲线title 时间部分
    $scope.lineTab='温度曲线';  //历史曲线title 传感器名称
    $scope.linevarstab=[];  //历史曲线tab的传感器数组
    $scope.selectedlinetab={}; //选择展示曲线的传感器对象
    $scope.selectedlindex=1; //默认选择最近10分钟的历史曲线
    $scope.curve={startTime:0,endTime:0,setTime:'自定义时间'};  //历史曲线选择的开始和结束时间 $scope.curve.startTime $scope.curve.endTime
    $scope.showAnalogTab = false; //控制模拟量tab的显示
    $scope.showDigitalTab = false; //控制开关量tab的显示
    $scope.lineLabel=$scope.lineType+$scope.lineTab;
    $scope.echartValue = [];
    $scope.empty = true;
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

    $scope.checktab = function checktab(selecttab){
      $scope.selectedlinetab = selecttab;
      $scope.lineTab=selecttab.name;
      getHistoryData();
    };
    // $scope.checktab = function(){
    //   console.log('selected',$scope.selectedlinetab);
    //   $scope.lineTab=$scope.selectedlinetab.name;
    //   getHistoryData();
    // };
    $scope.setHistoryTime = function setHistoryTime(index){
      $scope.selectedlindex = index;
      getHistoryData();
    };
    $scope.markers=[];
    $scope.map = new AMap.Map('mapContainer', {
        center: [116.397428, 39.90923],
        zoom: 4
    });
    $scope.map.plugin(["AMap.ToolBar"], function() {
        $scope.map.addControl(new AMap.ToolBar());
    });
    $scope.selectNodefromMap= function(){
     var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
     var devNodes = treeObj.getNodesByParam("id", $scope.selectedequipid, null);
     treeObj.selectNode(devNodes[0]);
     selectNode();
     $rootScope.showMap = !$rootScope.showMap;
     $scope.listMode = '地图模式';
   };
    $scope.formatStateValue = function(state,unit) {
      if(unit == null){unit =''}
      if(state == null){state=''}
     if (state == 'OFF' || state == '停止' || state == 'False')
       $scope.htmlStr='<a href="javascritp:;" class="btn btn-warning">'+state+'</a>';
     else
     if (state == 'ON' || state == '开启' || state == 'True')
       $scope.htmlStr='<a href="javascritp:;" class="btn green btn-info">'+state+'</a>';
     else
       $scope.htmlStr='<a href="javascritp:;" class="btn green btn-info">'+state+unit+'</a>';
    };
    $scope.formatStateValue2 = function(name) {
        $scope.htmlStr2='<a href="javascritp:;" class="btn blue btn-outline">'+name+'</a>';
    };

    $scope.refreshData = function(){
      if($scope.selectedequipid && $scope.selectedequipid!=null){
        getDataModelAndValues($scope.selectedequipid);
      }
    };
    $scope.setCurvetime = function() {
      var startDate = new Date($scope.curve.startTime);
      var endDate = new Date($scope.curve.endTime);
      if(Date.parse(endDate)-Date.parse(startDate)<=0){
        $scope.message = '开始时间必须早于结束时间';
        $('#myModal_alert').modal();
      }else{
        $scope.curve.setTime=$scope.curve.startTime+'-'+$scope.curve.endTime;
      }
    };
    $scope.setFreeTime = function(){
      if($scope.curve.setTime =='自定义时间'){
        $scope.message = '请先选择要查询的时间段';
        $('#myModal_alert').modal();
      }else{
        $scope.setHistoryTime(4);
      }
    };
    $scope.changemode = function(type){
      if(type=='line'){
        if($scope.historyType=='table'){
          $scope.historyType='line';
          getHistoryData();
        }
      }else if(type=='table'){
        if($scope.historyType=='line'){
          $scope.historyType='table';
          getHistoryData();
        }
      }
    };

    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };
    var linechart;
    var mapheight= document.body.clientHeight-180;
    $("#mapContainer").css("height",mapheight);
    $scope.player = new EZUIPlayer('myPlayer');
    $scope.player.on('play', function(){
      console.log('startPlayVedio');
    });
    $scope.player.on('pause', function(){
      console.log('pausePlayVedio');
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
    var timer;
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
            else if(level==2)//device node
            {
                $scope.selectedequipid = treeNode.id;
                selectNode();
            }
          }
        }
      }
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
    function getEquipmentList(){
      deviceApi.getDevicelist('asc',0,10000)
        .then(function(result) {
            if(result.data.total > 0) {
              if(result.data.rows.length>0){
                for(var i=0;i<result.data.rows.length;i++){
                  var item = result.data.rows[i];
                  var marker = new AMap.Marker({
                          position: [item.longitude, item.latitude],
                          offset: new AMap.Pixel(-12, -12),
                          zIndex: 101,
                          extData: item,
                          map: $scope.map
                      });
                  marker.on('click', function(e) {
                    $scope.selectedequipid = item.equipmentId;
                    // console.log('click',e.target.getExtData());
                    setInfoWindow(e.target.getExtData());
                  })
                  $scope.markers.push(marker);
                }
              }
            }else {
              // alert(result.errMsg);
            }
        }, function(err) {
            // alert(err);
        });
    }
    function getCityTree(callback){
      deviceApi.getDeviceTree()
        .then(function(result) {
            if(result.data.code == 1) {
              console.log('resulttree',result.data);
              if(result.data.data.provices.length == 0){

              }else{
                $scope.empty = false;
                var zNodes=result.data.data.provices;
                var treeObj=$.fn.zTree.init($("#treeDemo"), setting, zNodes);
                treeObj.expandAll(true);
                $scope.selectedequipid = zNodes[0].children[0].children[0].id;
                var devNodes = treeObj.getNodesByParam("id", $scope.selectedequipid, null);
          			 treeObj.selectNode(devNodes[0]);
                selectNode();
              }
            }else {
              // alert(result.data.errMsg);
            }
        }, function(err) {
            // alert(err);
        });
    }
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
          starttime = (new Date(starttime)).format('yyyy/MM/dd h:m:s');
          endtime = (new Date(endtime)).format('yyyy/MM/dd h:m:s');
        break;
        case 2:
          $scope.lineType ='最近24小时';
          starttime = endtime-24*60*60*1000;
          starttime = (new Date(starttime)).format('yyyy/MM/dd h:m:s');
          endtime = (new Date(endtime)).format('yyyy/MM/dd h:m:s');
        break;
        case 3:
          $scope.lineType ='最近7天';
          starttime = endtime-7*24*60*60*1000;
          starttime = (new Date(starttime)).format('yyyy/MM/dd h:m:s');
          endtime = (new Date(endtime)).format('yyyy/MM/dd h:m:s');
        break;
        case 4:
          $scope.lineType =$scope.curve.startTime+'~'+$scope.curve.endTime+' ';
          starttime = $scope.curve.startTime;
          endtime = $scope.curve.endTime;
        break;
        default:
        break;
      }
      $scope.lineLabel=$scope.lineType+$scope.lineTab;

      if($scope.historyType =='line'){
        App.startPageLoading({animate: true});
        deviceApi.getSensorHistory(tab.varid, starttime, endtime)
          .then(function(result) {
              if(result.data.value) {
                   var xdata=result.data.time;
                   var ydata=result.data.value;

                   for(var i=0; i<xdata.length;i++){
                     xdata[i]=(new Date(xdata[i])).format('yyyy/MM/dd h:m:s');
                   }
                   App.stopPageLoading();
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
                console.log(result.data.errMsg);
                App.stopPageLoading();
              }
          }, function(err) {
              console.log('getHistoryerr', err);
              App.stopPageLoading();
        });
      }else if($scope.historyType == 'table'){
        App.startPageLoading({animate: true});
        //获取表格信息
        deviceApi.getSensorHistoryDetail(tab.varid, starttime, endtime)
          .then(function(result) {
              if(result.data) {
                  for(var i=0;i<result.data.length;i++){
                    result.data[i].updateTime = changeTimeFormat2(result.data[i].updateTime);
                  }
                  $scope.tableParams = new NgTableParams({}, { dataset: result.data});
                   App.stopPageLoading();
              }else {
                $scope.tableParams = new NgTableParams({}, { dataset: null});
                console.log(result.data.errMsg);
                App.stopPageLoading();
              }
          }, function(err) {
              console.log('getHistoryerr', err);
              $scope.tableParams = new NgTableParams({}, { dataset: null});
              App.stopPageLoading();
        });
      }

    }
    function selectNode(){
      $('#firstTab').addClass('active').siblings().removeClass('active');
      $('.tab-content').find('#tab_1_1').addClass('active').siblings().removeClass('active');
      getEquipmentInfo($scope.selectedequipid);
      // getDataModelAndValues($scope.selectedequipid);
      getDataModel($scope.selectedequipid);

    };
    function setInfoWindow(infodata){
      // var content1=`
      // <div>
      //   <div style="color: white;font-size: 14px;background-color: rgba(0,155,255,0.8);line-height: 26px; padding: 0px 0 0 6px; font-weight: lighter; varter-spacing: 1px">
      //     设备概况</div>
      //   <div style="padding: 4px;color: #666666;line-height: 35px; width: 300px">
      //        <img style=" float: left; margin: 3px; width: 60px" src="../assets/pages/media/works/img7.jpg">
      //        <a href="javascritp:void(0);" ng-click="selectNodefromMap()">${infodata.name}</a><br/>
      //        ${infodata.equipmentId}<br/>
      //   </div>
      //   </div>
      //   `;
        var content1='<div>'+
        '<div style="color: white;font-size: 14px;background-color: rgba(0,155,255,0.8);line-height: 26px; padding: 0px 0 0 6px; font-weight: lighter; varter-spacing: 1px">'+
        '设备概况</div>'+
        '<div style="padding: 4px;color: #666666;line-height: 35px; width: 300px">'+
        '<img style=" float: left; margin: 3px; width: 60px" src="../assets/pages/media/works/img7.jpg">'+
        '<a href="javascritp:void(0);" ng-click="selectNodefromMap()">'+ infodata.name +'</a><br/>'+infodata.equipmentId+'<br/>'+
        '</div></div>';
      var content=$compile(content1)($scope);
      $scope.infowindow.setContent(content[0]);
      $scope.infowindow.open($scope.map,[infodata.longitude,infodata.latitude]);
    }
    function formatEchartValue(origindata) {
      $scope.echartValue = [];
      if(origindata.length>0){
        for(var i=0; i<origindata.length; i++) {
          if(origindata[i].value == null){
            origindata[i].value = '';
          }else{
            origindata[i].value = Math.floor(origindata[i].value*100)/100;
          }
          if(origindata[i].unit == null){
            origindata[i].unit = '';
          }

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
            case 'guage':{
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
          // toolbox: {
          //     feature: {
          //         saveAsImage: {}
          //     }
          // },
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
      deviceApi.getDeviceSensorData(equipid)
        .then(function(result) {
            if(result.data.code == 1) {
              var analogflag=0,digitalflag=0;
                 var dataArr=result.data.data;
                 if(dataArr.length>0){
                  $.each(dataArr,
                    function(i, val) {
                      if(val.type == 'analog'){
                        analogflag = analogflag+1;
                        $scope.showAnalogTab = true;
                        $scope.groupname0=val.groupName;
                        $scope.varsArr0=val.vars;
                        formatEchartValue($scope.varsArr0);
                        $scope.linevarstab = [];
                        for(var j=0;j<val.vars.length;j++){
                           if(val.vars[j].showchart == true){
                             $scope.linevarstab.push(val.vars[j]);
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
                      }
                      if(val.type == 'digital'){
                        digitalflag = digitalflag+1;
                        $scope.showDigitalTab = true;
                        $scope.groupname1=val.groupName;
                        $scope.varsArr1=val.vars;
                      }
                      if(digitalflag == 0){$scope.showDigitalTab = false;}
                      if(analogflag == 0){$scope.showAnalogTab = false;}
                    }
                  );
                }else if(dataArr.length==0){
                  $scope.groupname0=null;
                  $scope.varsArr0=[];
                  formatEchartValue($scope.varsArr0);
                  $scope.linevarstab = [];
                  $scope.groupname1=null;
                  $scope.varsArr1=[];
                  $scope.showDigitalTab = false;
                  $scope.showAnalogTab = false;
                }else{}

            }else {
              // alert(result.data.errMsg);
            }
        }, function(err) {
            // alert(err);
      });

      // userApi.getDataModel(equipid)
      // .then(function(result) {
      //   if(result.data.code == 0) {
      //        var dataArr=result.data.data[0].vars;
      //        $scope.linevarstab = [];
      //        for(var i=0;i<dataArr.length;i++){
      //          if(dataArr[i].showchart == true){
      //            $scope.linevarstab.push(dataArr[i]);
      //          }
      //        }
      //        if($scope.linevarstab.length>0){
      //          $scope.selectedlinetab = $scope.linevarstab[0];
      //          $scope.lineTab=$scope.selectedlinetab.name;
      //          $scope.lineLabel=$scope.lineType+$scope.lineTab;
      //        }
      //        if($scope.selectedlinetab.name){
      //            getHistoryData();
      //        }else{
      //          resetlineoption();
      //        }
      //
      //   }else {
      //     // alert(result.data.errMsg);
      //   }
      // },function(err){
      //   // alert(err);
      // });

    };
    function getDataModelAndValues(equipid) {
      deviceApi.getDeviceSensorData(equipid)
        .then(function(result) {
            if(result.data.code == 1) {
                 var dataArr=result.data.data;
                 if(dataArr.length>0){
                   $.each(dataArr,
                     function(i, val) {
                       if(val.type == 'analog'){
                         $scope.groupname0=val.groupName;
                         $scope.varsArr0=val.vars;
                         formatEchartValue($scope.varsArr0);
                       }
                       if(val.type == 'digital'){
                         $scope.groupname1=val.groupName;
                         $scope.varsArr1=val.vars;
                       }
                     }
                   );
                 }
            }else {
              // alert(result.data.errMsg);
            }
        }, function(err) {
            // alert(err);
      });
    };
    function getEquipmentInfo(equipid){
      var data ={};
      // for(var i=0;i<$scope.markers.length;i++){
      //   var obj = $scope.markers[i].getExtData();
      //   if(obj.equipmentId == equipid){
      //     data = obj;
      //     console.log('getEquipmentInfo哈哈哈',obj);
      //     break;
      //   }
      // }
      // if(data.equipmentId){
      //   $scope.gatewaySN=data.serialNumber;
      //   $scope.equipmentId=data.equipmentId;
      //   $scope.equipname=data.name;
      //   $scope.number=data.number;
      //   $scope.factoryDate=changeTimeFormat(data.factoryDate);
      //   $scope.commissioningDate=changeTimeFormat(data.commissioningDate);
      //   $scope.latitude=data.latitude;
      //   $scope.longitude=data.longitude;
      //   setInfoWindow(data);
      // }

      deviceApi.getDeviceInfoById(equipid)
        .then(function(result) {
            if(result.data.code == 1) {
                data = result.data.data
                $scope.gatewaySN=data.serialNumber;
                $scope.equipmentId=data.equipmentId;
                $scope.equipname=data.name;
                $scope.number=data.number;
                $scope.factoryDate=changeTimeFormat(data.factoryDate);
                $scope.commissioningDate=changeTimeFormat(data.commissioningDate);
                $scope.latitude=data.latitude;
                $scope.longitude=data.longitude;
                setInfoWindow(data);
            }else {
              console.log('getEquipmentInfobyIderr',result.message);
            }
        }, function(err) {
            console.log('getEquipmentInfobyIderr',err);
        });

    }

    $scope.$on('$destroy',function(){
       $interval.cancel(timer);
    });
    $scope.$on('$viewContentLoaded', function() {
      getEquipmentList();
      getCityTree(function(){
        if($scope.empty==true){
          if($scope.selectedequipid && $scope.selectedequipid>0){
            getDataModelAndValues($scope.selectedequipid);
            getEquipmentInfo($scope.selectedequipid);
          }
        }else{

        }
      });

      $('.nav-pills li a').click(function() {　
          $(this).addClass('active').siblings().removeClass('active');　
          var _id = $(this).attr('href').slice(2);　　
          $('.tab-content').find('#' + _id).addClass('active').siblings().removeClass('active');
          　
          switch (_id) {　　　　
              case "tab_1_1":
                $scope.player.pause();
                break;　　　　
              case "tab_1_2":
                $scope.player.pause();
                $scope.refreshData();
                $interval.cancel(timer);
                timer = $interval($scope.refreshData,10000);
                window.onresize=function(){
                  $scope.refreshData();
                  $interval.cancel(timer);
                  timer = $interval($scope.refreshData,10000);
                };
                break;

              case "tab_1_3":
                  {
                    $scope.player.pause();
                    $('.start_date').datetimepicker({
                        language: 'zh-CN',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        startView: 2,
                        forceParse: 0,
                        // minView:'day',
                        format: 'yyyy/mm/dd hh:ii',
                        todayHighlight: true,
                        }).on('hide', function (e) {
                          var $this = $(this);
                          var _this = this;
                          $scope.$apply(function(){
                              $scope.curve.startTime = _this.value;
                          });
                      });
                      $('.end_date').datetimepicker({
                          language: 'zh-CN',
                          weekStart: 1,
                          todayBtn: 1,
                          autoclose: 1,
                          startView: 2,
                          forceParse: 0,
                          // minView:'day',
                          format: 'yyyy/mm/dd hh:ii',
                          todayHighlight: true,
                          }).on('hide', function (e) {
                            var $this = $(this);
                            var _this = this;
                            $scope.$apply(function(){
                                $scope.curve.endTime = _this.value;
                            });
                        });

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
              case "tab_1_4":
                  　　　　　　break;
              // case "tab_1_5":
              //     　　　　　　break;
              // case "tab_1_6":
              //     　　　　　　break;　　　　
              default:
                  　　　　　　　　　　　
                  break;　　
          }
      });
    });

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
