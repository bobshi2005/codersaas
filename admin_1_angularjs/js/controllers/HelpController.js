angular.module('MetronicApp').controller('HelpController', ['$scope', '$rootScope','$state', function($scope, $rootScope,$state) {
  $rootScope.menueName = 'sidebar-setting';
  $scope.menueName = $rootScope.menueName;

  $scope.gotoHelpConnectRTU = function(){
    var url = $state.href('main.setting.helpConnect',{basicType:8});
    window.open(url,'_blank');
  }

}]);
