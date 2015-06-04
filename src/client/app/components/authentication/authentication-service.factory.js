(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthenticationService', AuthenticationServiceFactory);

  /** @ngInject */
  function AuthenticationServiceFactory($http, $q, $state, SessionService, userRoles) {
    var service = {
      login: login,
      logout: logout,
      isAuthenticated: isAuthenticated,
      ssoInit: ssoInit
    };

    return service;

    function ssoInit() {
      var deferred = $q.defer();

      $http.get('/api/v1/saml/init')
        .success(function(response) {
          deferred.resolve(response.url);
        }).error(function() {
          deferred.resolve(false);
        });

      return deferred.promise;
    }

    function login(credentials) {
      return $http.post('/api/v1/staff/sign_in', credentials)
        .success(function(data) {
          SessionService.create(data.id, data.first_name, data.last_name, data.email, data.role, data.updated_at);
        });
    }

    function logout() {
      return $http
        .delete('/api/v1/staff/sign_out')
        .success(function() {
          SessionService.destroy();
        });
    }

    function isAuthenticated() {
      return !!SessionService.email;
    }
  }
})();
