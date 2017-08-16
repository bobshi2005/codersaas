angular.module('MetronicApp').controller('InfoManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.isShowmap = false;
    $scope.loadModels = false;
    $scope.accessdev = {};
    $scope.deletedev = {};
    $scope.message = '';
    $scope.devicelist = [];
    $scope.latitude = 33.4;
    $scope.longitude = 116.3;
    $scope.models = [];
    $scope.currentData = {};
    $scope.modellist = [];
    $scope.provinceList = [];
    $scope.allcity = []; //所有的城市数据
    $scope.cityList = [];
    $scope.doProvAndCityRelation = function(){
      console.log('selectPro',$scope.currentData.province);
      $scope.cityList = [];
      $.each($scope.allcity,
        function(i, val) {
          if (val.id.substr(0, 2) == $scope.currentData.province.substr(0, 2)) {
            $scope.cityList.push(val);
          }
        }
      );
    };
    $scope.doGetCity = function(){
      console.log('selectCity',$scope.currentData.city);
    };
    $scope.showMap = function() {$scope.isShowmap = true;};
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 4
    });
    $scope.marker = new AMap.Marker({
      position: $scope.map.getCenter(),
      offset: new AMap.Pixel(-12, -12),
      zIndex: 101,
      map: $scope.map
    });
    $scope.map.plugin(["AMap.ToolBar"], function() {
        $scope.map.addControl(new AMap.ToolBar());
    });
    $scope.map.on('click', function(e) {
        document.getElementById("formlongitude").value = e.lnglat.getLng();
        document.getElementById("formlatitude").value = e.lnglat.getLat();
        $scope.marker.setPosition([e.lnglat.getLng(),e.lnglat.getLat()]);
    });
    $scope.discreate = function(){
        $('#myModal_createDevice').modal('hide');
    };
    $scope.disalert = function(){
        $('#myModal_alert').modal('hide')
    };
    $scope.setAccessDevDismiss = function(){
        $('#myModal_accessdev').modal('hide');
    };
    $scope.saveCreateDevice = function(){

      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        alert('必须填写设备名称');
      }else if(!$scope.currentData.hasOwnProperty("number")  || $scope.currentData.number == ''){
        alert('必须填写设备编号');
      }else if(!$scope.currentData.hasOwnProperty("serialNumber")  || $scope.currentData.serialNumber == ''){
        alert('必须填写设备序列号');
      }else if(!$scope.currentData.hasOwnProperty("createTime")  || $scope.currentData.createTime == ''){
        alert('必须填写生产日期');
      }else if(!$scope.currentData.hasOwnProperty("factoryDate")  || $scope.currentData.factoryDate == ''){
        alert('必须填写出厂日期');
      }else if(!$scope.currentData.hasOwnProperty("warrantyStartDate")  || $scope.currentData.warrantyStartDate == ''){
        alert('必须填写质保开始日期');
      }else if(!$scope.currentData.hasOwnProperty("warrantyEndDate")  || $scope.currentData.warrantyEndDate == ''){
        alert('必须填写质保结束日期');
      }else{

          $('#myModal_createDevice').modal('hide');
          createDevice();
      }
    };

    $scope.deleteDevice = function(eName,eId) {
        $('#myModal_deleteDevice').modal();

        $scope.deletedev.eName=eName;
        $scope.deletedev.eId=eId;

    };

    $scope.doneDeleteDevice = function() {

        $('#myModal_deleteDevice').modal("hide");

        if($scope.deletedev.eId)
        {
            //alert($scope.deletedev.eName);

            var eId=$scope.deletedev.eId;

            deviceApi.deleteDevice(eId)
                .then(function(result){
                    if(result.data.code ==1 ){
                        alert('删除设备成功');
                        getDevicelist();
                    }
                }, function(err) {
                    alert(err);
                    alert('网络连接问题，请稍后再试！');
                });

        }

    };

    $scope.saveAccessDevice = function(){

        // console.log('access dev',$scope.currentData);
        // console.log('location',$scope.longitude, $scope.latitude);
        // console.log('modalID',$scope.selectedmodel.equipmentModelId);
        if(!$scope.accessdev.hasOwnProperty("eName") || $scope.accessdev.eName == ''){
            alert('必须填写设备名称');
        }else if(!$scope.accessdev.hasOwnProperty("pId")  || $scope.accessdev.pId == ''){
            alert('必须选择链接协议');
        }else if(!$scope.accessdev.hasOwnProperty("hData")  || $scope.accessdev.hData == ''){
            alert('必须填写心跳包数据');
        }else if(!$scope.accessdev.hasOwnProperty("eId")  || $scope.accessdev.eId == ''){
            alert('必须填写注册包参数');
        }else{

            $('#myModal_accessdev').modal('hide');

            //  alert("access dev");
            accessDevice();

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
    $scope.getModels = function() {
      $('#myModal_createDevice').modal();
      getdeviceModellist();
    };

    $scope.getSelDevice = function(eName,eId,pId,hData) {
        $('#myModal_accessdev').modal();
        //getdeviceModellist();
        $scope.accessdev.eName=eName;
        $scope.accessdev.eId=eId;


        if(pId==null)
            $scope.accessdev.pId=0;
        else
            $scope.accessdev.pId=pId;

        $scope.accessdev.hData=hData;

        $scope.protocolLists=[{"id":0,"name":"请选择"},{"id":1,"name":"MB RTU"},{"id":2,"name":"MB TCP"},{"id":3,"name":"MQTT"}];

        //$scope.selectedProtocol=pId;

        //getSelDeviceInfo();
    };
    $scope.$on('$viewContentLoaded', function() {
      getdeviceModellist();
      getCityData();
      $scope.modellist = sharedataApi.getModeldata();

      $('.form_date1').datetimepicker({
          language: 'zh-CN',/*加载日历语言包，可自定义*/
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          todayHighlight: 1,
          startView: 2,
          forceParse: 0
      }).on('hide', function (e) {
          var $this = $(this);
          var _this = this;
          $scope.$apply(function(){
             // $scope.$this.attr('ng-model') = _this.value;
              $scope.currentData.createTime = _this.value;
          });
        });

        $('.form_date2').datetimepicker({
            language: 'zh-CN',/*加载日历语言包，可自定义*/
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
            //    $scope.$this.attr('ng-model') = _this.value;
                $scope.currentData.factoryDate = _this.value;
            });
        });

        $('.form_date3').datetimepicker({
            language: 'zh-CN',/*加载日历语言包，可自定义*/
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
            //    $scope.$this.attr('ng-model') = _this.value;
                $scope.currentData.warrantyStartDate = _this.value;
            });
        });

        $('.form_date4').datetimepicker({
            language: 'zh-CN',/*加载日历语言包，可自定义*/
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0
        }).on('hide', function (e) {
            var $this = $(this);
            var _this = this;
            $scope.$apply(function(){
            //    $scope.$this.attr('ng-model') = _this.value;
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

    function getSelDeviceInfo(){
        deviceApi.getdeviceModellist('asc',0,100)
            .then(function(result) {
                if(result.data.total > 0) {
                    $scope.selectedmodel=result.data.rows[0];
                    $scope.modellist=result.data.rows;
                }else {
                    $scope.modellist=[];
                }
            })
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

    function createDevice() {
      var params={};
      params.userId = 1;
      params.name = $scope.currentData.name;
      params.number = $scope.currentData.number;
      params.serial_number = $scope.currentData.serialNumber;
      params.equipmentModelId = $scope.selectedmodel.equipmentModelId;
      params.imagePath = '';
      params.longitude = Math.round(document.getElementById("formlongitude").value);
      params.latitude = Math.round(document.getElementById("formlatitude").value);
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

    function accessDevice() {

        var params={};

        params.equipmentId = $scope.accessdev.eId;
        params.protocolId = $scope.accessdev.pId;
        params.heartData = $scope.accessdev.hData;

       // alert(eId+pId+hData);

        deviceApi.accessDevice(params)
            .then(function(result){
                if(result.data.code ==1 ){
                    alert('设备接入成功');
                    getDevicelist();
                }
            }, function(err) {
                alert(err);
                alert('网络连接问题，请稍后再试！');
            });
    };

    function getCityData(){
      $.getJSON("./data/areas.json", function(value){
        $scope.provinceList = value.province;
        $scope.allcity = value.city;
    })}
}]);
