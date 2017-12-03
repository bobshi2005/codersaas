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
    $scope.currentDTU = {};   //当前设备的dtu
    $scope.currentDTUname = '';  //当前设备的dtu的名称
    $scope.currentselectDTU = {};   //设备选择dtu时选择的dtu
    $scope.dtudevices = []; //当前dtu名下的设备
    $scope.DTUlist = [];
    $scope.newDTU ={name:'',heartData:''};
    $scope.protocolName = '';
    $scope.salveId = $stateParams.equipmentInfo.salveId;
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

    $scope.selectDtu = function(){
      console.log('select',$scope.currentselectDTU);
    };

    $scope.updateselectDTU = function(){
      updateselectDTUImpl();
    };
    $scope.salveIdplus = function(equipment){
      equipment.salveId+= 1;
      console.log('salveIdplus',equipment.salveId)
    };
    $scope.salveIdminus = function(equipment){
      equipment.salveId-= 1;
      console.log('salveIdplus',equipment.salveId)
    };
    $scope.saveUpdateSalveId = function(equipment){
      $scope.message ='正在写入更新……';
      $('#myModal_alert').modal();
      dtuWriteEquipment(equipment,equipment.salveId);
    };

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
      // console.log('prop',$stateParams.equipmentInfo);
      $('.showDTUDetail').hide();
      changeProtocal();
      // getmodelPropertylist();
      getDTUlist();
    });

    $scope.accessdev ={ip:'mbrtu.coderise.cn', port:'8234'};
    // $scope.accessdev ={ip:'101.132.131.144', port:'8234'};

    $scope.showSelectDTU = function(){
      // $scope.currentselectDTU = angular.copy($scope.currentDTU);
      for(var i=0;i<$scope.DTUlist.length; i++){
        if($scope.currentDTU.dtuId == $scope.DTUlist[i].dtuId){
          $scope.currentselectDTU = $scope.DTUlist[i];
        }
      }
      $('#myModal_selectDTU').modal();
    };

    $scope.showCreateDTU = function(){
      $('#myModal_createDTU').modal();
    };
    $scope.createDTU = function(){
      if(!$scope.newDTU.name || $scope.newDTU.name==''){
        $scope.message='请输入名称';
        $('#myModal_alert').modal();
      }else if(!$scope.newDTU.heartData || $scope.newDTU.heartData==''){
        $scope.message='请输入心跳包';
        $('#myModal_alert').modal();
      }else{
        $('#myModal_createDTU').modal('hide');
        createDTUImpl();
      }

    };
    $scope.saveConnectInfo = function(){
        switch($scope.protocolId){
          case 1: {
              if(($scope.modbusRtuPeriod==null || $scope.modbusRtuPeriod=='')){
                $scope.message = '必须填写采集频率';
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

    $scope.updateselectDTUDismiss = function(){
      $('#myModal_selectDTU').modal('hide');
    };

    $scope.goback = function(){
      $state.go('main.asset.infomanage');
    }


    function changeProtocal(){
      switch($scope.protocolId){
        case 1:
            $('#MB-RTU').show();
            $('#JK').hide();
            $scope.protocolName ='Modbus RTU';

          break;
        case 4:
            $('#MB-RTU').hide();
            $('#JK').show();
            $scope.protocolName ='库智网关';

          break;
        default:
          $('#MB-RTU').hide();
          $('#JK').hide();
          $scope.protocolName ='无';
        break;
      }
    }

    function accessDevice() {
        var params={};
        params.equipmentId = $scope.equipmentId;
        // params.protocolId = $scope.protocolId;
        // params.name = $scope.equipmentname;
        if($scope.protocolId == 1){
          //  params.heartData = $scope.heartData;
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

    function getDTUlist(){
      deviceApi.getDtulist('asc', 0, 999)
        .then(function(result) {
            if(result.data.total > 0) {
                 $scope.DTUlist=result.data.rows;
                 for(var i=0;i<result.data.total;i++){
                   if(result.data.rows[i].dtuId==$stateParams.equipmentInfo.dtuId){
                     $scope.currentDTU = result.data.rows[i];
                     $scope.currentDTUname =  $scope.currentDTU.name;
                     $('.showDTUDetail').show();
                     getDTUdevices();
                   }
                 }
            }else {
              $scope.DTUlist=[];
            }
        }, function(err) {
        });
    }

    function getDTUdevices(){
      deviceApi.getDtueEuipmentlist($scope.currentDTU.dtuId,'asc', 0, 999)
        .then(function(result) {
            if(result.data.total > 0) {
                 $scope.dtudevices=[];
                 for(var i=0;i<result.data.total;i++){
                   if(result.data.rows[i].checked){
                     $scope.dtudevices.push(result.data.rows[i]);
                   }
                 }
            }else {
              $scope.dtudevices=[];
            }
        }, function(err) {
        });
    }

    function updateselectDTUImpl(){
      var eid = $scope.equipmentId;
      console.log('currentConnectDtu',$scope.currentselectDTU);
      if($scope.currentDTU.dtuId && $scope.currentDTU.dtuId == $scope.currentselectDTU.dtuId){
         //无操作
         console.log('无操作');
      }else if($scope.currentDTU.dtuId && $scope.currentDTU.dtuId != $scope.currentselectDTU.dtuId){
        console.log('先unconnect再connect');
        $scope.message = '正在删除当前设置，请稍后……';
        $('#myModal_alert').modal();
        deviceApi.deleteEquipmentFromDtu($scope.currentDTU.dtuId,eid)
          .then(function(result) {
              if(result.data.code == 1) {
                $scope.message = '正在配置新的dtu设置，请稍后……';
                deviceApi.addEquipmentToDtu($scope.currentselectDTU.dtuId,eid)
                  .then(function(result) {
                      if(result.data.code == 1) {
                        $('#myModal_selectDTU').modal('hide');
                        $scope.currentDTU = angular.copy($scope.currentselectDTU);
                        $scope.currentDTUname = $scope.currentDTU.name;
                        dtuWriteEquipment($stateParams.equipmentInfo,0);
                        $scope.message = 'dtu设置成功，正在写入数据，请稍后……';

                      }else {
                      }
                  }, function(err) {
                    $scope.message = '操作失败';
                  });

              }else {
                $scope.message = '操作失败';
              }
          }, function(err) {
            $scope.message = '操作失败';
          });
      }else{
        //connect
        console.log('connect');
        addEquipmentToDtu($scope.currentselectDTU.dtuId,eid);
      }


    }

    function addEquipmentToDtu(dtuid,eid){
      deviceApi.addEquipmentToDtu(dtuid,eid)
        .then(function(result) {
            if(result.data.code == 1) {
              $('#myModal_selectDTU').modal('hide');
              $scope.currentDTU = angular.copy($scope.currentselectDTU);
              $scope.currentDTUname = $scope.currentDTU.name;
              dtuWriteEquipment($stateParams.equipmentInfo,0);
              $scope.message = 'dtu设置成功，正在写入数据，请稍后……';
            }else {
              $scope.message = '操作失败';
            }
        }, function(err) {
          $scope.message = '操作失败';
        });
    }
    function deleteEquipmentFromDtu(dtuid,eid){
      deviceApi.deleteEquipmentFromDtu(dtuid,eid)
        .then(function(result) {
            if(result.data.code == 1) {
            }else {
            }
        }, function(err) {
        });
    }

    function dtuWriteEquipment(equipmentInfo,salveId){
      var equipmentInfo = equipmentInfo;
      equipmentInfo.salveId = salveId;
      deviceApi.dtuWriteEquipment(equipmentInfo)
        .then(function(result) {
            if(result.data.code == 1) {
              $scope.message = '数据写入成功';
              // $scope.currentDTU = angular.copy($scope.currentselectDTU);
              getDTUdevices();
            }else {
              $scope.message = '数据写入失败';
              getDTUdevices();
            }
        }, function(err) {
        });
    }

    function createDTUImpl() {
      var params={};
      params.name = $scope.newDTU.name;
      params.heartData = $scope.newDTU.heartData;

      deviceApi.createDTU(params)
        .then(function(result){
          if(result.data.code == 1){
            getDTUlist();
            $scope.message = '创建dtu成功';
            $('#myModal_alert').modal();
          }
        },function(err){
          console.log('createdtuerr',err);
        });

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
