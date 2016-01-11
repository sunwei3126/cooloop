'use strict';

angular.module('admin.system.mailbox', ['services.adminResource', 'services.utility'])
  .controller('SystemMailboxCtrl', ['$scope', '$log', 'utility', 'adminResource', 
  function ($scope, $log, utility, adminResource) {
      var fetchSetting = function () {
        adminResource.getMailbox().then(getMailboxSuccess, handleError);  
      };
    
      var getMailboxSuccess = function (data) {
        if (data.success) {
          $scope.email = JSON.parse(data.setting.info).email;
          $scope.password = '';
        } else {
          angular.forEach(data.errors, function (err, index) { //error due to server side validation
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      };

      $scope.submit = function () {
        var settings = {};
        settings.email = $scope.email;
        settings.password = $scope.password;

        adminResource.setMailbox(settings).then(setMailboxSuccess, handleError);
      };

      // local variable
      var setMailboxSuccess = function (data) {
        $scope.mailboxForm.$setPristine();
        if (data.success) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Maibox is configured.'
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

      var handleError = function () {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error set mailbox, Please try again!'
        });
      };

      // model def
      $scope.email = '';
      $scope.password = '';
      $scope.alerts = [];
      $scope.errfor = {};

      // method def
      $scope.hasError = utility.hasError;
      $scope.showError = utility.showError;
      $scope.canSave = utility.canSave;
      $scope.closeAlert = function (ind) {
        $scope.alerts.splice(ind, 1);
      };
    
      fetchSetting();
  }]);