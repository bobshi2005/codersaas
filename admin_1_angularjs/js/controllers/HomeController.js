angular.module('MetronicApp').controller('HomeController', ['$scope', '$rootScope', '$http', 'userApi', 'locals', function($scope, $rootScope, $http, userApi,locals) {
    $rootScope.showHeader = true;
    $rootScope.menueName = 'sidebar-dashboard';
    $scope.menueName = $rootScope.menueName;

    $rootScope.settings.layout.pageSidebarClosed = true;
    //Cookies.set('sidebar_closed', '1');

    var statusChart;
    var myOption4;
    $scope.$on('$viewContentLoaded', function() {
          if ($("#echarts_pie").length > 0) {
              statusChart = echarts.init(document.getElementById('echarts_pie'));
              statusChart.setOption({
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b}: {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      x: 'left',
                      data: ['正在运行', '故障停机']
                  },
                  series: [{
                          name: '在线状态',
                          type: 'pie',
                          selectedMode: 'single',
                          radius: [0, '70%'],
                          center: ['50%', 200],
                          label: {
                              normal: {
                                  position: 'inner'
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: false
                              }
                          },
                          color: ['#36d7b7', '#e08283'],
                          data: [{
                                  value: 1980,
                                  name: '正在运行',
                                  selected: true
                              },
                              {
                                  value: 340,
                                  name: '故障停机'
                              }
                          ]
                      }
                  ]
              });
          }

          if ($("#echarts_pie2").length > 0) {
              statusChart = echarts.init(document.getElementById('echarts_pie2'));
              statusChart.setOption({
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b}: {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      x: 'left',
                      data: ['在线', '正常停机', '故障停机', '离线', ]
                  },
                  series: [{
                          name: '在线状态',
                          type: 'pie',
                          selectedMode: 'single',
                          radius: [0, '70%'],
                          center: ['50%', 200],
                          label: {
                              normal: {
                                  position: 'inner'
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: false
                              }
                          },
                          color: ['#36d7b7', '#f4d03f'],
                          data: [{
                                  value: 335,
                                  name: '在线',
                                  selected: true
                              },
                              {
                                  value: 120,
                                  name: '离线'
                              }
                          ]
                      }
                  ]
              });
          }

          window.onresize = function() {
              if ($("#echarts_pie").length > 0) {
                  statusChart.resize();
              }
          };

      });

    $scope.devices = [{
            'Number': 1,
            'Serial': 'NS0013S90',
            'Name': '空压机',
            'startTime': '2017-02-11',
            'endTime': '2017-02-15'
        },
        {
            'Number': 2,
            'Serial': 'NS1093S88',
            'Name': '双螺旋杆压缩机',
            'startTime': '2017-02-11',
            'endTime': '2017-02-15'
        }

    ];
    $scope.undodevices = [{
            'Serial': 'HN00189',
            'Name': '空压机',
            'Describe': '机械故障'
        }
    ];

/*
    var alarmlistitems = [[
            '1211',
            '设备远程开启',
            'NH108982',
            '双螺旋杆压缩机',
            '2017-03-23 13:30:48'
        ],
        [
            '1212',
            '设备通讯故障',
            'SK108900',
            '空压机',
            '2017-03-18 17:23:10'
        ],
        [
            '1213',
            '设备远程关闭',
            'NJ108091',
            '双螺旋杆压缩机',
            '2017-03-17 19:13:12'
        ],
        [
            '1213',
            '设备远程关闭',
            'NJ108091',
            '双螺旋杆压缩机',
            '2017-03-17 19:13:12'
        ],
        [
            '1213',
            '设备远程关闭',
            'NJ108091',
            '双螺旋杆压缩机',
            '2017-03-17 19:13:12'
        ],
        [
            '1213',
            '设备远程关闭',
            'NJ108091',
            '双螺旋杆压缩机',
            '2017-03-17 19:13:12'
        ],
        [
            '1213',
            '设备远程关闭',
            'NJ108091',
            '双螺旋杆压缩机',
            '2017-03-17 19:13:12'
        ]
    ];
*/

    $scope.userrole=locals.get("userrole");

    userApi.getAlarms($scope.userrole)
        .then(function(result) {
            if(result.data.errCode == 0) {
                 var alarms=result.data.alarms;
                 //alert(alarms.length);

                 alarmlistitems='[';

                 var alarmlistitems=new Array();

                 for(var index=0;index<alarms.length;index++)
                 {
                    var equipid=alarms[index].equipid;
                    var gatewaySN=alarms[index].gatewaySN;
                    var equipname=alarms[index].equipname;
                    var time=alarms[index].time;
                    var alarm=alarms[index].alarm;

                    alarmlistitems.push(new Array(equipid,alarm,gatewaySN,equipname,time));

                 }

                 //alert(alarmlistitems);

                    $('#table_Alarm_1').dataTable({
                        "language": {
                            "aria": {
                                "sortAscending": ": activate to sort column ascending",
                                "sortDescending": ": activate to sort column descending"
                            },
                            "emptyTable": "没有数据",
                            "info": "显示 _START_ 到 _END_    共 _TOTAL_ 条",
                            "infoEmpty": "没有记录",
                            "infoFiltered": "(filtered1 from _MAX_ total entries)",
                            "lengthMenu": "_MENU_ 条记录/页",
                            "search": "搜索:",
                            "zeroRecords": "没有符合条件的查询记录"
                        },

                        buttons: [{
                                extend: 'print',
                                className: 'btn dark btn-outline',
                                text: '打印'
                            },
                            {
                                extend: 'copy',
                                className: 'btn red btn-outline',
                                text: '复制'
                            },
                            {
                                extend: 'pdf',
                                className: 'btn green btn-outline'
                            },
                            {
                                extend: 'excel',
                                className: 'btn yellow btn-outline '
                            },
                            {
                                extend: 'csv',
                                className: 'btn purple btn-outline '
                            },
                            {
                                extend: 'colvis',
                                className: 'btn dark btn-outline',
                                text: '列表项'
                            }
                        ],
                        "bRetrieve": true,
                        responsive: true,
                        "order": [
                            [0, 'asc']
                        ],
                        "lengthMenu": [
                            [5, 10, 15, 20, -1],
                            [5, 10, 15, 20, "All"] // change per page values here
                        ],
                        data: alarmlistitems,
                        columns: [{
                                title: "序号"
                            },
                            {
                                title: "报警内容"
                            },
                            {
                                title: "设备编号"
                            },
                            {
                                title: "设备名称"
                            },
                            {
                                title: "报警时间"
                            }
                        ],
                        "pageLength": 10,
                        "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
                    });


            //  $state.go('home.dashboard');
            }else {
              alert(result.data.errMsg);
            }
        }, function(err) {
            alert(err);
            alert('网络连接问题，请稍后再试！');
        });


    // {
    //     'Number': 1211,
    //     'Content': '设备远程开启',
    //     'Serial': 'NH108982',
    //     'Name': '双螺旋杆压缩机',
    //     'Time': '2017-03-18 17:23:10'
    // }
    // ];




}]);
