'use strict';

angular.module('acount.login', ['config', 'security.service', 'directives.serverError', 'services.utility', 'ui.bootstrap'])
  .controller('LoginCtrl', ['$scope', '$location', '$log', 'security', 'utility',
    function ($scope, $location, $log, security, utility) {
      var loginSuccess = function (data) {
        if (data.token) {
          return $location.path('/');
        } else {
          //error due to server side validation
          $scope.errfor = data.errfor;
          angular.forEach(data.errfor, function (err, field) {
            $scope.loginForm[field].$setValidity('server', false);
          });
          angular.forEach(data.errors, function (err, index) {
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      };
      var loginError = function () {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error logging you in, Please try again'
        });
      };
      // model def
      $scope.user = {};
      $scope.alerts = [];
      $scope.errfor = {};

      // method def
      $scope.hasError = utility.hasError;
      $scope.showError = utility.showError;
      $scope.canSave = utility.canSave;
      $scope.closeAlert = function (ind) {
        $scope.alerts.splice(ind, 1);
      };
      $scope.submit = function () {
        $scope.alerts = [];
        security.login($scope.user.username, $scope.user.password).then(loginSuccess, loginError);
      };
  }]);
