angular.module('MetronicApp').controller('InfoManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.isShowmap = false;
    $scope.loadModels = false;
    $scope.deletelist = [];
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.message = ''; // 自定义消息提示内容
    $scope.devicelist = [];
    $scope.models = [];
    $scope.currentData = {};
    $scope.modellist = [];
    $scope.provinceList = [];
    $scope.allcity = []; //所有的城市数据
    $scope.cityList = [];
    $scope.doProvAndCityRelation = function(){
      console.log('selectPro',$scope.currentData.province);
      getProCity($scope.currentData.province);
    };
    $scope.doGetCity = function(){
      console.log('selectCity',$scope.currentData.city);
    };
    $scope.showMap1 = function() {
      $scope.isShowmap = true;
    };
    $scope.showMap2 = function() {
      $scope.isShowmap = true;
    };
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.map1 = new AMap.Map('mapContainer1', {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 4
    });
    $scope.marker1 = new AMap.Marker({
      position: $scope.map1.getCenter(),
      offset: new AMap.Pixel(-12, -12),
      zIndex: 101,
      map: $scope.map1
    });
    $scope.map1.plugin(["AMap.ToolBar"], function() {
        $scope.map1.addControl(new AMap.ToolBar());
    });
    $scope.map1.on('click', function(e) {
        document.getElementById("formlongitude1").value = e.lnglat.getLng();
        document.getElementById("formlatitude1").value = e.lnglat.getLat();
        $scope.marker1.setPosition([e.lnglat.getLng(),e.lnglat.getLat()]);
    });
    $scope.map2 = new AMap.Map('mapContainer2', {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 4
    });
    $scope.marker2 = new AMap.Marker({
      position: $scope.map2.getCenter(),
      offset: new AMap.Pixel(-12, -12),
      zIndex: 101,
      map: $scope.map2
    });
    $scope.map2.plugin(["AMap.ToolBar"], function() {
        $scope.map2.addControl(new AMap.ToolBar());
    });
    $scope.map2.on('click', function(e) {
        document.getElementById("formlongitude2").value = e.lnglat.getLng();
        document.getElementById("formlatitude2").value = e.lnglat.getLat();
        $scope.marker2.setPosition([e.lnglat.getLng(),e.lnglat.getLat()]);
    });
    $scope.discreate = function(){
        $('#myModal_createDevice').modal('hide');
        $scope.isShowmap = false;
    };
    $scope.disdelete = function(){
        $('#myModal_deleteDevice').modal('hide');
    };
    $scope.disupdate = function(){
      $('#myModal_updateDevice').modal('hide');
      $scope.isShowmap = false;
    };
    $scope.disalert = function(){
        $('#myModal_alert').modal('hide')
    };
    $scope.createDevice = function() {
      $scope.currentData = [];
      $('#myModal_createDevice').modal();
      getdeviceModellist();
    };
    $scope.updateDevice = function() {
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个设备';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个设备类行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.devicelist.length; i++){
          if($scope.devicelist[i].equipmentId == index){
            $scope.currentData = $scope.devicelist[i];
            $scope.currentData.model = getModelByID($scope.currentData.equipmentModelId);
            getProCity($scope.currentData.province);
            $scope.marker2.setPosition([$scope.currentData.longitude,$scope.currentData.latitude]);
            break;
          }
        }
        $('#myModal_updateDevice').modal();
      }
    };
    $scope.deleteDevice = function() {
        var checked = 0;
        $scope.deletelist = [];
        angular.forEach($scope.checkboxes.items, function(value,key) {
          if(value){
            checked += 1;
            let tempdata={};
            for(var i=0; i< $scope.devicelist.length; i++){
              if($scope.devicelist[i].equipmentId == key){
                tempdata = $scope.devicelist[i];
                $scope.deletelist.push(tempdata);
                break;
              }
            }
          }
        });
        if(checked == 0){
          $scope.message = '请至少选择一个设备';
          $('#myModal_alert').modal();
        }else{
          let tempstr = '';
          for(var i=0; i< $scope.deletelist.length; i++){
            tempstr =tempstr+ $scope.deletelist[i].name;
            tempstr =tempstr+ ' ';
          }
          tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个设备';
          $scope.deletestr = tempstr;
          $('#myModal_deleteDevice').modal();
        }
    };
    $scope.saveCreateDevice = function(){

      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写设备名称';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("number")  || $scope.currentData.number == ''){
        $scope.message = '必须填写设备编号';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("serialNumber")  || $scope.currentData.serialNumber == ''){
        $scope.message = '必须填写设备序列号';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("createTime")  || $scope.currentData.createTime == ''){
        $scope.message = '必须填写生产日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("factoryDate")  || $scope.currentData.factoryDate == ''){
        $scope.message = '必须填写出厂日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("warrantyStartDate")  || $scope.currentData.warrantyStartDate == ''){
        $scope.message = '必须填写质保开始日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("warrantyEndDate")  || $scope.currentData.warrantyEndDate == ''){
        $scope.message = '必须填写质保结束日期';
        $('#myModal_alert').modal();
      }else{
          $('#myModal_createDevice').modal('hide');
          createDeviceImpl();
      }
    };
    $scope.saveDeleteDevice = function() {
        $('#myModal_deleteDevice').modal("hide");
        $scope.isShowmap = false;
        deleteDeviceImpl();
    };
    $scope.saveUpdateDevice = function(){
      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写设备名称';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("number")  || $scope.currentData.number == ''){
        $scope.message = '必须填写设备编号';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("serialNumber")  || $scope.currentData.serialNumber == ''){
        $scope.message = '必须填写设备序列号';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("createTime")  || $scope.currentData.createTime == ''){
        $scope.message = '必须填写生产日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("factoryDate")  || $scope.currentData.factoryDate == ''){
        $scope.message = '必须填写出厂日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("warrantyStartDate")  || $scope.currentData.warrantyStartDate == ''){
        $scope.message = '必须填写质保开始日期';
        $('#myModal_alert').modal();
      }else if(!$scope.currentData.hasOwnProperty("warrantyEndDate")  || $scope.currentData.warrantyEndDate == ''){
        $scope.message = '必须填写质保结束日期';
        $('#myModal_alert').modal();
      }else{
          $('#myModal_updateDevice').modal('hide');
          $scope.isShowmap = false;
          updateDeviceImpl();
      }
    };
    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.devicelist, function(item) {
        $scope.checkboxes.items[item.number] = value;
      });
    });
    // watch for data checkboxes
    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.devicelist.length;
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
      getdeviceModellist();
      getCityData();
      $scope.modellist = sharedataApi.getModeldata();

      $('.form_date1').datetimepicker({
          language: 'zh-CN',
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          startView: 2,
          forceParse: 0,
          minView:'month',
          format: 'yyyy-mm-dd',
          todayHighlight: true,
      }).on('hide', function (e) {
          var $this = $(this);
          var _this = this;
          $scope.$apply(function(){
              $scope.currentData.createTime = _this.value;
          });
        });

        $('.form_date2').datetimepicker({
          language: 'zh-CN',
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          startView: 2,
          forceParse: 0,
          minView:'month',
          format: 'yyyy-mm-dd',
          todayHighlight: true,
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
                $scope.currentData.factoryDate = _this.value;
            });
        });

        $('.form_date3').datetimepicker({
          language: 'zh-CN',
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          startView: 2,
          forceParse: 0,
          minView:'month',
          format: 'yyyy-mm-dd',
          todayHighlight: true,
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
                $scope.currentData.warrantyStartDate = _this.value;
            });
        });

        $('.form_date4').datetimepicker({
          language: 'zh-CN',
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          startView: 2,
          forceParse: 0,
          minView:'month',
          format: 'yyyy-mm-dd',
          todayHighlight: true,
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
                $scope.currentData.warrantyEndDate = _this.value;
            });
        });

      $timeout(getDevicelist(),1000);

    });


    function getdeviceModellist(){
      deviceApi.getdeviceModellist('asc',0,100)
        .then(function(result) {
          if(result.data.total > 0) {
              $scope.selectedmodel=result.data.rows[0];
              $scope.modellist=result.data.rows;
          }else {
            $scope.modellist=[];
          }
        });
    }

    function getModelByID(id){
      var obj = {};
        for(var i=0; i<$scope.modellist.length; i++){
            if($scope.modellist[i].equipmentModelId == id){
                obj = $scope.modellist[i]
                break;
            }
        }
        return obj;
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

    function changeTimeFormat2(inputTime) {
      var newDate = new Date(inputTime);
      return newDate.format('MM/dd/yyyy');
    }

    function getModelnameById(id) {
      for(var i=0; i<$scope.modellist.length; i++){
        if($scope.modellist[i].equipmentModelId == id){
          var name = $scope.modellist[i].name
          return name;
          break;
        }
      }
    }

    function getDevicelist() {
      $scope.devicelist=[];
      $scope.devicelist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getDevicelist('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.devicelist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       var tempname = getModelnameById($scope.devicelist[i].equipmentModelId);
                       $scope.devicelist[i].equipmentModelname = tempname;
                       $scope.devicelist[i].factoryDate = changeTimeFormat($scope.devicelist[i].factoryDate);
                       $scope.devicelist[i].createTime = changeTimeFormat($scope.devicelist[i].createTime);
                       $scope.devicelist[i].warrantyStartDate = changeTimeFormat($scope.devicelist[i].warrantyStartDate);
                       $scope.devicelist[i].warrantyEndDate = changeTimeFormat($scope.devicelist[i].warrantyEndDate);
                     }
                }else {
                  $scope.devicelist=[];
                }
                params.total(result.data.total);
                return $scope.devicelist;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    };

    function createDeviceImpl() {
      var params={};
      // params.userId = 1;
      params.name = $scope.currentData.name;
      params.number = $scope.currentData.number;
      params.serialNumber = $scope.currentData.serialNumber;
      params.equipmentModelId = $scope.selectedmodel.equipmentModelId;
      params.imagePath = '';
      params.longitude = Math.round(document.getElementById("formlongitude1").value);
      params.latitude = Math.round(document.getElementById("formlatitude1").value);
      params.factoryDate = changeTimeFormat2($scope.currentData.factoryDate);
      params.createTime = changeTimeFormat2($scope.currentData.createTime);
      params.warrantyStartDate = changeTimeFormat2($scope.currentData.warrantyStartDate);
      params.warrantyEndDate = changeTimeFormat2($scope.currentData.warrantyEndDate);
      params.commissioningDate = changeTimeFormat2(new Date());
      params.maintenancePeriod = $scope.currentData.maintenancePeriod;
      params.province = $scope.currentData.province;
      params.city = $scope.currentData.city;
      deviceApi.createDevice(params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="创建设备成功！";
              $('#myModal_alert').modal();
              getDevicelist();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('createDeviceerr',err);
        });
    };
    function updateDeviceImpl() {
      var params ={};
      params.name = $scope.currentData.name;
      params.number = $scope.currentData.number;
      params.serialNumber = $scope.currentData.serialNumber;
      params.equipmentModelId = $scope.selectedmodel.equipmentModelId;
      params.imagePath = '';
      params.longitude = Math.round(document.getElementById("formlongitude2").value);
      params.latitude = Math.round(document.getElementById("formlatitude2").value);
      params.factoryDate = changeTimeFormat2($scope.currentData.factoryDate);
      params.createTime = changeTimeFormat2($scope.currentData.createTime);
      params.warrantyStartDate = changeTimeFormat2($scope.currentData.warrantyStartDate);
      params.warrantyEndDate = changeTimeFormat2($scope.currentData.warrantyEndDate);
      params.commissioningDate = changeTimeFormat2(new Date());
      params.maintenancePeriod = $scope.currentData.maintenancePeriod;
      params.province = $scope.currentData.province;
      params.city = $scope.currentData.city;
      deviceApi.updateDevice($scope.currentData.equipmentId,params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="编辑设备成功！";
              $('#myModal_alert').modal();
              getDevicelist();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('updateDeviceerr',err);
        });

    }
    function deleteDeviceImpl() {
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].equipmentId+'-';
      }
      deviceApi.deleteDevice(ids)
        .then(function(result){
            if(result.data.code ==1 ){
                $scope.message = '设备删除成功';
                $('#myModal_alert').modal();
                getDevicelist();
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('deleteerr',err);
        });
    }
    function getCityData() {
      $.getJSON("./data/areas.json", function(value){
        $scope.provinceList = value.province;
        $scope.allcity = value.city;
    })}
    function getProCity(procode) {
      $scope.cityList = [];
      if(procode!=null && procode!=''){
        $.each($scope.allcity,
          function(i, val) {
            if (val.id.substr(0, 2) == procode.substr(0, 2)) {
              $scope.cityList.push(val);
            }
          }
        );
      }
    }
}]);
