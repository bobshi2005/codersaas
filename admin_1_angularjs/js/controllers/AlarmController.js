angular.module('MetronicApp').controller('AlarmController', ['$scope', '$rootScope','NgTableParams', function($scope, $rootScope, NgTableParams) {
    $rootScope.menueName = 'sidebar-device';
    var alarmlistitems = [
      ['1211','2017-03-23 13:30:48','NH108982','双螺旋杆压缩机','设备远程开启','低','已确认',`<a class="btn red btn-outline sbold uppercase showdetail" id="demo_3" ng-click='saveModalMsg()'> 查看 </a>`],
      ['1212','2017-03-22 06:23:39','NH108045','空压机','设备通讯故障','高','已确认',`<a class="btn red btn-outline sbold uppercasec showdetail" id="demo_3" ng-click='saveModalMsg()'> 查看 </a>`],
      ['1213','2017-03-21 18:23:39','NH800133','空压机','温度超限','中','已确认',`<a class="btn red btn-outline sbold uppercase showdetail" id="demo_3" ng-click='saveModalMsg()'> 查看 </a>`],

    ];
    $scope.currentalarm = $rootScope.alarmlist;
    $rootScope.$on('alarm_active',function(value){
      console.log('----+++++Sdaiwudbhih',value);
      $scope.alarmlist = $rootScope.alarmlist;
      console.log('alarmlist',$scope.alarmlist.length);
    });

    $('#sample_2').on('click', '.showdetail', function (e) {
        e.preventDefault();
        $rootScope.saveModalMsg();
    });

    $('#sample_2').dataTable({

        // Internationalisation. For more info refer to http://datatables.net/manual/i18n
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

        // Or you can use remote translation file
        //"language": {
        //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
        //},


        buttons: [
            { extend: 'print', className: 'btn dark btn-outline',text:'打印' },
            { extend: 'copy', className: 'btn red btn-outline' ,text:'复制'},
            { extend: 'pdf', className: 'btn green btn-outline' },
            { extend: 'excel', className: 'btn yellow btn-outline ' },
            { extend: 'csv', className: 'btn purple btn-outline ' },
            { extend: 'colvis', className: 'btn dark btn-outline', text: '列表项'}
        ],

        // setup responsive extension: http://datatables.net/extensions/responsive/
        responsive: true,

        //"ordering": false, disable column ordering
        //"paging": false, disable pagination

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
                title: "报警时间"
            },
            {
                title: "设备编号"
            },
            {
                title: "设备名称"
            },
            {
                title: "报警内容"
            },
            {
                title: "报警等级"
            },
            {
                title: "报警状态"
            },
            {
                title: "操作"
            }
        ],
        "pageLength": 10,
        "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
    });



}]);
