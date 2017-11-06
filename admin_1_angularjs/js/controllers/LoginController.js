angular.module('MetronicApp').controller('LoginController', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi) {
    $rootScope.isloginpage = true;
    $rootScope.showHeader = false;
    $rootScope.loginForm = {};
    $rootScope.loginForm.userId = locals.get("username");

    $scope.login = function(){
      console.log('sss',$rootScope.loginForm);
        userApi.login($scope.loginForm.userId, $scope.loginForm.password,'false','')
          .then(function(result) {
              if(result.data.code == 1) {
                $rootScope.isloginpage = false;
                getuserInfo($scope.loginForm.userId);
                locals.set("islogin", 1);
                //locals.set("userrole", result.data.role);
                if($rootScope.loginForm.remember && $rootScope.loginForm.remember==true){
                  locals.set("username", $scope.loginForm.userId);
                  locals.set("password", $scope.loginForm.password);
                  locals.set("remember", 'true');
                }else{
                  locals.set("username", '');
                  locals.set("password", '');
                  locals.set("remember", 'false');
                }

                $rootScope.$broadcast('alarm_start','true');
                $state.go('main.home.dashboard');
                // $state.transitionTo("main.home.dashboard", {}, {
                //   reload: true, inherit: true, notify: true
                // });
                // $state.transitionTo("main.home.dashboard", {}, {
                //   reload: false, inherit: true, notify: true
                // });
              }else {
                alert(result.data.data);
              }
          }, function(err) {
              alert('网络连接问题，请稍后再试！');
          });
      // $state.go('home.dashboard');//断网测试

    }
    $scope.$on('$viewContentLoaded', function() {
      if($rootScope.showtimeoutflag>=1){
        alert('超时，请重新登录');
        $rootScope.showtimeoutflag = 0;
      }
      if(locals.get("remember")==='true'){
        $rootScope.loginForm.remember=true;
      }
      var pwd = document.getElementById('password');
      pwd.type = "password";
      $rootScope.loginForm.password = locals.get("password");
      // userApi.logout().then(function(result){},function(err){});
      window.onresize=function(){

        if($('.login-content').width()<550){
          if($('.login-content').height()+$('.login-footer').height()+120>$('.login-container').height()){
            $('.login-footer').hide();
          }else{
            $('.login-footer').show();
          }
        }else if($('.login-content').width()<590){
          if($('.login-content').height()+$('.login-footer').height()+150>$('.login-container').height()){
            $('.login-footer').hide();
          }else{
            $('.login-footer').show();
          }
        }else if($('.login-content').width()<630){
          if($('.login-content').height()+$('.login-footer').height()+170>$('.login-container').height()){
            $('.login-footer').hide();
          }else{
            $('.login-footer').show();
          }
        }else{
          if($('.login-content').height()+$('.login-footer').height()+180>$('.login-container').height()){
            $('.login-footer').hide();
          }else{
            $('.login-footer').show();
          }
        }

      };
    });
    function getuserInfo(phone){
      userApi.userInfo(phone)
      .then(function(result) {
          if(result.data.code == 1) {
            console.log('loginInfo',result.data);
            locals.set("realname", result.data.data.user.realname);
          }else {
            console.log('getUserresulterr',result.data.message);
          }
      }, function(err) {
          console.log('getUserInfoerr',err);
      });
    }
    $scope.gotoRegist = function() {
        $state.go('regist');
    };
    $scope.gotoPassBack = function() {
        $state.go('passback');
    };
}]);
