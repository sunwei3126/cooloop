'use strict';

angular.module('admin', ['services.siteResource', 'security.authorization', 'admin.user.list', 'admin.user.detail', 'admin.user.pwd', 'admin.user.sites', 'admin.site.list', 'admin.site.detail', 'admin.site.users','admin.system.mailbox', 'admin.system.default'])
  .config(function ($stateProvider) {
    var routeRoleChecks = {
      admin: {
        auth: ['securityAuthorization',
          function (securityAuthorization) {
            return securityAuthorization.requireAdminUser();
            }]
      }
    }
    
    var checkAndFindSite = {
      admin: {
        site: ['$q', '$stateParams', '$location', 'securityAuthorization', 'siteResource',
          function ($q, $stateParams, $location, securityAuthorization, siteResource) {
            var redirectUrl;
            var promise = securityAuthorization.requireAdminUser()
              .then(function () {
                var id = $stateParams.id || '';
                if (id) {
                  return siteResource.findSite(id);
                } else {
                  redirectUrl = '/admin/sites';
                  return $q.reject();
                }
              }, function (reason) {
                //rejected either user is un-authorized or un-authenticated
                redirectUrl = reason === 'unauthorized-client' ? '/' : '/login';
                return $q.reject();
              })
              .catch(function () {
                redirectUrl = redirectUrl || '/';
                $location.path(redirectUrl);
                return $q.reject();
              });
            return promise;
            }]
      }
    }

    var checkAndFindUser = {
      admin: {
        user: ['$q', '$stateParams', '$location', 'securityAuthorization', 'accountResource',
          function ($q, $stateParams, $location, securityAuthorization, accountResource) {
            var redirectUrl;
            var promise = securityAuthorization.requireAdminUser()
              .then(function () {
                var id = $stateParams.id || '';
                if (id) {
                  return accountResource.getAccountDetails(id);
                } else {
                  redirectUrl = '/admin/users';
                  return $q.reject();
                }
              }, function (reason) {
                //rejected either user is un-authorized or un-authenticated
                redirectUrl = reason === 'unauthorized-client' ? '/' : '/login';
                return $q.reject();
              })
              .catch(function () {
                redirectUrl = redirectUrl || '/';
                $location.path(redirectUrl);
                return $q.reject();
              });
            return promise;
            }]
      }
    }
    
    $stateProvider
      .state('adminsystem', {
        url: '/admin/system',
        abstract: true,
        templateUrl: 'app/admin/system/system.html',
        authenticate: true,
        data: {
          displayName: 'System Settings'
        }
      }) 
      .state('adminsystem.default', {
        url: '',
        templateUrl: 'app/admin/system/default.html',
        controller: 'SystemDefaultCtrl',
        authenticate: true,
        data: {
          displayName: 'Default Setting',
          stateDescription: 'System Default Setting'
        }
      }) 
      .state('adminsystem.mailbox', {
        url: '/mailbox',
        templateUrl: 'app/admin/system/mailbox.html',
        controller: 'SystemMailboxCtrl',
        authenticate: true,
        data: {
          displayName: 'mailbox',
          stateDescription: 'Set Mailbox Account'
        }
      })
      .state('adminuser', {
        url: '/admin/users',
        abstract: true,
        templateUrl: 'app/admin/admin.html',
        data: {
          abstractProxy: 'adminuser.list'
        }      
      })
      .state('adminuser.list', {
        url: '',
        templateUrl: 'app/admin/users/adminusers.html',
        controller: 'AdminUsersCtrl',
        data: {
          displayName: 'Users',
          stateDescription: 'Admin All Users'
        },      
        resolve: routeRoleChecks.admin
      })
      .state('adminuser.detail', {
        url: '/:id',
        templateUrl: 'app/admin/users/adminuser.html',
        controller: 'AdminUserCtrl',
        data: {
          displayName: '{{user.username}}',
          stateDescription: 'User Details'
        },        
        resolve: checkAndFindUser.admin
      })
      .state('adminuser.pwd', {
        url: '/:id/pwd',
        templateUrl: 'app/admin/users/adminuserpwd.html',
        controller: 'AdminUserPwdCtrl',
        data: {
          displayName: '{{user.username}}',
          stateDescription: 'Set user password'
        },        
        resolve: checkAndFindUser.admin
      })
      .state('adminsites', {
        url: '/admin/sites',
        abstract: true,
        templateUrl: 'app/admin/admin.html',
        data: {
          abstractProxy: 'adminsites.list'
        }      
      })
      .state('adminsites.list', {
        url: '',
        templateUrl: 'app/admin/sites/adminsites.html',
        controller: 'AdminSitesCtrl',
        data: {
          displayName: 'Sites',
          stateDescription: '项目列表'
        }
      })
      .state('adminsites.detail', {
        url: '/:id',
        templateUrl: 'app/admin/sites/adminsite.html',
        controller: 'AdminSiteCtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: 'Config site'
        },        
        resolve: checkAndFindSite.admin
      });
  });