angular.module('MetronicApp').controller('StocksmanageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
  $rootScope.menueName = 'sidebar-asset';
  $scope.menueName = $rootScope.menueName;

  $scope.partList = [];
  $scope.warehouseList = [];
  $scope.warelocationList = [];

  $scope.inventoryList = [];
  $scope.currentData = {};
  $scope.message = ''; // alert 提示信息
  $scope.deletelist = [];//删除对象列表
  $scope.deletestr = ''; //删除队列显示字符串
  $scope.checkboxes = {
    checked: false,
    items: {}
  };
  //操作按钮事件
  $scope.addInventory = function() {
    $('#myModal_createInventory').modal();
  };
  $scope.updateInventory = function() {
    $scope.currentData = {};
    var checked = 0, index = 0;
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        index = key;
        checked += 1;
      }
    });
    if(checked == 0){
      $scope.message = '请选择一个库存';
      $('#myModal_alert').modal();
    }else if(checked > 1){
      $scope.message = '只能选择一个库存类行编辑';
      $('#myModal_alert').modal();
    }else{
      for(var i=0; i< $scope.inventoryList.length; i++){
        if($scope.inventoryList[i].inventoryId == index){
          getWarelocationlistWithcallback($scope.inventoryList[i].warehouseId, function(){
            $scope.currentData.warelocation=getlocationById($scope.currentData.locationId);
          });
          $scope.currentData = $scope.inventoryList[i];
          $scope.currentData.part = getPartById($scope.currentData.partId);
          $scope.currentData.warehouse = getWarehouseById($scope.currentData.warehouseId);
          break;
        }
      }
      $('#myModal_updateInventory').modal();
    }
  };

  $scope.deleteInventory = function() {
    var checked = 0;
    $scope.deletelist = [];
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        checked += 1;
        let tempdata={};
        for(var i=0; i< $scope.inventoryList.length; i++){
          if($scope.inventoryList[i].inventoryId == key){
            tempdata = $scope.inventoryList[i];
            $scope.deletelist.push(tempdata);
            break;
          }
        }
      }
    });
    if(checked == 0){
      $scope.message = '请至少选择一个库存';
      $('#myModal_alert').modal();
    }else{
      let tempstr = '';
      for(var i=0; i< $scope.deletelist.length; i++){
        tempstr =tempstr+ $scope.deletelist[i].inventoryId +'号';
        tempstr =tempstr+ ' ';
      }
      tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个库存';
      $scope.deletestr = tempstr;
      $('#myModal_deleteInventory').modal();
    }
  };
  //modal取消事件
  $scope.createDismiss = function(){
    $('#myModal_createInventory').modal('hide');
  };
  $scope.updateDismiss = function(){
    $('#myModal_updateInventory').modal('hide');
  };
  $scope.deleteDismiss = function(){
    $('#myModal_deleteInventory').modal('hide');
  };
  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };

  //onselect事件
  $scope.selectWarehouse = function(){
    getWarelocationlist($scope.currentData.warehouse.warehouseId);
  }
  //modal确定事件
  $scope.saveCreateInventory = function(){
      if(!$scope.currentData.hasOwnProperty("warehouse") || $scope.currentData.warehouse == ''){
          alert('必须选择一个仓库');
      }else if(!$scope.currentData.hasOwnProperty("warelocation")  || $scope.currentData.warelocation == ''){
          alert('必须选择一个仓位');
      }else if(!$scope.currentData.hasOwnProperty("part")  || $scope.currentData.part == ''){
          alert('必须选择一个配件');
      }else if(!$scope.currentData.hasOwnProperty("quantity")  || $scope.currentData.quantity == ''){
          alert('必须填写数量');
      }else if(!$scope.currentData.hasOwnProperty("inTaskDate")  || $scope.currentData.inTaskDate == '') {
          alert('必须选择时间');
      }else{
          $('#myModal_createInventory').modal('hide');
          createInventoryImpl();
      }
  };
  $scope.saveUpdatePart = function(){
    if(!$scope.currentData.hasOwnProperty("warehouse") || $scope.currentData.warehouse == ''){
        alert('必须选择一个仓库');
    }else if(!$scope.currentData.hasOwnProperty("warelocation")  || $scope.currentData.warelocation == ''){
        alert('必须选择一个仓位');
    }else if(!$scope.currentData.hasOwnProperty("part")  || $scope.currentData.part == ''){
        alert('必须选择一个配件');
    }else if(!$scope.currentData.hasOwnProperty("quantity")  || $scope.currentData.quantity == ''){
        alert('必须填写数量');
    }else if(!$scope.currentData.hasOwnProperty("inTaskDate")  || $scope.currentData.inTaskDate == '') {
        alert('必须选择时间');
    }else{
        $('#myModal_updateInventory').modal('hide');
        updateInventoryImpl();
    }
  };

  $scope.saveDeletePart = function(){
    $('#myModal_deleteInventory').modal('hide');
    deleteInventoryImpl();
  };

  $scope.$on('$viewContentLoaded', function() {
    getPartList();
    getWarehouseList();
    getInventoryList();
    $('.form_date').datetimepicker({
          language: 'zh-CN',/*加载日历语言包，可自定义*/
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          todayHighlight: 1,
          startView: 2,
          forceParse: 0
      }).on('hide', function (e) {
          var $this = $(this);
          var _this = this;
          $scope.$apply(function(){
              $scope.currentData.inTaskDate = _this.value;
          });
        });
  });
  $scope.$watch(function() {
    return $scope.checkboxes.checked;
    }, function(value) {
    angular.forEach($scope.inventoryList, function(item) {
      $scope.checkboxes.items[item.inventoryId] = value;
    });
  });

  $scope.$watch(function() {
    return $scope.checkboxes.items;
    }, function(values) {
      var checked = 0, unchecked = 0,
      total = $scope.inventoryList.length;
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
  function getPartList(){
      deviceApi.getPartList('asc',0,100)
          .then(function(result) {
              if(result.data.total > 0) {
                  $scope.partList=result.data.rows;
              }else {
                  $scope.partList=[];
              }
          })
  }
  function getWarehouseList(){
      deviceApi.getWarehouselist('asc',0,100)
          .then(function(result) {
              if(result.data.total > 0) {
                  $scope.warehouseList=result.data.rows;
                  getWarelocationlist($scope.warehouseList[0].warehouseId);
              }else {
                  $scope.warehouseList=[];
              }
          })
  }
  function getPartById(id){
    var obj = {};
      for(var i=0; i<$scope.partList.length; i++){
          if($scope.partList[i].partId == id){
              obj = $scope.partList[i]
              break;
          }
      }
      return obj;
  }
  function getWarehouseById(id){

    var obj = {};
      for(var i=0; i<$scope.warehouseList.length; i++){
          if($scope.warehouseList[i].warehouseId == id){
              obj = $scope.warehouseList[i];
              break;
          }
      }
      return obj;
  }
  function getlocationById(id){
    var obj = {};
      for(var i=0; i<$scope.warelocationList.length; i++){
          if($scope.warelocationList[i].locationId == id){
              obj = $scope.warelocationList[i]
              break;
          }
      }
      return obj;
  }
  function getWarelocationlist(warehouseId){
      deviceApi.getWarelocationlistById(warehouseId,'asc',0,100)
          .then(function(result) {
              if(result.data.total > 0) {
                  $scope.warelocationList=result.data.rows;
              }else {
                  $scope.warelocationList=[];
              }
          })
  }
  function getWarelocationlistWithcallback(warehouseId, callback){
      deviceApi.getWarelocationlistById(warehouseId,'asc',0,100)
          .then(function(result) {
              if(result.data.total > 0) {
                  $scope.warelocationList=result.data.rows;
              }else {
                  $scope.warelocationList=[];
              }
              callback();
          })
  }


  function getInventoryList() {
      $scope.inventoryList = [];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getInventorylist('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.inventoryList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.inventoryList[i].inTaskDate = changeTimeFormat($scope.inventoryList[i].inTaskDate);
                       $scope.inventoryList[i].updateTime = changeTimeFormat($scope.inventoryList[i].updateTime);
                       $scope.inventoryList[i].createTime = changeTimeFormat($scope.inventoryList[i].createTime);
                     }
                }else {
                  $scope.inventoryList=[];
                }
                params.total(result.data.total);
                return $scope.inventoryList;
            }, function(err) {
              console.log('获取库存列表err',err);
            });
        }
      });
      $scope.tableParams.reload();
  }

  function createInventoryImpl() {
    var params={};
    params.warehouseId = $scope.currentData.warehouse.warehouseId;
    params.locationId = $scope.currentData.warelocation.locationId;
    params.partId = $scope.currentData.part.partId;
    params.quantity = $scope.currentData.quantity;
    params.inTaskDate = changeTimeFormat2($scope.currentData.inTaskDate);

    deviceApi.createInventory(params)
        .then(function(result){
            if(result.data.code == 1 ){
              $scope.message = '添加库存成功！';
              $('#myModal_alert').modal();
              getInventoryList();
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('库存列表获取err', err);
        });
  }

  function updateInventoryImpl(){
    var params={};
    params.warehouseId = $scope.currentData.warehouse.warehouseId;
    params.locationId = $scope.currentData.warelocation.locationId;
    params.partId = $scope.currentData.part.partId;
    params.quantity = $scope.currentData.quantity;
    params.inTaskDate = changeTimeFormat2($scope.currentData.inTaskDate);

    deviceApi.updateInventory($scope.currentData.inventoryId,params)
        .then(function(result){
            if(result.data.code == 1 ){
              $scope.message = '库存修改成功！';
              $('#myModal_alert').modal();
              getInventoryList();
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('库存修改err', err);
        });
  }

  function deleteInventoryImpl(){
    var ids='';
    for(var i=0; i< $scope.deletelist.length; i++){
      ids =ids+ $scope.deletelist[i].inventoryId+'-';
    }
    deviceApi.deleteInventory(ids)
    .then(function(result){
        if(result.data.code ==1 ){
          $scope.message = '库存删除成功！';
          $('#myModal_alert').modal();
          getInventoryList();
        }else{
          $scope.message = result.data.message;
          $('#myModal_alert').modal();
        }
    }, function(err) {
      console.log('库存删除err',err);
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
