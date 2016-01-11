'use strict';

angular.module('admin.user.list', ['services.adminResource', 'services.utility', 'services.modalDialog'])
  .controller('AdminUsersCtrl', ['$scope', '$location', '$log', 'utility', 'modalService', 'adminResource',
  function ($scope, $location, $log, utility, modalService, adminResource) {
      // local var
      var deserializeData = function (data) {
        $scope.items = data.items;
        $scope.pages = data.pages;
        $scope.filters = data.filters;
        $scope.users = data.data;
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
      $scope.addUser = function () {
        adminResource.addUser($scope.username).then(function (data) {
          $scope.username = '';
          if (data.success) {
            $route.reload();
          } else if (data.errors && data.errors.length > 0) {
            alert(data.errors[0]);
          } else {
            alert('unknown error.');
          }
        }, function (e) {
          $scope.username = '';
          $log.error(e);
        });
      };

      $scope.delete = function (user) {
        var modalOptions = {
          closeButtonText: 'Cancel',
          actionButtonText: 'Delete User',
          headerText: 'Delete ' + user.username + '?',
          bodyText: 'Are you sure you want to delete this user?'
        };

        modalService.showModal({}, modalOptions).then(function (result) {
          if (result === 'ok') {
            adminResource.deleteUser(user._id).then(function (data) {
              angular.forEach($scope.users, function (u, i) {
                if (u._id === user._id) {
                  $scope.users.splice(i, 1);
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
      $scope.roles = [{
        label: "any",
        value: ""
    }, {
        label: "admin",
        value: "admin"
    }, {
        label: "user",
        value: "user"
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
          label: "username \u25B2",
          value: "username"
      },
        {
          label: "username \u25BC",
          value: "-username"
      },
        {
          label: "email \u25B2",
          value: "email"
      },
        {
          label: "email \u25BC",
          value: "-email"
      },
        {
          label: "mobile \u25B2",
          value: "mobile"
      },
        {
          label: "mobile \u25BC",
          value: "-mobile"
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
      $scope.filters.sort = "username";
      $scope.filters.role = '';
      fetchUsers();
  }
]);