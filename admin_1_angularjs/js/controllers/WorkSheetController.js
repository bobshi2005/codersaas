angular.module('MetronicApp').controller('WorkSheetController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
}]);
