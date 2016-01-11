'use strict';

angular.module('acount', ['acount.login', 'acount.signup', 'security.authorization', 'security.service', 'services.utility', 'services.accountResource'])
  .config(function ($stateProvider) {
    var unauthenticatedChecks = {
      check: {
        UnauthenticatedUser: ['$q', '$location', 'securityAuthorization',
          function ($q, $location, securityAuthorization) {
            var promise = securityAuthorization.requireUnauthenticatedUser()
              .catch(function (reason) {
                if (reason == 'authenticated-client') {
                  // user is authenticated, redirect
                  $location.path('/');
                  return $q.reject();
                }
              });
            return promise;
        }]
      }
    };

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl',
        resolve: unauthenticatedChecks.check,
        data: {
          displayName: 'Login',
          stateDescription: 'Login to IEC'
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl',
        resolve: unauthenticatedChecks.check,
        data: {
          displayName: 'Login',
          stateDescription: 'Login to VLink'
        }
      });
  });