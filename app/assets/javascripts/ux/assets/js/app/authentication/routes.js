'use strict';

var LoginData = require('./login_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider) {
  $stateProvider.state('base.public.login', {
    url: "/login",
    templateUrl: '/partials/login.html',
    controller: "LoginController as loginCtrl",
    resolve: LoginData
  }).state('base.public.logout', {
    url: "/logout",
    controller: "LogoutController as logoutCtrl"
  });
};
