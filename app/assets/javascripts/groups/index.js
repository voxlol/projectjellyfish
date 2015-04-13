//= require_tree .
'use strict';

var GroupsModule = angular.module('broker.groups', [])
    .factory('GroupsResource', GroupsResource)
    .directive('groupsBox', GroupsBoxDirective)
    .controller('GroupsController', GroupsController)
    .config(
    /**@ngInject*/
    function($stateProvider) {
        $stateProvider
            .state('base.authed.groups', {
                url: '/groups',
                abstract: true,
                template: '<div class="page groups-page" ui-view></div>',
                controller: 'GroupsController as groupsCtrl',
            });
    }
);

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
GroupsModule.filter('propsFilter', function() {
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

window.GroupsModule = GroupsModule;
