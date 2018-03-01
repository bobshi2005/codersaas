angular.module('MetronicApp').controller('EquipmentManageController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element','$compile','$state','$stateParams', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element,$compile,$state,$stateParams) {
    $rootScope.menueName = 'sidebar-asset';

    $scope.productLineId = $stateParams.productLine.productLineId;
    $scope.deletelist = [];
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.message = ''; // 自定义消息提示内容
    $scope.equipmentList = [];//设备列表
    $scope.dataGroupList =[];//数据分组数据
    $scope.unselectedDataGroupList=[];
    $scope.equipmentId ='';
    $scope.currentData = {};
    $scope.linedataElements=[]; //设备的数据点列表
    $scope.showUploader = false;//UPDATE 界面中 更新图片
    $scope.uuid = '';
    var galleryUploader;
    var galleryUpdate;
    var uploaderUrl = sharedataApi.getUploaderUrl();

    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    $scope.checkboxes2 = {
      checked: false,
      items: {}
    };
    $scope.checkboxes3 = {
      checked: false,
      items: {}
    };

    $scope.discreate = function(){
        $('#myModal_createEquipment').modal('hide');
    };
    $scope.disdelete = function(){
        $('#myModal_deleteEquipment').modal('hide');
    };
    $scope.disupdate = function(){
      $('#myModal_updateEquipment').modal('hide');
    };
    $scope.disalert = function(){
        $('#myModal_alert').modal('hide')
    };
    $scope.createEquipment = function() {
      $scope.currentData = [];
      getEquipmentCategoryList();

    };
    $scope.updateEquipment = function() {
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
        $scope.message = '只能选择一个设备行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.equipmentList.length; i++){
          if($scope.equipmentList[i].equipmentId == index){
            $scope.currentData = $scope.equipmentList[i];
            $scope.equipmentCategory = getEquipmentCategoryById($scope.equipmentList[i].equipmentCategoryId);
          }
        }
        $('#myModal_updateEquipment').modal();
      }
    };
    $scope.deleteEquipment = function() {
        var checked = 0;
        $scope.deletelist = [];
        angular.forEach($scope.checkboxes.items, function(value,key) {
          if(value){
            checked += 1;
            let tempdata={};
            for(var i=0; i< $scope.equipmentList.length; i++){
              if($scope.equipmentList[i].equipmentId == key){
                tempdata = $scope.equipmentList[i];
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
          $('#myModal_deleteEquipment').modal();
        }
    };
    $scope.saveCreateEquipment = function(){
      $('#imagePath').val($scope.uuid);

      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写设备名称';
        $('#myModal_alert').modal();
      }else if(!$scope.equipmentCategory.equipmentCategoryId){
        $scope.message = '必须选择设备类型';
        $('#myModal_alert').modal();
      }else if($scope.equipmentCategory.name =='产线'){
        $scope.message = '设备类型不能是产线';
        $('#myModal_alert').modal();
      }else{
          createEquipmentImpl();
      }
    };
    $scope.saveDeleteEquipment = function() {
        deleteEquipmentImpl();
    };
    $scope.saveUpdateEquipment = function(){
      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
        $scope.message = '必须填写设备名称';
        $('#myModal_alert').modal();
      }else if(!$scope.equipmentCategory.equipmentCategoryId){
        $scope.message = '必须选择设备类型';
        $('#myModal_alert').modal();
      }else if($scope.equipmentCategory.name =='产线'){
        $scope.message = '设备类型不能是产线';
        $('#myModal_alert').modal();
      }else{
          updateEquipmentImpl();
      }
    };
    $scope.changeImageUpdate = function(){
      $scope.uuid = '';
      $scope.currentData.imagesrc = '';
      $scope.showUploader = true;
    };
    $scope.showDataGroupDetail = function(param){
      $scope.equipmentId = param.equipmentId;
      getDataGroupList($scope.equipmentId);
      $('#myModal_dataGroupDetail').modal();
    };
    $scope.disShowDataGroup = function(){
      $('#myModal_dataGroupDetail').modal('hide');
    };
    $scope.showAddDataGroup = function(){
      getUnselectedDataGroupList($scope.equipmentId);
    };
    $scope.showRemoveDataGroup = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes2.items, function(value,key) {
        if(value){
          checked += 1;
          for(var i=0; i< $scope.dataGroupList.length; i++){
            if($scope.dataGroupList[i].id == key){
              var tempdata = $scope.dataGroupList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请至少选择一个数据组';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].dataGroupName;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个数据组';
        $scope.deletestr = tempstr;
        $('#myModal_removeDataGroup').modal();
      }

    };
    $scope.saveAddDataGroup = function(){
      var checked=0,ids='';
      angular.forEach($scope.checkboxes3.items, function(value,key) {
        if(value){
          checked += 1;
          ids+=key+'::';
        }
      });
      if(checked == 0){
        $scope.message = '没有选择数据组！'
        $('#myModal_alert').modal();
      }else{
        saveAddDataGroupImp(ids);
      }
    };
    $scope.saveRemoveDataGroup = function(){
      var checked=0,ids='';
      angular.forEach($scope.checkboxes2.items, function(value,key) {
        if(value){
          checked += 1;
          ids+=key+'-';
        }
      });
      if(checked == 0){
        $scope.message = '没有选择数据组！'
        $('#myModal_alert').modal();
      }else{
        saveRemoveDataGroupImp(ids);
      }
    };
    $scope.editDataGroupElements = function(){
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes2.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个数据组';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个数据组行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.dataGroupList.length; i++){
          if($scope.dataGroupList[i].id == index){
            $scope.currentData = $scope.dataGroupList[i];
          }
        }
        getDataGroupElements($scope.currentData.equipmentId,$scope.currentData.dataGroupId,$scope.currentData.id);
      }
    };
    $scope.disSlectetElements = function(){
      // $('#dataGroupElements_selector').multiSelect('clear');
      $('#myModal_DataGroupSelectData').modal('hide');
    };
    $scope.saveSlectetElements = function(){
      var idArr=$('#dataGroupElements_selector').val();
      var ids='';
      for(var i=0;i<idArr.length;i++){
        ids+=idArr[i]+'::';
      }
      console.log('isd',ids,$scope.currentData,idArr);
      saveSlectetElementsImp(ids);
    };
    $scope.disAddDataGroup = function(){
      $('#myModal_addDataGroup').modal('hide');
    };
    $scope.disRemoveDataGroup = function(){
      $('#myModal_removeDataGroup').modal('hide');
    };
    $scope.goback = function(){
      $state.go('main.asset.productmanage')
    };

    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.equipmentList, function(item) {
        $scope.checkboxes.items[item.equipmentId] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.equipmentList.length;
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

     //datagroup checkbox2监控
     $scope.$watch(function() {
       return $scope.checkboxes2.checked;
       }, function(value) {
       angular.forEach($scope.dataGroupList, function(item) {
         $scope.checkboxes2.items[item.id] = value;
       });
     });

     $scope.$watch(function() {
       return $scope.checkboxes2.items;
       }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.dataGroupList.length;
        angular.forEach($scope.checkboxes2.items, function(item) {
          if(item){
            checked += 1;
          }else{
            unchecked +=1;
          }
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes2.checked = (checked == total && total>0);
        }

        angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
      }, true);
    //checkboxes3监听
    $scope.$watch(function() {
      return $scope.checkboxes3.checked;
      }, function(value) {
      angular.forEach($scope.unselectedDataGroupList, function(item) {
        $scope.checkboxes3.items[item.id] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes3.items;
      }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.unselectedDataGroupList.length;
       angular.forEach($scope.checkboxes3.items, function(item) {
         if(item){
           checked += 1;
         }else{
           unchecked +=1;
         }
     });
     if ((unchecked == 0) || (checked == 0)) {
       $scope.checkboxes3.checked = (checked == total && total>0);
       }

       angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
     }, true);

    $scope.$on('$viewContentLoaded', function() {
      getEquipmentList();

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



    function getEquipmentCategoryList(){
      deviceApi.getEquipmentCategoryList('asc',0,100)
        .then(function(result) {
          if(result.data.total > 0) {
              $scope.equipmentCategory=result.data.rows[0];
              $scope.equipmentCategorylist=result.data.rows;
          }else {
            $scope.equipmentCategorylist=[];
          }
          $('#myModal_createEquipment').modal();
        }, function(err) {
            console.log('getEquipmentCategoryListErr',err);
        });
    }

    function saveSlectetElementsImp(ids){
      deviceApi.confirmElementsforEquipmentDataGroup($scope.currentData.equipmentId,$scope.currentData.dataGroupId,$scope.currentData.id,ids)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="数据点设置成功！";
              $('#myModal_alert').modal();
              $('#myModal_DataGroupSelectData').modal('hide');
              // $('#dataGroupElements_selector').multiSelect('clear');
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('confirmElementsforEquipmentDataGroupErr',err);
        });
    }

    function getDataGroupElements(equipmentId,dataGroupId,id){
      $('#dataGroupElements_selector').multiSelect('clear');
      $("#dataGroupElements_selector").innerHTML = "";
      deviceApi.getElementsListforEquipmentDataGroup(equipmentId,dataGroupId,id,'asc')
        .then(function(result) {
          if(result.data.rows) {
              $scope.dataGroupElements=result.data.rows;
              console.log('dataGroupElements',$scope.dataGroupElements);

              for(var i=0;i<$scope.dataGroupElements.length;i++){
                var x = $scope.dataGroupElements[i];
                console.log('i',x.checked);
                if(x.checked){
                  var optionhtml='<option  value="'+x.id+'" selected>'+x.lableName+'</option>';
                }else{
                  var optionhtml='<option  value="'+x.id+'">'+x.lableName+'</option>';
                }
                console.log('selector_template',optionhtml);
                var template = angular.element(optionhtml);

                var mobileDialogElement = $compile(template)($scope);
                angular.element("#dataGroupElements_selector").append(mobileDialogElement);
              }
              console.log('innerhtml',$("#dataGroupElements_selector"));
              $('#dataGroupElements_selector').multiSelect({
                selectableHeader: "<div class='custom-header'>可选数据点</div>",
                selectionHeader: "<div class='custom-header'>已选数据点</div>",
              });
              $('#dataGroupElements_selector').multiSelect('refresh');
              $('#myModal_DataGroupSelectData').modal();
          }else {
            $scope.dataGroupElements=[];
          }
          $('#myModal_DataGroupSelectData').modal();

        }, function(err) {
            console.log('getElementsListforEquipmentDataGroupErr',err);
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

    function getEquipmentList() {
      $scope.equipmentList = [];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};
      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getProductLineEquipmentsList($scope.productLineId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.equipmentList=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.equipmentList[i].imagesrc = uploaderUrl+'/files/'+$scope.equipmentList[i].imagePath;
                       $scope.equipmentList[i].createTime = changeTimeFormat($scope.equipmentList[i].createTime);

                       if($scope.equipmentList[i].imagePath ==''|| $scope.equipmentList[i].imagePath ==null){
                          $scope.equipmentList[i].imagesrc = "../assets/pages/media/works/img7.jpg";
                       }
                     }
                }else {
                  $scope.equipmentList=[];
                }
                params.total(result.data.total);
                return $scope.equipmentList;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }

    function getUnselectedDataGroupList(equipmentId){
      $scope.checkboxes3.checked = false;
      $scope.checkboxes3.items = {};
      deviceApi.getUnselectedDataGroupListByEquipmentId(equipmentId,'asc')
        .then(function(result) {
            if(result.data.rows) {
                 $scope.unselectedDataGroupList=result.data.rows;
            }else {
              $scope.unselectedDataGroupList=[];
            }
            $scope.dataGroup = new NgTableParams({},
                 {
                   counts:[],
                   dataset:$scope.unselectedDataGroupList
                 }
            );
            $('#myModal_addDataGroup').modal();
        }, function(err) {
          $scope.unselectedDataGroupList=[];
          $scope.dataGroup = new NgTableParams({},
               {
                 counts:[],
                 dataset:$scope.unselectedDataGroupList
               }
          );
          console.log('getUnselectedDataGroupListErr',err);
        });
    }

    function getDataGroupList(equipmentId) {
      $scope.dataGroupList = [];
      $scope.checkboxes2.checked = false;
      $scope.checkboxes2.items = {};
      $scope.equipmentDataGroup = new NgTableParams({
        page: 1,
        count:5
      }, {
        counts:[5,10],
        getData: function(params) {
          return deviceApi.getSelectedDataGroupListByEquipmentId(equipmentId,'asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.dataGroupList=result.data.rows;
                }else {
                  $scope.dataGroupList=[];
                }
                params.total(result.data.total);
                return $scope.dataGroupList;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }

    function saveAddDataGroupImp(ids){
      deviceApi.addDataGroupToEquipment($scope.equipmentId,ids)
        .then(function(result){
            if(result.data.code ==1 ){
                $scope.message = '数据分组添加成功';
                $('#myModal_alert').modal();
                $('#myModal_addDataGroup').modal("hide");
                getDataGroupList($scope.equipmentId);
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('addDataGroupToEquipmentErr',err);
        });
    }
    function saveRemoveDataGroupImp(ids){
      deviceApi.removeDataGroupFromEquipment($scope.equipmentId,ids)
        .then(function(result){
            if(result.data.code ==1 ){
                $scope.message = '数据分组移除成功';
                $('#myModal_alert').modal();
                $('#myModal_removeDataGroup').modal("hide");
                getDataGroupList($scope.equipmentId);
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('removeDataGroupFromEquipmentErr',err);
        });
    }
    function createEquipmentImpl() {
      var params={};
      params.name = $scope.currentData.name;
      params.imagePath = $('#imagePath').val();
      params.equipmentCategoryId =$scope.equipmentCategory.equipmentCategoryId;
      params.number = $scope.currentData.number || '';
      params.output = $scope.currentData.output || '';
      params.weight = $scope.currentData.weight || '';
      params.power = $scope.currentData.power || '';
      params.capacity = $scope.currentData.capacity || '';
      params.serialNumber = $scope.currentData.serialNumber || '';
      params.factoryDate = $scope.currentData.factoryDate || '';
      deviceApi.createProductLineEquipment($scope.productLineId,params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="创建设备成功！";
              $('#myModal_createEquipment').modal('hide');
              $('#myModal_alert').modal();
              getEquipmentList();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('createDeviceerr',err);
        });
    };
    function updateEquipmentImpl() {
      var params ={};
      params.id = $scope.currentData.equipmentId;
      params.name = $scope.currentData.name;
      params.imagePath = $('#imagePath').val();
      params.equipmentCategoryId =$scope.equipmentCategory.equipmentCategoryId;
      params.number = $scope.currentData.number || '';
      params.output = $scope.currentData.output || '';
      params.weight = $scope.currentData.weight || '';
      params.power = $scope.currentData.power || '';
      params.capacity = $scope.currentData.capacity || '';
      params.serialNumber = $scope.currentData.serialNumber || '';
      params.factoryDate = $scope.currentData.factoryDate || '';
      deviceApi.updateProductLineEquipment($scope.productLineId,params)
        .then(function(result){
            if(result.data.code ==1 ){
              $scope.message="编辑设备成功！";
              $('#myModal_updateEquipment').modal('hide');
              $('#myModal_alert').modal();
              getEquipmentList();
            }else{
              $scope.message=result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('updateEquipmenterr',err);
        });

    }
    function deleteEquipmentImpl() {
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].equipmentId+'-';
      }
      deviceApi.deleteProductLineEquipment($scope.productLineId,ids)
        .then(function(result){
            if(result.data.code ==1 ){
                $scope.message = '设备删除成功';
                $('#myModal_deleteEquipment').modal("hide");
                $('#myModal_alert').modal();
                getEquipmentList();
            }else{
              $scope.message = result.data.message;
              $('#myModal_alert').modal();
            }
        }, function(err) {
            console.log('deleteerr',err);
        });
    }

}]);
