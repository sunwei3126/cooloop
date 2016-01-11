'use strict';

angular.module('service.cases', ['services.siteResource', 'services.utility', 'services.modalDialog'])
.controller('ServiceCasesCtrl', ['$scope', '$location', '$state', '$log', 'utility', 'modalService', 'siteResource',
  function ($scope, $location, $state, $log, utility, modalService, siteResource) {
    $scope.sitetypes = [
      {
        label: "全部",
        value: ""
      },
      {
        label: "商业综合体",
        value: "mall"
      },
      {
        label: "医院",
        value: "hospital"
    },
      {
        label: "写字楼",
        value: "office building"
      },
        {
          label: "社区",
          value: "community"
      },
      {
        label: "酒店",
        value: "hotel"
    }];

    // local var
    var deserializeData = function (data) {
      $scope.sites = data.data;
    };

    var fetchSites = function () {
      siteResource.findSites($scope.filters).then(function (data) {
        deserializeData(data);

        // update url in browser addr bar
        $location.search($scope.filters);
      }, function (e) {
        alert('Unable to fetch data from server!');
      });
    };

    $scope.limitTextSize = function (text) {
      return text.substring(0, 50);
    };

    // $scope methods
    $scope.setFiler = function (item) {
      $scope.activetype = item.value;
    };

    $scope.getFilter = function() {
      return {sitetype: $scope.activetype};
    }

    $scope.isActiveT = function (item) {
      return $scope.activetype == item.value ? true : false;
    };

    $scope.getSiteImage = function (site) {
      return site.siteimg ? site.siteimg : 'assets/images/building.jpg';
    };

    //initialize $scope variables
    $scope.activetype = '';
    $scope.filters = {};
    $scope.filters.limit = 100;
    $scope.filters.sort = "sitename";
    $scope.filters.sitetype = '';
    fetchSites();
  }
]);
