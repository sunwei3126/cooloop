'use strict';

angular.module('site.list', ['services.siteResource', 'services.utility', 'ui.bootstrap'])
.controller('SiteListCtrl', ['$scope', '$modal','$state', '$location', '$log', 'utility', 'siteResource', 'accountResource', 'user', 
  function ($scope,$modal, $state, $location, $log, utility, siteResource, accountResource, user) {
    // local var
    var deserializeData = function (data) {
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.sites = data.sites;
    };

    var fetchSites = function () {
      accountResource.getAccountSites(user._id, $scope.filters).then(function (data) {
        if (data.success) {
          deserializeData(data);
          $location.search($scope.filters);
        } else if (data.errors && data.errors.length > 0) {
          angular.forEach(data.errors, function (err, index) { //error due to server side validation
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        } 
      }, function (e) {
            $scope.alerts.push({
              type: 'danger',
              msg: 'Error in fetching sites: ' + e
            });
      });
    };
    
    $scope.getInclude = function(){
        if($scope.sites.length == 0){
          return "";
        } else if($scope.sites.length == 1){
            return 'app/site/portfolio/portfolio1.html';
        } else if ($scope.sites.length == 2){
          return 'app/site/portfolio/portfolio2.html';
        } else if ($scope.sites.length <= 9){
          return 'app/site/portfolio/portfolio3.html';
        }
          
        return 'app/site/portfolio/portfolio3.html';
    }
        
    $scope.getSiteImage = function (site) {
      return site.siteimg ? site.siteimg : 'assets/images/building.jpg';
    };
    
    $scope.show = function (site) {
      $state.go('mysites.panel.hmi', { id : site._id});
    };
    
    // $scope methods
    $scope.canSave = utility.canSave;
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
    
    //initialize $scope variables
    $scope.filters = {};
    // model def
    $scope.user = user;
    $scope.sites = [];
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