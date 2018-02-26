angular.module('MetronicApp').controller('AlarmTemplateManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.AlarmTemplateList = [];
    $scope.equipmentDataList=[];
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
      $('#myModal_createAlarmTemplate').modal();
      $('.upperBound').hide();
      $('.lowerBound').hide();
      $('.duration').hide();
    };
    $scope.updateAlarmTemplate = function(){
      $scope.currentData = {};
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
          if($scope.AlarmTemplateList[i].alarmModelId == index){
            $scope.currentData = $scope.AlarmTemplateList[i];
            console.log('updatecurrentData',$scope.currentData);
            $scope.currentData.selectedDataElement=getDataElementById($scope.AlarmTemplateList[i].eamDataElementId);
            console.log('selectedDataElement',$scope.currentData.selectedDataElement);
            $scope.currentData.alarmType=getDataTypeById($scope.AlarmTemplateList[i].alarmType,$scope.currentData.selectedDataElement.dataType);
            console.log('update',$scope.currentData.alarmType);
            setNumContent($scope.currentData.alarmType.id);
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
            if($scope.AlarmTemplateList[i].alarmModelId == key){
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
        }else if(!$scope.currentData.hasOwnProperty("selectedDataElement") || $scope.currentData.selectedDataElement == ''){
            $scope.message = '必须选择报警变量';
            $('#myModal_alert').modal();
        }else if(!$scope.currentData.hasOwnProperty("alarmType") || $scope.currentData.alarmType == ''){
            $scope.message = '必须选择报警类型';
            $('#myModal_alert').modal();
        }else{
           if(checkNumContent()){
             $('#myModal_createAlarmTemplate').modal('hide');
             createAlarmTemplateImpl();
           }
        }
    };

    $scope.saveUpdateAlarmTemplate = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写报警模板名称';
            $('#myModal_alert').modal();
        }else if(!$scope.currentData.hasOwnProperty("selectedDataElement") || $scope.currentData.selectedDataElement == ''){
            $scope.message = '必须选择报警变量';
            $('#myModal_alert').modal();
        }else if(!$scope.currentData.hasOwnProperty("alarmType") || $scope.currentData.alarmType == ''){
            $scope.message = '必须选择报警类型';
            $('#myModal_alert').modal();
        }else{
           if(checkNumContent()){
             updateAlarmTemplateImpl();
           }
        }
    };

    $scope.saveDeleteEquipmentCategory = function(){
        deleteAlarmTemplateImpl();
        $('#myModal_deleteAlarmTemplate').modal('hide');
    };

    $scope.selectDataElement  =function(){
      var dataElement = $scope.currentData.selectedDataElement;
      getAlarmTypelistByDataType(dataElement.dataType);
      console.log('dataElement',dataElement);
      $('.upperBound').hide();
      $('.lowerBound').hide();
      $('.duration').hide();
    };

    $scope.selectAlarmType = function(){
      var alarmType = $scope.currentData.alarmType;
      console.log('alarmType',alarmType);
      setNumContent(alarmType.id);

    };


    $scope.$on('$viewContentLoaded', function() {
        // getEquipmentCategoryList();
        getEquipmentDataList();

    });
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.AlarmTemplateList, function(item) {
        $scope.checkboxes.items[item.alarmModelId] = value;
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

    // function getEquipmentCategoryList(){
    //   deviceApi.getEquipmentCategoryList('asc',0,100)
    //     .then(function(result) {
    //       if(result.data.total > 0) {
    //           $scope.equipmentCategory=result.data.rows[0];
    //           $scope.equipmentCategorylist=result.data.rows;
    //           getAlarmTemplateList();
    //       }else {
    //         $scope.equipmentCategorylist=[];
    //       }
    //     });
    // }

    function getDataElementById(id){
      for(var i=0; i<$scope.equipmentDataList.length; i++){
        if($scope.equipmentDataList[i].id == id){
          var Category = $scope.equipmentDataList[i]
          return Category;
          break;
        }
      }
    }

    function getDataTypeById(id,elementType){
      getAlarmTypelistByDataType(elementType);
      for(var i=0; i<$scope.alarmTypeLists.length; i++){
        if($scope.alarmTypeLists[i].id == id){
          var datatype = $scope.alarmTypeLists[i]
          return datatype;
          break;
        }
      }
    }
    //根据参数的类型获取报警的阈值类型
    function getAlarmTypelistByDataType(dataType){
        switch(dataType){
          case 'analog':
           $scope.alarmTypeLists=[
             {"id":'same_data_element',"name":"与数据点相同"},
             {"id":'val_above',"name":"数值高于X"},
             {"id":'val_below',"name":"数值低于Y"},
             {"id":'val_between',"name":"数值高于X低于Y"},
             {"id":'val_above_below_ofm',"name":"数值高于X低于Y超过M分钟"},
             {"id":'val_above_bound',"name":"数值超过M分钟高于X"},
             {"id":'val_below_bound',"name":"数值超过M分钟低于Y"},
             {"id":'offline',"name":"传感器断开",'type':0},
           ];
           break;
          case 'digital':
           $scope.alarmTypeLists=[
             {"id":'switch_on',"name":"开关开启"},
             {"id":'switch_off',"name":"开关关闭"},
             {"id":'offline',"name":"传感器断开"},
           ];
           break;
          default:
           break;
        }
    }

    function getEquipmentDataList(){
      deviceApi.getEquipmentDataList('asc', 0,100)
        .then(function(result) {
            if(result.data.total > 0) {
              $scope.equipmentDataList=result.data.rows;
            }else {
              $scope.equipmentDataList=[];
            }
            getAlarmTemplateList();
        }, function(err) {
          console.log('获取数据点列表err',err);
        });
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

    function setNumContent(alarmTypeId){
      switch(alarmTypeId){
          case "same_data_element":
            $('.upperBound').hide();
            $('.lowerBound').hide();
            $('.duration').hide();
            break;
          case "val_above":
            $('.upperBound').show();
            $('.lowerBound').hide();
            $('.duration').hide();
            break;
          case "val_below":
            $('.upperBound').hide();
            $('.lowerBound').show();
            $('.duration').hide();
            break;
          case "val_between":
            $('.upperBound').show();
            $('.lowerBound').show();
            $('.duration').hide();
            break;
          case "val_above_below_ofm":
            $('.upperBound').show();
            $('.lowerBound').show();
            $('.duration').show();
            break;
          case "val_above_bound":
            $('.upperBound').show();
            $('.lowerBound').hide();
            $('.duration').show();
            break;

          case "val_below_bound":
            $('.upperBound').hide();
            $('.lowerBound').show();
            $('.duration').show();
            break;

          default:
            $('.upperBound').hide();
            $('.lowerBound').hide();
            $('.duration').hide();
            break;
        }
    }

    function checkNumContent(){
        var x = $('.upperBoundNum').val();
        var y = $('.lowerBoundNum').val();
        var m = $('.durationNum').val();
        switch($scope.currentData.alarmType.id){
          case "val_above":
            if(x==null || x==''){
              $scope.message ='请填写 X 的值';
              $('#myModal_alert').modal();

            }else{
              $scope.currentData.lowerBound = '';
              $scope.currentData.duration = '';
              return true;
            }

            break;
          case "val_below":
            if( y==null || y==''){
              $scope.message ='请填写 Y 的值';
              $('#myModal_alert').modal();
            }else{
              $scope.currentData.upperBound = '';
              $scope.currentData.duration = '';
              return true;
            }
            break;

          case "val_between":
            if(x==null || x=='' || y==null || y==''){
              $scope.message ='请填写 X 与 Y 的值';
              $('#myModal_alert').modal();
            }else if(x-y>=0){
              $scope.message ='X 必须小于 Y';
              $('#myModal_alert').modal();
            }else{
              $scope.currentData.duration = '';
              return true;
            }
            break;
          case "val_above_below_ofm":
              if(x==null || x=='' || y==null || y=='' || m==null || m==''){
                $scope.message ='请填写 X Y M 的值';
                $('#myModal_alert').modal();
              }else if(x-y>=0 || m<=0){
                $scope.message ='X 必须小于 Y, M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                return true;
              }
            break;
          case "val_above_bound":
              if(x==null || x=='' || m==null || m==''){
                $scope.message ='请填写 X 与 M 的值';
                $('#myModal_alert').modal();
              }else if(m<=0){
                $scope.message ='M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                $scope.currentData.lowerBound = '';
                return true;
              }
            break;
          case "val_below_bound":
              if(y==null || y=='' || m==null || m==''){
                $scope.message ='请填写 Y 与 M 的值';
                $('#myModal_alert').modal();
              }else if(m<=0){
                $scope.message ='M必须大于 0';
                $('#myModal_alert').modal();
              }else{
                $scope.currentData.upperBound = '';
                return true;
              }
            break;
          default:
              $scope.currentData.lowerBound = '';
              $scope.currentData.upperBound = '';
              $scope.currentData.duration = '';
            break;
        }
      return false;
    }

    function createAlarmTemplateImpl(){
      var params={};
      params.eamDataElementId = $scope.currentData.selectedDataElement.id;
      params.name = $scope.currentData.name;
      params.alarmType = $scope.currentData.alarmType.id;
      if($scope.currentData.upperBound){
        params.upperBound = $scope.currentData.upperBound;
      }else{
        params.upperBound = '';
      }
      if($scope.currentData.lowerBound){
        params.lowerBound = $scope.currentData.lowerBound;
      }else{
        params.lowerBound = '';
      }
      if($scope.currentData.duration){
        params.duration = $scope.currentData.duration;
      }else{
        params.duration = '';
      }

      console.log('alarmparams',params);

      deviceApi.createAlarmTemplate(params)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '报警模板创建成功！';
                  $('#myModal_alert').modal();
                  $('#myModal_createAlarmTemplate').modal('hide');
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
      var params={};
      params.id = $scope.currentData.alarmModelId;
      params.eamDataElementId = $scope.currentData.selectedDataElement.id;
      params.name = $scope.currentData.name;
      params.alarmType = $scope.currentData.alarmType.id;
      if($scope.currentData.upperBound){
        params.upperBound = $scope.currentData.upperBound;
      }else{
        params.upperBound = '';
      }
      if($scope.currentData.lowerBound){
        params.lowerBound = $scope.currentData.lowerBound;
      }else{
        params.lowerBound = '';
      }
      if($scope.currentData.duration){
        params.duration = $scope.currentData.duration;
      }else{
        params.duration = '';
      }
      deviceApi.updateAlarmTemplate(params)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '报警模板修改成功！';
                  $('#myModal_alert').modal();
                  $('#myModal_updateAlarmTemplate').modal('hide');
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
        ids =ids+ $scope.deletelist[i].alarmModelId+'-';
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
