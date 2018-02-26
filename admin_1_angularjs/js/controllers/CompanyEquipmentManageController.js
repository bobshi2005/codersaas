angular.module('MetronicApp').controller('CompanyEquipmentManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','$stateParams','$element', '$state',function($scope, $rootScope, deviceApi, NgTableParams,$timeout,$stateParams,$element,$state) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  $scope.companyInfo = $stateParams.companyInfo;
  $scope.equipCheckList =[];
  $scope.equipUnCheckList =[];
  $scope.message = ''; // alert 提示信息
  $scope.deleteArr = [];//删除设备list
  $scope.checkboxes = {
    checked: false,
    items: {}
  };
  $scope.checkboxes2 = {
    checked: false,
    items: {}
  };

  $scope.showAddEquipment = function(){
    $('#myModal_addEquipment').modal();
  };
  $scope.showRemoveEquipment = function(){
    var checked = 0;
    $scope.deleteArr = angular.copy($scope.equipCheckList);
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        checked += 1;
        for(var i=0; i< $scope.equipCheckList.length; i++){
          if($scope.equipCheckList[i].equipmentId == key){
            $scope.deleteArr[i].checked=false;
            break;
          }
        }
      }
    });
    if(checked == 0){
      $scope.message = '请至少选择一个设备';
      $('#myModal_alert').modal();
    }else{
      var tempstr = '';
      var total = 0
      for(var i=0; i< $scope.deleteArr.length; i++){
        if($scope.deleteArr[i].checked ==false){
          tempstr =tempstr+'  '+ $scope.deleteArr[i].name;
          tempstr =tempstr+ '  ';
          total +=1;
        }
      }
      tempstr =tempstr+ '  共'+ total +'个设备';
      $scope.deletestr = tempstr;
      $('#myModal_removeEquipment').modal();
    }
  };
  $scope.addEquipment = function(){
    var checked = 0;
    angular.forEach($scope.checkboxes2.items, function(value,key) {
      if(value){
        checked += 1;
        for(var i=0; i< $scope.equipUnCheckList.length; i++){
          if($scope.equipUnCheckList[i].equipmentId == key){
            $scope.equipUnCheckList[i].checked = true;
            break;
          }
        }
      }
    });
    if(checked == 0){
      $scope.message = '请至少选择一个设备';
      $('#myModal_alert').modal();
    }else{
      $('#myModal_addEquipment').modal('hide');
      var equipmentlist = $scope.equipCheckList.concat($scope.equipUnCheckList);
      setCompanyEquipments(equipmentlist);
    }
  };
  $scope.removeEquipment = function(){
    $('#myModal_removeEquipment').modal('hide');
    var equipmentlist = $scope.deleteArr.concat($scope.equipUnCheckList);
    setCompanyEquipments(equipmentlist);

  }
  $scope.addDismiss = function(){
    $('#myModal_addEquipment').modal('hide');
  };
  $scope.removeDismiss = function(){
    $('#myModal_removeEquipment').modal('hide');
  };
  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };
  $scope.salveIdplus = function(equipment){
    equipment.salveId+= 1;
  };
  $scope.salveIdminus = function(equipment){
    equipment.salveId-= 1;
  };

  $scope.updateSalveId = function(equipment){
    $scope.message ='正在写入更新……';
    $('#myModal_alert').modal();
    // dtuWriteEquipment(equipment,equipment.salveId);
  };
  $scope.goback = function(){
    $state.go('main.setting.companymanage');
  };

  $scope.$on('$viewContentLoaded', function() {
    getEquipList();
  });
  //checklist
  $scope.$watch(function() {
    return $scope.checkboxes.checked;
    }, function(value) {
    angular.forEach($scope.equipCheckList, function(item) {
      $scope.checkboxes.items[item.equipmentId] = value;
    });
  });

  $scope.$watch(function() {
    return $scope.checkboxes.items;
    }, function(values) {
      var checked = 0, unchecked = 0,
      total = $scope.equipCheckList.length;
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
    //unchecklist
    $scope.$watch(function() {
      return $scope.checkboxes2.checked;
      }, function(value) {
      angular.forEach($scope.equipUnCheckList, function(item) {
        $scope.checkboxes2.items[item.equipmentId] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes2.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.equipUnCheckList.length;
        angular.forEach($scope.checkboxes2.items, function(item) {
         if(item){
           checked += 1;
         }else{
           unchecked +=1;
         }
        });
        if ((unchecked == 0) || (checked == 0)) {
         $scope.checkboxes2.checked = (checked == total && total>0);
        }

        angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
      }, true);

  function getEquipList(){
    $scope.equipCheckList = [];
    $scope.equipUnCheckList = [];
    $scope.checkboxes.checked = false;
    $scope.checkboxes.items = {};

    deviceApi.getCompanyEuipmentlist($scope.companyInfo.companyId,'asc', 0, 999)
      .then(function(result) {
          if(result.data.total > 0) {
               for(var i=0;i<result.data.total;i++){
                 if(result.data.rows[i].checked){
                   $scope.equipCheckList.push(result.data.rows[i]);
                 }else{
                   $scope.equipUnCheckList.push(result.data.rows[i]);
                 }
               }
               $scope.tableParams = new NgTableParams({},
                 {
                   counts:[],
                   dataset:$scope.equipCheckList
                 }
               );
               $scope.tableParams2 = new NgTableParams({},
                 {
                   counts:[],
                   dataset:$scope.equipUnCheckList
                 }
               );
          }else {
          }
      }, function(err) {
        console.log('getDtuEquipmentlistErr');

      });
  }

  function setCompanyEquipments(equipmentlist){

    var ids='';
    for(var i=0;i<equipmentlist.length;i++){
      if(equipmentlist[i].checked==true){
        ids=ids+'::'+equipmentlist[i].equipmentId;
      }
    }
    deviceApi.setCompanyEquipments($scope.companyInfo.companyId,ids)
      .then(function(result){
        if(result.data.code==1){
          getEquipList();
          $scope.message = '公司名下设备修改成功！';
          $('#myModal_alert').modal();
        }else{
          $scope.message = '公司名下设备修改失败！';
          $('#myModal_alert').modal();
        }
      },function(err){
        $scope.message = '公司名下设备修改失败！';
        $('#myModal_alert').modal();
        console.log('setCompanyEquipmentsErr');
      })
  }
}]);
