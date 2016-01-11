'use strict';

var express = require('express');
var controller = require('./site.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/campus', controller.getCampus);
router.post('/add', controller.createSite);
router.put('/:id', controller.updateSite);
router.post('/:id/adduser', controller.addSiteUser);
router.post('/:id/removeuser', controller.removeSiteUser);
router.get('/:id/users', controller.getSiteUsers);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/:id/campusfile', controller.uploadCampusFile);
router.post('/:id/img', controller.uploadSiteImage);


module.exports = router;