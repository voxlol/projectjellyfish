(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthenticationService', AuthenticationServiceFactory);

  /** @ngInject */
  function AuthenticationServiceFactory($http, $q, $state, ApiService) {
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
          Session.create(data.email, data.role);
        });
    }

    function logout() {
      return $http
        .delete(ApiService.routeResolve('signOut'))
        .success(function() {
          Session.destroy();
          $state.transitionTo('base.public.login');
        });
    }

     function isAuthenticated() {
      return !!Session.email;
    };

    function isAuthorized(authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      // If authorizedRoles contains 'all', then we allow it through.
      if (authorizedRoles.indexOf(USER_ROLES.all) !== -1) {
        return true;
      } else {
        return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.role) !== -1);
      }
    };
  }
})();
