angular.module('MetronicApp').controller('TrainingVideoController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.trainingVideoList = [];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.showUploader = false;//UPDATE 界面中 更新图片
    $scope.uuid = '';
    var galleryUploader;
    var galleryUpdate;
    var uploaderUrl = sharedataApi.getUploaderUrl();


    //操作按钮事件
    $scope.addTrainingVideo = function() {
      $('#myModal_createTrainingVideo').modal();
    };
    $scope.updateTrainingVideo = function() {
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个培训视频';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个培训视频行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.trainingVideoList.length; i++){
          if($scope.trainingVideoList[i].id == index){
            $scope.currentData = $scope.trainingVideoList[i];
            break;
          }
        }
        $('#myModal_updateTrainingVideo').modal();
      }
    };
    $scope.deleteTrainingVideo = function() {
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.trainingVideoList.length; i++){
            if($scope.trainingVideoList[i].id == key){
              tempdata = $scope.trainingVideoList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请至少选择一个培训视频';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].title;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个培训视频';
        $scope.deletestr = tempstr;
        $('#myModal_deleteTrainingVideo').modal();
      }
    };
    //modal取消事件
    $scope.createDismiss = function(){
      $('#myModal_createTrainingVideo').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updateTrainingVideo').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deleteTrainingVideo').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    //modal确定事件
    $scope.saveCreateTrainingVideo = function(){
      $('#path').val($scope.uuid);

        if(!$scope.currentData.hasOwnProperty("title") || $scope.currentData.title == ''){
            alert('必须填写标题');
        }else if(!$scope.currentData.hasOwnProperty("description")  || $scope.currentData.description == ''){
            alert('必须填写描述');
        }else{
            $('#myModal_createTrainingVideo').modal('hide');
            createTrainingVideoImpl();
        }
    };
    $scope.saveUpdateTrainingVideo = function(){
      if(!$scope.currentData.hasOwnProperty("title") || $scope.currentData.title == ''){
          alert('必须填写标题');
      }else if(!$scope.currentData.hasOwnProperty("description")  || $scope.currentData.description == ''){
          alert('必须填写描述');
      }else{
          $('#myModal_updateTrainingVideo').modal('hide');
          updateTrainingVideoImpl();
      }
    };

    $scope.saveDeleteTrainingVideo = function(){
      $('#myModal_deleteTrainingVideo').modal('hide');
      deleteTrainingVideoImpl();
    };

    $scope.$on('$viewContentLoaded', function() {
      getTrainingVideoList();

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
                  //allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                  //sizeLimit: 512000, //不能大于500K
                  //itemLimit:1
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
                    $scope.currentData.path = $scope.uuid;
                    $scope.currentData.pathURI = uploaderUrl+'/files/'+$scope.uuid;

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
                  //allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                  //sizeLimit: 512000, //不能大于500K
                  //itemLimit:1
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
                tooManyItemsError: "您上传了 ({netItems}) 个视频.  只允许上传 {itemLimit}个.",
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
                    // $scope.currentData.pathURI = uploaderUrl+'/files/'+uuid;

                  },
                  onUploadChunkSuccess: function(id, chunkData, responseJSON) {
                    $scope.uuid = galleryUpdate.getUuid(0);
                    console.log('success',$scope.uuid);
                    $scope.currentData.path = $scope.uuid;
                    $scope.currentData.pathURI = uploaderUrl+'/files/'+$scope.uuid;

                  },
              }
          });
    });


    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.trainingVideoList, function(item) {
        $scope.checkboxes.items[item.id] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.trainingVideoList.length;
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

    function getTrainingVideoList() {
        $scope.trainingVideoList = [];
        $scope.checkboxes.checked = false;
        $scope.checkboxes.items = {};

        $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
        }, {
          counts:[2,10,50],
          getData: function(params) {
            return deviceApi.getTrainingVideoList('asc', (params.page()-1)*params.count(), params.count())
              .then(function(result) {
                  if(result.data.total > 0) {
                       $scope.trainingVideoList=result.data.rows;
                       for(var i=0;i<result.data.rows.length;i++) {
                         $scope.trainingVideoList[i].pathURI = uploaderUrl+'/files/'+$scope.trainingVideoList[i].path;
                       }
                  }else {
                    $scope.trainingVideoList=[];
                  }
                  params.total(result.data.total);
                  return $scope.trainingVideoList;
              }, function(err) {
                console.log('获取培训视频列表err',err);
              });
          }
        });
        $scope.tableParams.reload();
    }

    function createTrainingVideoImpl() {
      var params={};
      params.title = $scope.currentData.title;
      params.description = $scope.currentData.description;
      params.tag = $scope.currentData.tag;
      params.path = $scope.currentData.path;

      deviceApi.createTrainingVideo(params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '新建培训视频成功！';
                $('#myModal_alert').modal();
                getTrainingVideoList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('培训视频列表获取err', err);
          });
    }

    function updateTrainingVideoImpl(){
      var params={};
      params.title = $scope.currentData.title;
      params.description = $scope.currentData.description;
      params.tag = $scope.currentData.tag;
      params.path = $scope.currentData.path;
      //hidden
      params.companyId = $scope.currentData.companyId;
      params.createUserId = $scope.currentData.createUserId;
      params.createTime = $scope.currentData.createTime;

      deviceApi.updateTrainingVideo($scope.currentData.id,params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '培训视频修改成功！';
                $('#myModal_alert').modal();
                getTrainingVideoList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('培训视频修改err', err);
          });
    }

    function deleteTrainingVideoImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].id+'::';
      }
      deviceApi.deleteTrainingVideo(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '培训视频删除成功！';
            $('#myModal_alert').modal();
            getTrainingVideoList();
          }else{
            $scope.message = result.data.message;
            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('培训视频删除err',err);
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

    $scope.changeImageUpdate = function(){
      $scope.uuid = '';
      $scope.currentData.pathURI = '';
      $scope.showUploader = true;
    }

}]);
