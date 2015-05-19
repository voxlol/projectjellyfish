(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectCatalog', ProjectCatalogDirective);

  /** @ngInject */
  function ProjectCatalogDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        viewMode: '=?',
        collapsed: '=?'
      },
      link: link,
      templateUrl: 'app/components/project-catalog/project-catalog.html',
      controller: ProjectCatalogController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectCatalogController(VIEW_MODES) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
      }
    }
  }
})();
