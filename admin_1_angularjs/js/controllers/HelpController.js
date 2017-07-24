angular.module('MetronicApp').controller('HelpController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  }]);
