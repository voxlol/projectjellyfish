'use strict';

var _ = require('lodash'),
  SidebarData = require('./leftsidebar_controller').resolve,
  HeaderData = require('./header_controller').resolve,
  FooterData = require('./footer_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider, USER_ROLES) {
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
        templateUrl: '/partials/layouts/authed.html'
      },
      'header@base.authed': {
        templateUrl: '/partials/common/header.html',
        controller: 'HeaderController as headerCtrl'
      },
      'left-sidebar@base.authed': {
        templateUrl: '/partials/common/left_sidebar.html',
        controller: 'LeftSidebarController as leftSidebarCtrl'
      },
      'footer@base.authed': {
        templateUrl: '/partials/common/footer.html',
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
        templateUrl: '/partials/layouts/public.html'
      },
      'header@base.public': {
        templateUrl: '/partials/common/header.html'
      },
      'footer@base.public': {
        templateUrl: '/partials/common/footer.html',
        controller: 'FooterController as footerCtrl',
        resolve: {footerLinks: function() { return []; }}
      }
    }
  });
};
