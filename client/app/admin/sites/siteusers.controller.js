'use strict';

angular.module('admin.site.users', ['services.adminResource', 'services.siteResource', 'services.utility'])
.controller('SiteUsersCtrl', ['$scope','$modalInstance', '$location', '$log', 'utility', 'adminResource', 'siteResource', 'site', 'siteusers',
  function ($scope, $modalInstance, $location, $log, utility, adminResource, siteResource, site, siteusers) {
    // local var
    var deserializeData = function (data) {
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.users = data.data;
    };

    $scope.isInSite = function (user) {
      for(var i=0;i<$scope.siteusers.length;i++){
        if($scope.siteusers[i].username == user.username)
          return true;
      }
      
      return false;
    };
    
    var fetchUsers = function () {
      adminResource.findUsers($scope.filters).then(function (data) {
        deserializeData(data);
          
        // update url in browser addr bar
        $location.search($scope.filters);
      }, function (e) {
        alert('Unable to fetch data from server!');
      });
    };

    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.filtersUpdated = function () {
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchUsers();
    };
    $scope.prev = function () {
      $scope.filters.page = $scope.pages.prev;
      fetchUsers();
    };
    $scope.next = function () {
      $scope.filters.page = $scope.pages.next;
      fetchUsers();
    };
    
    $scope.addSiteUser = function (user) {
      var info = {
        'siteid': $scope.site._id, 
        'userid': user._id 
      };
      
      siteResource.addSiteUser(info).then(function (data) {
        $scope.siteusers.push(user);
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
    $scope.filters.sort = "username";
    $scope.filters.role = '';
    $scope.site = site;
    $scope.siteusers = siteusers;
    fetchUsers();
  }
]);