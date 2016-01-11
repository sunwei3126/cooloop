'use strict';

angular.module('acount')
  .controller('PasswordCtrl', ['$scope', '$log', 'utility', 'accountResource', 'user',
      function ($scope, $log, utility, accountResource, user) {
        $scope.submit = function (form) {
          $scope.alerts = [];
          $scope.pass.userid = user._id;
          accountResource.setPassword($scope.pass).then(function (data) {
            $scope.pass = {};
            $scope.passwordForm.$setPristine();
            if (data.success) {
              $scope.alerts.push({
                type: 'success',
                msg: 'Password is updated.'
              });
            } else {
              //error due to server side validation
              angular.forEach(data.errors, function (err, index) {
                $scope.alerts.push({
                  type: 'danger',
                  msg: err
                });
              });
            }
          }, function (x) {
            $scope.alerts.push({
              type: 'danger',
              msg: 'Error set profile, Please try again!'
            });
          });
        };

        //model def
        $scope.errfor = {}; //for identity server-side validation
        $scope.alerts = [];
        $scope.pass = {};

        // method def
        $scope.hasError = utility.hasError;
        $scope.showError = utility.showError;
        $scope.canSave = utility.canSave;
        $scope.closeAlert = function(ind){
          $scope.alerts.splice(ind, 1);
        };
}]);