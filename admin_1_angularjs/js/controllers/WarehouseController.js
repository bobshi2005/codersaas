angular.module('MetronicApp').controller('WarehouseController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.warehouselist = [];//仓库列表
    $scope.currentData = [];//当前仓库数据
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//仓库列表
    $scope.deletestr = ''; //删除队列
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.addwarehouse = function(){
      $scope.currentData = [];
      $('#myModal_addwarehouse').modal();
    };
    $scope.deletewarehouse = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        console.log('item',key,value);
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.warehouselist.length; i++){
            if($scope.warehouselist[i].warehouseId == key){
              tempdata = $scope.warehouselist[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked = 0){
        $scope.message = '请选择一个仓库';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个仓库';
        $scope.deletestr = tempstr;
        $('#myModal_deletewarehouse').modal();
      }
    };
    $scope.saveCreateWarehouse = function(){
      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        alert('必须填写仓库名称');
      }else if(!$scope.currentData.hasOwnProperty("comments")  || $scope.currentData.comments == ''){
        alert('必须填写仓库备注');
      }else{
          $('#myModal_addwarehouse').modal('hide');
          Addwarehouse();
      }
    };
    $scope.saveDeleteWarehouse = function(){
      $('#myModal_deletewarehouse').modal('hide');
      DeleteWarehouse();
    };
    $scope.addismiss = function() {
      $('#myModal_addwarehouse').modal('hide');
    };
    $scope.disalert = function() {
      $('#myModal_alert').modal('hide');
    };
    $scope.deletedismiss = function() {
      $('#myModal_deletewarehouse').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
      getWarehouselist();
    });

    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.warehouselist, function(item) {
        $scope.checkboxes.items[item.warehouseId] = value;
      });
    });

    // watch for data checkboxes
     $scope.$watch(function() {
       return $scope.checkboxes.items;
     }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.warehouselist.length;
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
      //  grayed checkbox
       angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
     }, true);



    function getWarehouselist() {
      $scope.warehouselist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getWarehouselist('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.warehouselist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.warehouselist[i].updateTime = changeTimeFormat($scope.warehouselist[i].updateTime);
                       $scope.warehouselist[i].createTime = changeTimeFormat($scope.warehouselist[i].createTime);
                     }
                }else {
                  $scope.warehouselist=[];
                }
                params.total(result.data.total);
                return $scope.warehouselist;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }

    function Addwarehouse(){
      deviceApi.createWarehouse($scope.currentData.name, $scope.currentData.comments)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '仓库创建成功！';
            $('#myModal_alert').modal();
            getWarehouselist();
          }
      }, function(err) {
          alert(err);
      });
    }

    function DeleteWarehouse(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].warehouseId+'-';
      }
      deviceApi.deletedWarehouse(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '仓库删除创建成功！';
            $('#myModal_alert').modal();
            getWarehouselist();
          }
      }, function(err) {
          alert(err);
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

}]);
