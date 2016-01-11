'use strict';

angular.module('site', ['site.list', 'site.panel', 'site.hmi', 'site.data', 'site.alarms', 'site.equipments', 'services.siteResource', 'security.authorization'])
  .config(function ($stateProvider) {
    var routeRoleChecks = {
      admin: {
        auth: ['securityAuthorization',
          function (securityAuthorization) {
            return securityAuthorization.requireAdminUser();
            }]
      }
    }
    
    var authenticatedChecks = {
      check: {
        authenticatedUser: ['$q', '$location', 'securityAuthorization',
          function ($q, $location, securityAuthorization) {
            var promise = securityAuthorization.requireAuthenticatedUser()
              .catch(function (reason) {
                if (reason == 'unauthenticated-client') {
                  // user is authenticated, redirect
                  $location.path('/');
                  return $q.reject();
                }
              });
            return promise;
        }]
      }
    };
    
    var checkAndFindSite = {
      me: {
        site: ['$q', '$stateParams', '$location', 'securityAuthorization', 'siteResource',
          function ($q, $stateParams, $location, securityAuthorization, siteResource) {
            var redirectUrl;
            var promise = securityAuthorization.requireAuthenticatedUser()
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

    $stateProvider
      .state('mysites', {
        url: '/mysites',
        abstract: true,
        templateUrl: 'app/shared/contentholder.html',
        data: {
          abstractProxy: 'mysites.list'
        }      
      })
      .state('mysites.list', {
        url: '',
        templateUrl: 'app/site/portfolio/sitelist.html',
        controller: 'SiteListCtrl',
        data: {
          displayName: '项目列表',
          stateDescription: '项目管理'
        },
        resolve: {
          user: function(security) {
            return security.requestCurrentUser();
          } 
        }       
      })
      .state('portfolio', {
        url: '/portfolio',
        abstract: true,
        templateUrl: 'app/shared/contentholder.html',
        data: {
          abstractProxy: 'portfolio.list'
        }      
      })
      .state('portfolio.list', {
        url: '',
        templateUrl: 'app/site/portfolio/portfolio.html',
        controller: 'SiteListCtrl',
        data: {
          displayName: 'Site Portfolio',
          stateDescription: 'Watch my sites'
        },
        resolve: {
          user: function(security) {
            return security.requestCurrentUser();
          } 
        }       
      })
      .state('portfolio.panel', {
        url: '/:id',
        templateUrl: 'app/site/panel.html',
        controller: 'SitePanelCtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: 'Watch site'
        },      
        resolve: checkAndFindSite.me
      })    
      .state('mysites.panel', {
        url: '/:id',
        abstract: true,
        templateUrl: 'app/site/panel.html',
        controller: 'SitePanelCtrl',
        data: {
          stateDescription: '系统总图'
        },            
        resolve: checkAndFindSite.me
      })
      .state('mysites.panel.hmi', {
        url: '',
        templateUrl: 'app/site/hmi/hmi.html',
        controller: 'SiteHMICtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: '系统总图'
        }      
      })
      .state('mysites.panel.equipments', {
        url: '/equipments',
        templateUrl: 'app/site/equipment/equipments.html',
        controller: 'SiteEquipmentsCtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: 'Site Equipments'
        }      
      })
      .state('mysites.panel.data', {
        url: '/data',
        templateUrl: 'app/site/data/data.html',
        controller: 'SiteDataCtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: 'Site Data'
        }      
      })
      .state('mysites.panel.alarms', {
        url: '/alarms',
        templateUrl: 'app/site/alarm/alarms.html',
        controller: 'SiteAlarmsCtrl',
        data: {
          displayName: '{{site.sitename}}',
          stateDescription: 'Site Alarms'
        }      
      });
  });