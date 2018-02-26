angular.module('MetronicApp').controller('EquipmentDataGroupController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.EquipmentDataGroupList = [];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.addEquipmentDataGroup = function(){
      $scope.currentData = {};
      $('#myModal_createEquipmentDataGroup').modal();

    };
    $scope.updateEquipmentDataGroup = function(){
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个数据分组';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个数据分组进行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.EquipmentDataGroupList.length; i++){
          if($scope.EquipmentDataGroupList[i].id == index){
            $scope.currentData = $scope.EquipmentDataGroupList[i];
            break;
          }
        }
        $('#myModal_updateEquipmentDataGroup').modal();
      }
    };
    $scope.deleteEquipmentDataGroup = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.EquipmentDataGroupList.length; i++){
            if($scope.EquipmentDataGroupList[i].id == key){
              tempdata = $scope.EquipmentDataGroupList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个数据分组';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个分组';
        $scope.deletestr = tempstr;
        $('#myModal_deleteEquipmentDataGroup').modal();
      }
    };

    $scope.createDismiss = function(){
      $('#myModal_createEquipmentDataGroup').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updateEquipmentDataGroup').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deleteEquipmentDataGroup').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    $scope.saveCreateEquipmentDataGroup = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写分组名称';
            $('#myModal_alert').modal();
        }else{
            createEquipmentDataGroupImpl();
        }
    };

    $scope.saveUpdateEquipmentDataGroup = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写分组名称';
            $('#myModal_alert').modal();
        }else{
            $('#myModal_updateEquipmentDataGroup').modal('hide');
            updateEquipmentDataGroupImpl();
        }
    };

    $scope.saveDeleteEquipmentDataGroup = function(){
        deleteEquipmentDataGroupImpl();
        $('#myModal_deleteEquipmentDataGroup').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
        getEquipmentDataGroupList();
    });
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.EquipmentDataGroupList, function(item) {
        $scope.checkboxes.items[item.id] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.EquipmentDataGroupList.length;
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

    function getEquipmentDataGroupList(){
      $scope.EquipmentDataGroupList=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getEquipmentDataGroupList('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.EquipmentDataGroupList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.EquipmentDataGroupList[i].updateTime = changeTimeFormat($scope.EquipmentDataGroupList[i].updateTime);
                       $scope.EquipmentDataGroupList[i].createTime = changeTimeFormat($scope.EquipmentDataGroupList[i].createTime);
                     }
                }else {
                  $scope.EquipmentDataGroupList=[];
                }
                params.total(result.data.total);
                return $scope.EquipmentDataGroupList;
            }, function(err) {
              console.log('获取数据分组列表err',err);
            });
        }
      });
      $scope.tableParams.reload();
    }

    function createEquipmentDataGroupImpl(){
      deviceApi.createEquipmentDataGroup($scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '数据分组类创建成功！';
                  $('#myModal_alert').modal();
                  getEquipmentDataGroupList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
            console.log('数据分组创建err',err);
          });
    }

    function updateEquipmentDataGroupImpl(){
      deviceApi.updateEquipmentDataGroup($scope.currentData.id,$scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '数据分组修改成功！';
                  $('#myModal_alert').modal();
                  getEquipmentDataGroupList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('数据分组更新err',err);
          });
    }

    function deleteEquipmentDataGroupImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].id+'-';
      }
      deviceApi.deleteEquipmentDataGroup(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '数据分组删除成功！';
            $('#myModal_alert').modal();
            getEquipmentDataGroupList();
          }else{
            if(result.data && result.data.message){
              $scope.message = result.data.message;
            }else{
              $scope.message ='没有权限!';
            }

            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('数据分组删除err',err);
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
