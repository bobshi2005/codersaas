angular.module('MetronicApp').controller('UsermanageController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  }]);
