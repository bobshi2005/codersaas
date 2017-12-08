angular.module('MetronicApp').controller('UserboardController', ['$scope', '$rootScope','userApi','locals',function($scope, $rootScope,userApi,locals) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;
  // $rootScope.settings.layout.pageSidebarClosed = false;
  // Cookies.set('sidebar_closed', '1');
  $scope.info =[];
  $scope.editable = false;
  $scope.updatbtnname='更新信息';
  $scope.$on('$viewContentLoaded', function() {
    var phone = locals.get("username");
    getuserInfo(phone);
  });
  $scope.disalert = function(){
    $('#myModal_alert').modal('hide');
  };
  $scope.disupdate = function(){
    getuserInfo($scope.info.phone);
    $scope.editable = false;
    $scope.updatbtnname='更新信息';
  };

  $scope.updateUserInfo = function(){
    $scope.editable = !$scope.editable;
    if($scope.editable){
      $scope.updatbtnname ='保存更新'
    }else{
      updateInfo();
      $scope.updatbtnname='更新信息';
    }
  }

  function updateInfo(){
    var userInfo = {};
    userInfo.userId =$scope.info.userId;
    userInfo.username =$scope.info.username;
    userInfo.realname =$scope.info.realname;
    userInfo.avatar =$scope.info.avatar;
    userInfo.phone =$scope.info.phone;
    userInfo.email =$scope.info.email;
    userInfo.sex =$scope.info.sex;
    userInfo.locked =$scope.info.locked;


    userApi.updateUser(userInfo.userId,userInfo.username,userInfo.realname,userInfo.avatar,userInfo.phone,userInfo.email,userInfo.sex,userInfo.locked)
      .then(function(result){
        if(result.data.code==1){
          console.log('修改成功！');
          $scope.message = '用户信息修改成功！'
          getuserInfo(userInfo.phone);
          $('#myModal_alert').modal();
        }else{
          console.log('修改失败！');
          $('#myModal_alert').modal();
        }
      },function(err){
          console.log('updateUserE');
      });
  }

  function getuserInfo(phone){
    userApi.userInfo(phone)
    .then(function(result) {
        if(result.data.code == 1) {
          // console.log('loginInfo',result.data.data);
          $scope.info = result.data.data.user;
          $scope.info.company = result.data.data.organization.name;
          locals.set("realname", result.data.data.user.realname);
          $rootScope.$broadcast('realname_set','true');


        }else {
          $scope.info =[];
          // console.log(result.data.data);
        }
    }, function(err) {
        console.log('getUserInfoerr',err);
    });
  }

}]);
