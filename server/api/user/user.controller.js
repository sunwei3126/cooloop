'use strict';

var User = require('./user.model');
var Site = require('../site/site.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res, next) {
    req.query.username = req.query.username ? req.query.username : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '_id';
    req.query.isActive = req.query.isActive ? req.query.isActive : '';
    req.query.roles = req.query.roles ? req.query.roles : '';

    var filters = {};
    if (req.query.username) {
      filters.username = new RegExp('^.*?' + req.query.username + '.*$', 'i');
    }

    if (req.query.isActive) {
      filters.isActive = req.query.isActive;
    }

    if (req.query.role) {
      filters.role = req.query.role;
    }

    User.pagedFind({
      filters: filters,
      keys: '-salt -hashedPassword',
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      results.filters = req.query;
      res.status(200).json(results);
    });
  };

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.isActive = 'no'
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * add a new user
 */
exports.add = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.password = '888888';
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.isActive = 'no'
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.userid) {
      return workflow.emit('exception', 'not authenticated!');
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
    var newPass = String(req.body.newPassword);
    
    User.findById(userId, function (err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      user.password = newPass;
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
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    
    var result = { };
    result.user = user;
    res.json(result);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
