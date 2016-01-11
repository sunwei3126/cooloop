'use strict';

angular.module('acount')
  .controller('ProfileCtrl', ['$scope', '$log', 'utility', 'accountResource', 'user',
  function ($scope, $log, utility, accountResource, user) {
      $scope.submit = function () {
        var profile = {};
        profile.userid = $scope.user._id;
        profile.email = $scope.user.email;
        profile.mobile = $scope.user.mobile;

        accountResource.setProfile(profile).then(setProfileSuccess, setProfileError);
      };

      // local variable
      var setProfileSuccess = function (data) {
        $scope.profileForm.$setPristine();
        if (data.success) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Profile is updated.'
          });
        } else {
          angular.forEach(data.errors, function (err, index) { //error due to server side validation
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      };

      var setProfileError = function () {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error set profile, Please try again!'
        });
      };

      // model def
      $scope.user = user;
      $scope.alerts = [];
      $scope.errfor = {};

      // method def
      $scope.hasError = utility.hasError;
      $scope.showError = utility.showError;
      $scope.canSave = utility.canSave;
      $scope.closeAlert = function (ind) {
        $scope.alerts.splice(ind, 1);
      };
  }]);