angular.module('MetronicApp').controller('XmxMonitorController', ['$scope', '$rootScope', '$http', 'testApi', 'locals','$compile','$interval','deviceApi','NgTableParams','$state','sharedataApi', function($scope, $rootScope, $http, testApi, locals, $compile, $interval,deviceApi,NgTableParams,$state,sharedataApi) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-device';
    $scope.menueName = $rootScope.menueName;

    $scope.message ='';
    $scope.showTree = false;
    // $scope.equipname = '';

    $scope.savePosition = function(){
      var positions=[];
      positions.push({
        "left":parseInt($('#tag1').css('left')),
        "top":parseInt($('#tag1').css('top')),
      });
      positions.push({
        "left":parseInt($('#tag2').css('left')),
        "top":parseInt($('#tag2').css('top')),
      });
      positions.push({
        "left":parseInt($('#tag3').css('left')),
        "top":parseInt($('#tag3').css('top')),
      });
      positions.push({
        "left":parseInt($('#tag4').css('left')),
        "top":parseInt($('#tag4').css('top')),
      });
      positions.push({
        "left":parseInt($('#tag5').css('left')),
        "top":parseInt($('#tag5').css('top')),
      });
      setTagPositions(positions);
    }
    $scope.changeTreeState = function(){
      console.log('sskdjoj',$('.xmx-left-bar img').attr('src'));
      if($('.xmx-left-bar img').attr('src') == "../assets/pages/img/right.png"){
        $scope.showTree = true;
        $('.xmx-left-bar').css('width',"180px");
        $('.xmx-left-bar').css('height',"90%");
        $('.xmx-left-bar img').attr('src',"../assets/pages/img/left.png");
      }else{
        $scope.showTree = false;
        $('.xmx-left-bar').css('width',"10px");
        $('.xmx-left-bar').css('height',"90%");
        $('.xmx-left-bar img').attr('src',"../assets/pages/img/right.png");
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
    });

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
        console.log('position',result.data);
        $('#tag1').css('left',result.data[0].left+'px');
        $('#tag2').css('left',result.data[1].left+'px');
        $('#tag3').css('left',result.data[2].left+'px');
        $('#tag4').css('left',result.data[3].left+'px');
        $('#tag5').css('left',result.data[4].left+'px');

        $('#tag1').css('top',result.data[0].top+'px');
        $('#tag2').css('top',result.data[1].top+'px');
        $('#tag3').css('top',result.data[2].top+'px');
        $('#tag4').css('top',result.data[3].top+'px');
        $('#tag5').css('top',result.data[4].top+'px');
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
