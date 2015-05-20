'use strict';


angular.module('broker.common.constants', [])
  .constant('USER_ROLES', {
    all: '*',
    user: 'user',
    admin: 'admin'
  })
  .constant('APP_CONFIG', {
    apiBasePath: angular.element('meta[name="api-base-path"]').attr('content'),
    orgLogo: '/images/logo.png',
    orgColor: '#0a498a',
    version: '2.0.0'
  })
  .constant('WIZARD_AUTOSUBMIT',
      angular.element('meta[name="wizard-autosubmit"]').attr('content') == 'true')
  .constant('WIZARD_MULTIPAGE',
      angular.element('meta[name="wizard-multipage"]').attr('content') == 'true')
  .constant('ROUTES', {
    login: '/login',
    logout: '/logout',
    default: '/login'
  });
