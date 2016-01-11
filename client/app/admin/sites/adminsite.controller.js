'use strict';

angular.module('admin.site.detail', ['services.siteResource', 'services.utility', 'services.modalDialog', 'ui.bootstrap', 'admin.site.users'])
.controller('AdminSiteCtrl', ['$scope', '$modal', '$location', '$log', 'utility', 'modalService', 'siteResource', 'site', 
  function ($scope, $modal, $location, $log, utility, modalService, siteResource, site) {
    $scope.sitetypes = [
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
        label: "酒店",
        value: "hotel"
    }];
    
    $scope.isActives = [
      {
      label: "yes",
      value: "yes"
    }, {
      label: "no",
      value: "no"
    }];
    
    $scope.opts = {
        backdrop: true,
        keyboard: true,
        backdropClick: false,
        templateUrl: 'app/admin/sites/siteusers.html',
        controller: 'SiteUsersCtrl',
        resolve: {
          site: function () { return $scope.site; }, 
          siteusers: function () { return $scope.siteusers; } 
        }
    };    
    $scope.openDialog = function () {
      var d = $modal.open($scope.opts);

      d.result.then(function (result) {
        fetchSiteUsers($scope.site);
      }, function () {
        fetchSiteUsers($scope.site);
      });
    };
    
    $scope.canSave = utility.canSave;
    $scope.submit = function () {
      siteResource.updateSite($scope.site._id, $scope.site).then(function(data){
        $scope.adminSiteForm.$setPristine();
        if(data.success){
          $scope.alerts.push({
            type: 'success',
            msg: 'Site detail is updated.'
          });
        }else{
          angular.forEach(data.errors, function(err, index){
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      }, function(x){
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error updating site details: ' + x
        });
      });
    };
    
    //cancel
    $scope.cancel = function () {
      $scope.site = angular.copy(original);
      $scope.adminSiteForm.$setPristine();
    };
    
    $scope.removeUser = function (user) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Delete User',
        headerText: 'Delete ' + user.username + '?',
        bodyText: 'Are you sure you want to delete this user?'
      };

      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          var info = {
            'siteid': $scope.site._id,
            'userid': user._id
          };

          siteResource.removeSiteUser(info).then(function (data) {
            var index = $scope.siteusers.indexOf(user);
            $scope.siteusers.splice(index, 1);
          }, function (e) {
            $log.error(e);
          });
        }
      });
    };
    
    var fetchSiteUsers = function (site) {
      siteResource.getSiteUsers(site._id).then(function (data) {
        $scope.siteusers = data.users;
      }, function (e) {
        alert('Unable to fetch site users from server!');
      });
    };
    
    $scope.getSiteImage = function (site) {
      return site.siteimg ? site.siteimg : 'assets/images/building.jpg';
    };
    
    // model def
    var original = angular.copy(site);
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
    
    fetchSiteUsers(site);
  }
]);