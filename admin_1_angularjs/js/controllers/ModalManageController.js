angular.module('MetronicApp').controller('ModalManageController', ['$scope', '$rootScope','deviceApi','$compile','NgTableParams','$filter','$element', function($scope, $rootScope, deviceApi, $compile, NgTableParams, $filter,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.modellist;
    $scope.propertylist=[];
    $scope.currentModal={};
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
      deviceApi.createdeviceModel(1,$scope.createFormData.name,$scope.createFormData.number)
        .then(function(result) {
            getdeviceModellist();
            alert('模型创建成功！');
            $scope.createFormData = {};
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
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
      $scope.PropertyItemData.userId = 1;
      $scope.PropertyItemData.equipmentModelId = $scope.currentModal.equipmentModelId;
      createPropertyItem();
    };

    $scope.deletePropertyItem = function(param) {
      deletePropertyItem();

    };
    $scope.setPropertyItem = function(param) {
      $scope.PropertyItemData = param;
      $scope.PropertyItemData.userId = 1;
    };

    $scope.cancelpdatePropertyItem = function() {
      getmodelPropertylist();
    }

    function deletedeviceModel(){
      deviceApi.deletedeviceModel($scope.currentModal.equipmentModelId)
        .then(function(result) {
            getdeviceModellist();
            alert('删除成功！');
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });
    }

    function updatedeviceModel(){
      deviceApi.updatedeviceModel($scope.currentModal.equipmentModelId,1,$scope.currentModal.name,$scope.currentModal.number)
        .then(function(result) {
            getdeviceModellist();
            alert('修改成功！');
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });
    }

    function getdeviceModellist(){
      $scope.modellist=[];
      deviceApi.getdeviceModellist('asc', 0, 100)
        .then(function(result) {
          console.log('s1',result);
            if(result.data.total > 0) {
                 $scope.modellist=result.data.rows;
                 initSlick();
            }else {
              $scope.modellist=[];
            }
        }, function(err) {
            console.log('s2',err);
            // alert(err);
            // alert('网络连接问题，请稍后再试！');
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
            alert('参数创建成功！');
            $scope.PropertyItemData = {};
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
            $scope.PropertyItemData = {};
        });
    }

    function updatePropertyItem(){
      var params = {
        userId: $scope.PropertyItemData.userId,
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
            alert('修改参数成功！');
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });
    }
    function deletePropertyItem(){
      deviceApi.deletePropertyItem($scope.PropertyItemData.equipmentModelPropertyId)
        .then(function(result) {
            getmodelPropertylist();
            alert('删除参数成功！');
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
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
