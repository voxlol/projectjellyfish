(function() {
  var httpInterceptor = function($provide, $httpProvider) {
    $provide.factory('httpInterceptor', function($q, $location, $rootScope) {
      return {
        response: function(response) {
          return response || $q.when(response);
        },
        responseError: function(rejection) {
          if ([200, 201, 202, 203, 204].indexOf(rejection.status) === -1) {
            $location.url('/error');
            //$rootScope.$$phase || $rootScope.$apply();
            $rootScope.$apply();
          }

          return $q.reject(rejection);
        }
      };
    });
    $httpProvider.interceptors.push('httpInterceptor');
  };
  angular.module('app').config(httpInterceptor);
}());
