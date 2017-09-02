angular.module('MetronicApp').controller('UserboardController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;
  // $rootScope.settings.layout.pageSidebarClosed = false;
  // Cookies.set('sidebar_closed', '1');
  }]);
