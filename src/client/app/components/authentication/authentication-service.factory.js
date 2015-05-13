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
      isAuthorized: isAuthorized,
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
      return $http
        .post(ApiService.routeResolve('signIn'), credentials)
        .success(function(data, statusCode) {
          SessionService.create(data.email, data.role);
        });
    }

    function logout() {
      return $http
        .delete(ApiService.routeResolve('signOut'))
        .success(function() {
          SessionService.destroy();
          $state.transitionTo('login');
        });
    }

    function isAuthenticated() {
      return !!SessionService.email;
    }

    function isAuthorized(authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      // If authorizedRoles contains 'all', then we allow it through.
      if (authorizedRoles.indexOf(userRoles.all) !== -1) {
        return true;
      } else {
        return (AuthenticationServiceFactory.isAuthenticated() && authorizedRoles.indexOf(SessionService.role) !== -1);
      }
    }
  }
})();
