'use strict';

/**@ngInject*/
var GroupsBoxDirective = function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/partials/groups/groups_box.html',
    transclude: true,
    scope: {
      group: "="
    }
  };
};

window.GroupsBoxDirective = GroupsBoxDirective;
