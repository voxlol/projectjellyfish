//= require_tree .
'use strict';

var UsersModule = angular.module('broker.users', ['broker.users.orders'])
  .factory('UsersResource', UsersResource)
  .directive('usersBox', UsersBoxDirective)
  .controller('UsersController', UsersController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.users', {
          url: '/users',
          abstract: true,
          template: '<div class="page users-page" ui-view></div>',
          controller: 'UsersController as usersCtrl'
        });
    }
  );

window.UsersModule = UsersModule;
