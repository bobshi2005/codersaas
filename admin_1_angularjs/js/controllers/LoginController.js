angular.module('MetronicApp').controller('LoginController', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi) {
    $rootScope.isloginpage = true;
    $rootScope.showHeader = false;
    $rootScope.loginForm = {};
    $rootScope.loginForm.userId = locals.get("username");
    $rootScope.loginForm.password = locals.get("password");
    $scope.login = function(){
        userApi.login($scope.loginForm.userId, $scope.loginForm.password,'false','')
          .then(function(result) {
              if(result.data.code == 1) {
                $rootScope.isloginpage = false;
                locals.set("islogin", 1);
                //locals.set("userrole", result.data.role);
                locals.set("username", $scope.loginForm.userId);
                locals.set("password", $scope.loginForm.password);
                // $state.go('home.dashboard');
                $state.transitionTo("main.home.dashboard", {}, {
                  reload: true, inherit: true, notify: true
                });
              }else {
                alert(result.data.data);
              }
          }, function(err) {
              alert('网络连接问题，请稍后再试！');
          });
      // $state.go('home.dashboard');//断网测试

    }
    $scope.$on('$viewContentLoaded', function() {
      userApi.logout().then(function(result){},function(err){});
    });
    $scope.gotoRegist = function() {
        $state.go('regist');
    };
    $scope.gotoPassBack = function() {
        $state.go('passback');
    };
}]);
