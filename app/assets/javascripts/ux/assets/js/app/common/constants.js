'use strict';

var CommonConstants = angular.module('broker.common.constants', [])
  .constant('USER_ROLES', {
    all: '*',
    user: 'user',
    admin: 'admin'
  })
  .constant('APP_CONFIG', angular.copy(window.appConfig))
  .constant('APP_VERSION', angular.copy(window.appVersion))
  .constant('ROUTES', {
    login: '/login',
    logout: '/logout',
    default: '/dashboard'
  });

window.CommonConstants = CommonConstants
