/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /sites              ->  index
 * POST    /sites              ->  create
 * GET     /sites/:id          ->  show
 * PUT     /sites/:id          ->  update
 * DELETE  /sites/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Site = require('./site.model');
var User = require('../user/user.model');
var fs = require('fs');
var path = require('path');
var url  = require("url");
var busboy = require('connect-busboy');

// Get list of sites
exports.index = function (req, res, next) {
  req.query.sitename = req.query.sitename ? req.query.sitename : '';
  req.query.sitetype = req.query.sitetype ? req.query.sitetype : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
  req.query.isActive = req.query.isActive ? req.query.isActive : '';

  var filters = {};
  if (req.query.sitename) {
    filters.sitename = new RegExp('^.*?' + req.query.sitename + '.*$', 'i');
  }

  if (req.query.isActive) {
    filters.isActive = req.query.isActive;
  }

    if (req.query.sitetype) {
      filters.sitetype = req.query.sitetype;
    }
  
  Site.pagedFind({
    filters: filters,
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

// Get a single site
exports.show = function (req, res) {
  Site.findById(req.params.id, function (err, site) {
    if (err) {
      return handleError(res, err);
    }
    if (!site) {
      return res.send(404);
    }
    return res.json(site);
  });
};

/**
 * Change a site's detail 
 */
exports.createSite = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.sitename) {
      return workflow.emit('exception', 'site name is required!');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('createNewSite');
  });

  workflow.on('createNewSite', function () {
    var data = req.body;
    data.isActive = 'no'
    
    Site.create(data, function (err, site) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (!site) {
        return workflow.emit('exception', 'create site failed!');
      }
      
      workflow.outcome.site = site;
      workflow.emit('response');
    }); 
  });
  
  workflow.emit('validate');
};

/**
 * Change a site's detail 
 */
exports.getCampus = function (req, res, next) {
  var pathurl = url.parse(req.url).pathname;  
  var urlSplit = pathurl.split("/");
  
  //var sitehome = path.join(req.app.config.root, 'uploads', urlSplit[1]); 
  var sitehome = path.join(req.app.config.root, 'uploads'); 
  var campusFile = path.join(sitehome, 'campuss.json'); 
  if (!fs.existsSync(campusFile)) {
    return res.send(404);
  }

  var stat = fs.statSync(campusFile);

  res.writeHead(200, {
    'Content-Type': 'text/json',
    'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(campusFile);
  readStream.on('open', function () {
    readStream.pipe(res);
  });

  readStream.on('error', function (err) {
    return res.send(500);
  });
};
/**
 * Change a site's detail 
 */
exports.updateSite = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function () {
    if (!req.body.sitename) {
      return workflow.emit('exception', 'site name is required!');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('saveSiteDetail');
  });

  workflow.on('saveSiteDetail', function () {
    var siteId = req.params.id;
    var data = req.body;
    
    Site.findById(siteId, function (err, site) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      if (!site) {
        return workflow.emit('exception', 'site not exists');
      }
      
      var updated = _.merge(site, data);
      updated.save(function (err) {
        if (err) {
          return workflow.emit('exception', err);
        }
        
        workflow.emit('response');
      });
    });    
  });

  workflow.emit('validate');
};


// Updates an existing site in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Site.findById(req.params.id, function (err, site) {
    if (err) {
      return handleError(res, err);
    }
    if (!site) {
      return res.send(404);
    }
    var updated = _.merge(site, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, site);
    });
  });
};


/**
 * Get Site Users
 */
exports.getSiteUsers = function(req, res, next) {
  var options = { Sites: req.params.id };
  
  User.find(options, function(err, results) { 
    if (err) return next(err);
    
    var result = { };
    result.users = results;
    res.json(result);
  });
};

exports.addSiteUser = function(req, res, next) {
  User.findById(req.body.userid, function(err, user) { // don't ever give out the password or salt
    doPushSiteUser(req, res, err, user);
  });
};

var doPushSiteUser = function (req, res, err, user) {
  if (err) 
    return handleError(res, err);
    
  var index = user.Sites.indexOf(req.body.siteid);
  if(index >= 0)
    return handleError(res,  'Already a user of site.');

  var d = new Date();
  user.mobile = d.getTime() +'-';
  user.Sites.push(req.body.siteid);
  user.save(
    function (err, user) {
      onEditSave(req, res, err, user);
    }
  );
};

var onEditSave = function (req, res, err, user) {
  if (err) {
    return handleError(res, 'save user failed!');
  } else {
    return res.send(200);
  }
};
  
exports.removeSiteUser = function(req, res, next) {
  User.findById(req.body.userid, function(err, user) { // don't ever give out the password or salt
    doRemoveSiteUser(req, res, err, user);
  });
};

var doRemoveSiteUser = function (req, res, err, user) {
  if (err) 
    return handleError(res, err);

  
  if(!user.Sites)
    return handleError(res, 'not exists');

  var index = user.Sites.indexOf(req.body.siteid);
  if(index < 0)
    return handleError(res, 'not exists');
    
  user.Sites.splice(index, 1);
  user.save(
    function (err, user) {
      onEditSave(req, res, err, user);
    }
  );
};
// Deletes a site from the DB.
exports.destroy = function (req, res) {
  Site.findById(req.params.id, function (err, site) {
    if (err) {
      return handleError(res, err);
    }
    if (!site) {
      return res.send(404);
    }
    site.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};
  
// upload campus file.
exports.uploadCampusFile = function (req, res) {
  var pathurl = url.parse(req.url).pathname;  
  var urlSplit = pathurl.split("/");
  
  var sitehome = path.join(req.app.config.root, 'uploads', urlSplit[1]); 
  try {
    fs.mkdirSync(sitehome);
  } catch(e) {
    if ( e.code != 'EEXIST' ) 
      return handleError(res, e);
  }  
  
  var campusFile = path.join(sitehome, 'campuss.json'); 
  console.log(campusFile);
  
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var stream = fs.createWriteStream(campusFile);
    file.pipe(stream);
    stream.on('close', function () {
      console.log('File ' + filename + ' is uploaded');
      res.json({
        filename: filename
      });
    });
  });
};

// upload image file.
exports.uploadSiteImage = function (req, res) {
  var pathurl = url.parse(req.url).pathname;  
  var urlSplit = pathurl.split("/");
  
  var imgFile = path.join(req.app.config.root, '/sites', urlSplit[1]) + '.png'; 
  console.log('campus file:' + imgFile);
  
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var stream = fs.createWriteStream(imgFile);
    file.pipe(stream);
    stream.on('close', function () {
      console.log('File ' + filename + ' is uploaded');
      res.json({
        filename: filename
      });
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}