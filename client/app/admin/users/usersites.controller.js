'use strict';

angular.module('admin.user.sites', ['services.adminResource', 'services.siteResource', 'services.utility'])
.controller('UserSitesCtrl', ['$scope','$modalInstance', '$location', '$log', 'utility', 'adminResource', 'siteResource', 'user', 
  function ($scope, $modalInstance, $location, $log, utility, adminResource, siteResource, user) {
    // local var
    var deserializeData = function (data) {
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.sites = data.data;
    };

    $scope.isUnderUser = function (site) {
      for(var i=0;i<$scope.user.Sites.length;i++){
        if($scope.user.Sites[i]._id == site._id)
          return true;
      }
      
      return false;
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

    // $scope methods
    $scope.filtersUpdated = function () {
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchSites();
    };
    $scope.prev = function () {
      $scope.filters.page = $scope.pages.prev;
      fetchSites();
    };
    $scope.next = function () {
      $scope.filters.page = $scope.pages.next;
      fetchSites();
    };
    
    $scope.addSiteToUser = function (site) {
      var info = {
        'siteid': site._id, 
        'userid': $scope.user._id 
      };
      
      siteResource.addSiteUser(info).then(function (data) {
        $scope.user.Sites.push(site);
      }, function (e) {
        $log.error(e);
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    
    //initialize $scope variables
    $scope.filters = {};
    $scope.filters.limit = 5;
    $scope.filters.sort = "sitename";
    $scope.filters.role = '';
    
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
    
    fetchSites();
  }
]);