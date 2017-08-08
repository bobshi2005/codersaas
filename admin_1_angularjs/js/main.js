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
    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','$state', 'ModalService','locals',function($scope, $rootScope,$state,ModalService,locals) {
    Layout.init();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var islogin=locals.get('islogin');
        // console.log('islogin',islogin);
        // console.log('to', toState.name);
        if(islogin==1 || toState.name == 'login' || toState.name == 'regist' ) {
          if($rootScope.isloginpage == false) {
             if(toState.name == 'regist' || toState.name == 'login') {
               $rootScope.showHeader = false;
             }else {
               if(toState.name != 'main.home.dashboard'){
                 $rootScope.showHeader = true;
               }
             }
          }
        } else {
          // console.log('isloginerr', islogin);
          // console.log('to', toState.name);
          event.preventDefault();
          App.stopPageLoading();
          $state.transitionTo("login");

        }
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
MetronicApp.controller('HeaderController', ['$rootScope','$scope','$state','locals', function($rootScope, $scope, $state, locals) {
    $scope.logout = function() {
        locals.set("islogin", 0);
        locals.set("username", '');
        locals.set("password", '');
        $state.transitionTo("login",{},{reload: true});
    }
    $scope.useraccount = locals.get("username");
    $scope.getusername = function(){
      return locals.get("username");
    }
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
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
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.when('', '/login');
    $urlRouterProvider.otherwise('/login');
    $stateProvider

        // home
        .state('login', {
            url: "/login",
            templateUrl: "views/login5.html?version=2017071304",
            controller: 'LoginController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'loginApp',
                        files: [
                            "../assets/pages/css/login-5.css",
                            "../assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                            "../assets/global/plugins/jquery-validation/js/additional-methods.min.js",
                            "../assets/global/plugins/backstretch/jquery.backstretch.min.js",
                            "../assets/pages/scripts/login-5.js",
                            "js/controllers/LoginController.js?version=2017071304 ",

                        ]
                    }])
                }]
            }
        })
        .state('regist', {
            url: "/regist",
            templateUrl: "views/regist.html?version=2017071304",
            controller: 'RegistController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'registApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            "../assets/apps/login_files/login.css",
                            "../assets/apps/login_files/jquery-1.8.3.min.js",
                            'js/controllers/RegistController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })
        .state('main', {
            url: "/main",
            templateUrl: "views/main.html?version=2017071304",
            controller: 'AppController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'homeApp',
                        cache: true,
                        files: [
                          "../assets/global/plugins/jquery.min.js",
                          "../assets/global/plugins/echarts/echarts.min.js",
                          '../assets/global/plugins/datatables/datatables.min.css',
                          '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          '../assets/global/plugins/datatables/datatables.all.min.js',
                          "../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js",
                          'js/scripts/world.js?version=2017071304',
                        ]
                    }])
                }]
            }


        })
        .state('main.home', {
            url: "/home",
            templateUrl: "views/home.html?version=2017071304",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'homeApp',
                        cache: true,
                        files: [
                            "../assets/pages/css/profile.min.css",
                            "../assets/pages/scripts/profile.min.js",
                            // '../assets/global/plugins/datatables/datatables.min.css',
                            // '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            // '../assets/global/plugins/datatables/datatables.all.min.js',
                            // "../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js",
                            // 'js/scripts/world.js?version=2017071304',
                        ]
                    }])
                }]
            }
        })
        .state('main.home.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard2.html?version=2017071304",
            controller: 'HomeController2',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      {
                        name: 'dashboardApp',
                        cache: false,
                        files: [
                            // "../assets/global/plugins/jquery.min.js",
                            // "../assets/global/plugins/echarts/echarts.min.js",
                            // '../assets/global/plugins/datatables/datatables.min.css',
                            // '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            // '../assets/global/plugins/datatables/datatables.all.min.js',
                            // "../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js",
                            // 'js/scripts/world.js?version=2017071304',

                            'js/controllers/GeneralPageController.js?version=2017071304',
                            'js/controllers/HomeController2.js?version=2017071304 '

                        ]
                    }])
                }]
            }
        })
        .state('main.home.dashboard2', {
            url: "/dashboard2",
            templateUrl: "views/dashboard.html?version=2017071304",
            controller: 'HomeController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'dashboard2App',
                        files: [
                            'js/controllers/GeneralPageController.js?version=2017071304 ',
                            'js/controllers/HomeController.js?version=2017071304 '

                        ]
                    }])
                }]
            }
        })

        .state('main.device', {
            url: "/device",
            templateUrl: "views/device.html?version=2017071304",
            cache: false,
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'deviceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        cache: false,
                        files: [
                          "../assets/pages/css/profile.min.css",
                          "../assets/pages/scripts/profile.min.js",
                          "../assets/global/plugins/jquery-knob/js/jquery.knob.js",
                          "../assets/pages/scripts/components-knob-dials.min.js",
                          "../assets/global/plugins/ztree/css/zTreeStyle/zTreeStyle.css",
                          "../assets/global/plugins/ztree/js/jquery.ztree.core.js",
                          "../assets/global/plugins/ezuikit/ezuikit.js",
                          "http://cache.amap.com/lbs/static/es5.min.js",
                          "http://webapi.amap.com/maps?v=1.3&key=6b4c9a24cdc8f3b738fa3a574602cb9c",

                        ]
                    }])
                }]
            }
        })
        .state('main.device.devicemap', {
            url: "/devicemap",
            templateUrl: "views/devicemap.html?version=2017071304",
            controller: 'MapController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'devicemapApp',
                        files: [
                            "js/controllers/MapController.js?version=2017071304 "
                        ]
                    }])
                }]
            }
        })
        .state('main.device.monitor', {
            url: "/monitor",
            templateUrl: "views/monitor.html?version=2017071304",
            controller: 'DeviceMonitorController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'monitorApp',
                        files: [
                            "../assets/apps/css/widget.css",
                            "../assets/global/plugins/echarts/echarts.min.js",
                            '../assets/pages/scripts/table-datatables-managed-kuyun.js',
                            "js/controllers/DeviceMonitorController.js?version=2017071304 "
                        ]
                    }])
                }]
            }
        })
        .state('main.device.alarm', {
            url: "/alarm",
            templateUrl: "views/alarm.html?version=2017071304",
            controller: 'AlarmController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'alarmApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/AlarmController.js?version=2017071304 '
                        ]
                    }])
                }]
            }

        })
        .state('main.asset', {
            url: "/asset",
            templateUrl: "views/asset.html?version=2017071304",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'assetApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        cache: false,
                        files: [
                            "../assets/pages/css/profile.min.css",
                            "../assets/pages/scripts/profile.min.js",
                            "../assets/global/plugins/slick/slick.css",
                            "../assets/global/plugins/slick/slick-theme.css",
                            "../assets/pages/css/slider.css",
                            "../assets/global/plugins/slick/slick.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.modalmanage', {
            url: "/modalmanage",
            templateUrl: "views/asset-modalmanage.html?version=2017071304",
            controller: 'ModalManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'modalmanageApp',
                        // insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            "../assets/global/plugins/slick/slick.css",
                            "../assets/global/plugins/slick/slick-theme.css",
                            "../assets/pages/css/slider.css",
                            "../assets/global/plugins/slick/slick.min.js",
                            // "../assets/pages/scripts/slider.js?version=2017071304 ",
                            'js/controllers/ModalManageController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.infomanage', {
            url: "/infomanage",
            templateUrl: "views/asset-infomanage.html?version=2017071304",
            controller: 'InfoManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'infomanageApp',
                        files: [

                        //    "../assets/global/plugins/bootstrap/css/bootstrap.min.css",
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            "../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                            'js/controllers/InfoManageController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.connectdevice', {
            url: "/connectdevice",
            params:{"equipmentId":null, "name": null, "heartData":null, "protocolId":null, "equipmentModelId": null},
            templateUrl: "views/asset-connectdevice.html?version=2017071304",
            controller: 'ConnectDeviceController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'connectdeviceApp',
                        files: [
                          'js/controllers/ConnectDeviceController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.warehousemanage', {
            url: "/warehousemanage",
            templateUrl: "views/asset-warehousemanage.html?version=2017071304",
            controller: 'WarehouseController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'WarehouseApp',
                        files: [
                          'js/controllers/WarehouseController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.stocksmanage', {
            url: "/stocksmanage",
            templateUrl: "views/asset-stocksmanage.html?version=2017071304",
            controller: 'StocksmanageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'stocksmanageApp',
                        files: [
                          'js/controllers/StocksmanageController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.mtcmanage', {
            url: "/mtcmanage",
            templateUrl: "views/asset-mtcmanage.html?version=2017071304",
            controller: 'MtcManageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'mtcmanageApp',
                        files: [
                            'js/controllers/MtcManageController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.partcategory', {
            url: "/partcategory",
            templateUrl: "views/asset-partcategory.html?version=2017071304",
            controller: 'PartCategoryController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'partcategoryApp',
                        files: [
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            'js/controllers/PartCategoryController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.part', {
            url: "/part",
            templateUrl: "views/asset-part.html?version=2017071304",
            controller: 'PartController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'partApp',
                        files: [
                            "../assets/global/plugins/jquery.min.js",
                            "../assets/global/plugins/bootstrap/js/bootstrap.min.js",
                            'js/controllers/PartController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.worksheet', {
            url: "/worksheet",
            templateUrl: "views/asset-worksheet.html?version=2017071304",
            controller: 'WorkSheetController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'worksheetApp',
                        files: [
                            'js/controllers/WorkSheetController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.worksheetdetail', {
            url: "/worksheetdetail",
            templateUrl: "views/asset-worksheetdetail.html?version=2017071304",
            controller: 'WorksheetdetailController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'worksheetdetailApp',
                        files: [
                            'js/controllers/WorksheetdetailController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.setting', {
            url: "/setting",
            templateUrl: "views/setting.html?version=2017071304",
        })
        .state('main.setting.userboard', {
            url: "/userboard",
            templateUrl: "views/setting-userboard.html?version=2017071304",
            controller: 'UserboardController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'userboardApp',
                        files: [
                            'js/controllers/UserboardController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.setting.usermanage', {
            url: "/usermanage",
            templateUrl: "views/setting-usermanage.html?version=2017071304",
            controller: 'UsermanageController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'usermanageApp',
                        files: [
                            'js/controllers/UsermanageController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.asset.netgate', {
            url: "/netgate",
            templateUrl: "views/setting-netgate.html?version=2017071304",
            controller: 'NetgateController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'netgateApp',
                        files: [
                            'js/controllers/NetgateController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.setting.customer', {
            url: "/customer",
            templateUrl: "views/setting-customer.html?version=2017071304",
            controller: 'CustomerController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'customerApp',
                        files: [
                            'js/controllers/CustomerController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.setting.notify', {
            url: "/notify",
            templateUrl: "views/setting-notify.html?version=2017071304",
            controller: 'NotifyController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'notifyApp',
                        files: [
                            'js/controllers/NotifyController.js?version=2017071304 '
                        ]
                    }])
                }]
            }
        })
        .state('main.setting.help', {
            url: "/help",
            templateUrl: "views/setting-help.html?version=2017071304",
            controller: 'HelpController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'helpApp',
                        files: [
                            'js/controllers/HelpController.js?version=2017071304 '
                        ]
                    }])
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
                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {
                pageTitle: 'AngularJS Ui Select'
            },
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {
                pageTitle: 'AngularJS UI Bootstrap'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {
                pageTitle: 'jQuery Tree View'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {
                pageTitle: 'Form Tools'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {
                pageTitle: 'Date & Time Pickers'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {
                pageTitle: 'Custom Dropdowns'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {
                pageTitle: 'Advanced Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {
                pageTitle: 'Ajax Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js?version=2017071304 '
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {
                pageTitle: 'User Profile'
            },
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js?version=2017071304 '
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {
                pageTitle: 'User Profile'
            }
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {
                pageTitle: 'User Account'
            }
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {
                pageTitle: 'User Help'
            }
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {
                pageTitle: 'Todo'
            },
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js?version=2017071304 '
                        ]
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
