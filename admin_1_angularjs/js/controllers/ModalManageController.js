angular.module('MetronicApp').controller('ModalManageController', ['$scope', '$rootScope','deviceApi','$compile','NgTableParams','$filter','$element', function($scope, $rootScope, deviceApi, $compile, NgTableParams, $filter,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.modellist;
    $scope.propertylist=[];
    $scope.currentModal={};
    $scope.currentPropertySensor={};
    $scope.allowEdit = false;//允许编辑modal
    $scope.createFormData = {};
    $scope.PropertyItemData;
    $scope.offset = 0;
    $scope.limit = 2;

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
      {"id":1,"name":"MB RTU"},
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
      {"id":'UNSIGNED_32',"name":"32位 无符号数"},
      {"id":'FLOAT_32',"name":"32位 浮点数"}
    ];

    $scope.bitorderLists =[
      {"id":'AB CD',"name":"AB CD"},
      {"id":'CD AB',"name":"CD AB"},
      {"id":'BA DC',"name":"BA DC"},
      {"id":'DC BA',"name":"DC BA"}
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
				variableWidth: true
			});
      getdeviceModellist();
    });
    // 重新选择模型，重新获取模型参数
    var watch = $scope.$watch('currentModal',function(newValue,oldValue, scope){
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
    }
    $scope.setSensorJKDismiss = function(){
      $('#myModal_setSeneorJK').modal('hide');
      $scope.sensor = {};
    }
    $scope.selectModel = function(index) {
      $scope.currentModal = angular.copy($scope.modellist[index]);
    };
    $scope.allowEditInput = function() {
      $scope.allowEdit = true;
    };
    $scope.saveEditInput = function() {
      $scope.allowEdit = false;
      updatedeviceModel();
    };
    $scope.saveCreateModel = function() {
      deviceApi.createdeviceModel($scope.createFormData.name,$scope.createFormData.number,$scope.currentModal.protocolId)
        .then(function(result) {
            getdeviceModellist();
            $scope.message = '模型创建成功！';
            $('#myModal_alert').modal();
            $scope.createFormData = {};
        }, function(err) {
            console.log('createModelErr',err);
            $scope.createFormData = {};
        });

    };
    $scope.cancelCreateModel = function() {
      $scope.createFormData = {};
    };

    $scope.deleteModel = function() {
      if($scope.currentModal.equipmentModelId !=null){
        deletedeviceModel();
      }
    };

    $scope.canceleditPropertyItem = function() {
      $scope.PropertyItemData = [];
    }
    $scope.updatePropertyItem = function() {
      updatePropertyItem();
    };
    $scope.createPropertyItem = function() {
      $scope.PropertyItemData.equipmentModelId = $scope.currentModal.equipmentModelId;
      createPropertyItem();
    };

    $scope.deletePropertyItem = function(param) {
      deletePropertyItem();

    };
    $scope.setPropertyItem = function(param) {
      $scope.PropertyItemData = param;
    };

    $scope.cancelpdatePropertyItem = function() {
      getmodelPropertylist();
    }

    $scope.showSetSensor = function(param){
      $scope.sensor = {};
      $scope.sensor.equipmentModelPropertyId = param.equipmentModelPropertyId;
      $scope.sensor.equipmentModelId = param.equipmentModelId;
      switch($scope.currentModal.protocolId){
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

    $scope.addDataConversioin = function(){
      $scope.isl = 0;
      $scope.ish = 100;
      $scope.osl = 0;
      $scope.osh = 100;
      $('.conversion-view').show();
      $('#addConversionbtn').hide();
    };

    $scope.removeDataConversioin = function(){
      if($scope.currentPropertySensor.isl!=null){
        $scope.isl = 0; //这里应该是null
        $scope.ish = 0;
        $scope.osl = 0;
        $scope.osh = 0;
      }
      $('.conversion-view').hide();
      $('#addConversionbtn').show();
    };

    $scope.saveSensor = function(){
      if($('.conversion-view').is(':visible') && $scope.isl == $scope.osl && $scope.ish == $scope.osh){
        $scope.message = '参数转换前后数据不能一致';
        $('#myModal_alert').modal();
      }else{
        if($('.conversion-view').is(':hidden') && $scope.isl == null){
          //如果是空值就不用update了
        }else{
          $scope.sensor.isl = $scope.isl;
          $scope.sensor.ish = $scope.ish;
          $scope.sensor.osl = $scope.osl;
          $scope.sensor.osh = $scope.osh;
        }
        $scope.sensor.grmAction ='R'; //默认读取模式
        deviceApi.createPropertySensor($scope.sensor)
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

    function getSensorModbus(){
      deviceApi.getSensorModbus($scope.sensor.equipmentModelId,$scope.sensor.equipmentModelPropertyId)
          .then(function(result){
            if(result.data.sensor && result.data.sensor!=null){
                var sensor = result.data.sensor;
                $scope.currentPropertySensor = angular.copy(sensor);
                $scope.sensor.salveId = sensor.salveId;
                $scope.sensor.sensorId = sensor.sensorId;
                $scope.sensor.period = sensor.period;
                $scope.sensor.functionCode = sensor.functionCode;
                $scope.sensor.address = sensor.address;
                $scope.sensor.bitOrder = sensor.bitOrder;
                $scope.sensor.dataFormat = sensor.dataFormat;

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
                $('#myModal_setSeneor').modal('show');
              }else if(result.data.sensor==null){
                $scope.currentPropertySensor = {};
                $('.conversion-view').hide();
                $('#addConversionbtn').show();
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
              $scope.sensor.grmVariableOrder = sensor.grmVariableOrder;

              if(sensor.isl == null || sensor.ish == null || sensor.osl == null || sensor.osh == null){
                  $('.conversion-view').hide();
                  $('#addConversionbtn').show();
                }else if(sensor.isl == 0 && sensor.ish == 0 && sensor.osl == 0 && sensor.osh == 0){
                  $('.conversion-view').hide();
                  $('#addConversionbtn').show();
                }else{
                  $scope.isl = sensor.isl;
                  $scope.ish = sensor.ish;
                  $scope.osl = sensor.osl;
                  $scope.osh = sensor.osh;
                  $('.conversion-view').show();
                  $('#addConversionbtn').hide();
                }
                $('#myModal_setSeneorJK').modal('show');
            }else if(result.data.sensor==null){
              $scope.currentPropertySensor = {};
              $('.conversion-view').hide();
              $('#addConversionbtn').show();
              $('#myModal_setSeneorJK').modal('show');
            }

          }, function(err) {
          });
    }
    function deletedeviceModel(){
      deviceApi.deletedeviceModel($scope.currentModal.equipmentModelId)
        .then(function(result) {
            getdeviceModellist();
            $scope.message = '删除成功！';
            $('#myModal_alert').modal();
        }, function(err) {
            console.log('modelDeleteErr',err);
        });
    }

    function updatedeviceModel(){
      deviceApi.updatedeviceModel($scope.currentModal.equipmentModelId,$scope.currentModal.name,$scope.currentModal.number,$scope.currentModal.protocolId)
        .then(function(result) {
            getdeviceModellist();
            $scope.message = '修改成功！';
            $('#myModal_alert').modal();
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
          return deviceApi.getmodelPropertylist($scope.currentModal.equipmentModelId,'asc', (params.page()-1)*params.count(), params.count())
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
            getmodelPropertylist();
            $scope.message = '参数创建成功！';
            $('#myModal_alert').modal();
            $scope.PropertyItemData = {};
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
            getmodelPropertylist();
            $scope.message = '修改参数成功！';
            $('#myModal_alert').modal();
        }, function(err) {
            console.log('updatePropertyErr',err);
        });
    }
    function deletePropertyItem(){
      deviceApi.deletePropertyItem($scope.PropertyItemData.equipmentModelPropertyId)
        .then(function(result) {
            getmodelPropertylist();
            $scope.message = '删除参数成功！';
            $('#myModal_alert').modal();
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
          + '<h4 class="widget-thumb-heading">'+modellist[i].number+'</h4>'
          + '<div class="widget-thumb-wrap">'
          + '<i class="widget-thumb-icon bg-green icon-layers"></i>'
          + '<div class="widget-thumb-body">'
          + '<span class="widget-thumb-subtitle">'+modellist[i].name+'</span>'
          + '<span class="widget-thumb-body-stat">'+modellist[i].equipmentModelId+'</span>'
          + '</div></div></div>';


        var content=$compile(divStr)($scope);
        $('.multiple-items').slick('slickAdd',content[0]);
        $('.multiple-items').slick('refresh');
      }
      $scope.currentModal = angular.copy($scope.modellist[0]);
      getmodelPropertylist();
    };
}]);
