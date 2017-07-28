angular.module('MetronicApp').controller('ConnectDeviceController', ['$scope', '$rootScope', 'deviceApi','$stateParams',function($scope, $rootScope, deviceApi, $stateParams) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.equipmentId = $stateParams.equipmentId;
    $scope.equipmentname = $stateParams.name;
    $scope.protocolId = $stateParams.protocolId;
    $scope.heartData = $stateParams.heartData;
    console.log('protocolId',$stateParams.protocolId);

    $scope.protocolLists =[
      {"id":1,"name":"MB RTU"},
      {"id":2,"name":"MB TCP"},
      {"id":3,"name":"MQTT"}
    ];

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
                alert('网络连接问题，请稍后再试！');
            });
    };
}]);
