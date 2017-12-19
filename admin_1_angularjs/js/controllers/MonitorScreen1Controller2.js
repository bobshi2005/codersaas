angular.module('MetronicApp').controller('MonitorScreen1Controller', ['$scope', '$rootScope', '$state', '$http', 'userApi', 'locals','deviceApi','$window',function($scope, $rootScope, $state, $http, userApi,locals,deviceApi,$window) {
    $rootScope.menueName = 'sidebar-device';
    $rootScope.showMonitorScreen = locals.get("screenNumber");
    $rootScope.settings.layout.pageContentWhite = false;

    $scope.pmNumber = 45;
    $scope.pmPercent = 13;
    $scope.pmBarColor = 'green';
    $scope.pmSize = 100;
    $scope.co2Number = 466;
    $scope.co2Percent = 80;
    $scope.co2BarColor = 'blue';
    $scope.anionNumber = 466;
    $scope.anionPercent = 80;
    $scope.anionBarColor = 'blue';

    $scope.$on('$viewContentLoaded', function() {
      var pmHeight = $('.bgContainer').height()/2;
      $('.easy-pie-chart .number.pm25').css('height',pmHeight);
      $('.easy-pie-chart .number.pm25').css('width',pmHeight);
      $scope.pmSize = pmHeight;
      initchart();
      var resizeTimeout;
      window.onresize=function(){
        clearTimeout(resizeTimeout); //防止onresize连续调用两次
        resizeTimeout = setTimeout(function(){
          var winowHeight = $window.innerHeight; //获取窗口高度
          var headerHeight = 50;
          var footerHeight = 35;
          var paddingTop = 25;
          $('.screenContainer').css('height',(winowHeight - headerHeight - footerHeight -paddingTop) + 'px');
          var pmHeight = $('.bgContainer').height()/2;
          $('.easy-pie-chart .number.pm25').css('height',pmHeight);
          $('.easy-pie-chart .number.pm25').css('width',pmHeight);
          $scope.pmSize = pmHeight;
          updatecgart();
        },500)

      };

    });

    function getValues(){

    }

    function updatecgart(){

      $('.easy-pie-chart .number.pm25').easyPieChart({
        animate: 1000,
        size: $scope.pmSize,
        lineWidth: $scope.pmSize/10,
        barColor: function (percent) {
           return (percent < 50 ? '#5cb85c' : percent < 85 ? '#f0ad4e' : '#cb3935');
        },
        trackColor: '#c3c1cd',
        scaleColor: false,
        onStep: function(from, to, percent) {
            $(this.el).find('.pie-value').text(Math.round($scope.pmNumber));
        }
      });

      $('.easy-pie-chart .number.pm25').data('easyPieChart').update($scope.pmPercent);

      $('.easy-pie-chart .number.co2').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 10,
          barColor: $scope.co2BarColor,
          trackColor: '#c3c1cd',
          scaleColor: false,
          onStep: function(from, to, percent) {
              $(this.el).find('.pie-value').text(Math.round($scope.co2Number));
          }
      });
      $('.easy-pie-chart .number.co2').data('easyPieChart').update($scope.co2Percent);

      $('.easy-pie-chart .number.Anion').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: $scope.anionBarColor,
          trackColor: '#c3c1cd',
          scaleColor: false,
          onStep: function(from, to, percent) {
              $(this.el).find('.pie-value').text(Math.round($scope.anionNumber));
          }
      });
      $('.easy-pie-chart .number.Anion').data('easyPieChart').update($scope.anionPercent);
    }

    function initchart(){
      $('.easy-pie-chart .number.pm25').easyPieChart({
          animate: 1000,
          size: $scope.pmSize,
          lineWidth: $scope.pmSize/10,
          barColor: function (percent) {
             return (percent < 50 ? '#5cb85c' : percent < 85 ? '#f0ad4e' : '#cb3935');
          },
          trackColor: '#c3c1cd',
          scaleColor: false,
          onStep: function(from, to, percent) {
              $(this.el).find('.pie-value').text(Math.round($scope.pmNumber));
          }
      });

      $('.easy-pie-chart .number.pm25').data('easyPieChart').update($scope.pmPercent);

      $('.easy-pie-chart .number.co2').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 10,
          barColor: $scope.co2BarColor,
          trackColor: '#c3c1cd',
          scaleColor: false,
          onStep: function(from, to, percent) {
              $(this.el).find('.pie-value').text(Math.round($scope.co2Number));
          }
      });
      $('.easy-pie-chart .number.co2').data('easyPieChart').update($scope.co2Percent);

      $('.easy-pie-chart .number.Anion').easyPieChart({
          animate: 1000,
          size: 75,
          lineWidth: 3,
          barColor: $scope.anionBarColor,
          trackColor: '#c3c1cd',
          scaleColor: false,
          onStep: function(from, to, percent) {
              $(this.el).find('.pie-value').text(Math.round($scope.anionNumber));
          }
      });
      $('.easy-pie-chart .number.Anion').data('easyPieChart').update($scope.anionPercent);
    }
}]);
