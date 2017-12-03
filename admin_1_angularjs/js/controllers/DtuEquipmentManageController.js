angular.module('MetronicApp').controller('DtuEquipmentManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','$stateParams','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,$stateParams,$element) {
  $rootScope.menueName = 'sidebar-asset';
  $scope.menueName = $rootScope.menueName;

  $scope.dtuInfo = $stateParams.dtuInfo;
  $scope.equipCheckList =[];
  $scope.equipUnCheckList =[];
  $scope.message = ''; // alert 提示信息
  $scope.checkboxes = {
    checked: false,
    items: {}
  };

  $scope.$on('$viewContentLoaded', function() {
    getEquipList();
  });
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

  function getEquipList(){
    $scope.equipCheckList = [];
    $scope.equipUnCheckList = [];
    $scope.checkboxes.checked = false;
    $scope.checkboxes.items = {};

    // $scope.tableParams = new NgTableParams({
    // page: 1,
    // count:10
    // }, {
    //   getData: function() {
    //     deviceApi.getDtueEuipmentlist($scope.dtuInfo.dtuId,'asc', 0, 999)
    //       .then(function(result) {
    //           if(result.data.total > 0) {
    //               console.log('getDtuEquipmentlist',result.data);
    //                for(var i=0;i<result.data.total;i++){
    //                  if(result.data.rows[i].checked){
    //                    $scope.equipCheckList.push(result.data.rows[i]);
    //                  }else{
    //                    $scope.equipUnCheckList.push(result.data.rows[i]);
    //                  }
    //                }
    //                return $scope.equipCheckList;
    //           }else {
    //             return $scope.equipCheckList;
    //           }
    //       }, function(err) {
    //         console.log('getDtuEquipmentlistErr');
    //
    //       });
    //   }
    // });

    deviceApi.getDtueEuipmentlist($scope.dtuInfo.dtuId,'asc', 0, 999)
      .then(function(result) {
          if(result.data.total > 0) {
              console.log('getDtuEquipmentlist',result.data);
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
          }else {
            return $scope.equipCheckList;
          }
      }, function(err) {
        console.log('getDtuEquipmentlistErr');

      });
  }


}]);
