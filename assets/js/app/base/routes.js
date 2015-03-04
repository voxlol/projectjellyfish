'use strict';

var HeaderData = require('./header_controller').resolve;
var FooterData = require('./footer_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider, USER_ROLES) {
  $stateProvider.state('root', {
    url: "/",
    data: {
      authorizedRoles: [USER_ROLES.all]
    },
    controller: 'RootController'
  }).state('base', {
    abstract: true,
    views: {
      '' : {
        templateUrl: '/partials/layouts/base.html'
      },
      'header@base': {
        templateUrl: "/partials/common/header.html",
        controller: "HeaderController as headerCtrl",
        resolve: HeaderData
      },
      "left-sidebar@base" : {
        templateUrl: "/partials/common/left_sidebar.html",
        controller: "LeftSidebarController as leftSidebarCtrl"
      },
      "footer@base" : {
        templateUrl: "/partials/common/footer.html",
        controller: "FooterController as footerCtrl",
        resolve: FooterData
      }
    },
    resolve: {
      /**@ngInject*/
      currentUser: function(UsersResource) {
        return UsersResource.getCurrentMember().$promise;
      },
      /**@ngInject*/
      alerts: function(AlertsResource) {
        return AlertsResource.query({'includes[]': ['project']}).$promise;
      },
      /**@ngInject*/
      projects: function(ProjectsResource) {
        return ProjectsResource.query().$promise;
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
    }
  }).state('publicbase', {
    abstract: true,
    views: {
      '' : {
        templateUrl: '/partials/layouts/publicbase.html'
      },
      'header@publicbase' : {
        templateUrl: "/partials/common/header.html"
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.all]
    }
  });
};
