'use strict';

angular.module('navbar', ['security.authorization'])
  .controller('NavbarCtrl', 
    function ($scope, $location, security) {
      $scope.menu = [{
        'title': '首页',
        'link': '/'}];

      $scope.isCollapsed = true;
      $scope.isLoggedIn = security.isAuthenticated;
      $scope.isAdmin = security.isAdmin;
      $scope.currentUser = security.currentUser;

      $scope.logout = function () {
        security.logout('/login');
      };

      $scope.getSites = function () {
        return security.currentUser.Sites;
      };
  
      $scope.isActive = function (route) {
        if(route == '/')
          return $location.path() == route;
        
        return $location.path().indexOf(route) >= 0;
      };
  });