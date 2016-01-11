angular.module('services.siteResource', []).factory('siteResource', ['$http', '$q', function ($http, $q) {
  // local variable
  var siteUrl = 'api/sites';

  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};

  // ----- site api -----
  resource.findSites = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(siteUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addSite = function(sitename){
    return $http.post(siteUrl+ '/add', { sitename: sitename }).then(processResponse, processResponse);
  };
  resource.findSite = function(_id){
    var url = siteUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateSite = function(_id, data){
    var url = siteUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.getSiteUsers = function(_id){
    var url = siteUrl + '/' + _id + '/users';
    return $http.get(url).then(processResponse, processError);
  };
  resource.addSiteUser = function(data){
    var url = siteUrl + '/' + data.siteid + '/adduser';
    return $http.post(url, data).then(processResponse, processError);
  };
  resource.removeSiteUser = function(data){
    var url = siteUrl + '/' + data.siteid + '/removeuser';
    return $http.post(url, data).then(processResponse, processError);
  };
  resource.deleteSite = function(_id){
    var url = siteUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };
  resource.getCampus = function(_id){
    var url = siteUrl + '/' + _id + '/campus';
    return $http.get(url).then(processResponse, processError);
  };
  return resource;
}]);
