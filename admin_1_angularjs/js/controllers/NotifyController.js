angular.module('MetronicApp').controller('NotifyController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  }]);
