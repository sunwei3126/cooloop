'use strict';

var express = require('express');
var passport = require('passport');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Setting = require('../setting/setting.model');

var router = express.Router();


var sendMail = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.sender) {
      workflow.outcome.errfor.sender = 'required';
    }
    
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }

    if (!req.body.message) {
      workflow.outcome.errfor.message = 'required';
    }
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('getSetting');
  });
  
  workflow.on('getSetting', function () {
    Setting.findOne({
      item: "mailbox"
    }, function(err, data) { // don't ever give out the password or salt
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (!data) {
        return workflow.emit('exception', 'mailbox not configured');
      }

      var setting = JSON.parse(data.info);
      workflow.emit('doSend', setting);    
    });
  });

  workflow.on('doSend', function (setting) {
    var transport = nodemailer.createTransport("SMTP", {
                    service: "QQ",
                    auth: {
                        user: setting.email,
                        pass: setting.password
                    }
                });
    
    var msg = req.body.email + '  ' + req.body.message;
    transport.sendMail({
        from: setting.email,
        to: setting.email,
        subject: req.body.sender,
        generateTextFromHTML: true,
        html: msg
    }, function(err, response) {
        if (err) {
          return workflow.emit('exception', err);
        } else {
          workflow.emit('response');
        }
        transport.close();
    });  
  });

  workflow.emit('validate');
}

router.post('/message', sendMail);

module.exports = router;