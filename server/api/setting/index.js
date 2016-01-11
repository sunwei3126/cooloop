'use strict';

var express = require('express');
var controller = require('./setting.controller');

var router = express.Router();

router.get('/:item', controller.getItem);
router.put('/:item', controller.setItem);


module.exports = router;