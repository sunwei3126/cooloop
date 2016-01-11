'use strict';

angular.module('about.us', ['config', 'security.service', 'directives.serverError', 'services.utility', 'ui.bootstrap'])
  .controller('UsCtrl', ['$scope', '$location', '$log', 'security', 'utility',
    function ($scope, $location, $log, security, utility) {
      $scope.alerts = [];
      $scope.errfor = {};

      // method def
      $scope.hasError = utility.hasError;
      $scope.showError = utility.showError;
      $scope.canSave = utility.canSave;
      $scope.closeAlert = function (ind) {
        $scope.alerts.splice(ind, 1);
      };

      $scope.base = 'assets/images/us/';
      $scope.slides = [
         { img: $scope.base + '1.png', title : '海竞中央空调智能控制系统' },
         { img: $scope.base + '2.png', title : '海竞楼宇能源管理系统' },
         { img: $scope.base + '3.png', title : '海竞楼宇通讯网关' },
         { img: $scope.base + '4.png', title : '海竞楼宇实时历史数据库' },
       ];
  }])
  .directive('bxSlider', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on('repeatFinished', function () {
                console.log("ngRepeat has finished");
                element.bxSlider({ adaptiveHeight: true, auto : true, captions:true, mode: 'fade'});
            });
        }
    }
  }])
  .directive('notifyWhenRepeatFinished', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('repeatFinished');
                });
            }
        }
    }
  }]);
