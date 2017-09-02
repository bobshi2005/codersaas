angular.module('MetronicApp').controller('PartController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.partCategoryList = [];
    $scope.partList = [];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };
    //操作按钮事件
    $scope.addPart = function() {
      $('#myModal_createPart').modal();
    };
    $scope.updatePart = function() {
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个配件';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个配件类行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.partList.length; i++){
          if($scope.partList[i].partId == index){
            $scope.currentData = $scope.partList[i];
            $scope.currentData.partCategory = getCategoryById($scope.currentData.categoryId);
            break;
          }
        }
        $('#myModal_updatePart').modal();
      }
    };
    $scope.deletePart = function() {
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.partList.length; i++){
            if($scope.partList[i].partId == key){
              tempdata = $scope.partList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请至少选择一个配件';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个配件';
        $scope.deletestr = tempstr;
        $('#myModal_deletePart').modal();
      }
    };
    //modal取消事件
    $scope.createDismiss = function(){
      $('#myModal_createPart').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updatePart').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deletePart').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    //modal确定事件
    $scope.saveCreatePart = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            alert('必须填写配件名称');
        }else if(!$scope.currentData.hasOwnProperty("partCategory")  || $scope.currentData.partCategory == ''){
            alert('必须填写规格');
        }else if(!$scope.currentData.hasOwnProperty("spec")  || $scope.currentData.spec == ''){
            alert('必须填写规格');
        }else if(!$scope.currentData.hasOwnProperty("model")  || $scope.currentData.model == ''){
            alert('必须填写型号');
        }else if(!$scope.currentData.hasOwnProperty("unit")  || $scope.currentData.unit == ''){
            alert('必须填写单位');
        }else if(!$scope.currentData.hasOwnProperty("brand")  || $scope.currentData.brand == '') {
            alert('必须填写品牌');
        }else{
            $('#myModal_createPart').modal('hide');
            createPartImpl();
        }
    };
    $scope.saveUpdatePart = function(){
      if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
          alert('必须填写配件名称');
      }else if(!$scope.currentData.hasOwnProperty("partCategory")  || $scope.currentData.partCategory == ''){
          alert('必须填写规格');
      }else if(!$scope.currentData.hasOwnProperty("spec")  || $scope.currentData.spec == ''){
          alert('必须填写规格');
      }else if(!$scope.currentData.hasOwnProperty("model")  || $scope.currentData.model == ''){
          alert('必须填写型号');
      }else if(!$scope.currentData.hasOwnProperty("unit")  || $scope.currentData.unit == ''){
          alert('必须填写单位');
      }else if(!$scope.currentData.hasOwnProperty("brand")  || $scope.currentData.brand == '') {
          alert('必须填写品牌');
      }else{
          $('#myModal_updatePart').modal('hide');
          updatePartImpl();
      }
    };

    $scope.saveDeletePart = function(){
      $('#myModal_deletePart').modal('hide');
      deletePartImpl();
    };

    $scope.$on('$viewContentLoaded', function() {
      getPartCategoryList();
      getPartList();
    });
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
      }, function(value) {
      angular.forEach($scope.partList, function(item) {
        $scope.checkboxes.items[item.partId] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.partList.length;
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

    //定义方法
    function getPartCategoryList(){
        deviceApi.getPartCategoryList('asc',0,100)
            .then(function(result) {
                if(result.data.total > 0) {
                    $scope.partCategoryList=result.data.rows;
                }else {
                    $scope.partCategoryList=[];
                }
            })
    }

    function getCategoryById(id) {
        var obj = {};
        for(var i=0; i<$scope.partCategoryList.length; i++){
            if($scope.partCategoryList[i].categoryId == id){
                obj = $scope.partCategoryList[i]
                break;
            }
        }
        return obj;
    }

    function getPartList() {
        $scope.partList = [];
        $scope.checkboxes.checked = false;
        $scope.checkboxes.items = {};

        $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
        }, {
          counts:[2,10,50],
          getData: function(params) {
            return deviceApi.getPartList('asc', (params.page()-1)*params.count(), params.count())
              .then(function(result) {
                  if(result.data.total > 0) {
                       $scope.partList=result.data.rows;
                       for(var i=0;i<result.data.rows.length;i++) {
                         $scope.partList[i].updateTime = changeTimeFormat($scope.partList[i].updateTime);
                         $scope.partList[i].createTime = changeTimeFormat($scope.partList[i].createTime);
                       }
                  }else {
                    $scope.partList=[];
                  }
                  params.total(result.data.total);
                  return $scope.partList;
              }, function(err) {
                console.log('获取配件列表err',err);
              });
          }
        });
        $scope.tableParams.reload();
    }

    function createPartImpl() {
      var params={};
      params.name = $scope.currentData.name;
      params.spec = $scope.currentData.spec;
      params.model = $scope.currentData.model;
      params.unit = $scope.currentData.unit;
      params.brand = $scope.currentData.brand;
      params.categoryId = $scope.currentData.partCategory.categoryId;

      deviceApi.createPart(params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '新建配件成功！';
                $('#myModal_alert').modal();
                getPartList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('配件列表获取err', err);
          });
    }

    function updatePartImpl(){
      var params={};
      params.name = $scope.currentData.name;
      params.spec = $scope.currentData.spec;
      params.model = $scope.currentData.model;
      params.unit = $scope.currentData.unit;
      params.brand = $scope.currentData.brand;
      params.categoryId = $scope.currentData.partCategory.categoryId;

      deviceApi.updatePart($scope.currentData.partId,params)
          .then(function(result){
              if(result.data.code == 1 ){
                $scope.message = '配件修改成功！';
                $('#myModal_alert').modal();
                getPartList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('配件修改err', err);
          });
    }

    function deletePartImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].partId+'-';
      }
      deviceApi.deletePart(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '配件删除成功！';
            $('#myModal_alert').modal();
            getPartList();
          }else{
            $scope.message = result.data.message;
            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('配件删除err',err);
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
