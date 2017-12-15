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
  $scope.currentData = {};
  $scope.createDismiss = function(){
    $('#myModal_createCompany').modal('hide');
  };
  $scope.updateDismiss = function(){
    $('#myModal_updateCompany').modal('hide');
  };
  $scope.deleteDismiss = function(){
    $('#myModal_deleteCompany').modal('hide');
  };

  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };

  $scope.showCreateCompany = function(){
    $scope.currentData={
      name:'',
      address:'',
      phone:'',
      fax:'',
      www:'',
      zip:'',
    }
    $('#myModal_createCompany').modal();
  };
  $scope.createCompany = function(){
    var params={};
    params.name = $scope.currentData.name;
    params.address = $scope.currentData.address;
    params.phone = $scope.currentData.phone;
    params.fax = $scope.currentData.fax;
    params.zip = $scope.currentData.zip;
    params.www = $scope.currentData.www;
    console.log('paramstest',params);
    if(params.name=='' || params.name == null){
      $scope.message = '公司名称不能为空';
      $('#myModal_alert').modal();
    }else if(!params.phone || params.phone=='' || params.phone==null){
      $scope.message = '联系电话必须 由纯数字构成，且不能为空';
      $('#myModal_alert').modal();
    }else if(!params.address || params.address=='' || params.address==null){
      $scope.message = '公司地址不能为空';
      $('#myModal_alert').modal();
    }else{
      if(params.fax == undefined){
        params.fax = '';
      }
      if(params.zip == undefined){
        params.zip = '';
      }
      if(params.www == undefined){
        params.www = '';
      }
      createCompanyImp(params);
    }
  };

  $scope.showUpdateCompany = function(){
    $scope.currentData = {};
    var checked = 0, index = 0;
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        index = key;
        checked += 1;
      }
    });
    if(checked == 0){
      $scope.message = '请选择一个子公司';
      $('#myModal_alert').modal();
    }else if(checked > 1){
      $scope.message = '只能选择一个子公司进行编辑';
      $('#myModal_alert').modal();
    }else{
      for(var i=0; i< $scope.companylist.length; i++){
        if($scope.companylist[i].companyId == index){
          $scope.currentData = $scope.companylist[i];
          console.log('currentcompany',$scope.currentData)
          break;
        }
      }
      $('#myModal_updateCompany').modal();
    }
  };
  $scope.updateCompany = function(){
    $('#myModal_updateCompany').modal('hide');
    updateCompanyImpl();
  };

  $scope.showDeleteCompany = function(){
    var checked = 0;
    $scope.deletelist = [];
    angular.forEach($scope.checkboxes.items, function(value,key) {
      if(value){
        checked += 1;
        let tempdata={};
        for(var i=0; i< $scope.companylist.length; i++){
          if($scope.companylist[i].companyId == key){
            tempdata = $scope.companylist[i];
            $scope.deletelist.push(tempdata);
            break;
          }
        }
      }
    });
    if(checked == 0){
      $scope.message = '请至少选择一个子公司';
      $('#myModal_alert').modal();
    }else{
      console.log('deletelist',$scope.deletelist);
      let tempstr = '';
      for(var i=0; i< $scope.deletelist.length; i++){
        tempstr =tempstr+'  '+ $scope.deletelist[i].name;
        tempstr =tempstr+ '  ';
      }
      tempstr =tempstr+ '  共'+ $scope.deletelist.length+'个子公司';
      $scope.deletestr = tempstr;
      $('#myModal_deleteCompany').modal();
    }
  };


  $scope.deleteCompany = function(){
    $('#myModal_deleteCompany').modal('hide');
    deleteCompanyImpl();
  };
  $scope.$on('$viewContentLoaded', function() {
      getCompanyList();
  });

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

  function createCompanyImp(params){
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

  function deleteCompanyImpl(){
    var ids='';
    for(var i=0;i<$scope.deletelist.length;i++){
      ids+= $scope.deletelist[i].companyId;
      ids+= '-';
    }
    console.log('ids',ids);
    deviceApi.deleteCompany(ids)
    .then(function(result){
      if(result.data.code==1){
        $scope.message = '子公司删除成功';
        $('#myModal_alert').modal();
        $('#myModal_updaCompany').modal('hide');
        getCompanyList();
      }else{
        $scope.message = '子公司删除失败';
        $('#myModal_alert').modal();
      }
    },function(err){
      $scope.message = '子公司删除失败';
      $('#myModal_alert').modal();
      console.log('编辑子公司err',err);
    })
  }

  function updateCompanyImpl(){

      var params={};
      params.name = $scope.currentData.name;
      params.address = $scope.currentData.address;
      params.phone = $scope.currentData.phone;
      params.fax = $scope.currentData.fax;
      params.zip = $scope.currentData.zip;
      params.www = $scope.currentData.www;

      deviceApi.updateCompany(params,$scope.currentData.companyId)
      .then(function(result){
        if(result.data.code==1){
          $scope.message = '子公司编辑成功';
          $('#myModal_alert').modal();
          $('#myModal_updaCompany').modal('hide');
          getCompanyList();
        }else{
          $scope.message = '子公司编辑失败';
          $('#myModal_alert').modal();
        }
      },function(err){
        $scope.message = '子公司编辑失败';
        $('#myModal_alert').modal();
        console.log('编辑子公司err',err);
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
