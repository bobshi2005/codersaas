angular.module('MetronicApp').controller('LoginController', ['$scope', '$rootScope', '$state', '$http', 'userApi','deviceApi', 'locals','deviceApi',function($scope, $rootScope, $state, $http, userApi,deviceApi,locals,deviceApi) {
    $rootScope.isloginpage = true;
    $rootScope.showHeader = false;
    $rootScope.loginForm = {};
    $rootScope.loginForm.userId = locals.get("username");
    $rootScope.loginForm.password = locals.get("password");
    $scope.login = function(){
      /*
        deviceApi.login('admin','123456')
          .then(function(result) {
            console.log('logupms',result);
          }, function(err) {

          });
       */
      //userApi.login($scope.loginForm.userId, $scope.loginForm.password)
        deviceApi.login($scope.loginForm.userId, $scope.loginForm.password,'false','')
          .then(function(result) {
              console.log('logindata:',result.data);
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
              alert(err);
              alert('网络连接问题，请稍后再试！');
          });
      // $state.go('home.dashboard');//断网测试

    }
    $scope.gotoRegist = function() {
        $state.go('regist');
    };
}]);
