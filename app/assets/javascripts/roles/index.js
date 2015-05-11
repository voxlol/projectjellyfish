//= require_tree .
'use strict';

var RolesModule = angular.module('broker.roles', [])
    .factory('RolesResource', RolesResource)
    .directive('groupsBox', RolesBoxDirective)
    .controller('RolesController', RolesController)
    .config(
    /**@ngInject*/
    function($stateProvider) {
        $stateProvider
            .state('base.authed.roles', {
                url: '/roles',
                abstract: true,
                template: '<div class="page roles-page" ui-view></div>',
                controller: 'RolesController as rolesCtrl',
            });
    }
);

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
RolesModule.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

window.RolesModule = RolesModule;
