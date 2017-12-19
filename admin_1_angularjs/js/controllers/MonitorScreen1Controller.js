angular.module('MetronicApp').controller('MonitorScreen1Controller', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi) {
    $rootScope.menueName = 'sidebar-device';
    $scope.percent = 65;
    $scope.options = {
        animate:{
            duration:0,
            enabled:false
        },
        barColor:'#2C3E50',
        scaleColor:false,
        lineWidth:20,
        lineCap:'circle'
    };


    $scope.$on('$viewContentLoaded', function() {

    });
}]);
