(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectGroupsTable', ProjectGroupsTableDirective);

  /** @ngInject */
  function ProjectGroupsTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '='
      },
      link: link,
      templateUrl: 'app/components/project-groups-table/project-groups-table.html',
      controller: ProjectGroupsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectGroupsTableController(lodash, Project, Toasts) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteGroup;

      function activate() {
      }

      function deleteGroup(index) {
        var project = vm.project.groups[index];

        if (!project) {
          return;
        }

        lodash.remove(vm.project.groups, {id: project.id});
        project.$delete(deleteSuccess, deleteError);

        function deleteSuccess() {
          Toasts.toast('Group deleted.');
        }

        function deleteError() {
          Toasts.error('Could not delete group. Try again later.');
          vm.project.groups.splice(index, 0, project);
        }
      }
    }
  }
})();
