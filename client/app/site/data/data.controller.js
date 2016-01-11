'use strict';

angular.module('site.data', ['services.siteResource', 'services.utility', 'ui.bootstrap'])
.controller('SiteDataCtrl', ['$scope', '$modal','$stateParams', '$location', '$log', 'utility', 'siteResource', 'site',
  function ($scope,$modal, $stateParams, $location, $log, utility, siteResource, site) {
    // model def
    $scope.site = site;
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
