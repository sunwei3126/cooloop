angular.module('services.loc', ['pascalprecht.translate'])
.factory('loc', ['$translate', function ($translate) {
  var tran = {};
  tran.loc = function(key){
    if(key)
      return $translate.instant(key);

    return key;
  };

  return tran;
}]);
