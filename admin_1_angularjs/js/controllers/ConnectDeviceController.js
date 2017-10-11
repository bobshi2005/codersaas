angular.module('MetronicApp').controller('ConnectDeviceController', ['$scope', '$rootScope', 'deviceApi','$stateParams','NgTableParams','$element','$state',function($scope, $rootScope, deviceApi, $stateParams,NgTableParams,$element,$state) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.equipmentId = $stateParams.equipmentInfo.equipmentId;
    $scope.equipmentname = $stateParams.equipmentInfo.name;
    $scope.protocolId = $stateParams.equipmentInfo.eamEquipmentModel.protocolId;
    $scope.heartData = $stateParams.equipmentInfo.heartData;
    $scope.grm = $stateParams.equipmentInfo.grm;
    $scope.grmPassword = $stateParams.equipmentInfo.grmPassword;
    $scope.grmPeriod = $stateParams.equipmentInfo.grmPeriod;
    $scope.modbusRtuPeriod = $stateParams.equipmentInfo.modbusRtuPeriod;
    $scope.propertylist = [];
    $scope.sensor = {};
    $scope.equipmentModelId = $stateParams.equipmentInfo.equipmentModelId;

    $scope.protocolLists =[
      {"id":1,"name":"Modbus RTU"},
      {"id":4,"name":"库智网关"},
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

    $scope.selectProtocal = function(){
      changeProtocal();
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

    $scope.$on('$viewContentLoaded', function() {
      changeProtocal();
      // getmodelPropertylist();
    });

    $scope.accessdev ={ip:'mbrtu.coderise.cn', port:'8234'};

    $scope.saveConnectInfo = function(){
      if(($scope.equipmentname==null || $scope.equipmentname=='')){
        $scope.message = '设备名称不能为空';
        $('#myModal_alert').modal();
      }else if(($scope.protocolId==null || $scope.protocolId=='')){
        $scope.message = '必须选择一个协议';
        $('#myModal_alert').modal();
      }else{
        switch($scope.protocolId){
          case 1: {
              if(($scope.heartData==null || $scope.heartData=='')){
                $scope.message = '心跳包格式不能为空';
                $('#myModal_alert').modal();
              }else{
                accessDevice();
              }
            };
            break;
          case 4: {
              if(($scope.grm==null || $scope.grm=='')){
                $scope.message = '必须填写设备ID';
                $('#myModal_alert').modal();
              }else if(($scope.grmPassword==null || $scope.grmPassword=='')){
                $scope.message = '必须填写设备密码';
                $('#myModal_alert').modal();
              }else if(($scope.grmPeriod==null || $scope.grmPeriod=='')){
                $scope.message = '必须填写采集频率';
                $('#myModal_alert').modal();
              }else{
                accessDevice();
              }
            };
            break;
          default: break;
        }

      }


    };

    $scope.addDataConversioin = function(){
      $scope.sensor.isl = 0;
      $scope.sensor.ish = 100;
      $scope.sensor.osl = 0;
      $scope.sensor.osh = 100;
      $('.conversion-view').show();
      $('#addConversionbtn').hide();
    };

    $scope.removeDataConversioin = function(){
      $scope.sensor.isl = 0;
      $scope.sensor.ish = 0;
      $scope.sensor.osl = 0;
      $scope.sensor.osh = 0;
      $('.conversion-view').hide();
      $('#addConversionbtn').show();
    };

    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
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
                $scope.sensor.isl = sensor.isl;
                $scope.sensor.ish = sensor.ish;
                $scope.sensor.osl = sensor.osl;
                $scope.sensor.osh = sensor.osh;
                $scope.sensor.grmAction = sensor.grmAction;
                $scope.sensor.grmVariable = sensor.grmVariable;
                $scope.sensor.grmVariableValue = sensor.grmVariableValue;
                $scope.sensor.grmVariableOrder = sensor.grmVariableOrder;

              }
              if($scope.sensor.dataFormat =='UNSIGNED_16' || $scope.sensor.dataFormat =='SIGNED_16' ){
                $scope.sensor.bitOrder = 'noValue';
                $('#bitcode').hide();
              }else{
                $('#bitcode').show();
              }
              if($scope.sensor.isl == null || $scope.sensor.ish == null || $scope.sensor.osl == null || $scope.sensor.osh == null){
                $('.conversion-view').hide();
                $('#addConversionbtn').show();
              }else if($scope.sensor.isl == 0 && $scope.sensor.ish == 0 && $scope.sensor.osl == 0 && $scope.sensor.osh == 0){
                $('.conversion-view').hide();
                $('#addConversionbtn').show();
              }else{
                $('.conversion-view').show();
                $('#addConversionbtn').hide();
              }
              if($scope.protocolId == 1){
                $('#myModal_setSeneor').modal('show');
              }else if($scope.protocolId == 4){
                $('#myModal_setSeneorJK').modal('show');
              }

          }, function(err) {
              if(err.status == 404){

              }
          });
    }

    $scope.setSensorDismiss = function(){
      $('#myModal_setSeneor').modal('hide');
      $scope.sensor = {};
    }
    $scope.setSensorJKDismiss = function(){
      $('#myModal_setSeneorJK').modal('hide');
      $scope.sensor = {};
    }
    $scope.saveSensor = function(){

      if($('.conversion-view').is(':visible') && $scope.sensor.isl == $scope.sensor.osl && $scope.sensor.ish == $scope.sensor.osh){
        $scope.message = '参数转换前后数据不能一致';
        $('#myModal_alert').modal();
      }else{
        deviceApi.createSensor($scope.sensor)
            .then(function(result){
                if(result.data.code ==1 ){
                    $scope.message = '读写指令设置成功';
                    $('#myModal_alert').modal();
                    $('#myModal_setSeneor').modal('hide');
                    $('#myModal_setSeneorJK').modal('hide');
                }
            }, function(err) {
                console.log('createSensorerr',err);
                $('#myModal_setSeneor').modal('hide');
                $('#myModal_setSeneorJK').modal('hide');
            });
      }


    };

    $scope.goback = function(){
      $state.go('main.asset.infomanage');
    }


        function changeProtocal(){
          switch($scope.protocolId){
            case 1:
                $('#MB-RTU').show();
                $('#JK').hide();

              break;
            case 4:
                $('#MB-RTU').hide();
                $('#JK').show();

              break;
            default:
              $('#MB-RTU').hide();
              $('#JK').hide();
            break;
          }
        }

    function accessDevice() {
        var params={};
        params.equipmentId = $scope.equipmentId;
        // params.protocolId = $scope.protocolId;
        // params.name = $scope.equipmentname;
        if($scope.protocolId == 1){
           params.heartData = $scope.heartData;
           params.modbusRtuPeriod = $scope.modbusRtuPeriod;
        }else if($scope.protocolId == 4){
          params.grm = $scope.grm;
          params.grmPassword = $scope.grmPassword;
          params.grmPeriod = $scope.grmPeriod;
        }

        deviceApi.accessDevice(params)
            .then(function(result){
                if(result.data.code ==1 ){
                    $scope.message = '设备接入成功';
                    $('#myModal_alert').modal();
                }else{
                  $scope.message = '设备接入失败';
                  $('#myModal_alert').modal();
                }
            }, function(err) {
                console.log('accessDeviceerr',err);
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
