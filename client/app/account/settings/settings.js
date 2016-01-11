'use strict';

angular.module('acount')
  .config(function ($stateProvider) {
    $stateProvider
      .state('settings', {
        url: '/settings',
        abstract: true,
        templateUrl: 'app/account/settings/settings.html',
        authenticate: true,
        resolve: {
          user: function(security) {
            return security.requestCurrentUser();
          } 
        },       
        data: {
          displayName: 'Settings'
        }
      }) 
      .state('settings.password', {
        url: '/password',
        templateUrl: 'app/account/settings/password.html',
        controller: 'PasswordCtrl',
        authenticate: true,
        data: {
          displayName: 'Password',
          stateDescription: 'Set your password'
        }
      })      
      .state('settings.profile', {
        url: '',
        templateUrl: 'app/account/settings/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true,
        data: {
          displayName: 'Profile',
          stateDescription: 'My profile information'
        }
      }) 
      .state('settings.notification', {
        url: '/notification',
        templateUrl: 'app/account/settings/notification.html',
        controller: 'NotificationCtrl',
        authenticate: true,
        data: {
          displayName: 'Notification',
          stateDescription: 'Check notification'
        }      
    });      
  });