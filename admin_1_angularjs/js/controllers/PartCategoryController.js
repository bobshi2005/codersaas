angular.module('MetronicApp').controller('PartCategoryController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi) {

    $rootScope.menueName = 'sidebar-asset';
    $scope.loadModels = false;
    $scope.partCategoryList = [];
    $scope.createData = {};

    $scope.$on('$viewContentLoaded', function() {
        $timeout(getPartCategoryList(),1000);
    });

    $scope.tableParams = new NgTableParams(
        {
            page: 1,    // show first page
            count: 5    // count per page
        }, {
            counts: [5, 10, 15, 20],
            total: $scope.partCategoryList.length,
            dataset: $scope.partCategoryList
        });

    function getPartCategoryList(){
        $scope.partCategoryList=[];
        deviceApi.getPartCategoryList('asc',0,100)
            .then(function(result) {
                if(result.data.total > 0) {
                    $scope.partCategory=result.data.rows[0];
                    $scope.partCategoryList=result.data.rows;
                }else {
                    $scope.partCategoryList=[];
                }
                $scope.tableParams.settings().dataset = $scope.partCategoryList;
                $scope.tableParams.reload();
            })
    };

    $scope.createPartCategory = function(){
        // console.log("create start");
        if(!$scope.createData.hasOwnProperty("name") || $scope.createData.name == ''){
            alert('必须填写类别名称');
        }else{
            createPartCategoryImpl();
        }
    };

    function createPartCategoryImpl() {
        deviceApi.createPartCategory($scope.createData.name)
            .then(function(result){
                // console.log("result"+ result);
                if(result.data.code == 1 ){
                    getPartCategoryList();
                }
            }, function(err) {
                alert(err);
                alert('网络连接问题，请稍后再试！');
            });
    };


}]);
