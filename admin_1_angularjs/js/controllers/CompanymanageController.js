angular.module('MetronicApp').controller('CompanymanageController', ['$scope', '$rootScope', 'NgTableParams','deviceApi','$element',function($scope, $rootScope,NgTableParams,deviceApi,$element) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;
  $scope.companylist = [];
  $scope.curentcompany = {};
  $scope.message = ''; // alert 提示信息
  $scope.deletelist = [];//删除对象列表
  $scope.deletestr = ''; //删除队列显示字符串
  $scope.checkboxes = {
    checked: false,
    items: {}
  };

  $scope.createDismiss = function(){
    $('#myModal_createCompany').modal('hide');
  };

  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };

  $scope.addCompany = function(){
    $('#myModal_createCompany').modal();
  };
  $scope.saveCreateCompany = function(){
    createCompanyImp();
  };
  $scope.deleteCompany = function(){

  };
  $scope.updateCompany = function(){

  };
  $scope.$on('$viewContentLoaded', function() {
      getCompanyList();
  });
  $scope.setDevice = function(){
    $('#myModal_setCompanyDevice').modal();
  }
  $scope.$watch(function() {
    return $scope.checkboxes.checked;
  }, function(value) {
    angular.forEach($scope.companylist, function(item) {
      $scope.checkboxes.items[item.companyId] = value;
    });
  });

  $scope.$watch(function() {
    return $scope.checkboxes.items;
    }, function(values) {
      var checked = 0, unchecked = 0,
      total = $scope.companylist.length;
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

  function getCompanyList(){
      $scope.companylist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableCompany = new NgTableParams({
      page: 1,
      count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getCompanyList('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.companylist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.companylist[i].createTime = changeTimeFormat($scope.companylist[i].createTime);
                     }
                }else {
                  $scope.companylist=[];
                }
                params.total(result.data.total);
                return $scope.companylist;
            }, function(err) {
              console.log('获取子公司列表err',err);
            });
        }
      });
      $scope.tableCompany.reload();
  }

  function createCompanyImp(){
    var params={};
    params.name = $scope.currentData.name;
    params.address = $scope.currentData.address;
    params.phone = $scope.currentData.phone;
    params.fax = $scope.currentData.fax;
    params.zip = $scope.currentData.zip;
    params.www = $scope.currentData.www;

    deviceApi.createCompany(params)
    .then(function(result){
      if(result.data.code==1){
        $scope.message = '子公司创建成功';
        $('#myModal_alert').modal();
        $('#myModal_createCompany').modal('hide');
        getCompanyList();
      }else{
        $scope.message = '子公司创建失败';
        $('#myModal_alert').modal();
      }
    },function(err){
      $scope.message = '子公司创建失败';
      $('#myModal_alert').modal();
      console.log('创建子公司err',err);
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


  }]);
