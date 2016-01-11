'use strict';

angular.module('site.panel', ['services.siteResource', 'services.utility', 'ui.bootstrap'])
.controller('SitePanelCtrl', ['$scope', '$modal', '$state', '$stateParams', '$location', '$log', 'utility', 'siteResource', 'site',
  function ($scope,$modal, $state, $stateParams, $location, $log, utility, siteResource, site) {
    // model def
    $scope.site = site;
  }
]);
