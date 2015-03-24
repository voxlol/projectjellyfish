'use strict';

window.appConfig = {
  apiBasePath: window.apiBasePath,
  orgLogo: '/images/logo.png',
  orgColor: '#0a498a',
  version: '2.0.0'
};

var CommonConstants = angular.module('broker.common.constants', [])
  .constant('USER_ROLES', {
    all: '*',
    user: 'user',
    admin: 'admin'
  })
  .constant('APP_CONFIG', angular.copy(window.appConfig))
  .constant('ROUTES', {
    login: '/login',
    logout: '/logout',
    default: '/dashboard'
  });

window.CommonConstants = CommonConstants
