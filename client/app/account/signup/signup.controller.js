'use strict';

angular.module('acount.signup', ['config', 'security.service', 'directives.serverError', 'services.utility', 'ui.bootstrap'])
  .controller('SignupCtrl', ['$scope', '$location', '$log', 'utility', 'security',
  function ($scope, $location, $log, utility, security) {
      // local variable
      var signupSuccess = function (data) {
        if (data.username) {
          //account/user created, redirect...
          var url = data.defaultReturnUrl || '/';
          return $location.path(url);
        } else {
          //error due to server side validation
          $scope.errfor = data.errfor;
          angular.forEach(data.errfor, function (err, field) {
            $scope.signupForm[field].$setValidity('server', false);
          });
        }
      };
      var signupError = function () {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error creating account, Please try again'
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
        security.signup($scope.user).then(signupSuccess, signupError);
      };
  }]);