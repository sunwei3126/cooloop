'use strict';

angular.module('admin.user.detail', ['services.accountResource', 'services.utility', 'services.modalDialog', 'ui.bootstrap', 'admin.user.sites'])
  .controller('AdminUserCtrl', ['$scope', '$modal', 'modalService', '$log', 'utility', 'accountResource', 'siteResource', 'user',
  function ($scope, $modal, modalService, $log, utility, accountResource, siteResource, user) {
    $scope.roles = [
      {
        label: "Administrator",
        value: "admin"
      },
      {
        label: "Ordinary User",
        value: "user"
      }
    ];

    $scope.isActives = [
      {
        label: "yes",
        value: "yes"
      }, 
      {
        label: "no",
        value: "no"
      }
    ];

    $scope.opts = {
      backdrop: true,
      keyboard: true,
      backdropClick: false,
      templateUrl: 'app/admin/users/usersites.html',
      controller: 'UserSitesCtrl',
      resolve: {
        user: function () {
          return $scope.user;
        }
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
      $scope.alerts = [];
      accountResource.setAccountDetails($scope.user).then(function (data) {
        if (data.success) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Account detail is updated.'
          });
        } else {
          angular.forEach(data.errors, function (err, index) {
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      }, function (x) {
        $scope.alerts.detail.push({
          type: 'danger',
          msg: 'Error updating account details: ' + x
        });
      });
    };

    //cancel
    $scope.cancel = function () {
      $scope.alerts = [];
      siteResource.findSite($scope.site._id).then(function (data) {
        if (data._id == $scope.site._id) {
          $scope.site = data;
          $scope.alerts.push({
            type: 'success',
            msg: 'Account detail is updated.'
          });
        } else {
          angular.forEach(data.errors, function (err, index) {
            $scope.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      }, function (x) {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error updating account details: ' + x
        });
      });
    };

    $scope.removeSite = function (site) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Delete Site',
        headerText: 'Delete ' + site.sitename + '?',
        bodyText: 'Are you sure not allow user to access this site?'
      };

      modalService.showModal({}, modalOptions).then(function (result) {
        var info = {
          'siteid': site._id,
          'userid': $scope.user._id
        };

        siteResource.removeSiteUser(info).then(function (data) {
          var index = $scope.user.Sites.indexOf(site);
          $scope.user.Sites.splice(index, 1);
        }, function (e) {
          $log.error(e);
        });
      });
    };

    var fetchSiteUsers = function (site) {
      siteResource.getSiteUsers(site._id).then(function (data) {
        $scope.siteusers = data.users;
      }, function (e) {
        alert('Unable to fetch users from server!');
      });
    };

    //initialize $scope variables
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
  }
]);