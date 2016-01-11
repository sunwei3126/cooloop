/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Site = require('../api/site/site.model');
var User = require('../api/user/user.model');
var Util = require('util');

Site.find({}).remove(function () {
  Site.create({
    sitename: '成都来福士广场',
    sitetype: 'mall',
    isActive: 'no',
    siteimg: 'assets/images/sites/rifile.jpg',
    info: ''
  }  , {
    sitename: '杭州市中医院',
    sitetype: 'hospital',
    isActive: 'no',
    siteimg: 'assets/images/sites/hzszyy.jpg',
    info: ''
  }
  , {
    sitename: '巢湖市第一人民医院',
    sitetype: 'hospital',
    isActive: 'no',
    siteimg: 'assets/images/sites/chaohu.jpg',
    info: ''
  }
  , {
    sitename: '三亚鸿洲国际游艇酒店',
    sitetype: 'hotel',
    isActive: 'yes',
    siteimg: 'assets/images/sites/hongzhou.jpg',
    info: ''
  }, {
    sitename: '郎诗中园社区',
    sitetype: 'community',
    isActive: 'yes',
    siteimg: 'assets/images/sites/lszy.jpg',
    info: ''
  }, {
    sitename: '合肥第三人民医院',
    sitetype: 'hospital',
    isActive: 'no',
    siteimg: 'assets/images/sites/hfsy.jpg',
    info: ''
  }, {
    sitename: '上海时尚国际中心',
    sitetype: 'mall',
    isActive: 'no',
    siteimg: 'assets/images/sites/shishang.jpg',
    info: ''
  }, {
    sitename: '上海奉贤镇政府大楼',
    sitetype: 'office building',
    isActive: 'no',
    siteimg: 'assets/images/sites/fxzzf.jpg',
    info: ''
  });
});

User.find({}).remove(function () {
  User.create({
    provider: 'local',
    role: 'admin',
    username: 'Admin',
    email: 'admin@admin.com',
    isActive:'yes',
    password: 'cooloop17a07'
  }, function () {
    console.log('finished populating users');
  });
});
