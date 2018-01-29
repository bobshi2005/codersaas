angular.module('MetronicApp').controller('UsermanageController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  $scope.showCreateUser = function(){
    $('#myModal_autocomplete').modal();
  };
  $scope.showCreateRole = function(){
    $('#myModal_autocomplete2').modal();
  };

  $scope.DismissCreateUser = function(){
    $('#myModal_autocomplete').modal('hide');
  };
  $scope.DismissCreateRole = function(){
    $('#myModal_autocomplete2').modal('hide');
  };

  }]);
