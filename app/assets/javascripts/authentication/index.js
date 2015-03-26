//= require_tree .
'use strict';

var LoginData = LoginController.resolve;

var AuthenticationModule = angular.module('broker.auth', [])
  .controller('LoginController', LoginController)
  .controller('LogoutController', LogoutController)
  .factory('AuthService', AuthService)
  .service('Session', Session)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider.state('base.public.login', {
        url: "/login",
        templateUrl: '/templates/partials/login.html',
        controller: "LoginController as loginCtrl",
        resolve: LoginData
      }).state('base.public.logout', {
        url: "/logout",
        controller: "LogoutController as logoutCtrl"
      });
    }
  );

window.AuthenticationModule = AuthenticationModule;
