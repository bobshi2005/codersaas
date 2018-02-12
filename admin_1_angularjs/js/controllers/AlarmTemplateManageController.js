angular.module('MetronicApp').controller('AlarmTemplateManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.AlarmTemplateList = [];
    $scope.equipmentCategorylist=[];
    $scope.dataTypelist=[
      {"id":"analog",'name':'模拟量'},
      {"id":"digital",'name':'开关量'}];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.addAlarmTemplate = function(){
      $scope.currentData = {};
      $scope.equipmentCategory=$scope.equipmentCategorylist[0];
      $scope.dataType=$scope.dataTypelist[0];
      $('#myModal_createAlarmTemplate').modal();

    };
    $scope.updateAlarmTemplate = function(){
      $scope.currentData = {};
      $scope.equipmentCategory=$scope.equipmentCategorylist[0];
      $scope.dataType=$scope.dataTypelist[0];
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个报警模板';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个报警模板进行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.AlarmTemplateList.length; i++){
          if($scope.AlarmTemplateList[i].id == index){
            $scope.currentData = $scope.AlarmTemplateList[i];
            $scope.equipmentCategory=getEquipmentCategoryById($scope.AlarmTemplateList[i].equipmentCategoryId);
            $scope.dataType=getDataTypeById($scope.AlarmTemplateList[i].dataType);
            break;
          }
        }
        $('#myModal_updateAlarmTemplate').modal();
      }
    };
    $scope.deleteAlarmTemplate = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.AlarmTemplateList.length; i++){
            if($scope.AlarmTemplateList[i].id == key){
              tempdata = $scope.AlarmTemplateList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个报警模板';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个报警模板';
        $scope.deletestr = tempstr;
        $('#myModal_deleteAlarmTemplate').modal();
      }
    };

    $scope.createDismiss = function(){
      $('#myModal_createAlarmTemplate').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updateAlarmTemplate').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deleteAlarmTemplate').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    $scope.saveCreateAlarmTemplate = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写报警模板名称';
            $('#myModal_alert').modal();
        }else if(!$scope.currentData.hasOwnProperty("lableName") || $scope.currentData.lableName == ''){
            $scope.message = '必须填写报警模板显示名称';
            $('#myModal_alert').modal();
        }else{
            createAlarmTemplateImpl();
        }
    };

    $scope.saveUpdateAlarmTemplate = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写报警模板名称';
            $('#myModal_alert').modal();
        }else if(!$scope.currentData.hasOwnProperty("lableName") || $scope.currentData.lableName == ''){
            $scope.message = '必须填写报警模板显示名称';
            $('#myModal_alert').modal();
        }else{
            $('#myModal_updateAlarmTemplate').modal('hide');
            updateAlarmTemplateImpl();
        }
    };

    $scope.saveDeleteEquipmentCategory = function(){
        deleteAlarmTemplateImpl();
        $('#myModal_deleteAlarmTemplate').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
        getEquipmentCategoryList();

    });
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.AlarmTemplateList, function(item) {
        $scope.checkboxes.items[item.id] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.AlarmTemplateList.length;
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

    function getEquipmentCategoryList(){
      deviceApi.getEquipmentCategoryList('asc',0,100)
        .then(function(result) {
          if(result.data.total > 0) {
              $scope.equipmentCategory=result.data.rows[0];
              $scope.equipmentCategorylist=result.data.rows;
              getAlarmTemplateList();
          }else {
            $scope.equipmentCategorylist=[];
          }
        });
    }

    function getEquipmentCategoryById(id){
      for(var i=0; i<$scope.equipmentCategorylist.length; i++){
        if($scope.equipmentCategorylist[i].equipmentCategoryId == id){
          var Category = $scope.equipmentCategorylist[i]
          return Category;
          break;
        }
      }
    }

    function getDataTypeById(id){
      for(var i=0; i<$scope.dataTypelist.length; i++){
        if($scope.dataTypelist[i].id == id){
          var datatype = $scope.dataTypelist[i]
          return datatype;
          break;
        }
      }
    }

    function getAlarmTemplateList(){
      $scope.AlarmTemplateList=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getAlarmTemplateList('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.AlarmTemplateList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.AlarmTemplateList[i].createTime = changeTimeFormat($scope.AlarmTemplateList[i].createTime);
                     }
                }else {
                  $scope.AlarmTemplateList=[];
                }
                params.total(result.data.total);
                return $scope.AlarmTemplateList;
            }, function(err) {
              console.log('获取报警模板列表err',err);
            });
        }
      });
      $scope.tableParams.reload();
    }

    function createAlarmTemplateImpl(){
      var params={};
      params.equipmentCategoryId = $scope.equipmentCategory.equipmentCategoryId;
      params.name = $scope.currentData.name;
      params.lableName = $scope.currentData.lableName;
      params.unit = $scope.currentData.unit;
      params.dataType = $scope.dataType.id;
      console.log('params',params);
      deviceApi.createAlarmTemplate(params)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '报警模板创建成功！';
                  $('#myModal_alert').modal();
                  getAlarmTemplateList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
            console.log('报警模板创建err',err);
          });
    }

    function updateAlarmTemplateImpl(){
      var params = {};
      params.id = $scope.currentData.id;
      params.equipmentCategoryId = $scope.equipmentCategory.equipmentCategoryId;
      params.name = $scope.currentData.name;
      params.lableName = $scope.currentData.lableName;
      params.unit = $scope.currentData.unit;
      params.dataType = $scope.dataType.id;
      deviceApi.updateAlarmTemplate(params)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '报警模板修改成功！';
                  $('#myModal_alert').modal();
                  getAlarmTemplateList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('报警模板更新err',err);
          });
    }

    function deleteAlarmTemplateImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].id+'-';
      }
      deviceApi.deleteAlarmTemplate(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '报警模板删除成功！';
            $('#myModal_alert').modal();
            getAlarmTemplateList();
          }else{
            if(result.data && result.data.message){
              $scope.message = result.data.message;
            }else{
              $scope.message ='没有权限!';
            }

            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('报警模板删除err',err);
      });
    }


    Date.prototype.format = function(format) {
      var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                   format = format.replace(RegExp.$1, RegExp.$1.length == 1
                          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
      }
      return format;
    }

    function changeTimeFormat(timestamp) {
      var newDate = new Date();
      newDate.setTime(timestamp);
      return newDate.format('yyyy-MM-dd');
    }


}]);
