angular.module('MetronicApp').controller('MonitorScreen1Controller', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi) {
    $rootScope.menueName = 'sidebar-device';
    $rootScope.showMonitorScreen = locals.get("screenNumber");
    $scope.$on('$viewContentLoaded', function() {
      $('.easy-pie-chart .number.transactions').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: App.getBrandColor('yellow')
      });
    });
}]);
