'use strict';

angular.module('ourservice', ['service.cases', 'security.authorization', 'security.service'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('services', {
        url: '/service/services',
        templateUrl: 'app/service/services.html',
        data: {
          displayName: '产品与服务',
          stateDescription: '优质产品+放心服务'
        }
      })
      .state('iec', {
        url: '/products/iec',
        templateUrl: 'app/service/iec.html',
        data: {
          displayName: '中央空调智能控制系统',
          stateDescription: '赋予中央空调以智慧'
        },
      })
      .state('ems', {
        url: '/products/ems',
        templateUrl: 'app/service/ems.html',
        data: {
          displayName: '能源管理系统',
          stateDescription: '能源管理系统'
        },
      })
      .state('rtdb', {
        url: '/products/rtdb',
        templateUrl: 'app/service/rtdb.html',
        data: {
          displayName: 'RTDB',
          stateDescription: '海竞楼宇实时历史数据库'
        },
      })
      .state('gateway', {
        url: '/products/gateway',
        templateUrl: 'app/service/gateway.html',
        data: {
          displayName: '网关',
          stateDescription: '楼宇多协议通讯网关'
        },
      })
      .state('cases', {
        url: '/service/cases',
        templateUrl: 'app/service/cases.html',
        controller: 'ServiceCasesCtrl',
        data: {
          displayName: '项目案例',
          stateDescription: '中央空调智能控制系统'
        }
      })
      .state('faq', {
        url: '/service/faq',
        templateUrl: 'app/service/faq.html',
        data: {
          displayName: 'FAQ',
          stateDescription: '常见问题'
        }
      });
  });
