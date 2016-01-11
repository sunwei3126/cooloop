'use strict';

angular.module('acount')
  .controller('NotificationCtrl', ['$scope', '$log', 'utility', 'accountResource', 'user',
      function ($scope, $log, utility, accountResource, user) {
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