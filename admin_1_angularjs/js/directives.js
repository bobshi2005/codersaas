/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };
});


MetronicApp.directive('widget', function($http, $window) {
    function link($scope, element, attrs) {
      var showtype = $scope.$eval(attrs.eType);

      if(showtype =='led'){
        var option = $scope.$eval(attrs.eData);
        element[0].innerHTML = "<div class='led-text'>"+option.value+option.unit+"</div>";
      }else{
        var myChart = echarts.init(element[0]);
        $scope.$watch(attrs['eData'], function() {
            var option = $scope.$eval(attrs.eData);
            if (angular.isObject(option)) {
                myChart.setOption(option);
                myChart.resize();
            }
        }, true);
        // $scope.getDom = function() {
        //     return {
        //         'height': element[0].offsetHeight,
        //         'width': element[0].offsetWidth
        //     };
        // };
        // $scope.$watch($scope.getDom, function() {
        //     // resize echarts图表
        //     myChart.resize();
        // }, true);
      }

    }
    return {
        restrict: 'A',
        link: link
    };
});

// MetronicApp.directive('eChart', ['$window', function ($window) {
//
//      return {
//         link: link,
//         restrict: 'A',
//      };
//      function link($scope, element, attrs){
//        var container = element[0];
//        var myChart = echarts.init(container);
//        $scope.$watch(attrs['eData'], function() {
//            var option = $scope.$eval(attrs.eData);
//            console.log('option', option);
//            if (angular.isObject(option)) {
//                myChart.setOption(option);
//                $scope.onResizeFunction();
//            }
//        }, true);
//        $scope.onResizeFunction = function() {
//         myChart.resize();
//         console.log(element[0].offsetHeight+"-"+element[0].offsetWidth);
//       };
//       angular.element($window).bind('resize', function() {
//         $scope.onResizeFunction();
//         $scope.$apply();
//       });
//      }
//
//  }]);
