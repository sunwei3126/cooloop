'use strict';

angular.module('admin.site.list', ['services.siteResource', 'services.utility', 'services.modalDialog'])
.controller('AdminSitesCtrl', ['$scope', '$location', '$state', '$log', 'utility', 'modalService', 'siteResource',
  function ($scope, $location, $state, $log, utility, modalService, siteResource) {
    // local var
    var deserializeData = function (data) {
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
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
    $scope.addSite = function () {
      siteResource.addSite($scope.newsitename).then(function (data) {
        $scope.newsitename = '';
        if (data.success) {
          $state.go('adminsites.detail', { id : data.site._id});
        } else if (data.errors && data.errors.length > 0) {
          if(data.errors[0].indexOf('duplicate key') > 0)
            alert('Site already exsist!');
          else  
            alert(data.errors[0]);
        } else {
          alert('unknown error.');
        }
      }, function (e) {
        $scope.newsitename = '';
        $log.error(e);
      });
    };

    $scope.delete = function (site) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Delete Site',
        headerText: 'Delete ' + site.sitename + '?',
        bodyText: 'Are you sure you want to delete this site?'
      };

      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          siteResource.deleteSite(site._id).then(function (data) {
            angular.forEach($scope.sites, function (u, i) {
              if (u._id === site._id) {
                $scope.sites.splice(i, 1);
              }
            });
          }, function (e) {
            $log.error(e);
          });
        }
      });
    };
    // $scope vars
    //select elements and their associating options
    $scope.sitetypes = [
      {
        label: "any",
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
        label: "酒店",
        value: "hotel"
    }];
    $scope.isActives = [{
      label: "either",
      value: ""
    }, {
      label: "yes",
      value: "yes"
    }, {
      label: "no",
      value: "no"
    }];
    $scope.sorts = [
      {
        label: "sitename \u25B2",
        value: "sitename"
      },
      {
        label: "sitename \u25BC",
        value: "-sitename"
      },
      {
        label: "sitetype \u25B2",
        value: "sitetype"
      },
      {
        label: "sitetype \u25BC",
        value: "-sitetype"
      }
    ];
    $scope.limits = [
      {
        label: "10 items",
        value: 10
      },
      {
        label: "20 items",
        value: 20
      },
      {
        label: "50 items",
        value: 50
      },
      {
        label: "100 items",
        value: 100
      }
    ];

    //initialize $scope variables
    $scope.filters = {};
    $scope.filters.sort = "sitename";
    $scope.filters.sitetype = '';
    fetchSites();
  }
]);