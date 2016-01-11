'use strict';

var express = require('express');
var controller = require('./account.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.put('/password', auth.isAuthenticated(), controller.changePassword);
router.put('/profile', auth.isAuthenticated(), controller.setProfile);
router.get('/setting/:id', auth.hasRole('admin'), controller.getSetting);
router.put('/setting', auth.hasRole('admin'), controller.setSetting);
router.get('/:id/sites', auth.isAuthenticated(), controller.getMySites);

module.exports = router;
