// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'ui.bootstrap.modal'     // Used to display the login form as a modal dialog.
])

.factory('security', ['$http', '$q', '$location', '$cookieStore', 'securityRetryQueue', '$modal', function($http, $q, $location, $cookieStore, queue, $modal) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog() {
    $location.path('/login');
    //if ( loginDialog ) {
  //    throw new Error('Trying to open a dialog that is already open!');
  //  }
    //loginDialog = $modal.dialog();
    //loginDialog.open('security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
  //  loginDialog = $modal.open({
   //   templateUrl: 'security/login/form.tpl.html',
  //    controller: 'LoginFormController'
   // });
 //   loginDialog.result.then(onLoginDialogClose, onLoginDialogDismiss);
  }
  function closeLoginDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function dismissLoginDialog(reason){
    if(loginDialog){
      loginDialog.dismiss(reason);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      queue.retryAll();
    } else {
      queue.cancelAll();
      redirect();
    }
  }
  //modal is dismissed because escape key press or mouse click outside
  function onLoginDialogDismiss(reason){
    loginDialog = null;
    queue.cancelAll();
    redirect();
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });


  function onCreateUserOk(res){
    var data = res.data;
    if(data.token){
      $cookieStore.put('token', data.token);
      return service.requestCurrentUser();  
    }
    
    return $q.reject();
  }
  
  function processResponse(res){
    return res.data;
  }

  function processError(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  }
  var deferredCurrentUser;

  // The public API of the service
  var service = {

    signup: function(data){
      return $http.post('/api/users', data).then(onCreateUserOk, processError);
    },

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    socialDisconnect: function(provider){
      var url = '/api/account/settings/' + provider.toLowerCase() + '/disconnect';
      return $http.get(url).then(function(res){ return res.data; });
    },

    socialConnect: function(provider, code){
      var url = '/api/account/settings/' + provider.toLowerCase() + '/callback';
      if(code){
        url += '?code=' + code;
      }
      return $http.get(url).then(function(res){ return res.data; });
    },

    socialLogin: function(provider, code){
      var url = '/api/login/' + provider.toLowerCase() + '/callback';
      if(code){
        url += '?code=' + code;
      }
      var promise = $http.get(url).then(function(res){
        var data = res.data;
        if (data.success) {
          closeLoginDialog(true);
          service.currentUser = data.user;
        }
        return data;
      });
      return promise;
    },

    // Attempt to authenticate a user by the given username and password
    login: function(username, password) {
      var request = $http.post('/auth/local', {
        username: username,
        password: password
      });
      return request.then(function(response) {
        var data = response.data;
        if(data.token){
          $cookieStore.put('token', data.token);
          closeLoginDialog(true);
          service.setCurrentUser(data.user);
        }
        return data;
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      //closeLoginDialog(false);
      //redirect();
      dismissLoginDialog('cancel button clicked');
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post('/auth/logout').then(function() {
        $cookieStore.remove('token');
        service.currentUser = null;
        redirect(redirectTo).replace();
      }, function() {
        $cookieStore.remove('token');
        service.currentUser = null;
        redirect(redirectTo).replace();
      });
    },

    loginForgot: function(data){
      return $http.post('/api/login/forgot', data).then(processResponse, processError);
    },

    loginReset: function(id, email, data){
      var url = '/api/login/reset/' + email + '/' + id;
      return $http.put(url, data).then(processResponse, processError);
    },
    
    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        // local currentUser is available
        return $q.when(service.currentUser);
      } else if(deferredCurrentUser) {
        // already an outstanding backend request for currentUser
        return deferredCurrentUser.promise;
      } else {
        // no outstanding backend call nor local currentUser
        deferredCurrentUser = $q.defer();
        $http.get('/api/users/me').then(function(response){
          service.currentUser = response.data.user;
          deferredCurrentUser.resolve(service.currentUser);
          deferredCurrentUser = null;
        }, function(x){
          deferredCurrentUser.reject('Unauthorized');
          deferredCurrentUser = null;
        });
        return deferredCurrentUser.promise;
      }
    },

    setCurrentUser: function(user){
      service.currentUser = user;
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user an administrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.role === 'admin');
    }
  };

  service.requestCurrentUser();
  return service;
}]);
