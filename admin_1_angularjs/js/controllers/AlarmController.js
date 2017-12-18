angular.module('MetronicApp').controller('AlarmController', ['$scope', '$rootScope','NgTableParams','deviceApi', function($scope, $rootScope, NgTableParams, deviceApi) {
    $rootScope.menueName = 'sidebar-device';
    $scope.message='';
    $scope.currentItem={};

    $scope.alarmlist = $rootScope.alarmlist;
    $scope.historylist = [];
    $scope.table_historyalarm;

    $scope.equipmentlist=[];
    $scope.alartypelist=[
      {'id':'','name':'所有'},
      {'id':'ANU','name':'活跃'},
      {'id':'CNU','name':'已消除'},

    ];
    $scope.startDate='';
    $scope.endDate='';
    $scope.equipment='';
    $scope.alarmtype=$scope.alartypelist[0];

    $scope.setAlarmType = function(type){
      $scope.alarmtype = type;
    };
    $scope.setAlarmEquipment = function(type){
      $scope.equipment = type;
    };

    $scope.table_alarm = new NgTableParams({
      page: 1,
      count:10
    }, {
      counts:[5,10,20],
      dataset: $scope.alarmlist
    });



    $scope.$on('$viewContentLoaded', function() {
      getCurrentalarms(function(){
        $rootScope.alarmlist = $scope.alarmlist;
        $rootScope.$broadcast('alarm_active_2','true');
        reloadalarmtable();
        getHistoryalarms();
      });
      getdevicelist();

      $('.nav-tabs li a').click(function() {
        // var _id = $(this).attr('href').slice(2);　
        var _id = $(this).attr('data-target');
        // console.log('alarmtest',_id);
        switch(_id) {
          case "#tab_1":

          break;
          case "#tab_2":
          $('.start_date').datetimepicker({
              language: 'zh-CN',
              weekStart: 1,
              todayBtn: 1,
              autoclose: 1,
              startView: 2,
              forceParse: 0,
              // minView:'day',
              format: 'yyyy/mm/dd hh:ii',
              todayHighlight: true,
              }).on('hide', function (e) {
                var $this = $(this);
                var _this = this;
                $scope.$apply(function(){
                    $scope.startDate = _this.value;
                });
            });
            $('.end_date').datetimepicker({
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                startView: 2,
                forceParse: 0,
                // minView:'day',
                format: 'yyyy/mm/dd hh:ii',
                todayHighlight: true,
                }).on('hide', function (e) {
                  var $this = $(this);
                  var _this = this;
                  $scope.$apply(function(){
                      $scope.endDate = _this.value;
                  });
              });
            $scope.historylist=[];
            getHistoryalarms();
          break;
          default:
          break;
        }
      });
    });

    $scope.disalert=function(){
      $('#myModal_alert').modal('hide');
    };
    $scope.disdetail=function(){
      $('#myModal_historydetail').modal('hide');
    };

    $scope.searchAlarm = function(){
      $scope.historylist=[];
      if($scope.startDate && $scope.startDate !=null && $scope.startDate !=''){
        if($scope.endDate && $scope.endDate !=null && $scope.endDate !=''){
          if($scope.startDate>$scope.endDate){
            console.log('kaishishijianbuengnxiaoyujieshushijian');
            $scope.message = '开始时间必须 早于 结束时间';
            $('#myModal_alert').modal();
          }
        }
      }
      getHistoryalarms();
    }

    $scope.showalarmcontent = function(param){
      $scope.currentItem = param;
      $('#myModal_historydetail').modal();
    }
    $scope.$on('alarm_active_1',function(value){
      $scope.alarmlist = $rootScope.alarmlist;
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

    function getdevicelist(){
      deviceApi.getDevicelist('asc', 0, 9999)
        .then(function(result) {
            if(result.data.total > 0) {
              $scope.equipmentlist.push({
                'id':'','name':'所有'
              });
              for(var i=0;i<result.data.total;i++){
                $scope.equipmentlist.push({
                  'id':result.data.rows[i].equipmentId,
                  'name':result.data.rows[i].name
                })
              }
             $scope.equipment = $scope.equipmentlist[0];
            }else {
              $scope.equipmentlist=[];
            }
            return $scope.devicelist;
        }, function(err) {
            console.log('getdevicelisterr',err);
            $scope.equipmentlist=[];
        });
    }

    function getCurrentalarms(callback){
      deviceApi.getCurrentAlarms()
      .then(function(result){
        if(result.data.total && result.data.total>0){
          $scope.alarmlist = result.data.rows;
          for(var i=0;i<result.data.rows.length;i++) {
            $scope.alarmlist[i].alarmContent = $scope.alarmlist[i].alarmContent.split(' ')[4];//拆分原始的alarmContent
          }

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

    function getHistoryalarms(){
      $scope.table_historyalarm = new NgTableParams({
        page: 1,
        count:5
      }, {
        counts:[5,10,20],
        getData:
         function(params) {
           var data={};
           data.order = 'asc';
           data.offset = (params.page()-1)*params.count();
           data.limit = params.count();
           if($scope.equipment.id && $scope.equipment.id !=null && $scope.equipment.id !=''){
             data.equipmentId = $scope.equipment.id;
           }
           if($scope.startDate && $scope.startDate !=null && $scope.startDate !=''){
             data.startDate = $scope.startDate;
           }
           if($scope.endDate && $scope.endDate !=null && $scope.endDate !=''){
             data.endDate = $scope.endDate;
           }
           if($scope.alarmtype.id && $scope.alarmtype.id !=null && $scope.alarmtype.id !=''){
             data.alarmStatus = $scope.alarmtype.id;
           }
          return deviceApi.searchHistoryAlarms(data)
            .then(function(result) {
                if(result.data.total && result.data.total > 0) {
                     $scope.historylist=result.data.rows;
                     for(var i=0;i<result.data.rows.length;i++) {
                       $scope.historylist[i].alarmTime = changeTimeFormat($scope.historylist[i].alarmTime);
                       $scope.historylist[i].updateTime = changeTimeFormat($scope.historylist[i].updateTime);
                       $scope.historylist[i].alarmContent = $scope.historylist[i].alarmContent.split(' ')[4];//拆分原始的alarmContent
                       if($scope.historylist[i].alarmStatus=='CNU'){
                         $scope.historylist[i].alarmStatus ='已消除';
                         $scope.historylist[i].isClear =true;
                       }
                       if($scope.historylist[i].alarmStatus=='ANU'){
                         $scope.historylist[i].alarmStatus ='活跃';
                         $scope.historylist[i].isClear =false;
                       }
                     }
                }else {
                  $scope.historylist=[];
                }
                params.total(result.data.total);
                return $scope.historylist;

            }, function(err) {
                $scope.historylist=[];
                return $scope.historylist;
            });
        }
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
