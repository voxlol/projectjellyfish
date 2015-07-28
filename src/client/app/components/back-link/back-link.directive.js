(function() {
  'use strict';

  angular.module('app.components')
    .directive('backLink', BackLinkDirective);

  /** @ngInject */
  function BackLinkDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/back-link/back-link.html',
      controller: BackLinkController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function BackLinkController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();
