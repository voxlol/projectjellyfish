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
    function ProjectCatalogController(VIEW_MODES, $state) {
      var vm = this;

      vm.activate = activate;
      vm.goTo = goTo;
      // vm.isApproved = isApproved;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
      }
      function goTo(id) {
        $state.go('projects.details', {projectId: id});
      }
      // function isApproved(status){
      //  return status === 'approved'? true : false;
      // }
    }
  }
})();
