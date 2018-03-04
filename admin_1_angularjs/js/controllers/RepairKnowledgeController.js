angular.module('MetronicApp').controller('RepairKnowledgeController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.repairKnowledgeList = [];
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
    $scope.addRepairKnowledge = function() {
      $('#myModal_createRepairKnowledge').modal();
    };
    $scope.updateRepairKnowledge = function() {
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个维修知识';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个维修知识行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.repairKnowledgeList.length; i++){
          if($scope.repairKnowledgeList[i].id == index){
            $scope.currentData = $scope.repairKnowledgeList[i];
            break;
          }
        }
        $('#myModal_updateRepairKnowledge').modal();
      }
    };
    $scope.deleteRepairKnowledge = function() {
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.repairKnowledgeList.length; i++){
            if($scope.repairKnowledgeList[i].id == key){
              tempdata = $scope.repairKnowledgeList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请至少选择一个维修知识';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].codes;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个维修知识';
        $scope.deletestr = tempstr;
        $('#myModal_deleteRepairKnowledge').modal();
      }
    };
    //modal取消事件
    $scope.createDismiss = function(){
      $('#myModal_createRepairKnowledge').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updateRepairKnowledge').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deleteRepairKnowledge').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    //modal确定事件
    $scope.saveCreateRepairKnowledge = function(){
      $('#path').val($scope.uuid);

        if(!$scope.currentData.hasOwnProperty("codes") || $scope.currentData.codes == ''){
            alert('必须填写故障代码');
        }else if(!$scope.currentData.hasOwnProperty("description")  || $scope.currentData.description == ''){
            alert('必须填写故障描述');
        }else if(!$scope.currentData.hasOwnProperty("method")  || $scope.currentData.method == ''){
            alert('必须填写解决故障的方法');
        }else{
            $('#myModal_createRepairKnowledge').modal('hide');
            createRepairKnowledgeImpl();
        }
    };
    $scope.saveUpdateRepairKnowledge = function(){
      if(!$scope.currentData.hasOwnProperty("codes") || $scope.currentData.codes == ''){
          alert('必须填写故障代码');
      }else if(!$scope.currentData.hasOwnProperty("description")  || $scope.currentData.description == ''){
          alert('必须填写故障描述');
      }else if(!$scope.currentData.hasOwnProperty("method")  || $scope.currentData.method == ''){
          alert('必须填写解决故障的方法');
      }else{
          $('#myModal_updateRepairKnowledge').modal('hide');
          updateRepairKnowledgeImpl();
      }
    };

    $scope.saveDeleteRepairKnowledge = function(){
      $('#myModal_deleteRepairKnowledge').modal('hide');
      deleteRepairKnowledgeImpl();
    };

    $scope.$on('$viewContentLoaded', function() {
      getRepairKnowledgeList();
    });


    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.repairKnowledgeList, function(item) {
        $scope.checkboxes.items[item.id] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.repairKnowledgeList.length;
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

    function getRepairKnowledgeList() {
        $scope.repairKnowledgeList = [];
        $scope.checkboxes.checked = false;
        $scope.checkboxes.items = {};

        $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
        }, {
          counts:[2,10,50],
          getData: function(params) {
            return deviceApi.getRepairKnowledgeList('asc', (params.page()-1)*params.count(), params.count())
              .then(function(result) {
                  if(result.data.total > 0) {
                       $scope.repairKnowledgeList=result.data.rows;
                       for(var i=0;i<result.data.rows.length;i++) {
                         $scope.repairKnowledgeList[i].pathURI = uploaderUrl+'/files/'+$scope.repairKnowledgeList[i].path;
                       }
                  }else {
                    $scope.repairKnowledgeList=[];
                  }
                  params.total(result.data.total);
                  return $scope.repairKnowledgeList;
              }, function(err) {
                console.log('获取维修知识列表err',err);
              });
          }
        });
        $scope.tableParams.reload();
    }

    function createRepairKnowledgeImpl() {
      var params={};
      params.codes = $scope.currentData.codes;
      params.description = $scope.currentData.description;
      params.method = $scope.currentData.method;
      params.tag = $scope.currentData.tag;

      deviceApi.createRepairKnowledge(params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '新建维修知识成功！';
                $('#myModal_alert').modal();
                getRepairKnowledgeList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('维修知识列表获取err', err);
          });
    }

    function updateRepairKnowledgeImpl(){
      var params={};
      params.codes = $scope.currentData.codes;
      params.description = $scope.currentData.description;
      params.method = $scope.currentData.method;
      params.tag = $scope.currentData.tag;
      //hidden
      params.companyId = $scope.currentData.companyId;
      params.createUserId = $scope.currentData.createUserId;
      params.createTime = $scope.currentData.createTime;

      deviceApi.updateRepairKnowledge($scope.currentData.id,params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '维修知识修改成功！';
                $('#myModal_alert').modal();
                getRepairKnowledgeList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('维修知识修改err', err);
          });
    }

    function deleteRepairKnowledgeImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].id+'::';
      }
      deviceApi.deleteRepairKnowledge(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '维修知识删除成功！';
            $('#myModal_alert').modal();
            getRepairKnowledgeList();
          }else{
            $scope.message = result.data.message;
            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('维修知识删除err',err);
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
