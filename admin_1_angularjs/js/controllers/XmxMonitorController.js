angular.module('MetronicApp').controller('XmxMonitorController', ['$scope', '$rootScope', '$http', 'testApi', 'locals','$compile','$interval','deviceApi','NgTableParams','$state','sharedataApi', function($scope, $rootScope, $http, testApi, locals, $compile, $interval,deviceApi,NgTableParams,$state,sharedataApi) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-device';
    $scope.menueName = $rootScope.menueName;

    $scope.message ='';
    $scope.showTree = false;
    $scope.tagPositions ={};
    $scope.linechartoption;
    var linechart;
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
      treeObj.selectNode(devNodes[0]);
      selectNode();
      callback();
    }

    function selectNode(){
      // $('#firstTab').addClass('active').siblings().removeClass('active');
      // $('.tab-content').find('#tab_1_1').addClass('active').siblings().removeClass('active');
      // getEquipmentInfo($scope.selectedequipid);
      // getDataModel($scope.selectedequipid);
      console.log('i select ',$scope.selectedequipid);
      reloadleftbar();

    };

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
