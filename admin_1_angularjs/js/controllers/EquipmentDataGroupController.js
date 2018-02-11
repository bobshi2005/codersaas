angular.module('MetronicApp').controller('EquipmentDataGroupController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.equipmentCategoryList = [];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.addEquipmentCategory = function(){
      $scope.currentData = {};
      $('#myModal_createEquipmentCategory').modal();

    };
    $scope.updateEquipmentCategory = function(){
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个设备类';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个设备类进行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.equipmentCategoryList.length; i++){
          if($scope.equipmentCategoryList[i].equipmentCategoryId == index){
            $scope.currentData = $scope.equipmentCategoryList[i];
            break;
          }
        }
        $('#myModal_updateEquipmentCategory').modal();
      }
    };
    $scope.deleteEquipmentCategory = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.equipmentCategoryList.length; i++){
            if($scope.equipmentCategoryList[i].equipmentCategoryId == key){
              tempdata = $scope.equipmentCategoryList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个设备类';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个类别';
        $scope.deletestr = tempstr;
        $('#myModal_deleteEquipmentCategory').modal();
      }
    };

    $scope.createDismiss = function(){
      $('#myModal_createEquipmentCategory').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updateEquipmentCategory').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deleteEquipmentCategory').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    $scope.saveCreateEquipmentCategory = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写类别名称';
            $('#myModal_alert').modal();
        }else{
            createEquipmentCategoryImpl();
        }
    };

    $scope.saveUpdateEquipmentCategory = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写类别名称';
            $('#myModal_alert').modal();
        }else{
            $('#myModal_updateEquipmentCategory').modal('hide');
            updateEquipmentcategoryImpl();
        }
    };

    $scope.saveDeleteEquipmentCategory = function(){
        deleteEquipmentcategoryImpl();
        $('#myModal_deleteEquipmentCategory').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
        getEquipmentCategoryList();
    });
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.equipmentCategoryList, function(item) {
        $scope.checkboxes.items[item.equipmentCategoryId] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.equipmentCategoryList.length;
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

    function getEquipmentCategoryList(){
      $scope.equipmentCategoryList=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getEquipmentCategoryList('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.equipmentCategoryList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.equipmentCategoryList[i].updateTime = changeTimeFormat($scope.equipmentCategoryList[i].updateTime);
                       $scope.equipmentCategoryList[i].createTime = changeTimeFormat($scope.equipmentCategoryList[i].createTime);
                     }
                }else {
                  $scope.equipmentCategoryList=[];
                }
                params.total(result.data.total);
                return $scope.equipmentCategoryList;
            }, function(err) {
              console.log('获取设备类列表err',err);
            });
        }
      });
      $scope.tableParams.reload();
    }

    function createEquipmentCategoryImpl(){
      deviceApi.createEquipmentCategory($scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '设备类型类创建成功！';
                  $('#myModal_alert').modal();
                  getEquipmentCategoryList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
            console.log('设备类型创建err',err);
          });
    }

    function updateEquipmentcategoryImpl(){
      deviceApi.updateEquipmentCategory($scope.currentData.equipmentCategoryId,$scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '设备类型修改成功！';
                  $('#myModal_alert').modal();
                  getEquipmentCategoryList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('设备类型更新err',err);
          });
    }

    function deleteEquipmentcategoryImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].equipmentCategoryId+'-';
      }
      deviceApi.deleteEquipmentCategory(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '设备类型删除成功！';
            $('#myModal_alert').modal();
            getEquipmentCategoryList();
          }else{
            if(result.data && result.data.message){
              $scope.message = result.data.message;
            }else{
              $scope.message ='没有权限!';
            }

            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('设备类型删除err',err);
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
