'use strict';

angular.module('about.contact', ['config', 'security.service', 'directives.serverError', 'services.utility', 'services.aboutResource'])
  .controller('ContactCtrl', ['$scope', '$location', '$log', 'security', 'utility', 'aboutResource',
    function ($scope, $location, $log, security, utility, aboutResource) {
      $scope.submit = function () {
        aboutResource.contactUs($scope.contact).then(sendSuccess, sendFailed);
      };
      
      var sendSuccess = function (data) {
        if (data.success) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Message is sent.'
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
      var sendFailed = function () {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error send message, Please try again!'
        });
      };
      // model def
      $scope.contact = {};
      $scope.contact.sender = '';
      $scope.contact.email = '';
      $scope.contact.message = '';
      
      // method def
      $scope.alerts = [];
      $scope.errfor = {};
      $scope.hasError = utility.hasError;
      $scope.showError = utility.showError;
      $scope.canSave = utility.canSave;
      $scope.closeAlert = function (ind) {
        $scope.alerts.splice(ind, 1);
      };
  }]);