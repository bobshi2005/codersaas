angular.module('MetronicApp').controller('RegistController', ['$scope', '$http', '$interval', '$state', 'userApi', function($scope, $http, $interval, $state, userApi) {
    $scope.formData = {};
    $scope.formData.industry=1;
    $scope.inputType = 'password';
    $scope.eyeIcon = 'glyphicon glyphicon-eye-close';
    $scope.btndescription = '获取验证码';
    $scope.btncheckAccount = '检查用户名';
    $scope.submitCancel = function() {
      $state.go('login');
    };
    // $scope.checkAccount = function() {
    //     if ($scope.formData.account && $scope.formData.account != null && $scope.formData.username != "") {
    //         //userApi.checkAccount($scope.formData.account)
    //         userApi.checkAccount($scope.formData.account)
    //             .then(function(result) {
    //
    //                 if (result.data.code == 1) {
    //                     $scope.btncheckAccount = '用户名可用';
    //                 } else {
    //                     $scope.btncheckAccount = '检查用户名';
    //                     alert('用户名已存在，请重新输入');
    //                 }
    //             }, function(err) {
    //                 console.log(err);
    //                 alert('网络连接问题，请稍后再试！');
    //             });
    //     }
    // };
    $scope.hideShowPassword = function() {
        if ($scope.inputType == 'password') {
            $scope.inputType = 'text';
            $scope.eyeIcon = 'glyphicon glyphicon-eye-open';
        } else {
            $scope.inputType = 'password';
            $scope.eyeIcon = 'glyphicon glyphicon-eye-close';
        }
    };
    $scope.submitForm = function() {
        userApi.createUser($scope.formData.phone, $scope.formData.password,$scope.formData.name, $scope.formData.company,$scope.formData.email, $scope.formData.phone,$scope.formData.code)
            .then(function(result) {
                if (result.data.code == 1) {
                    alert("用户创建成功，请登录");
                    $state.go('login');
                } else {
                    console.log(result.data.data);
                }
            }, function(err) {
                console.log(err);
                alert('网络连接问题，请稍后再试！');
            });

        // $state.go('home.dashboard');
        // $urlRouterProvider.otherwise('/home/success');
    };
    // $scope.sendCode = function() {
    //   if($scope.formData.phone && $scope.formData.phone!=null && $scope.formData.phone!="" && form.username.$dirty && form.username.$valid){
    //     userApi.checkAccount($scope.formData.phone)
    //         .then(function(result) {
    //             console.log('sendCode',result.data);
    //             if(result.data.errCode == 0) {
    //                 alert('验证码已发送到 '+$scope.formData.phone);
    //             }else {
    //               alert(result.data.errMsg);
    //             }
    //         }, function(err) {
    //             alert(err);
    //             alert('网络连接问题，请稍后再试！');
    //         });
    //   }
    // };
    $scope.checkCode = function() {
        $http({
            method: 'post',
            url: $rootScope.url + 'CheckVerifyCode',
            data: {
                'phone': $scope.formData.phone,
                'verifyCode': $scope.formData.code
            }
        }).then(function(res) {
            console.log(res.data);
        }).catch(err => console.log('err', err))
    };
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
