//= require_tree .
'use strict';

var ErrorsModule = angular.module('broker.errors', [])
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      $stateProvider.state('errors', {
        abstract: true,
        views: {
          '': {
            templateUrl: '/templates/partials/layouts/errors.html'
          },
          'header@errors': {
            templateUrl: '/templates/partials/common/header.html'
          },
          'footer@errors': {
            templateUrl: '/templates/partials/common/footer.html',
            controller: 'FooterController as footerCtrl',
            resolve: {footerLinks: function() { return []; }}
          }
        },
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      // Critical Errors - Don't try to load anything from the server
      }).state('errors.sorry', {
        url: '/terribly-sorry-about-that',
        templateUrl: '/templates/partials/errors/sorry.html'
      }).state('errors.no-network', {
        url: '/server-unreachable',
        templateUrl: '/templates/partials/errors/no_network.html'

      // Non-Critical Errors - Can continue to try and load resources
      }).state('base.authed.errors.not-found', {
        url: '/404-not-found',
        templateUrl: '/templates/partials/errors/not_found.html'
      }).state('base.authed.errors.unauthorized', {
        url: '/401-unauthorized',
        templateUrl: '/templates/partials/errors/unauthorized.html'
      });
    }
  );
window.ErrorsModule = ErrorsModule;
