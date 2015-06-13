(function () {
  'use strict';

  angular.module('app.components')
    .directive('status', StatusDirective);

  /** @ngInject */
  function StatusDirective() {
    var directive = {
      restrict: 'E',
      scope: {
        text: '@',
        level: '@?'
      },
      link: link,
      template: '<span class="status" ng-class="::\'status--\' + vm.level" ng-bind="::vm.text"></span>',
      controller: StatusController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function StatusController(lodash) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.level = angular.isDefined(vm.level) ? vm.level : lodash.trim(vm.text.toLowerCase());
      }
    }
  }
})();
