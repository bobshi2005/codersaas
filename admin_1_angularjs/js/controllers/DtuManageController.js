angular.module('MetronicApp').controller('DtuManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
  $rootScope.menueName = 'sidebar-asset';
  $scope.menueName = $rootScope.menueName;


  $scope.dtuList = [];
  $scope.currentData = {};
  $scope.message = ''; // alert 提示信息
  $scope.deletelist = [];//删除对象列表
  $scope.deletestr = ''; //删除队列显示字符串
  $scope.checkboxes = {
    checked: false,
    items: {}
  };
  //操作按钮事件
  $scope.addDTU = function() {
    $scope.currentData = {};
    $('#myModal_createDTU').modal();
  };
  $scope.updateDTU = function() {
    $scope.currentData = {};
    var checked = 0, index = 0;
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        index = key;
        checked += 1;
      }
    });
    if(checked == 0){
      $scope.message = '请选择一个dtu';
      $('#myModal_alert').modal();
    }else if(checked > 1){
      $scope.message = '只能选择一个dtu类行编辑';
      $('#myModal_alert').modal();
    }else{
      for(var i=0; i< $scope.dtuList.length; i++){
        if($scope.dtuList[i].dtuId == index){
          $scope.currentData = $scope.dtuList[i];
          break;
        }
      }
      $('#myModal_updateDTU').modal();
    }
  };

  $scope.deleteDTU = function() {
    var checked = 0;
    $scope.deletelist = [];
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        checked += 1;
        let tempdata={};
        for(var i=0; i< $scope.dtuList.length; i++){
          if($scope.dtuList[i].dtuId == key){
            tempdata = $scope.dtuList[i];
            $scope.deletelist.push(tempdata);
            break;
          }
        }
      }
    });
    if(checked == 0){
      $scope.message = '请至少选择一个dtu';
      $('#myModal_alert').modal();
    }else{
      let tempstr = '';
      for(var i=0; i< $scope.deletelist.length; i++){
        tempstr =tempstr+'  '+ $scope.deletelist[i].dtuId;
        tempstr =tempstr+ '  ';
      }
      tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个dtu';
      $scope.deletestr = tempstr;
      $('#myModal_deleteDTU').modal();
    }
  };
  //modal取消事件
  $scope.createDismiss = function(){
    $('#myModal_createDTU').modal('hide');
  };
  $scope.updateDismiss = function(){
    $('#myModal_updateDTU').modal('hide');
  };
  $scope.deleteDismiss = function(){
    $('#myModal_deleteDTU').modal('hide');
  };
  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };

  //onselect事件
  $scope.selectWarehouse = function(){
    getWarelocationlist($scope.currentData.warehouse.warehouseId);
  }
  //modal确定事件
  $scope.saveCreateDTU = function(){
      $('#myModal_createDTU').modal('hide');
      createDTUImpl();
  };
  $scope.saveUpdateDTU = function(){
      $('#myModal_updateDTU').modal('hide');
      updateDTUImpl();
  };

  $scope.saveDeleteDTU = function(){
    $('#myModal_deleteDTU').modal('hide');
    deleteDTUImpl();
  };

  $scope.$on('$viewContentLoaded', function() {
    getDtulist();
  });
  $scope.$watch(function() {
    return $scope.checkboxes.checked;
    }, function(value) {
    angular.forEach($scope.dtuList, function(item) {
      $scope.checkboxes.items[item.dtuId] = value;
    });
  });

  $scope.$watch(function() {
    return $scope.checkboxes.items;
    }, function(values) {
      var checked = 0, unchecked = 0,
      total = $scope.dtuList.length;
      angular.forEach($scope.checkboxes.items, function(item) {
       if(item){
         checked += 1;
       }else{
         unchecked +=1;
       }
      });
      if ((unchecked == 0) || (checked == 0)) {
       $scope.checkboxes.checked = (checked == total && total>0);
      }

      angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

  //定义方法
  function getDtulist() {
      $scope.dtuList = [];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getDtulist('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.dtuList=result.data.rows;
                }else {
                  $scope.dtuList=[];
                }
                params.total(result.data.total);
                return $scope.dtuList;
            }, function(err) {
              console.log('获取dtu列表err',err);
            });
        }
      });
      $scope.tableParams.reload();
  }

  function createDTUImpl() {
    var params={};
    // params.name = $scope.currentData.name;
    params.heartData = $scope.currentData.heartData;
    params.modbusRtuPeriod = $scope.currentData.modbusRtuPeriod;

    deviceApi.createDTU(params)
      .then(function(result){
        if(result.data.code == 1){
          getDtulist();
          $scope.message = '创建dtu成功';
          $('#myModal_alert').modal();
        }
      },function(err){
        console.log('createdtuerr',err);
      });

  }

  function updateDTUImpl(){
    var params={};
    // params.name = $scope.currentData.name;
    params.heartData = $scope.currentData.heartData;
    params.modbusRtuPeriod = $scope.currentData.modbusRtuPeriod;

    deviceApi.updateDTU($scope.currentData.dtuId,params)
      .then(function(result){
        if(result.data.code ==1){
          getDtulist();
          $scope.message = '修改dtu成功';
          $('#myModal_alert').modal();
        }
      },function(err){
        console.log('updatedtuerr',err);
      });
  }

  function deleteDTUImpl(){
    var ids='';
    for(var i=0; i< $scope.deletelist.length; i++){
      ids =ids+ $scope.deletelist[i].dtuId;
      ids =ids+ '-';
    }
    deviceApi.deleteDtu(ids)
      .then(function(result){
        if(result.data.code ==1){
          getDtulist();
          $scope.message = '删除dtu成功';
          $('#myModal_alert').modal();
        }
      },function(err){
        console.log('deletedtuerr',err);
      });
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

  function changeTimeFormat2(inputTime) {
      var newDate = new Date(inputTime);
      return newDate.format('MM/dd/yyyy');
    }


}]);
