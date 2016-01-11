'use strict';

var User = require('../user/user.model');
var Site = require('../site/site.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var auth = require('../../auth/auth.service');

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.userid) {
      return workflow.emit('exception', 'not authenticated!');
    }
    
    if (!req.body.oldPassword) {
      workflow.outcome.errfor.oldPassword = 'required';
    }
    
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = 'required';
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = 'required';
    }

    if (req.body.newPassword !== req.body.confirm) {
      workflow.outcome.errors.push('Passwords do not match.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('savePassword');
  });

  workflow.on('savePassword', function () {
    var userId = req.body.userid;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    
    User.findById(userId, function (err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        user.save(function (err) {
          if (err) {
            return workflow.emit('exception', err);
          }
          
          workflow.outcome.user = user;
          workflow.outcome.newPassword = '';
          workflow.outcome.confirm = '';
          workflow.emit('response');
        });
      } else {
        res.send(403);
      }
    });    
  });

  workflow.emit('validate');
}


/**
 * Change a users profile
 */
exports.setProfile = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.userid) {
      return workflow.emit('exception', 'not authenticated!');
    }
    
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    
    if (!req.body.mobile) {
      workflow.outcome.errfor.mobile = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('saveProfile');
  });

  workflow.on('saveProfile', function () {
    var userId = req.body.userid;
    var email = String(req.body.email);
    var mobile = String(req.body.mobile);
    
    User.findById(userId, function (err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      user.email = email;
      user.mobile = mobile;
      user.save(function (err) {
        if (err) {
          return workflow.emit('exception', err);
        }
          
        workflow.emit('response');
      });
    });    
  });

  workflow.emit('validate');
}

/**
 * get setting of user
 */
exports.getSetting = function(req, res, next){
  User.findById(req.params.id, '-salt -hashedPassword').populate('Sites', 'sitename _id').exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).json(user);
  });
}

/**
 * Change a users profile
 */
exports.setSetting = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body._id) {
      return workflow.emit('exception', 'not authenticated!');
    }
    
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    
    if (!req.body.mobile) {
      workflow.outcome.errfor.mobile = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('saveProfile');
  });

  workflow.on('saveProfile', function () {
    var userId = req.body._id;
    var email = String(req.body.email);
    var mobile = String(req.body.mobile);
    var role = String(req.body.role);
    var isActive = req.body.isActive;
    
    User.findById(userId, function (err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      user.email = email;
      user.mobile = mobile;
      user.isActive = isActive;
      user.role = role;
      user.save(function (err) {
        if (err) {
          return workflow.emit('exception', err);
        }
          
        workflow.emit('response');
      });
    });    
  });

  workflow.emit('validate');
}

/**
 * Get user's sites
 */
exports.getMySites = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('getUserInfo', function () {
    var userId = req.params.id;
    User.findById(userId, function (err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (user.Sites.length < 1 && user.role != 'admin') {
        workflow.outcome.errors.push('There are no sites authorized to you!');
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }
      
      workflow.emit('fetchSites', user);
    });    
  });

  workflow.on('fetchSites', function (user) {
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;

    var filters = {};
    if(user.role != 'admin')
    {
      filters._id = { $in: user.Sites };
    }
    Site.pagedFind({
      filters: filters,
      limit: 10,
      page: req.query.page,
      sort: 'sitename'
    }, function (err, results) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.filters = req.query;
      workflow.outcome.sites = results.data;
      workflow.emit('response');
    });
  });
  
  workflow.emit('getUserInfo');
}
