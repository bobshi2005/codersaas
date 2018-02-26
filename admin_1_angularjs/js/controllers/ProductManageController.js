angular.module('MetronicApp').controller('ProductManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.isShowmap = false;
    $scope.loadModels = false;
    $scope.deletelist = [];
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.message = ''; // 自定义消息提示内容
    $scope.productLineList = [];
    $scope.productLineList = [];//产线列表
    $scope.models = [];
    $scope.currentData = {};
    $scope.modellist = [];
    $scope.provinceList = [];
    $scope.allcity = []; //所有的城市数据
    $scope.cityList = [];
    $scope.showUploader = false;//UPDATE 界面中 更新图片
    $scope.uuid = '';
    var galleryUploader;
    var galleryUpdate;
    var uploaderUrl = sharedataApi.getUploaderUrl();
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
      console.log('zaoban',$scope.currentData.morningShiftStartTime,$scope.currentData.morningShiftEndTime);
        $('#myModal_createProductLine').modal('hide');
        $scope.isShowmap = false;
    };
    $scope.disdelete = function(){
        $('#myModal_deleteProductLine').modal('hide');
    };
    $scope.disupdate = function(){
      $('#myModal_updateProductLine').modal('hide');
      $scope.isShowmap = false;
    };
    $scope.disalert = function(){
        $('#myModal_alert').modal('hide')
    };

    $scope.disstatus = function(){
        $('#myModal_status').modal('hide')
    };
    $scope.createProductLine = function() {
      $scope.currentData = [];
      $('.date').timepicker('setTime',null);
      $('#myModal_createProductLine').modal();
    };
    $scope.updateProductLine = function() {
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个产线';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个产线类行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.productLineList.length; i++){
          if($scope.productLineList[i].productLineId == index){
            $scope.currentData = $scope.productLineList[i];
            $scope.currentData.model = getModelByID($scope.currentData.equipmentModelId);
            getProCity($scope.currentData.province);
            if($scope.currentData.longitude!=null && $scope.currentData.latitude!=null){
              $scope.marker2.setPosition([$scope.currentData.longitude,$scope.currentData.latitude]);
            }else{
              $scope.marker2.setPosition([116,39]);
            }
            $('.form_date1').timepicker('setTime',$scope.currentData.morningShiftStartTime);
            $('.form_date2').timepicker('setTime',$scope.currentData.morningShiftEndTime);
            $('.form_date3').timepicker('setTime',$scope.currentData.middleShiftStartTime);
            $('.form_date4').timepicker('setTime',$scope.currentData.middleShiftEndTime);
            $('.form_date5').timepicker('setTime',$scope.currentData.nightShiftStartTime);
            $('.form_date6').timepicker('setTime',$scope.currentData.nightShiftEndTime);
          }
        }
        $('#myModal_updateProductLine').modal();
      }
    };
    $scope.deleteProductLine = function() {
        var checked = 0;
        $scope.deletelist = [];
        angular.forEach($scope.checkboxes.items, function(value,key) {
          if(value){
            checked += 1;
            let tempdata={};
            for(var i=0; i< $scope.productLineList.length; i++){
              if($scope.productLineList[i].productLineId == key){
                tempdata = $scope.productLineList[i];
                $scope.deletelist.push(tempdata);
                break;
              }
            }
          }
        });
        if(checked == 0){
          $scope.message = '请至少选择一个产线';
          $('#myModal_alert').modal();
        }else{
          let tempstr = '';
          for(var i=0; i< $scope.deletelist.length; i++){
            tempstr =tempstr+ $scope.deletelist[i].name;
            tempstr =tempstr+ ' ';
          }
          tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个产线';
          $scope.deletestr = tempstr;
          $('#myModal_deleteProductLine').modal();
        }
    };
    $scope.saveCreateProductLine = function(){
      $('#imagePath').val($scope.uuid);

      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写产线名称';
        $('#myModal_alert').modal();
      }else{
          // $('#myModal_createProductLine').modal('hide');
          createProductLineImpl();
      }
    };
    $scope.saveDeleteProductLine = function() {
        // $('#myModal_deleteProductLine').modal("hide");
        $scope.isShowmap = false;
        deleteProductLineImpl();
    };
    $scope.saveUpdateProductLine = function(){
      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写产线名称';
        $('#myModal_alert').modal();
      }else{
          // $('#myModal_updateProductLine').modal('hide');
          $scope.isShowmap = false;
          updateProductLineImpl();
      }
    };

    $scope.updateModel=function(){
      $scope.currentData.equipmentModelId = $scope.currentData.model.equipmentModelId;

    };

    $scope.changeImageUpdate = function(){
      $scope.uuid = '';
      $scope.currentData.imagesrc = '';
      $scope.showUploader = true;
    }

    $scope.openStatusModal = function(param){
      //产线启停
        $scope.currentData = param;
        if(param.collectStatus == "Working"){
          $scope.status ="已开启";
          $scope.statusAction = "停止";
        }else {
          $scope.status ="已停止";
          $scope.statusAction = "开启";
        }
        $('#myModal_status').modal();
    };
    $scope.changeStatus = function(){
      $('#myModal_status').modal('hide');
      param = {};
      param.ids=$scope.currentData.productLineId;
      if($scope.statusAction == '开启'){
        deviceApi.startCollect(param)
          .then(function(result) {
            if(result.data.code == 1) {
              $scope.message="产线开启成功！";
              $('#myModal_alert').modal();
              getProductLineList();
            }else {
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
          }, function(err) {
              console.log('startCollectErr',err);
          });

      }else if($scope.statusAction == '停止'){
        deviceApi.stopCollect(param)
          .then(function(result) {
            if(result.data.code == 1) {
              $scope.message="产线停止成功！";
              $('#myModal_alert').modal();
              getProductLineList();
            }else {
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
          }, function(err) {
              console.log('stopCollectErr',err);
          });
      }
    };
    $scope.showProductLineDetail = function(param){
      console.log('showProductLineDetail',param);
      $scope.currentData = param;
      $('#myModal_ProductLineDetail').modal();
    };
    $scope.disShowProductLineDetail = function(){
      $('#myModal_ProductLineDetail').modal('hide');
    };
    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.productLineList, function(item) {
        $scope.checkboxes.items[item.productLineId] = value;
      });
    });
    // watch for data checkboxes
    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.productLineList.length;
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
      // getdeviceModellist();
      getProductLineList();
      getCityData();
      $scope.modellist = sharedataApi.getModeldata();
      $('.form_date1').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.morningShiftStartTime = e.time.value;
      });
      $('.form_date2').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.morningShiftEndTime = e.time.value;
      });

      $('.form_date3').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.middleShiftStartTime = e.time.value;
      });
      $('.form_date4').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.middleShiftEndTime = e.time.value;
      });
      $('.form_date5').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.nightShiftStartTime = e.time.value;
      });
      $('.form_date6').timepicker({
           minuteStep: 5,
           showInputs: false,
           disableFocus: true,
           showMeridian: false,
           defaultTime: false
      }).on('hide.timepicker', function (e) {
          $scope.currentData.nightShiftEndTime = e.time.value;
      });

      // $timeout(getProductLineList(),1000);

      galleryUploader = new qq.FineUploader(
          {
              element : document.getElementById("fine-uploader-gallery"),
              template : 'qq-template-gallery',
              request : {
                  endpoint : uploaderUrl+'/fd/upload',
                  params : {
                      kuyunModule : "eam"
                  }
              },
              thumbnails : {
                  placeholders : {
                      waitingPath : '../assets/global/plugins/fine-uploader/placeholders/waiting-generic.png',
                      notAvailablePath : '../assets/global/plugins/fine-uploader/placeholders/not_available-generic.png'
                  }
              },
              multiple: false,
              validation : {
                  allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                  sizeLimit: 512000, //不能大于500K
                  itemLimit:1
              },
              chunking : {
                  enabled : true,
                  concurrent : {
                      enabled : true
                  },
                  success : {
                      endpoint : uploaderUrl+'/fd/uploadDone'
                  },
                  mandatory : true
              },
              deleteFile : {
                  enabled : true,
                  forceConfirm : true,
                  endpoint : uploaderUrl+'/fd/delete',
                  confirmMessage:'确定要删除文件{filename}吗？',
                  deletingFailedText:'删除失败！'
              },
              cors : {
                  //all requests are expected to be cross-domain requests
                  expected : true,

                  //if you want cookies to be sent along with the request
                  sendCredentials : true
              },
              messages: {
                  typeError: "{file} has an invalid extension. Valid extension(s): {extensions}.",
                  sizeError: "{file} 文件太大，文件大小小于{sizeLimit}.",
                  minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
                  emptyError: "{file} is empty, please select files again without it.",
                  noFilesError: "No files to upload.",
                  tooManyItemsError: "您上传了 ({netItems}) 张图片.  只允许上传 {itemLimit}张.",
                  maxHeightImageError: "Image is too tall.",
                  maxWidthImageError: "Image is too wide.",
                  minHeightImageError: "Image is not tall enough.",
                  minWidthImageError: "Image is not wide enough.",
                  retryFailTooManyItems: "Retry failed - you have reached your file limit.",
                  onLeave: "The files are being uploaded, if you leave now the upload will be canceled.",
                  unsupportedBrowserIos8Safari: "Unrecoverable error - this browser does not permit file uploading of any kind due to serious bugs in iOS8 Safari.  Please use iOS8 Chrome until Apple fixes these issues."
              },
              callbacks: {
                  onComplete: function(id, name, responseJSON) {
                    $scope.showUploader = false;
                  },
                  onUploadChunk: function(id, name, chunkData) {
                    $scope.uuid = galleryUploader.getUuid(0);
                  },
                  onUploadChunkSuccess: function(id, chunkData, responseJSON) {
                    $scope.currentData.imagePath = $scope.uuid;
                    $scope.currentData.imagesrc = uploaderUrl+'/files/'+$scope.uuid;

                  },
              }

          });

      galleryUpdate = new qq.FineUploader(
          {
              element : document.getElementById("fine-uploader-gallery-update"),
              template : 'qq-template-gallery-update',
              request : {
                  endpoint : uploaderUrl+'/fd/upload',
                  params : {
                      kuyunModule : "eam"
                  }
              },
              thumbnails : {
                  placeholders : {
                      waitingPath : '../assets/global/plugins/fine-uploader/placeholders/waiting-generic.png',
                      notAvailablePath : '../assets/global/plugins/fine-uploader/placeholders/not_available-generic.png'
                  }
              },
              multiple: false,
              validation : {
                  allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                  sizeLimit: 512000, //不能大于500K
                  itemLimit:1
              },
              chunking : {
                  enabled : true,
                  concurrent : {
                      enabled : true
                  },
                  success : {
                      endpoint : uploaderUrl+'/fd/uploadDone'
                  },
                  mandatory : true
              },
              deleteFile : {
                  enabled : true,
                  forceConfirm : true,
                  endpoint : uploaderUrl+'/fd/delete',
                  confirmMessage:'确定要删除文件{filename}吗？',
                  deletingFailedText:'删除失败！'
              },
              cors : {
                  //all requests are expected to be cross-domain requests
                  expected : true,

                  //if you want cookies to be sent along with the request
                  sendCredentials : true
              },
              messages: {
                typeError: "{file} has an invalid extension. Valid extension(s): {extensions}.",
                sizeError: "{file} 文件太大，文件大小小于{sizeLimit}.",
                minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
                emptyError: "{file} is empty, please select files again without it.",
                noFilesError: "No files to upload.",
                tooManyItemsError: "您上传了 ({netItems}) 张图片.  只允许上传 {itemLimit}张.",
                maxHeightImageError: "Image is too tall.",
                maxWidthImageError: "Image is too wide.",
                minHeightImageError: "Image is not tall enough.",
                minWidthImageError: "Image is not wide enough.",
                retryFailTooManyItems: "Retry failed - you have reached your file limit.",
                onLeave: "The files are being uploaded, if you leave now the upload will be canceled.",
                unsupportedBrowserIos8Safari: "Unrecoverable error - this browser does not permit file uploading of any kind due to serious bugs in iOS8 Safari.  Please use iOS8 Chrome until Apple fixes these issues."
              },
              callbacks: {
                  onComplete: function(id, name, responseJSON) {
                    $scope.showUploader = false;
                  },
                  onUploadChunk: function(id, name, chunkData) {
                    // $scope.uuid = galleryUpdate.getUuid(0);
                    // $scope.currentData.imagesrc = uploaderUrl+'/files/'+uuid;

                  },
                  onUploadChunkSuccess: function(id, chunkData, responseJSON) {
                    $scope.uuid = galleryUpdate.getUuid(0);
                    console.log('success',$scope.uuid);
                    $scope.currentData.imagePath = $scope.uuid;
                    $scope.currentData.imagesrc = uploaderUrl+'/files/'+$scope.uuid;

                  },
              }
          });

    });


    // function getdeviceModellist(){
    //   deviceApi.getdeviceModellist('asc',0,100)
    //     .then(function(result) {
    //       if(result.data.total > 0) {
    //           $scope.selectedmodel=result.data.rows[0];
    //           $scope.modellist=result.data.rows;
    //       }else {
    //         $scope.modellist=[];
    //       }
    //     });
    // }

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

    // function getModelnameById(id) {
    //   for(var i=0; i<$scope.modellist.length; i++){
    //     if($scope.modellist[i].equipmentModelId == id){
    //       var name = $scope.modellist[i].name
    //       return name;
    //       break;
    //     }
    //   }
    // }

    function getProductLineList() {
      $scope.productLineList = [];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getProductLineList('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.productLineList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.productLineList[i].imagesrc = uploaderUrl+'/files/'+$scope.productLineList[i].imagePath;
                       $scope.productLineList[i].createTime = changeTimeFormat($scope.productLineList[i].createTime);

                       if($scope.productLineList[i].imagePath ==''|| $scope.productLineList[i].imagePath ==null){
                          $scope.productLineList[i].imagesrc = "../assets/pages/media/works/img7.jpg";
                       }
                       if($scope.productLineList[i].collectStatus == "Working"){
                         $scope.productLineList[i].turnpic="../assets/pages/img/turn-on2.png"
                       }else{
                         $scope.productLineList[i].turnpic="../assets/pages/img/turn-off2.png"
                       }
                       if($scope.productLineList[i].isOnline == true){
                         $scope.productLineList[i].isOnlinelabel="在线"
                       }else{
                         $scope.productLineList[i].isOnlinelabel="离线"
                       }
                     }
                }else {
                  $scope.productLineList=[];
                }
                params.total(result.data.total);
                return $scope.productLineList;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }




    function createProductLineImpl() {
      var params={};
      // params.userId = 1;
      params.name = $scope.currentData.name;
      params.imagePath = $('#imagePath').val();
      params.longitude = Math.round(document.getElementById("formlongitude1").value);
      params.latitude = Math.round(document.getElementById("formlatitude1").value);
      params.morningShiftStartTime = $scope.currentData.morningShiftStartTime;
      params.morningShiftEndTime = $scope.currentData.morningShiftEndTime;
      params.middleShiftStartTime = $scope.currentData.middleShiftStartTime;
      params.middleShiftEndTime = $scope.currentData.middleShiftEndTime;
      params.nightShiftStartTime = $scope.currentData.nightShiftStartTime;
      params.nightShiftEndTime = $scope.currentData.nightShiftEndTime;
      params.province = $scope.currentData.province;
      params.city = $scope.currentData.city;
      params.grm = $scope.currentData.grm;
      params.grmPassword = $scope.currentData.grmPassword;
      params.grmPeriod = $scope.currentData.grmPeriod;
      deviceApi.createProductLine(params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="创建产线成功！";
              $('#myModal_createProductLine').modal('hide');
              $('#myModal_alert').modal();
              getProductLineList();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('createDeviceerr',err);
        });
    };
    function updateProductLineImpl() {
      var params ={};
      params.id = $scope.currentData.productLineId;
      params.name = $scope.currentData.name;
      params.imagePath = $scope.currentData.imagePath;
      params.longitude = Math.round(document.getElementById("formlongitude2").value);
      params.latitude = Math.round(document.getElementById("formlatitude2").value);
      params.morningShiftStartTime = $scope.currentData.morningShiftStartTime;
      params.morningShiftEndTime = $scope.currentData.morningShiftEndTime;
      params.middleShiftStartTime = $scope.currentData.middleShiftStartTime;
      params.middleShiftEndTime = $scope.currentData.middleShiftEndTime;
      params.nightShiftStartTime = $scope.currentData.nightShiftStartTime;
      params.nightShiftEndTime = $scope.currentData.nightShiftEndTime;
      params.province = $scope.currentData.province;
      params.city = $scope.currentData.city;
      params.grm = $scope.currentData.grm;
      params.grmPassword = $scope.currentData.grmPassword;
      params.grmPeriod = $scope.currentData.grmPeriod;
      deviceApi.updateProductLine(params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="编辑产线成功！";
              $('#myModal_updateProductLine').modal('hide');
              $('#myModal_alert').modal();
              getProductLineList();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('updateProductLineerr',err);
        });

    }
    function deleteProductLineImpl() {
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].productLineId+'-';
      }
      deviceApi.deleteProductLine(ids)
        .then(function(result){
            if(result.data.code ==1 ){
                $scope.message = '产线删除成功';
                $('#myModal_deleteProductLine').modal("hide");
                $('#myModal_alert').modal();
                getProductLineList();
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
