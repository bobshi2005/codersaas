angular.module('MetronicApp').controller('ConnectDeviceController', ['$scope', '$rootScope', 'deviceApi','$stateParams','NgTableParams','$element',function($scope, $rootScope, deviceApi, $stateParams,NgTableParams,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.equipmentId = $stateParams.equipmentId;
    $scope.equipmentname = $stateParams.name;
    $scope.protocolId = $stateParams.protocolId;
    $scope.heartData = $stateParams.heartData;
    $scope.propertylist = [];
    $scope.sensor = {};
    $scope.equipmentModelId = $stateParams.equipmentModelId;

    $scope.protocolLists =[
      {"id":1,"name":"MB RTU"},
      {"id":2,"name":"MB TCP"},
      {"id":3,"name":"MQTT"}
    ];

    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.propertylist, function(item) {
        $scope.checkboxes.items[item.equipmentModelPropertyId] = value;
      });
    });

    // watch for data checkboxes
   $scope.$watch(function() {
     return $scope.checkboxes.items;
   }, function(values) {
     var checked = 0, unchecked = 0,
     total = $scope.propertylist.length;
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

    $scope.accessdev ={ip:'127.0.0.1', port:'8234'};

    $scope.saveConnectInfo = function(){
      if(($scope.equipmentname==null || $scope.equipmentname=='')){
        alert('提示','设备名称不能为空');
      }else if(($scope.protocolId==null || $scope.protocolId=='')){
        alert('提示','必须选择一个协议');
      }else if(($scope.heartData==null || $scope.heartData=='')){
        alert('提示','心跳包格式不能为空');
      }else{
        accessDevice();
      }
    };

    $scope.showSetSeneor = function(param){
      $scope.sensor = [];
      $scope.sensor.equipmentModelPropertyId = param.equipmentModelPropertyId;
      $scope.sensor.equipmentId = $scope.equipmentId;
      $('#myModal_setSeneor').modal('show');
    }

    $scope.setSensorDismiss = function(){
      $('#myModal_setSeneor').modal('hide');
      $scope.sensor = [];
    }
    $scope.saveSensor = function(){
      console.log('sensor',$scope.sensor);
      deviceApi.createSensor($scope.sensor)
          .then(function(result){
              if(result.data.code ==1 ){
                  alert('读写指令设置成功');
                  $('#myModal_setSeneor').modal('hide');
              }
          }, function(err) {
              alert(err);
              $('#myModal_setSeneor').modal('hide');
          });
    }
    getmodelPropertylist();//获取参数列表

    function accessDevice() {
        var params={};
        params.equipmentId = $scope.equipmentId;
        params.protocolId = $scope.protocolId;
        params.heartData = $scope.heartData;

        deviceApi.accessDevice(params)
            .then(function(result){
                if(result.data.code ==1 ){
                    alert('设备接入成功');
                }
            }, function(err) {
                alert(err);
            });
    };

    function getmodelPropertylist(){
      $scope.propertylist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:2
      }, {
        counts:[2,5,10],
        getData: function(params) {
          return deviceApi.getmodelPropertylist($scope.equipmentModelId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.propertylist=result.data.rows;
                }else {
                  $scope.propertylist=[];
                }
                params.total(result.data.total);
                return $scope.propertylist;
            }, function(err) {
            });
        }
      });
      $scope.tableParams.reload();
    }
}]);
