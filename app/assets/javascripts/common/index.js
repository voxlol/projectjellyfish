//= require_tree .
'use strict';

var CommonModule = angular.module(
    'broker.common',
    ['broker.common.exceptions', 'broker.common.constants']
  )
  .factory('apiResource', apiResource)
  .factory('httpInterceptor', HttpInterceptor)
  .factory('JellyfishModal', JellyfishModal)
  .directive('sectionHeader', SectionHeaderDirective)
  .directive('compareTo', compareTo)
  .config(
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/dashboard');

      $locationProvider.html5Mode(true);

      $httpProvider.interceptors.push('httpInterceptor');
    }
  );

window.CommonModule = CommonModule
