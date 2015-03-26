'use strict';

/**@ngInject*/
var UsersBoxDirective = function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/partials/users/users_box.html',
    transclude: true,
    scope: {
      user: "="
    }
  };
};

window.UsersBoxDirective = UsersBoxDirective;
