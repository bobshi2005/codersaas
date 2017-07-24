angular.module('MetronicApp').controller('MtcManageController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.params = [
      ['1','2017-03-02','HN0013','空压机','PJ028398','电机','损坏','维修电机','<a class="edit" href="">编辑</a>','<a class="delete" href="">删除</a>'],
      ['2','2017-02-12','HN1018','空压机','PJ028398','电机','检查','电机检测','<a class="edit" href="">编辑</a>','<a class="delete" href="">删除</a>']
    ];
    TableDatatablesEditable.init($scope.params,'mtcmanage_editable_1');
}]);
