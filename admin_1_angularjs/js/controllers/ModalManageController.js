angular.module('MetronicApp').controller('ModalManageController', ['$scope', '$rootScope','deviceApi','$compile','NgTableParams','$filter','$element', function($scope, $rootScope, deviceApi, $compile, NgTableParams, $filter,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.modellist;
    $scope.propertylist=[];
    $scope.currentModel={};
    $scope.editModel={};
    $scope.currentPropertySensor={};
    $scope.allowEdit = false;//允许编辑modal
    $scope.createFormData = {};
    $scope.PropertyItemData;
    $scope.offset = 0;
    $scope.limit = 2;
    $scope.alarm = {};
    $scope.hasAlarmset = false;
    $scope.companyUserLists=[];
    $scope.isAnalogProperty = false;
    $scope.typeList = [
      {"id":"analog",'name':'模拟量'},
      {"id":"digital",'name':'开关量'}
    ];
    $scope.displayTypeList = [
      {"id":"led",'name':'LED'},
      {"id":"pie",'name':'饼图'},
      {"id":"guage","name":"仪表盘"}
    ];
    $scope.protocolLists =[
      {"id":1,"name":"Modbus RTU"},
      {"id":4,"name":"库智网关"}
      //{"id":2,"name":"MB TCP"},
      //{"id":3,"name":"MQTT"}
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
      {"id":'SIGNED_32',"name":"32位 有符号数"},
      {"id":'FLOAT_32',"name":"32位 浮点数"}
    ];

    $scope.bitorderLists =[
      {"id":'AB CD',"name":"AB CD"},
      {"id":'CD AB',"name":"CD AB"},
      {"id":'BA DC',"name":"BA DC"},
      {"id":'DC BA',"name":"DC BA"}
    ];

    $scope.alarmTargets =[
      {"id":'SMS',"name":"短信提醒"},
      {"id":'EMAIL',"name":"邮件提醒"},
    ];



    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.$on('$viewContentLoaded', function() {
      $('.multiple-items').slick({
				dots: false,
				infinite: false,
				arrows: true,
				speed: 300,
				slidesToShow: 2,
				slidesToScroll: 1,
				variableWidth: true,
			});
      getdeviceModellist();
    });
    // 重新选择模型，重新获取模型参数
    var watch = $scope.$watch('currentModel',function(newValue,oldValue, scope){
        if(newValue.equipmentModelId !=oldValue.equipmentModelId) {
          getmodelPropertylist();
        }
    });
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

    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };
    $scope.setSensorDismiss = function(){
      $('#myModal_setSeneor').modal('hide');
      $scope.sensor = {};
    };
    $scope.setSensorJKDismiss = function(){
      $('#myModal_setSeneorJK').modal('hide');
      $scope.sensor = {};
    };
    $scope.setAlarmDismiss = function(){
      $('#myModal_setAlarm').modal('hide');
      $scope.alarm = {};
    };
    $scope.selectModel = function(index) {
      $scope.allowEdit = false;
      $scope.currentModel = angular.copy($scope.modellist[index]);
      $scope.editModel = angular.copy($scope.modellist[index]);
      // console.log('editmodel',$scope.editModel);

    };
    $scope.allowEditInput = function() {
      $scope.allowEdit = true;
    };
    $scope.saveEditInput = function() {
      $scope.allowEdit = false;
      updatedeviceModel();
    };
    $scope.showCreateModel=function(){
      $('#myModal_createModel').modal();
    };
    $scope.creatDismiss = function(){
        $('#myModal_createModel').modal('hide');
    }
    $scope.saveCreateModel = function() {
      console.log('formdata',$scope.createFormData);
      if($scope.createFormData.name == undefined || $scope.createFormData.name==''){
        $scope.message = '必须填写模型名称！';
        $('#myModal_alert').modal();
      }else if($scope.createFormData.number == undefined || $scope.createFormData.number==''){
        $scope.message = '必须填写模型编号！';
        $('#myModal_alert').modal();
      }else if($scope.protocolId == undefined || $scope.protocolId==''){
        $scope.message = '必须选择一个链接协议！';
        $('#myModal_alert').modal();
      }else{
        $('#myModal_createModel').modal('hide');
        deviceApi.createdeviceModel($scope.createFormData.name,$scope.createFormData.number,$scope.protocolId)
          .then(function(result) {
            if(result.data.code == 1){
              getdeviceModellist();
              $scope.message = '模型创建成功！';
              $('#myModal_alert').modal();
              $scope.createFormData = {};
            }else{
              $scope.message = '模型创建失败！';
              $('#myModal_alert').modal();
              $scope.createFormData = {};
            }

          }, function(err) {
              console.log('createModelErr',err);
              $scope.createFormData = {};
          });
      }


    };
    $scope.cancelCreateModel = function() {
      $scope.createFormData = {};
    };

    $scope.deleteModel = function() {
      if($scope.currentModel.equipmentModelId !=null){
        deletedeviceModel();
      }
    };

    $scope.canceleditPropertyItem = function() {
      $scope.PropertyItemData = {};
    }
    $scope.updatePropertyItem = function() {
      updatePropertyItem();
    };
    $scope.createPropertyItem = function() {
      $scope.PropertyItemData.equipmentModelId = $scope.currentModel.equipmentModelId;
      createPropertyItem();
    };

    $scope.deletePropertyItem = function(param) {
      deletePropertyItem();

    };
    $scope.setPropertyItem = function(param) {
      $scope.PropertyItemData = param;
      if(param.dataType =='analog'){
        $scope.isAnalogProperty = true;
      }else{
        $scope.isAnalogProperty = false;
      }
    };

    $scope.resetPropertyItem = function() {
      $scope.PropertyItemData = {};
      $scope.isAnalogProperty = false;
    };

    $scope.cancelupdatePropertyItem = function() {
      $scope.PropertyItemData = {};
      getmodelPropertylist();
    };

    $scope.selectAlarmtype = function(){
      var alarmtype = $scope.alarm.alarmType;
      if(alarmtype.hasOwnProperty('type')){
        switch (alarmtype.type){
          case 1:
            $('#upperBound').show();
            $('#lowerBound').hide();
            $('#duration').hide();
            break;
          case 2:
            $('#upperBound').hide();
            $('#lowerBound').show();
            $('#duration').hide();
            break;
          case 3:
            $('#upperBound').show();
            $('#lowerBound').show();
            $('#duration').hide();
            break;
          case 4:
            $('#upperBound').show();
            $('#lowerBound').show();
            $('#duration').show();
            break;
          case 5:
            $('#upperBound').show();
            $('#lowerBound').hide();
            $('#duration').show();
            break;
          case 6:
            $('#upperBound').hide();
            $('#lowerBound').show();
            $('#duration').show();
            break;

          case 7:
            $('#upperBound').show();
            $('#lowerBound').show();
            $('#duration').hide();
            break;
          default:
            $('#upperBound').hide();
            $('#lowerBound').hide();
            $('#duration').hide();
            break;
        }
      }
    };
    $scope.saveAlarm = function(){
      //模拟量
      // console.log('savealarm',$scope.alarm);
      if($scope.alarm.alarmType.hasOwnProperty('type')){
        console.log('X',$('#upperBoundNum').val());
        console.log('Y',$('#lowerBoundNum').val());
        console.log('M',$('#durationNum').val());
        var x = $('#upperBoundNum').val();
        var y = $('#lowerBoundNum').val();
        var m = $('#durationNum').val();
        switch($scope.alarm.alarmType.type){
          case 1:
            if(x==null || x==''){
              $scope.message ='请填写 X 的值';
              $('#myModal_alert').modal();
            }else{
              $scope.alarm.lowerBound = 0;
              $scope.alarm.duration = 0;
              saveAlarmImpl();
            }

            break;
          case 2:
            if( y==null || y==''){
              $scope.message ='请填写 Y 的值';
              $('#myModal_alert').modal();
            }else{
              $scope.alarm.upperBound = 0;
              $scope.alarm.duration = 0;
                saveAlarmImpl();
            }
            break;

          case 3:
            if(x==null || x=='' || y==null || y==''){
              $scope.message ='请填写 X 与 Y 的值';
              $('#myModal_alert').modal();
            }else if(x-y>=0){
              $scope.message ='X 必须小于 Y';
              $('#myModal_alert').modal();
            }else{
              $scope.alarm.duration = 0;
              saveAlarmImpl();
            }
            break;
          case 4:
              if(x==null || x=='' || y==null || y=='' || m==null || m==''){
                $scope.message ='请填写 X Y M 的值';
                $('#myModal_alert').modal();
              }else if(x-y>=0 || m<=0){
                $scope.message ='X 必须小于 Y, M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                saveAlarmImpl();
              }
            break;
          case 5:
              if(x==null || x=='' || m==null || m==''){
                $scope.message ='请填写 X 与 M 的值';
                $('#myModal_alert').modal();
              }else if(m<=0){
                $scope.message ='M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                $scope.alarm.lowerBound = 0;
                saveAlarmImpl();
              }
            break;
          case 6:
              if(y==null || y=='' || m==null || m==''){
                $scope.message ='请填写 Y 与 M 的值';
                $('#myModal_alert').modal();
              }else if(m<=0){
                $scope.message ='M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                $scope.alarm.upperBound = 0;
                saveAlarmImpl();
              }
            break;
          case 7:
            if(x==null || x=='' || y==null || y==''){
              $scope.message ='请填写 X 与 Y 的值';
              $('#myModal_alert').modal();
            }else if(x-y<0){
              $scope.message ='X 不能小于 Y';
              $('#myModal_alert').modal();
            }else{
              $scope.alarm.duration = 0;
              saveAlarmImpl();
            }
            break;
          case 0:
              $scope.alarm.lowerBound = 0;
              $scope.alarm.upperBound = 0;
              $scope.alarm.duration = 0;
              saveAlarmImpl();
          default:
              $scope.alarm.lowerBound = 0;
              $scope.alarm.upperBound = 0;
              $scope.alarm.duration = 0;
            break;
        }
      }
    };
    $scope.showSetAlarm = function(param){
      $scope.alarm ={};
      $scope.alarmTypeLists =[];
      $scope.alarmType='';
      $scope.alarm.dataType = param.dataType;
      $scope.alarm.equipmentModelPropertyId = param.equipmentModelPropertyId;
      // console.log('PARTAM',param);
      switch(param.dataType){
        case 'analog':
         $scope.alarmTypeLists=[
           {"id":'val_above',"name":"数值高于X",'type':1},//
           {"id":'val_below',"name":"数值低于Y",'type':2},
           {"id":'val_between',"name":"数值高于X低于Y",'type':3},
           {"id":'val_above_below_ofm',"name":"数值高于X低于Y超过M分钟",'type':4},
           {"id":'val_above_bound',"name":"数值超过M分钟高于X",'type':5},
           {"id":'val_below_bound',"name":"数值超过M分钟低于Y",'type':6},
           {"id":'x_tir_y_rec',"name":"数值高于X报警，低于Y恢复",'type':7},
           {"id":'offline',"name":"传感器断开",'type':0},
         ];
         $('#upperBound').hide();
         $('#lowerBound').hide();
         $('#duration').hide();
         $('#myModal_setAlarm').modal();
         break;
        case 'digital':
         $scope.alarmTypeLists=[
           {"id":'switch_on',"name":"开关开启"},
           {"id":'switch_off',"name":"开关关闭"},
           {"id":'offline',"name":"传感器断开"},
         ];
         $('#upperBound').hide();
         $('#lowerBound').hide();
         $('#duration').hide();
         $('#myModal_setAlarm').modal();
         break;
        default:
            $scope.message = '请设置参数类型！';
            $('#myModal_alert').modal();
         break;
      }
      getAlarmset(param.equipmentModelId,param.equipmentModelPropertyId);

    };
    $scope.clearAlarmset = function(){
      deviceApi.deleteAlarmset($scope.alarm.alarmId)
          .then(function(result){
            if(result.data.code ==1){
              // console.log('deleteAlarmset',result.data);
              $scope.message = '报警设置移除成功！';
              $('#myModal_alert').modal();
              $scope.alarm = {};
              $('#myModal_setAlarm').modal('hide');
              $scope.hasAlarmset = false;
            }
          }, function(err) {
            console.log('deleteAlarmsetErr',err);
          });
    };

    $scope.showSetSensor = function(param){
      $scope.sensor = {};
      $scope.sensor.equipmentModelPropertyId = param.equipmentModelPropertyId;
      $scope.sensor.equipmentModelId = param.equipmentModelId;
      switch($scope.currentModel.protocolId){
        case 1:
         getSensorModbus();
         break;
        case 4:
         getSensorGrm();
         break;
        default:
          $scope.message = '功能开发中！';
          $('#myModal_alert').modal();
         break;
      }


    }
    $scope.selectFormat = function(){
      if($scope.sensor.dataFormat =='UNSIGNED_16' || $scope.sensor.dataFormat =='SIGNED_16' ){
        $scope.sensor.bitOrder = 'noValue';
        $('#bitcode').hide();

      }else{
        $('#bitcode').show();
      }
    };
    $scope.selectDataType = function(){
      if($scope.PropertyItemData.dataType =='analog' ){
        $scope.isAnalogProperty = true;
      }else{
        $scope.isAnalogProperty = false;
        $scope.PropertyItemData.displayType ='';
      }
    };

    $scope.addDataConversioin = function(){
      $scope.isl = 0;
      $scope.ish = 100;
      $scope.osl = 0;
      $scope.osh = 100;
      $('.conversion-view').show();
      $('.conversion-add').hide();
    };

    $scope.removeDataConversioin = function(){
      $scope.isl = '';
      $scope.ish = '';
      $scope.osl = '';
      $scope.osh = '';
      $('.conversion-view').hide();
      $('.conversion-add').show();
    };

    $scope.saveSensor = function(){
      if($('.conversion-view').is(':visible') && $scope.isl == $scope.osl && $scope.ish == $scope.osh){
        $scope.message = '参数转换前后数据不能一致';
        $('#myModal_alert').modal();
      }else if($scope.isl-$scope.ish == 0 && $scope.isl!=null && $scope.isl!=''){

          $scope.message = '同一组转换参数的两个数值不能一样';
          $('#myModal_alert').modal();
      }else{
          if($scope.isl!=undefined){
            $scope.sensor.isl = $scope.isl;
            $scope.sensor.ish = $scope.ish;
            $scope.sensor.osl = $scope.osl;
            $scope.sensor.osh = $scope.osh;
            // console.log('sensor',$scope.sensor);
          }else{
            $scope.sensor.isl = '';
            $scope.sensor.ish = '';
            $scope.sensor.osl = '';
            $scope.sensor.osh = '';
          }


        $scope.sensor.grmAction ='R'; //默认读取模式
        deviceApi.createPropertySensor($scope.sensor)
            .then(function(result){
                if(result.data.code ==1 ){
                    $scope.message = '读写指令设置成功';
                    $('#myModal_alert').modal();
                    $('#myModal_setSeneor').modal('hide');
                    $('#myModal_setSeneorJK').modal('hide');
                }else{
                  $scope.message = '读写指令设置失败';
                  $('#myModal_alert').modal();
                }
            }, function(err) {
                console.log('createSensorerr',err);
                $('#myModal_setSeneor').modal('hide');
                $('#myModal_setSeneorJK').modal('hide');
            });
      }
    };

    function getSensorModbus(){
      deviceApi.getSensorModbus($scope.sensor.equipmentModelId,$scope.sensor.equipmentModelPropertyId)
          .then(function(result){
            if(result.data.sensor && result.data.sensor!=null){
                var sensor = result.data.sensor;
                $scope.currentPropertySensor = angular.copy(sensor);
                // $scope.sensor.salveId = sensor.salveId;
                $scope.sensor.sensorId = sensor.sensorId;
                // $scope.sensor.period = sensor.period;
                $scope.sensor.functionCode = sensor.functionCode;
                $scope.sensor.address = sensor.address;
                $scope.sensor.bitOrder = sensor.bitOrder;
                $scope.sensor.dataFormat = sensor.dataFormat;
                $scope.sensor.ish = sensor.ish;
                $scope.sensor.isl = sensor.isl;
                $scope.sensor.osh = sensor.osh;
                $scope.sensor.osl = sensor.osl;

                if($scope.sensor.dataFormat =='UNSIGNED_16' || $scope.sensor.dataFormat =='SIGNED_16' ){
                  $scope.sensor.bitOrder = 'noValue';
                  $('#bitcode').hide();
                }else{
                  $('#bitcode').show();
                }
                // console.log('sensor',$scope.sensor);
                if($scope.sensor.isl == null || $scope.sensor.ish == null || $scope.sensor.osl == null || $scope.sensor.osh == null){
                  $('.conversion-view').hide();
                  $('.conversion-add').show();
                }else if($scope.sensor.isl == 0 && $scope.sensor.ish == 0 && $scope.sensor.osl == 0 && $scope.sensor.osh == 0){
                  $('.conversion-view').hide();
                  $('.conversion-add').show();
                }else{
                  $scope.isl = angular.copy($scope.sensor.isl);
                  $scope.ish = angular.copy($scope.sensor.ish);
                  $scope.osl = angular.copy($scope.sensor.osl);
                  $scope.osh = angular.copy($scope.sensor.osh);
                  $('.conversion-view').show();
                  $('.conversion-add').hide();
                }
                $('#myModal_setSeneor').modal('show');
              }else if(result.data.sensor==null){
                $scope.currentPropertySensor = {};
                $('.conversion-view').hide();
                $('.conversion-add').show();
                $('#myModal_setSeneor').modal('show');
              }
          }, function(err) {
          });
    }
    function getSensorGrm(){
      deviceApi.getSensorGrm($scope.sensor.equipmentModelId,$scope.sensor.equipmentModelPropertyId)
          .then(function(result){
            if(result.data.sensor && result.data.sensor!=null){
              let sensor = result.data.sensor;
              $scope.currentPropertySensor = sensor;
              $scope.sensor.sensorId = sensor.sensorId;
              $scope.sensor.grmAction = sensor.grmAction;
              $scope.sensor.grmVariable = sensor.grmVariable;
              $scope.sensor.grmVariableValue = sensor.grmVariableValue;
              // $scope.sensor.grmVariableOrder = sensor.grmVariableOrder;

              if(sensor.isl == null || sensor.ish == null || sensor.osl == null || sensor.osh == null){
                  $('.conversion-view').hide();
                  $('.conversion-add').show();
                }else if(sensor.isl == 0 && sensor.ish == 0 && sensor.osl == 0 && sensor.osh == 0){
                  $('.conversion-view').hide();
                  $('.conversion-add').show();
                }else{
                  $scope.isl = sensor.isl;
                  $scope.ish = sensor.ish;
                  $scope.osl = sensor.osl;
                  $scope.osh = sensor.osh;
                  $('.conversion-view').show();
                  $('.conversion-add').hide();
                }
                $('#myModal_setSeneorJK').modal('show');
            }else if(result.data.sensor==null){
              $scope.currentPropertySensor = {};
              $('.conversion-view').hide();
              $('.conversion-add').show();
              $('#myModal_setSeneorJK').modal('show');
            }

          }, function(err) {
          });
    }
    function deletedeviceModel(){
      deviceApi.deletedeviceModel($scope.currentModel.equipmentModelId)
        .then(function(result) {
            if(result.data.code == 1){
              getdeviceModellist();
              $scope.message = '删除成功！';
              $('#myModal_alert').modal();
            }else{
              $scope.message = '删除失败！';
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('modelDeleteErr',err);
        });
    }

    function updatedeviceModel(){
      deviceApi.updatedeviceModel($scope.editModel.equipmentModelId,$scope.editModel.name,$scope.editModel.number,$scope.editModel.protocolId)
        .then(function(result) {
            if(result.data.code ==1){
              getdeviceModellist();
              $scope.message = '修改成功！';
              $('#myModal_alert').modal();
            }else{
              $scope.message = '修改失败！';
              $('#myModal_alert').modal();
            }

        }, function(err) {
            console.log('updateModelerr',err);
        });
    }

    function getdeviceModellist(){
      $scope.modellist=[];
      deviceApi.getdeviceModellist('asc', 0, 100)
        .then(function(result) {
            if(result.data.total > 0) {
                 $scope.modellist=result.data.rows;
                 initSlick();
            }else {
              $scope.modellist=[];
            }
        }, function(err) {
            console.log('getdeviceModellisterr',err);
            // console.log(err);
        });
    }

    function findAlarmTypeItemById(id){
      for(var i=0;i<$scope.alarmTypeLists.length;i++){
        if($scope.alarmTypeLists[i].id == id){
          return $scope.alarmTypeLists[i];
          break;
        }
      }
    }

    function findTargetUserById(id){
      // console.log('userlists',id,$scope.companyUserLists);
      for(var i=0;i<$scope.companyUserLists.length;i++){
        if($scope.companyUserLists[i].userId == id){
          return $scope.companyUserLists[i].userId;
          break;
        }
      }
    }

    function getAlarmset(mid,pid){
      $scope.companyUserLists=[];
      deviceApi.getAlarmset(mid,pid)
        .then(function(result) {
            if(result.data.users){
              $scope.companyUserLists = result.data.users;
            }
            if(result.data.alarm && result.data.alarm.alarmId){
              var alarm = result.data.alarm;
              $scope.alarm.alarmType = findAlarmTypeItemById(alarm.alarmType);
              $scope.alarm.upperBound = alarm.upperBound;
              $scope.alarm.alarmId = alarm.alarmId;
              $scope.alarm.lowerBound = alarm.lowerBound;
              $scope.alarm.duration = alarm.duration;
              $scope.alarm.alarmTarget = alarm.alarmTarget;
              $scope.hasAlarmset = true;
              $scope.selectAlarmtype();
            }else{
              $scope.hasAlarmset = false;
            }
            if(result.data.targetUsers.length>0){
              $scope.alarm.targetUser=findTargetUserById(result.data.targetUsers[0].userId);
            }else{
              $scope.alarm.targetUser=angular.copy($scope.companyUserLists[0]);
            }

        }, function(err) {
            console.log('getalarmsseterr',err);
            // console.log(err);
        });
    }

    function saveAlarmImpl(){
      var params={}
      if($scope.alarm.dataType =='analog'){
        params.equipmentModelPropertyId = $scope.alarm.equipmentModelPropertyId;
        params.alarmType = $scope.alarm.alarmType.id;
        params.upperBound = $scope.alarm.upperBound;
        params.lowerBound = $scope.alarm.lowerBound;
        params.duration = $scope.alarm.duration;
        params.alarmTarget = $scope.alarm.alarmTarget;
        params.targetUser = $scope.alarm.targetUser;
      }else{
        params.equipmentModelPropertyId = $scope.alarm.equipmentModelPropertyId;
        params.alarmType = $scope.alarm.alarmType.id;
        params.alarmTarget = $scope.alarm.alarmTarget;
        params.targetUser = $scope.alarm.targetUser;
      }
      if($scope.alarm.alarmId){
        params.alarmId = $scope.alarm.alarmId;
      }

      deviceApi.createPropertyAlarm(params)
          .then(function(result){
              if(result.data.code ==1 ){
                  $scope.message = '报警设置成功';
                  $('#myModal_alert').modal();
                  $('#myModal_setAlarm').modal('hide');
              }else{
                $scope.message = '报警设置失败';
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('createAlarmerr',err);
                $('#myModal_setAlarm').modal('hide');
          });
    }

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
      // console.log('获取模型参数');
      $scope.propertylist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,20],
        getData: function(params) {
          return deviceApi.getmodelPropertylist($scope.currentModel.equipmentModelId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.propertylist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++){
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

    function createPropertyItem(){
      deviceApi.createPropertyItem($scope.PropertyItemData)
        .then(function(result) {
            if(result.data.code ==1){
              getmodelPropertylist();
              $scope.message = '参数创建成功！';
              $('#myModal_alert').modal();
              $scope.PropertyItemData = {};
            }else{
              $scope.message = '参数创建失败！';
              $('#myModal_alert').modal();
              $scope.PropertyItemData = {};
            }

        }, function(err) {
            console.log('createPropertyErr',err);
            $scope.PropertyItemData = {};
        });
    }

    function updatePropertyItem(){
      var params = {
        equipmentModelId: $scope.PropertyItemData.equipmentModelId,
        name: $scope.PropertyItemData.name,
        lable: $scope.PropertyItemData.lable,
        unit: $scope.PropertyItemData.unit,
        address: $scope.PropertyItemData.address,
        dataType: $scope.PropertyItemData.dataType,
        alarmType: $scope.PropertyItemData.alarmType,
        refreshPeriod: $scope.PropertyItemData.refreshPeriod,
        displayType: $scope.PropertyItemData.displayType
      };
      var id = $scope.PropertyItemData.equipmentModelPropertyId;
      deviceApi.updatePropertyItem(id,params)
        .then(function(result) {
            if(result.data.code ==1){
              getmodelPropertylist();
              $scope.message = '修改参数成功！';
              $('#myModal_alert').modal();
            }else{
              $scope.message = '修改参数失败！';
              $('#myModal_alert').modal();
            }

        }, function(err) {
            console.log('updatePropertyErr',err);
        });
    }
    function deletePropertyItem(){
      deviceApi.deletePropertyItem($scope.PropertyItemData.equipmentModelPropertyId)
        .then(function(result) {
            if(result.data.code ==1){
              getmodelPropertylist();
              $scope.message = '删除参数成功！';
              $('#myModal_alert').modal();
            }else{
              $scope.message = '删除参数失败！';
              $('#myModal_alert').modal();
            }

        }, function(err) {
            console.log('deletePropertyErr',err);
        });
    }

    function initSlick(){
      $('.multiple-items').slick('slickRemove',0,0,true);
      var modellist = $scope.modellist;
      var count = modellist.length;
      for(var i=0; i<count; i++){
        // var divStr=`
        //   <div class="slickitem widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" ng-click="selectModel(${i})">
        //     <h4 class="widget-thumb-heading">${modellist[i].number}</h4>
        //     <div class="widget-thumb-wrap">
        //       <i class="widget-thumb-icon bg-green icon-layers"></i>
        //       <div class="widget-thumb-body">
        //         <span class="widget-thumb-subtitle">${modellist[i].name}</span>
        //         <span class="widget-thumb-body-stat">${modellist[i].equipmentModelId}</span>
        //       </div>
        //     </div>
        //   </div>
        // `;
        var divStr=
            '<div class="slickitem widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered" ng-click="selectModel('+i+')">'
          + '<div class="widget-thumb-wrap">'
          + '<i class="widget-thumb-icon bg-green icon-layers"></i>'
          + '<div class="widget-thumb-body">'
          + '<span class="widget-thumb-subtitle">'+modellist[i].name+'</span>'
          + '<span class="widget-thumb-body-stat" style="font-size: 15px">'+modellist[i].number+'</span>'
          + '</div></div></div>';


        var content=$compile(divStr)($scope);
        $('.multiple-items').slick('slickAdd',content[0]);
        $('.multiple-items').slick('refresh');
      }
      $scope.currentModel = angular.copy($scope.modellist[0]);
      $scope.editModel = angular.copy($scope.modellist[0]);
      // console.log('editmodel',$scope.editModel);
      getmodelPropertylist();
    };
}]);
