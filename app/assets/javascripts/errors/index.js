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
            templateUrl: '/assets/templates/partials/layouts/errors.html'
          },
          'header@errors': {
            templateUrl: '/assets/templates/partials/common/header.html'
          },
          'footer@errors': {
            templateUrl: '/assets/templates/partials/common/footer.html',
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
        templateUrl: '/assets/templates/partials/errors/sorry.html'
      }).state('errors.no-network', {
        url: '/server-unreachable',
        templateUrl: '/assets/templates/partials/errors/no_network.html'

      // Non-Critical Errors - Can continue to try and load resources
      }).state('base.authed.errors.not-found', {
        url: '/404-not-found',
        templateUrl: '/assets/templates/partials/errors/not_found.html'
      }).state('base.authed.errors.unauthorized', {
        url: '/401-unauthorized',
        templateUrl: '/assets/templates/partials/errors/unauthorized.html'
      });
    }
  );
window.ErrorsModule = ErrorsModule;
