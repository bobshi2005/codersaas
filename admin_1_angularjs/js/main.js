/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "AppService",
    "angularModalService",
    "ngTable"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;
    $rootScope.showHeader = false;
    $rootScope.isloginpage = false;
    $rootScope.menueName = 'sidebar-dashboard';
    $rootScope.showMap = false;
    $rootScope.pagetitle = '列表模式';
    $rootScope.listMode = '切换地图';
    $rootScope.showtimeoutflag = 0;
    $rootScope.alarmlist =[]; //全局active 报警列表
    $rootScope.showMonitorScreen = 0;//选择显示的大屏序列，默认不显示
    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','$state', 'ModalService','locals',function($scope, $rootScope,$state,ModalService,locals) {
    Layout.init();
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //     var islogin=locals.get('islogin');
    //     // console.log('islogin',islogin);
    //     // console.log('to', toState.name);
    //     if(islogin==1 || toState.name == 'login' || toState.name == 'regist' || toState.name == 'passback') {
    //       if($rootScope.isloginpage == false) {
    //          if(toState.name == 'regist' || toState.name == 'login' || toState.name == 'passback') {
    //            $rootScope.showHeader = false;
    //          }else {
    //            if(toState.name != 'main.home.dashboard'){
    //              $rootScope.showHeader = true;
    //            }
    //          }
    //       }
    //     } else {
    //       // console.log('isloginerr', islogin);
    //       // console.log('to', toState.name);
    //       event.preventDefault();
    //       App.stopPageLoading();
    //       $state.transitionTo("login");
    //
    //     }
    // });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'login' || toState.name == 'regist' || toState.name == 'passback') {
          $rootScope.showHeader = false;
        } else {
        }
        $rootScope.showMonitorScreen = locals.get("screenNumber");
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'login' || toState.name == 'regist' || toState.name == 'passback') {
          $rootScope.showHeader = false;
        } else {
          $rootScope.showHeader = true;
        }
    });
    $rootScope.$on('to-login',function(value){
      $rootScope.$broadcast('alarm_stop','true');
      locals.set("islogin", 0);
      $state.transitionTo('login');
    });

    $rootScope.saveModalMsg = function() {
        //弹出提示popup
        ModalService.showModal({
            templateUrl:'modal.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                // $scope.yesNoResult = result ? "You said Yes" : "You said No";
            });
        });
    };
    $rootScope.$on('$viewContentLoaded', function() {
        // App.initComponents(); // init core components
        // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

MetronicApp.controller('ModalController', function($scope, close) {
    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

});

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$rootScope','$scope','$state','locals','userApi','deviceApi','$interval', function($rootScope, $scope, $state, locals, userApi, deviceApi, $interval) {
    $scope.logout = function() {
        $interval.cancel($scope.alarmtimer);
        userApi.logout().then(function(result){},function(err){});
        locals.set("islogin", 0);
        $rootScope.showMonitorScreen = 0;
        $state.transitionTo("login",{},{reload: true});
    };
    $scope.useraccount = locals.get("username");
    $scope.alarmnum = 0;
    $scope.alarmlist = [];
    $scope.hasalarm = false;
    $scope.alarmtimer;
    $scope.realname = locals.get("realname");
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        // $interval.cancel($scope.timer);
        if(locals.get("islogin")==0){
           $interval.cancel($scope.timer);
        }else{
          $scope.alarmtimer = $interval($scope.getcurrentalarms,10000);
        }
    });
    $scope.$on('realname_set',function(){
      $scope.realname = locals.get("realname");
    });
    $scope.$on('$destroy',function(){
       $interval.cancel($scope.alarmtimer);
    });
    $scope.$on('alarm_start',function(){
      //  $interval.cancel($scope.alarmtimer);
       $scope.alarmtimer = $interval($scope.getcurrentalarms,10000);
    });
    $scope.$on('alarm_stop',function(){
       $interval.cancel($scope.alarmtimer);
    });
    $scope.$on('alarm_active_2',function(value){
      // console.log('haha我是active2');
      $scope.alarmlist = $rootScope.alarmlist;
      $scope.alarmnum = $rootScope.alarmlist.length;
      if($scope.alarmnum == 0){
        $scope.hasalarm = false;
      }else{
        $scope.hasalarm = true;
      }
      // console.log('hasalarm',$scope.hasalarm);
    });
    $scope.getcurrentalarms = function(){
      deviceApi.getCurrentAlarms()
      .then(function(result){
        if(result.data.total && result.data.total>0){
          $scope.alarmnum = result.data.total;
          $scope.alarmlist = result.data.rows;
          for(var i=0;i<result.data.rows.length;i++) {
            $scope.alarmlist[i].alarmContent = $scope.alarmlist[i].alarmContent.split(' ')[4];//拆分原始的alarmContent
          }
          $rootScope.alarmlist = $scope.alarmlist;
          $scope.hasalarm = true;
          $rootScope.$broadcast('alarm_active_1','true');
        }else{
          $scope.alarmnum = 0;
          $scope.alarmlist = [];
          $scope.hasalarm = false;
          $rootScope.alarmlist = $scope.alarmlist;
          $rootScope.$broadcast('alarm_active_1','true');
        }
      },function(err){
        $scope.alarmnum = 0;
        $scope.alarmlist = [];
        $scope.hasalarm = false;
        $rootScope.alarmlist = $scope.alarmlist;
        $rootScope.$broadcast('alarm_active_1','true');
      });
    }
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope','$rootScope', function($scope, $rootScope) {
    Layout.initSidebar(); // init sidebar
    $scope.$on('$includeContentLoaded', function() {
        // console.log('load',$rootScope.settings.layout.pageSidebarClosed);
        // Layout.initSidebar(); // init sidebar
        Layout.handleSidebarMenuActiveLink();
    });
}]);

