angular.module('MetronicApp').controller('CustomerController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  }]);
