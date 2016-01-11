'use strict';

angular.module('admin.system.default', [])
  .controller('SystemDefaultCtrl', ['$scope', '$log', 'utility', 
      function ($scope, $log, utility) {
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