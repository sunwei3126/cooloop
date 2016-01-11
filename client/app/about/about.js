'use strict';

angular.module('about', ['about.us', 'about.contact', 'security.authorization', 'security.service'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('aboutus', {
        url: '/about/us',
        templateUrl: 'app/about/us/us.html',
        controller: 'UsCtrl',
        data: {
          displayName: '关于海竞',
          stateDescription: '关于海竞'
        }
      })
      .state('contact', {
        url: '/about/contact',
        templateUrl: 'app/about/contact/contact.html',
        controller: 'ContactCtrl',
        data: {
          displayName: '联系我们',
          stateDescription: '联系我们'
        }
      })
      .state('clients', {
        url: '/about/clients',
        templateUrl: 'app/about/client/clients.html',
        data: {
          displayName: '客户',
          stateDescription: '我们的客户'
        }
      });
  });
