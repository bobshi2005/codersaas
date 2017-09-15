angular.module('MetronicApp').controller('PassBackController', ['$scope', '$http', '$interval', '$state', 'userApi','locals', function($scope, $http, $interval, $state, userApi,locals) {
    $scope.formData = {};
    $scope.btndescription = '获取验证码';
    $scope.btncheckAccount = '检查用户名';
    $scope.step1=true;
    $scope.step2=false;
    $scope.step3=false;
    $scope.reactcode=locals.get("reactVerifyCode");
    //  $scope.reactcode='260963';
    $scope.submitCancel = function() {
      $state.go('login');
    };

    $scope.hideShowPassword = function() {
        if ($scope.inputType == 'password') {
            $scope.inputType = 'text';
            $scope.eyeIcon = 'glyphicon glyphicon-eye-open';
        } else {
            $scope.inputType = 'password';
            $scope.eyeIcon = 'glyphicon glyphicon-eye-close';
        }
    };
    $scope.submit = function() {
      userApi.passback($scope.formData.phone,$scope.formData.code,$scope.formData.password,$scope.formData.confirmPassword)
          .then(function(result) {
            console.log('result',result);
              if (result.data.code == 1) {
                $scope.step1=false;
                $scope.step2=false;
                $scope.step3=true;
                $('#step2').removeClass('bg-blue');
                $('#step2').addClass('bg-white');
                $('#step3').removeClass('bg-white');
                $('#step3').addClass('bg-blue');
                $('#steptext2').addClass('font-grey-cascade');
                $('#steptext3').removeClass('font-grey-cascade');
              } else if(result.data.code ==0){
                  alert(result.data.data);
              }
          }, function(err) {
              console.log('get back password err',err);
          });

    };

    $scope.nextStep = function(){
      if($scope.reactcode != $scope.formData.code){
        alert("验证码输入错误");
      }else{
        $scope.step1=false;
        $scope.step2=true;
        $scope.step3=false;
        $('#step1').removeClass('bg-blue');
        $('#step1').addClass('bg-white');
        $('#step2').removeClass('bg-white');
        $('#step2').addClass('bg-blue');
        $('#steptext1').addClass('font-grey-cascade');
        $('#steptext2').removeClass('font-grey-cascade');
      }
    };
    $scope.gotoLogin = function(){
      $state.go('login');
    }
    $scope.backToStep1 = function(){
      $scope.step1=true;
      $scope.step2=false;
      $scope.step3=false;
      $scope.formData.password=null;
      $scope.formData.confirmPassword=null;
    }
    $scope.send = {
        canClick: false,
        second: 60,
        timer: null,
        ToSend: function() {
            if ($scope.formData.phone && $scope.formData.phone != null && $scope.formData.phone != "") {
                userApi.SendVerifyCode($scope.formData.phone)
                    .then(function(result) {
                        timer = $interval(function() {
                            $scope.send.second--;
                            $scope.btndescription = $scope.send.second + 's后重新获取';
                            $scope.send.canClick = true;
                            $scope.send.color = {
                                color: '#f00',
                                fontSize: '25px'
                            };
                            if ($scope.send.second === 0) {
                                $scope.btndescription = '获取验证码';
                                $scope.send.second = 60;
                                $interval.cancel(timer);
                                $scope.send.canClick = false;
                                $scope.send.color = {
                                    color: '#333'
                                };
                            }
                        }, 1000)
                        // console.log('sendCode', result.data);

                        if (result.data.code == 200) {
                            alert('验证码已发送到 ' + $scope.formData.phone);
                            $scope.reactcode=result.data.obj;
                            locals.set("reactVerifyCode",result.data.obj);
                        } else if(result.data.code == 416){
                            alert('您发送的验证码太频繁了 请10分钟后再试！');
                        } else{
                           alert('验证码获取失败');
                        }
                    }, function(err) {
                        console.log(err);
                        alert('网络连接问题，请稍后再试！');
                    });
            } else {
                alert('请输入有效的手机号码');
            }
            // $scope.sendCode();

        }
    }
}]);
