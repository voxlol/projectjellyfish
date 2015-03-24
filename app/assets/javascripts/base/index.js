//= require_tree .
'use strict';

var SidebarData = LeftSidebarController.resolve,
  HeaderData = HeaderController.resolve,
  FooterData = FooterController.resolve;

var BaseModule = angular.module('broker.base', [])
  .controller('BaseController', BaseController)
  .controller('HeaderController', HeaderController)
  .controller('LeftSidebarController', LeftSidebarController)
  .controller('FooterController', FooterController)
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      $stateProvider.state('base', {
        abstract: true,
        template: '<div ui-view></div>',
        controller: 'BaseController as baseCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      }).state('base.authed', {
        abstract: true,
        views: {
          '': {
            templateUrl: '/assets/templates/partials/layouts/authed.html'
          },
          'header@base.authed': {
            templateUrl: '/assets/templates/partials/common/header.html',
            controller: 'HeaderController as headerCtrl'
          },
          'left-sidebar@base.authed': {
            templateUrl: '/assets/templates/partials/common/left_sidebar.html',
            controller: 'LeftSidebarController as leftSidebarCtrl'
          },
          'footer@base.authed': {
            templateUrl: '/assets/templates/partials/common/footer.html',
            controller: 'FooterController as footerCtrl'
          }
        },
        resolve: _.merge({
          /**@ngInject*/
          currentUser: function(UsersResource) {
            return UsersResource.getCurrentMember().$promise;
          }
        }, SidebarData, HeaderData, FooterData),
        data: {
          authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
        }
      }).state('base.public', {
        abstract: true,
        views: {
          '': {
            templateUrl: '/assets/templates/partials/layouts/public.html'
          },
          'header@base.public': {
            templateUrl: '/assets/templates/partials/common/header.html'
          },
          'footer@base.public': {
            templateUrl: '/assets/templates/partials/common/footer.html',
            controller: 'FooterController as footerCtrl',
            resolve: {footerLinks: function() { return []; }}
          }
        }
      });
    }
  );

window.BaseModule = BaseModule;
