'use strict';

var _ = require('lodash');

// Set outside of the controller instantiation to make sure we keep the state.
var isFailedLogin = false;

/**@ngInject*/
function LoginController($scope, $state, AuthService, currentUser, ssoUrl) {
  this.$scope = $scope;
  this.$state = $state;
  this.AuthService = AuthService;
  this.ssoUrl = ssoUrl;

  // If the user is already logged in, take them to the default route.
  if (currentUser || AuthService.isAuthenticated()) {
    $state.transitionTo('base.authed.dashboard');
  }
}

LoginController.prototype = {

  login: function() {

    // Reset the failed login flag.
    isFailedLogin = false;

    var credentials = {
      staff: {
        email: this.$scope.email,
        password: this.$scope.password
      }
    };

    // @todo Add optional to redirect back to where they were instead of always going to dashboard.
    this.AuthService.login(credentials)
      .success(_.bind(function() {
        this.$state.transitionTo('base.authed.dashboard');
      }, this))
      .error(_.bind(function() {
        isFailedLogin = true;
      }, this));
  },

  hasFailedLogin: function() {
    return isFailedLogin;
  }
};

LoginController.resolve = {
  /**@ngInject*/
  ssoUrl: function(AuthService) {
    return AuthService.ssoInit();
  },
  /**@ngInject*/
  currentUser: function($q, UsersResource) {
    var deferred = $q.defer();

    UsersResource.getCurrentMember(function() {
      deferred.resolve(true);
    }, function() {
      deferred.resolve(false);
    });
    return deferred.promise;
  }
};

module.exports = LoginController;
