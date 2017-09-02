angular.module('MetronicApp').controller('WarelocationController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element','$stateParams','$state', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element,$stateParams,$state) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.warehouseId = $stateParams.warehouseId;
    $scope.name = $stateParams.name;
    $scope.warelocationlist=[];
    $scope.currentData = [];//当前仓库数据
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//仓库列表
    $scope.deletestr = ''; //删除队列
    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.addwarelocation = function(){
      $scope.currentData = [];
      $('#myModal_addwarelocation').modal();
    };
    $scope.updatewarelocation = function(){
      $scope.currentData = [];
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个仓位';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个仓位进行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.warelocationlist.length; i++){
          if($scope.warelocationlist[i].locationId == index){
            $scope.currentData = $scope.warelocationlist[i];
            break;
          }
        }
        $('#myModal_updatewarelocation').modal();
      }
    };
    $scope.deletewarelocation = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.warelocationlist.length; i++){
            if($scope.warelocationlist[i].locationId == key){
              tempdata = $scope.warelocationlist[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个仓库';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].number;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个仓库';
        $scope.deletestr = tempstr;
        $('#myModal_deletewarelocation').modal();
      }
    };
    $scope.saveCreateWarelocation = function(){
      if(!$scope.currentData.hasOwnProperty("number") || $scope.currentData.number == ''){
        alert('必须填写仓位号码');
      }else if(!$scope.currentData.hasOwnProperty("comments")  || $scope.currentData.comments == ''){
        alert('必须填写仓位备注');
      }else{
          $('#myModal_addwarelocation').modal('hide');
          Addwarelocation();
      }
    };
    $scope.saveUpdateWarehouse = function(){
      if(!$scope.currentData.hasOwnProperty("number") || $scope.currentData.number == ''){
        alert('必须填写仓位号码');
      }else if(!$scope.currentData.hasOwnProperty("comments")  || $scope.currentData.comments == ''){
        alert('必须填写仓位备注');
      }else{
          $('#myModal_updatewarelocation').modal('hide');
          Updatewarelocation();
      }
    };
    $scope.saveDeleteWarelocation = function(){
      $('#myModal_deletewarelocation').modal('hide');
      DeleteWarelocation();
    };

    $scope.addismiss = function() {
      $('#myModal_addwarelocation').modal('hide');
    };
    $scope.disalert = function() {
      $('#myModal_alert').modal('hide');
    };
    $scope.updatedismiss = function() {
      $('#myModal_updatewarelocation').modal('hide');
    };
    $scope.deletedismiss = function() {
      $('#myModal_deletewarelocation').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
      getWarelocationlist();
    });

    $scope.goback = function(){
      $state.go('main.asset.warehousemanage');
    };

    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.warelocationlist, function(item) {
        $scope.checkboxes.items[item.locationId] = value;
      });
    });

    $scope.$watch(function() {
       return $scope.checkboxes.items;
     }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.warelocationlist.length;
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

    function getWarelocationlist() {
      $scope.warelocationlist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getWarelocationlistById($scope.warehouseId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.warelocationlist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.warelocationlist[i].updateTime = changeTimeFormat($scope.warelocationlist[i].updateTime);
                       $scope.warelocationlist[i].createTime = changeTimeFormat($scope.warelocationlist[i].createTime);
                     }
                }else {
                  $scope.warelocationlist=[];
                }
                params.total(result.data.total);
                return $scope.warelocationlist;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }

    function Addwarelocation(){
      deviceApi.createWarelocation($scope.warehouseId, $scope.currentData.number, $scope.currentData.comments)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '仓位创建成功！';
            $('#myModal_alert').modal();
            getWarelocationlist();
          }
      }, function(err) {
          alert(err);
      });
    }

    function Updatewarelocation(){
      deviceApi.updateWarelocation($scope.currentData.locationId,$scope.currentData.number, $scope.currentData.comments)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '仓位编辑成功！';
            $('#myModal_alert').modal();
            getWarelocationlist();
          }
      }, function(err) {
          alert(err);
      });
    }

    function DeleteWarelocation(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].locationId+'-';
      }
      deviceApi.deletedWarelocation(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '仓位删除创建成功！';
            $('#myModal_alert').modal();
            getWarelocationlist();
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
