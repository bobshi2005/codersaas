angular.module('MetronicApp').controller('PartCategoryController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.partCategoryList = [];
    $scope.currentData = {};
    $scope.message = ''; // alert 提示信息
    $scope.deletelist = [];//删除对象列表
    $scope.deletestr = ''; //删除队列显示字符串
    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.addPartcategory = function(){
      $('#myModal_createPartCategory').modal();
    };
    $scope.updatePartcategory = function(){
      $scope.currentData = {};
      var checked = 0, index = 0;
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          index = key;
          checked += 1;
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个配件类';
        $('#myModal_alert').modal();
      }else if(checked > 1){
        $scope.message = '只能选择一个配件类进行编辑';
        $('#myModal_alert').modal();
      }else{
        for(var i=0; i< $scope.partCategoryList.length; i++){
          if($scope.partCategoryList[i].categoryId == index){
            $scope.currentData = $scope.partCategoryList[i];
            break;
          }
        }
        $('#myModal_updatePartCategory').modal();
      }
    };
    $scope.deletePartcategory = function(){
      var checked = 0;
      $scope.deletelist = [];
      angular.forEach($scope.checkboxes.items, function(value,key) {
        if(value){
          checked += 1;
          let tempdata={};
          for(var i=0; i< $scope.partCategoryList.length; i++){
            if($scope.partCategoryList[i].categoryId == key){
              tempdata = $scope.partCategoryList[i];
              $scope.deletelist.push(tempdata);
              break;
            }
          }
        }
      });
      if(checked == 0){
        $scope.message = '请选择一个配件类';
        $('#myModal_alert').modal();
      }else{
        let tempstr = '';
        for(var i=0; i< $scope.deletelist.length; i++){
          tempstr =tempstr+ $scope.deletelist[i].name;
          tempstr =tempstr+ ' ';
        }
        tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个类别';
        $scope.deletestr = tempstr;
        $('#myModal_deletePartCategory').modal();
      }
    };
    $scope.createDismiss = function(){
      $('#myModal_createPartCategory').modal('hide');
    };
    $scope.updateDismiss = function(){
      $('#myModal_updatePartCategory').modal('hide');
    };
    $scope.deleteDismiss = function(){
      $('#myModal_deletePartCategory').modal('hide');
    };
    $scope.disalert = function(){
      $('#myModal_alert').modal('hide');
    };

    $scope.saveCreatePartCategory = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写类别名称';
            $('#myModal_alert').modal();
        }else{
            createPartCategoryImpl();
        }
    };

    $scope.saveUpdatePartCategory = function(){
        if(!$scope.currentData.hasOwnProperty("name") || $scope.currentData.name == ''){
            $scope.message = '必须填写类别名称';
            $('#myModal_alert').modal();
        }else{
            $('#myModal_updatePartCategory').modal('hide');
            updatePartcategoryImpl();
        }
    };

    $scope.saveDeletePartCategory = function(){
        deletePartcategoryImpl();
        $('#myModal_deletePartCategory').modal('hide');
    };

    $scope.$on('$viewContentLoaded', function() {
        getPartCategoryList();
    });

    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.partCategoryList, function(item) {
        $scope.checkboxes.items[item.categoryId] = value;
      });
    });

    $scope.$watch(function() {
      return $scope.checkboxes.items;
      }, function(values) {
        var checked = 0, unchecked = 0,
        total = $scope.partCategoryList.length;
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

    function getPartCategoryList(){
        $scope.partCategoryList=[];
        $scope.checkboxes.checked = false;
        $scope.checkboxes.items = {};

        $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
        }, {
          counts:[2,10,50],
          getData: function(params) {
            return deviceApi.getPartCategoryList('asc', (params.page()-1)*params.count(), params.count())
              .then(function(result) {
                  if(result.data.total > 0) {
                       $scope.partCategoryList=result.data.rows;
                       for(var i=0;i<result.data.rows.length;i++) {
                         $scope.partCategoryList[i].updateTime = changeTimeFormat($scope.partCategoryList[i].updateTime);
                         $scope.partCategoryList[i].createTime = changeTimeFormat($scope.partCategoryList[i].createTime);
                       }
                  }else {
                    $scope.partCategoryList=[];
                  }
                  params.total(result.data.total);
                  return $scope.partCategoryList;
              }, function(err) {
                console.log('获取配件类列表err',err);
              });
          }
        });
        $scope.tableParams.reload();
    }

    function createPartCategoryImpl() {
      deviceApi.createPartCategory($scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '配件类创建成功！';
                  $('#myModal_alert').modal();
                  getPartCategoryList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
            console.log('配件类创建err',err);
          });
    }

    function updatePartcategoryImpl(){
      deviceApi.updatePartCategory($scope.currentData.categoryId,$scope.currentData.name)
          .then(function(result){
              if(result.data.code == 1 ){
                  $scope.message = '配件类修改成功！';
                  $('#myModal_alert').modal();
                  getPartCategoryList();
              }else{
                $scope.message = result.data.message;
                $('#myModal_alert').modal();
              }
          }, function(err) {
              console.log('配件类更新err',err);
          });
    }

    function deletePartcategoryImpl(){
      var ids='';
      for(var i=0; i< $scope.deletelist.length; i++){
        ids =ids+ $scope.deletelist[i].categoryId+'-';
      }
      deviceApi.deletePartCategory(ids)
      .then(function(result){
          if(result.data.code ==1 ){
            $scope.message = '配件类删除成功！';
            $('#myModal_alert').modal();
            getPartCategoryList();
          }else{
            $scope.message = result.data.message;
            $('#myModal_alert').modal();
          }
      }, function(err) {
        console.log('配件类删除err',err);
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
