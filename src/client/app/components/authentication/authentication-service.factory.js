(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthenticationService', AuthenticationServiceFactory);

  /** @ngInject */
  function AuthenticationServiceFactory($http, $q, $state, ApiService, SessionService, userRoles) {
    var service = {
      login: login,
      logout: logout,
      isAuthenticated: isAuthenticated,
      ssoInit: ssoInit
    };

    return service;

    function ssoInit() {
      var deferred = $q.defer();

      $http.get(ApiService.routeResolve('ssoInit'))
        .success(function(response) {
          deferred.resolve(response.url);
        }).error(function() {
          deferred.resolve(false);
        });

      return deferred.promise;
    }

    function login(credentials) {
 
      return $http.post(ApiService.routeResolve('signIn'), credentials)
        .success(function(data) {
          SessionService.create(data.id, data.first_name, data.last_name, data.email, data.role, data.updated_at);
        });
    }

    function logout() {
      return $http
        .delete(ApiService.routeResolve('signOut'))
        .success(function() {
          SessionService.destroy();
        });
    }

    function isAuthenticated() {
      return !!SessionService.email;
    }
  }
})();
