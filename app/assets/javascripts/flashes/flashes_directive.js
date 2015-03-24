'use strict';

/**@ngInject*/
function FlashesDirective() {
  return {
    restrict: 'EA',
    templateUrl: '/assets/templates/partials/common/flashes.html',
    controller: 'FlashesController',
    controllerAs: 'flashesCtrl'
  };
}

window.FlashesDirective = FlashesDirective;