/* Setup Layout Part - Quick Sidebar */
// MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         setTimeout(function() {
//             QuickSidebar.init(); // init quick sidebar
//         }, 2000)
//     });
// }]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

MetronicApp.controller('sidemenuController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.menueName = $rootScope.menueName;
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$httpProvider) {
    // Redirect any unmatched url
    $httpProvider.interceptors.push('sessionTimeout');
    $urlRouterProvider.when('', '/login');
    $urlRouterProvider.otherwise('/login');
    $stateProvider

        // home
        .state('login', {
            url: "/login",
            templateUrl: "views/login6.html?version=2017122701",
            controller: 'LoginController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/pages/css/login-6.css",
                            "../assets/global/plugins/jquery.min.js",
                            "js/controllers/LoginController.js?version=2017122701",
                            "../assets/global/plugins/echarts/echarts.min.js",
                            "../assets/global/plugins/highcharts/js/highcharts_v6.0.4.js",
                            "http://cache.amap.com/lbs/static/es5.min.js"
                      ])
                }]
            }
        })
        .state('regist', {
            url: "/regist",
            templateUrl: "views/regist.html?version=2017122701",
            controller: 'RegistController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/apps/login_files/login.css",
                            "../assets/global/plugins/jquery.min.js",
                            'js/controllers/RegistController.js?version=2017122701'
                    ]);
                }]
            }
        })
        .state('passback', {
            url: "/passback",
            templateUrl: "views/passback.html?version=2017122701",
            controller: 'PassBackController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/apps/login_files/login.css",
                            "../assets/global/plugins/jquery.min.js",
                            'js/controllers/PassBackController.js?version=2017122701'
                    ]);
                }]
            }
        })
        .state('main', {
            url: "/main",
            templateUrl: "views/main.html?version=2017122701",
            controller: 'AppController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/echarts/echarts.min.js",
                          '../assets/global/plugins/datatables/datatables.min.css',
                          '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          '../assets/global/plugins/datatables/datatables.all.min.js',
                          "../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js",
                          // 'js/scripts/world.js?version=2017122701',
                    ])
                }]
            }
        })
        .state('main.home', {
            url: "/home",
            templateUrl: "views/home.html?version=2017122701",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      "../assets/global/plugins/jquery.min.js",
                      "../assets/global/plugins/echarts/echarts.min.js",
                      "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                      "../assets/pages/css/profile.min.css",
                      "../assets/pages/scripts/profile.min.js",
                      "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                      '../assets/global/plugins/datatables/datatables.all.min.js',
                    ])
                }]
            }
        })
        .state('main.home.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard2.html?version=2017122701",
            controller: 'HomeController2',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/echarts/echarts.min.js",
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            "../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js",
                            'js/scripts/world.js?version=2017122701',
                            'js/controllers/GeneralPageController.js?version=2017122701',
                            'js/controllers/HomeController2.js?version=2017122701'
                    ])
                }]
            }
        })
        .state('main.home.dashboard2', {
            url: "/dashboard2",
            templateUrl: "views/dashboard.html?version=2017122701",
            controller: 'HomeController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/GeneralPageController.js?version=2017122701',
                            'js/controllers/HomeController.js?version=2017122701'
                      ])
                }]
            }
        })
        .state('main.device', {
            url: "/device",
            templateUrl: "views/device.html?version=2017122701",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/echarts/echarts.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          "../assets/pages/css/profile.min.css",
                          "../assets/pages/scripts/profile.min.js",
                          "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                          "../assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js",
                          "../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",

                          // "../assets/global/plugins/jquery-knob/js/jquery.knob.js",
                          // "../assets/pages/scripts/components-knob-dials.min.js",
                    ])
                }]
            }
        })
        .state('main.device.monitor', {
            url: "/monitor",
            templateUrl: "views/monitor.html?version=2017122701",
            controller: 'DeviceMonitorController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            "../assets/global/plugins/echarts/echarts.min.js",
                            // "../assets/global/plugins/bootstrap/css/bootstrap.min.css",
                            "../assets/apps/css/widget.css",
                            // '../assets/pages/scripts/table-datatables-managed-kuyun.js',
                            "../assets/global/plugins/ezuikit/ezuikit.js",
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                            // "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                            // "../assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js",
                            // "../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                            // "../assets/global/plugins/jquery-knob/js/jquery.knob.js",
                            // "../assets/pages/scripts/components-knob-dials.min.js",
                            "../assets/global/plugins/ztree/css/zTreeStyle/zTreeStyle.css",
                            "../assets/global/plugins/ztree/js/jquery.ztree.core.js",
                            "js/controllers/DeviceMonitorController.js?version=2017122701 "

                      ])
                }]
            }
        })

        .state('main.device.monitorxmx', {
            url: "/monitorxmx",
            templateUrl: "views/monitorxmx.html?version=2017122701",
            controller: 'XmxMonitorController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/highcharts/js/highcharts_v6.0.4.js", //new add
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/echarts/echarts.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js",
                            "../assets/pages/css/xmxmonitor.css?version=2017122701",
                            "../assets/global/plugins/ztree/css/zTreeStyle/zTreeStyle.css",
                            "../assets/global/plugins/ztree/js/jquery.ztree.core.js",
                            "js/controllers/XmxMonitorController.js?version=2017122701",
                            "../assets/global/plugins/highcharts/js/xrange_v6.0.4.js", //new add

                      ])
                }]
            }
        })

        .state('main.device.alarm', {
            url: "/alarm",
            templateUrl: "views/alarm.html?version=2017122701",
            controller: 'AlarmController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        "../assets/global/plugins/jquery.min.js",
                        "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                        'js/controllers/AlarmController.js?version=2017122701'
                    ])
                }]
            }
        })
        .state('main.device.monitorscreen1', {
            url: "/monitorscreen1",
            templateUrl: "views/monitorscreen-1.html?version=2017122701",
            controller: 'MonitorScreen1Controller',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            "../assets/global/plugins/echarts/echarts.min.js",
                            "../assets/pages/css/bgscreen.css",
                            "../assets/global/css/plugins.min.css",
                            "../assets/global/plugins/jquery-easypiechart/jquery.easypiechart.js",
                            "js/controllers/MonitorScreen1Controller.js?version=2017122701"

                      ])
                }]
            }
        })
        .state('main.asset', {
            url: "/asset",
            templateUrl: "views/asset.html?version=2017122701",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        "../assets/global/plugins/jquery.min.js",
                        "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                        "../assets/pages/css/profile.min.css",
                        "../assets/pages/scripts/profile.min.js",
                        "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                    ])
                }]
            }
        })
        .state('main.asset.modalmanage', {
            url: "/modalmanage",
            templateUrl: "views/asset-modalmanage.html?version=2017122701",
            controller: 'ModalManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            "../assets/global/plugins/slick/slick.css",
                            "../assets/global/plugins/slick/slick-theme.css",
                            "../assets/pages/css/slider.css",
                            "../assets/global/plugins/slick/slick.min.js",
                            // "../assets/pages/scripts/slider.js?version=2017122701 ",
                            'js/controllers/ModalManageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.infomanage', {
            url: "/infomanage",
            templateUrl: "views/asset-infomanage.html?version=2017122701",
            controller: 'InfoManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js",
                            "../assets/global/plugins/fine-uploader/fine-uploader-gallery.min.css",
                            "../assets/global/plugins/fine-uploader/fine-uploader.min.js",
                            'js/controllers/InfoManageController.js?version=2017122701'
                    ])
                }]
            }
        })
        .state('main.asset.connectdevice', {
            url: "/connectdevice",
            params:{"equipmentInfo":null},
            templateUrl: "views/asset-connectdevice.html?version=2017122701",
            controller: 'ConnectDeviceController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          'js/controllers/ConnectDeviceController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.dtumanage', {
            url: "/dtumanage",
            templateUrl: "views/asset-dtumanage.html?version=2017122701",
            controller: 'DtuManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/DtuManageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.dtuConnectEquip', {
            url: "/dtuConnectEquip",
            params:{"dtuInfo":null},
            templateUrl: "views/asset-dtuConnectEquip.html?version=2017122701",
            controller: 'DtuEquipmentManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/DtuEquipmentManageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.warehousemanage', {
            url: "/warehousemanage",
            templateUrl: "views/asset-warehousemanage.html?version=2017122701",
            controller: 'WarehouseController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/WarehouseController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.warelocation', {
            url: "/warelocation",
            params:{"warehouseId":null, "name": null},
            templateUrl: "views/asset-warelocation.html?version=2017122701",
            controller: 'WarelocationController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/WarelocationController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.stocksmanage', {
            url: "/stocksmanage",
            templateUrl: "views/asset-stocksmanage.html?version=2017122701",
            controller: 'StocksmanageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/StocksmanageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.mtcmanage', {
            url: "/mtcmanage",
            templateUrl: "views/asset-mtcmanage.html?version=2017122701",
            controller: 'MtcManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/MtcManageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.partcategory', {
            url: "/partcategory",
            templateUrl: "views/asset-partcategory.html?version=2017122701",
            controller: 'PartCategoryController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            'js/controllers/PartCategoryController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.partmanage', {
            url: "/partmanage",
            templateUrl: "views/asset-partmanage.html?version=2017122701",
            controller: 'PartController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            'js/controllers/PartController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.worksheet', {
            url: "/worksheet",
            templateUrl: "views/asset-worksheet.html?version=2017122701",
            controller: 'WorkSheetController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/WorkSheetController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.worksheetdetail', {
            url: "/worksheetdetail",
            templateUrl: "views/asset-worksheetdetail.html?version=2017122701",
            controller: 'WorksheetdetailController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/WorksheetdetailController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting', {
            url: "/setting",
            templateUrl: "views/setting.html?version=2017122701",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        "../assets/global/plugins/jquery.min.js",
                        "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                        "../assets/pages/css/profile.min.css",
                        "../assets/pages/scripts/profile.min.js",
                    ])
                }]
            }
        })
        .state('main.setting.userboard', {
            url: "/userboard",
            templateUrl: "views/setting-userboard.html?version=2017122701",
            controller: 'UserboardController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/UserboardController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.usermanage', {
            url: "/usermanage",
            templateUrl: "views/setting-usermanage.html?version=2017122701",
            controller: 'UsermanageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/UsermanageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.companymanage', {
            url: "/companymanage",
            templateUrl: "views/setting-companymanage.html?version=2017122701",
            controller: 'CompanymanageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/CompanymanageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.companyequip', {
            url: "/companyequip",
            params:{"companyInfo":null},
            templateUrl: "views/setting-companyEquip.html?version=2017122701",
            controller: 'CompanyEquipmentManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                          'js/controllers/CompanyEquipmentManageController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.asset.netgate', {
            url: "/netgate",
            templateUrl: "views/setting-netgate.html?version=2017122701",
            controller: 'NetgateController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/NetgateController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.customer', {
            url: "/customer",
            templateUrl: "views/setting-customer.html?version=2017122701",
            controller: 'CustomerController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/CustomerController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.notify', {
            url: "/notify",
            templateUrl: "views/setting-notify.html?version=2017122701",
            controller: 'NotifyController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/NotifyController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.helpConnectRTU', {
            url: "/helpConnectRTU",
            templateUrl: "views/setting-help-connectRTU.html?version=2017122701",
            controller: 'HelpController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/HelpController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('main.setting.helpSetRTU', {
            url: "/helpSetRTU",
            templateUrl: "views/setting-help-setRTU.html?version=2017122701",
            controller: 'HelpController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            'js/controllers/HelpController.js?version=2017122701'

                    ])
                }]
            }
        })
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js?version=2017122701 '
                        ]
                    }]);
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
