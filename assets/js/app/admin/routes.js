'use strict';

var AdminData = require('./admin_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider, USER_ROLES) {
  $stateProvider
    .state('base.authed.admin', {
      url: '/admin',
      abstract: true,
      controller: 'AdminController as admin',
      template: '<div ui-view></div>',
      data: {
        authorizedRoles: [USER_ROLES.admin]
      },
      resolve: AdminData
    });
};
