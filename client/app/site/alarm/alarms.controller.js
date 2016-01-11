'use strict';

angular.module('site.alarms', ['firebase', 'services.siteResource', 'services.utility', 'ui.bootstrap'])
.controller('SiteAlarmsCtrl', ['$scope', '$firebaseArray', '$location', '$log', "$firebase", 'utility', 'siteResource', 
  function ($scope, $firebaseArray, $location, $log, $firebase, utility, siteResource) {

  //firebase
    var alarmRef = new Firebase("https://iecmon.firebaseio.com/Campus/Alarms");
    $scope.alarms = $firebaseArray(alarmRef);
    $scope.alarms.$loaded(function() {
      if ($scope.alarms.length === 0) {
        $scope.alarms.$add({
          "Stamp": "12:23:22 2015/09/10",
          "Level": "Normal",
          "Source": "HVAC1.Pumpx",
          "Detail": "OK"
        });
      }
    });
    
    // model def
    $scope.alerts = [];
    $scope.errfor = {};
    
    // method def
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.canSave = utility.canSave;
    $scope.closeAlert = function (ind) {
      $scope.alerts.splice(ind, 1);
    };    
  }
]);



