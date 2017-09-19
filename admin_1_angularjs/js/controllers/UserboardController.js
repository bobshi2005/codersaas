angular.module('MetronicApp').controller('UserboardController', ['$scope', '$rootScope','userApi','locals',function($scope, $rootScope,userApi,locals) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;
  // $rootScope.settings.layout.pageSidebarClosed = false;
  // Cookies.set('sidebar_closed', '1');
  $scope.info =[];
  $scope.$on('$viewContentLoaded', function() {
    var phone = locals.get("username");
    getuserInfo(phone);
  });

  function getuserInfo(phone){
    userApi.userInfo(phone)
    .then(function(result) {
        if(result.data.code == 1) {
          console.log('loginInfo',result.data);
          $scope.info.realname = result.data.data.user.realname;
          $scope.info.phone = result.data.data.user.phone;
          $scope.info.email = result.data.data.user.email;
          $scope.info.company = result.data.data.organization.name;

        }else {
          $scope.info =[];
          console.log(result.data.data);
        }
    }, function(err) {
        console.log('getUserInfoerr',err);
    });
  }

}]);
