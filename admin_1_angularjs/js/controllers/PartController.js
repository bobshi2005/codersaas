angular.module('MetronicApp').controller('PartController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi) {

    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;
    $scope.partCategoryList = [];
    $scope.partList = [];
    $scope.createData = {};

    $scope.tableParams = new NgTableParams(
    {
        page: 1,    // show first page
        count: 5    // count per page
    }, {
        counts: [5, 10, 15, 20],
        total: $scope.partList.length,
        dataset: $scope.partList
    });

    $scope.getModels = function() {
        $('#myModal_autocomplete').modal();
        getPartCategoryList();
    };

    $scope.createPart = function(){

        if(!$scope.createData.hasOwnProperty("name") || $scope.createData.name == ''){
            alert('必须填写配件名称');
        }else if(!$scope.createData.hasOwnProperty("spec")  || $scope.createData.spec == ''){
            alert('必须填写规格');
        }else if(!$scope.createData.hasOwnProperty("model")  || $scope.createData.model == ''){
            alert('必须填写型号');
        }else if(!$scope.createData.hasOwnProperty("unit")  || $scope.createData.unit == ''){
            alert('必须填写单位');
        }else if(!$scope.createData.hasOwnProperty("brand")  || $scope.createData.brand == '') {
            alert('必须填写品牌');
        }else{

            // $('#myModal_autocomplete').modal('hide');

            createPartImpl();
        }
    };

    $scope.deletePart = function(){

    }

    function getPartCategoryList(){
        deviceApi.getPartCategoryList('asc',0,100)
            .then(function(result) {
                if(result.data.total > 0) {
                    $scope.partCategory=result.data.rows[0];
                    $scope.partCategoryList=result.data.rows;
                }else {
                    $scope.partCategoryList=[];
                }
            })
    }

    function getCategoryNameById(id) {
        var name = "";
        for(var i=0; i<$scope.partCategoryList.length; i++){
            if($scope.partCategoryList[i].categoryId == id){
                name = $scope.partCategoryList[i].name
                break;
            }
        }
        return name;
    }

    function getPartList() {
        $scope.partList = [];
        deviceApi.getPartList('asc', 0, 100)
            .then(function(result) {
                if(result.data.total > 0) {
                    $scope.partList = result.data.rows;
                    for(var i = 0 ;i< result.data.rows.length; i++) {
                        var categoryName = getCategoryNameById($scope.partList[i].categoryId);
                        $scope.partList[i].categoryName = categoryName;
                        // $scope.devicelist[i].factoryDate = changeTimeFormat($scope.devicelist[i].factoryDate);

                    }
                }else {
                    $scope.partList=[];
                }
                $scope.tableParams.settings().dataset = $scope.partList;
                $scope.tableParams.reload();
            }, function(err) {
                alert(err);
                alert('网络连接问题，请稍后再试！');
            });
    };

    function createPartImpl() {
        var params={};
        params.name = $scope.createData.name;
        params.spec = $scope.createData.spec;
        params.model = $scope.createData.model;
        params.unit = $scope.createData.unit;
        params.brand = $scope.createData.brand;
        params.categoryId = $scope.partCategory.categoryId;

        deviceApi.createPart(params)
            .then(function(result){
                if(result.data.code == 1 ){
                    getPartList();
                }
            }, function(err) {
                alert(err);
                alert('网络连接问题，请稍后再试！');
            });
    };


}]);
