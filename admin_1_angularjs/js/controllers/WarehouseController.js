angular.module('MetronicApp').controller('WarehouseController', ['$scope', '$rootScope','deviceApi','NgTableParams','$timeout','sharedataApi','$element', function($scope, $rootScope, deviceApi, NgTableParams,$timeout,sharedataApi,$element) {
    $rootScope.menueName = 'sidebar-asset';
    $scope.menueName = $rootScope.menueName;

    $scope.warehouselist=[];

    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.$on('$viewContentLoaded', function() {
      getWarehouselist();
    });

    //监听 checkbox
    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.warehouselist, function(item) {
        $scope.checkboxes.items[item.warehouseId] = value;
      });
    });

    // watch for data checkboxes
     $scope.$watch(function() {
       return $scope.checkboxes.items;
     }, function(values) {
       var checked = 0, unchecked = 0,
       total = $scope.warehouselist.length;
       angular.forEach($scope.checkboxes.items, function(item) {
         if(item){
           checked += 1;
         }else{
           unchecked +=1;
         }
       });
       if ((unchecked == 0) || (checked == 0)) {
         $scope.checkboxes.checked = (checked == total && total>0);
       }
      //  grayed checkbox
       angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
     }, true);

    function getWarehouselist() {
      $scope.warehouselist=[];
      $scope.checkboxes.checked = false;
      $scope.checkboxes.items = {};

      $scope.tableParams = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        getData: function(params) {
          return deviceApi.getWarehouselist('asc', (params.page()-1)*params.count(), params.count())
            .then(function(result) {
                if(result.data.total > 0) {
                     $scope.warehouselist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.warehouselist[i].updateTime = changeTimeFormat($scope.warehouselist[i].updateTime);
                       $scope.warehouselist[i].createTime = changeTimeFormat($scope.warehouselist[i].createTime);
                     }
                }else {
                  $scope.warehouselist=[];
                }
                params.total(result.data.total);
                return $scope.warehouselist;
            }, function(err) {

            });
        }
      });
      $scope.tableParams.reload();
    }

    Date.prototype.format = function(format) {
      var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                   format = format.replace(RegExp.$1, RegExp.$1.length == 1
                          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
      }
      return format;
    }

    function changeTimeFormat(timestamp) {
      var newDate = new Date();
      newDate.setTime(timestamp);
      return newDate.format('yyyy-MM-dd');
    }

}]);
