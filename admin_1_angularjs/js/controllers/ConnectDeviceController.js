angular.module('MetronicApp').controller('ConnectDeviceController', ['$scope', '$rootScope', 'deviceApi','$stateParams','NgTableParams','$element','$state',function($scope, $rootScope, deviceApi, $stateParams,NgTableParams,$element,$state) {
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

    $scope.codeLists =[
      {"id":1,"name":"01 读写"},
      {"id":2,"name":"02 只读"},
      {"id":3,"name":"03 读写"},
      {"id":4,"name":"04 只读"}
    ];

    $scope.formatLists =[
      {"id":'UNSIGNED_16',"name":"16位 无符号数"},
      {"id":'SIGNED_16',"name":"16位 有符号数"},
      {"id":'UNSIGNED_32',"name":"32位 无符号数"},
      {"id":'UNSIGNED_32',"name":"32位 无符号数"},
      {"id":'FLOAT_32',"name":"32位 浮点数"}
    ];

    $scope.bitorderLists =[
      {"id":'AB CD',"name":"AB CD"},
      {"id":'CD AB',"name":"CD AB"},
      {"id":'BA DC',"name":"BA DC"},
      {"id":'DC BA',"name":"DC BA"}
    ];

    $scope.typeList = [
      {"id":"analog",'name':'模拟量'},
      {"id":"digital",'name':'开关量'}
    ];
    $scope.displayTypeList = [
      {"id":"led",'name':'LED'},
      {"id":"pie",'name':'饼图'},
      {"id":"guage","name":"仪表盘"}
    ];

    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.selectFormat = function(){
      if($scope.sensor.dataFormat =='UNSIGNED_16' || $scope.sensor.dataFormat =='SIGNED_16' ){
        $scope.sensor.bitOrder = 'noValue';
        $('#bitcode').hide();

      }else{
        $('#bitcode').show();
      }
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
      $scope.sensor = {};
      $scope.sensor.equipmentModelPropertyId = param.equipmentModelPropertyId;
      $scope.sensor.equipmentId = $scope.equipmentId;
      deviceApi.getSensor($scope.equipmentId, $scope.sensor.equipmentModelPropertyId)
          .then(function(result){

              if(result.data.sensor && result.data.sensor!=null){
                let sensor = result.data.sensor;
                $scope.sensor.salveId = sensor.salveId;
                $scope.sensor.sensorId = sensor.sensorId;
                $scope.sensor.period = sensor.period;
                $scope.sensor.functionCode = sensor.functionCode;
                $scope.sensor.address = sensor.address;
                // $scope.sensor.quantity = sensor.quantity;
                $scope.sensor.bitOrder = sensor.bitOrder;
                $scope.sensor.dataFormat = sensor.dataFormat;
              }
              if($scope.sensor.dataFormat =='UNSIGNED_16' || $scope.sensor.dataFormat =='SIGNED_16' ){
                $scope.sensor.bitOrder = 'noValue';
                $('#bitcode').hide();
              }else{
                $('#bitcode').show();
              }
              $('#myModal_setSeneor').modal('show');
          }, function(err) {
              if(err.status == 404){
                $('#myModal_setSeneor').modal('show');
              }
          });
    }

    $scope.setSensorDismiss = function(){
      $('#myModal_setSeneor').modal('hide');
      $scope.sensor = {};
    }
    $scope.saveSensor = function(){
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

    // function getSensor(){
    //   deviceApi.getSensor($scope.equipmentId, $scope.protocolId)
    //       .then(function(result){
    //           if(result.data.code ==1 ){
    //             console.log('get success',result);
    //           }
    //       }, function(err) {
    //           alert(err);
    //       });
    // }

    $scope.goback = function(){
      $state.go('main.asset.infomanage');
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

    function getdataTypeNameByID(id){
      for(var i=0;i<$scope.typeList.length;i++){
        if($scope.typeList[i].id == id){
          return $scope.typeList[i].name;
          break;
        }
      }
    }

    function getdisplayNameByID(id){
      for(var i=0;i<$scope.displayTypeList.length;i++){
        if($scope.displayTypeList[i].id == id){
          return $scope.displayTypeList[i].name;
          break;
        }
      }
    }

    function getmodelPropertylist(){
      $scope.propertylist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,20],
        getData: function(params) {
          return deviceApi.getmodelPropertylist($scope.equipmentModelId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.propertylist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++){
                       $scope.propertylist[i].periodname = $scope.propertylist[i].period+ '秒';
                       $scope.propertylist[i].dataTypename = getdataTypeNameByID($scope.propertylist[i].dataType);
                       $scope.propertylist[i].displayname = getdisplayNameByID($scope.propertylist[i].displayType);
                     }
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
