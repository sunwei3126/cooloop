'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google/passport').setup(User, config);

var router = express.Router();


router.use('/local', require('./local'));
router.use('/google', require('./google'));

router.post('/logout', function(req, res, next) {
  req.logout();
  res.send({success: true});
});

module.exports = router;