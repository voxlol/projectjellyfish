'use strict';

/**@ngInject*/
var RolesBoxDirective = function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/partials/roles/roles_box.html',
    transclude: true,
    scope: {
      role: "="
    }
  };
};

window.RolesBoxDirective = RolesBoxDirective;
