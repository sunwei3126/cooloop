'use strict';

var _ = require('lodash');
var Setting = require('./setting.model');
var url  = require("url");

// Get a single site
exports.getItem = function (req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var itemname = req.params.item;

  workflow.on('validate', function () {
    if (!itemname) {
      return workflow.emit('exception', 'Setting item is required!');
    }
    
    workflow.emit('findItem');
  });

  workflow.on('findItem', function () {
    Setting.findOne({
      item: itemname
    }, function(err, setting) { // don't ever give out the password or salt
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (!setting) {
        return workflow.emit('exception', 'item not configured');
      }

      workflow.outcome.setting = setting;  
      workflow.emit('response');    
    });
  });

  workflow.emit('validate');
};

/**
 * Change a site's detail 
 */
exports.setItem = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);
  var itemname = req.params.item;

  workflow.on('validate', function () {
    if (!itemname) {
      return workflow.emit('exception', 'Setting des item is required!');
    }

    if (!req.body) {
      return workflow.emit('exception', 'Setting item value is required!');
    }
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('findItem');
  });

  workflow.on('findItem', function () {
    Setting.findOne({
      item: itemname
    }, function(err, setting) { // don't ever give out the password or salt
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if(!setting)
        workflow.emit('newItem');    
      else
        workflow.emit('saveItem', setting);    
    });
  });

  workflow.on('newItem', function () {
    var data = {
      'item': itemname,
      'info': JSON.stringify(req.body)
    };
    
    Setting.create(data, function (err) {
      if (err) {
        return workflow.emit('exception', err);
      }
        
      workflow.emit('response');
    });
  });
  
  workflow.on('saveItem', function (setting) {
    setting.info = JSON.stringify(req.body);
    
    setting.save(function (err) {
      if (err) {
        return workflow.emit('exception', err);
      }
        
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

function handleError(res, err) {
  return res.send(500, err);
}