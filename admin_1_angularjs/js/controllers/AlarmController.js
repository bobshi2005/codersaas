angular.module('MetronicApp').controller('AlarmController', ['$scope', '$rootScope','NgTableParams','deviceApi', function($scope, $rootScope, NgTableParams, deviceApi) {
    $rootScope.menueName = 'sidebar-device';

    $scope.alarmlist = $rootScope.alarmlist;
    $scope.historylist = [];
    $scope.table_historyalarm;


    $scope.table_alarm = new NgTableParams({
      page: 1,
      count:10
    }, {
      counts:[2,10,50],
      dataset: $scope.alarmlist
    });



    $scope.$on('$viewContentLoaded', function() {
      getCurrentalarms(function(){
        $rootScope.alarmlist = $scope.alarmlist;
        $rootScope.$broadcast('alarm_active_2','true');
        reloadalarmtable();
      });

      getHistortyalarms(function(){
        console.log('=====',$scope.historylist);
        $scope.table_historyalarm = new NgTableParams({
          page: 1,
          count:10
        }, {
          counts:[2,10,50],
          dataset:$scope.historylist
        });
      });

      $('.nav-tabs li a').click(function() {
        var _id = $(this).attr('href').slice(2);　
        console.log('id',_id);
        switch(_id) {
          case "tab_1":

          break;
          case "tab_2":
          console.log('=====',$scope.historylist);
          $scope.table_historyalarm = new NgTableParams({
            page: 1,
            count:10
          }, {
            counts:[2,10,50],
            dataset:$scope.historylist
          });
            // $scope.table_historyalarm = new NgTableParams({
            //   page: 1,
            //   count:10
            // }, {
            //   counts:[2,10,50],
            //   dataset: $scope.alarmlist
            //   //  function(params) {
            //   //   return deviceApi.getHistoryAlarms('asc', (params.page()-1)*params.count(), params.count())
            //   //     .then(function(result) {
            //   //       console.log('gethistory',result);
            //   //         if(result.data.total && result.data.total > 0) {
            //   //              $scope.historylist=result.data.data;
            //   //              for(var i=0;i<result.data.length;i++) {
            //   //                $scope.historylist[i].alarmTime = changeTimeFormat($scope.historylist[i].alarmTime);
            //   //                $scope.historylist[i].createTime = changeTimeFormat($scope.historylist[i].createTime);
            //   //              }
            //   //         }else {
            //   //           $scope.historylist=[];
            //   //         }
            //   //         params.total(result.data.total);
            //   //         return $scope.historylist;
            //   //
            //   //     }, function(err) {
            //   //         $scope.historylist=[];
            //   //         return $scope.historylist;
            //   //
            //   //     });
            //   // }
            // });
          break;
          default:
          break;
        }
      });
    });

    $scope.$on('alarm_active_1',function(value){
      $scope.alarmlist = $rootScope.alarmlist;
      // console.log('haha我是active1',$scope.alarmlist.length);
      reloadalarmtable();
    });

    function reloadalarmtable(){
      $scope.table_alarm = new NgTableParams({
        page: 1,
        count:10
      }, {
        counts:[2,10,50],
        dataset:  $scope.alarmlist
      });
    }

    function getCurrentalarms(callback){
      deviceApi.getCurrentAlarms()
      .then(function(result){
        if(result.data.total && result.data.total>0){
          $scope.alarmlist = result.data.rows;
          callback();
        }else{
          $scope.alarmlist = [];
          callback();
        }
      },function(err){
        $scope.alarmlist = [];
        callback();
      });
    }

    function getHistortyalarms(){
      deviceApi.getHistoryAlarms('asc', 0, 100)
        .then(function(result) {
          console.log('gethistory',result);
            if(result.data && result.data.length > 0) {
                 $scope.historylist=result.data;
                 for(var i=0;i<result.data.length;i++) {
                   $scope.historylist[i].alarmTime = changeTimeFormat($scope.historylist[i].alarmTime);
                   $scope.historylist[i].createTime = changeTimeFormat($scope.historylist[i].createTime);
                 }
            }else {
              $scope.historylist=[];
            }
            callback();
        }, function(err) {
            $scope.historylist=[];
            callback();
        });
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
      return newDate.format('yyyy-MM-dd hh:mm:ss');
    }
}]);
