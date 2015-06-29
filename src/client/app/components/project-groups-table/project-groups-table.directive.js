(function () {
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
    function ProjectGroupsTableController(lodash, Toasts) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteGroup;

      function activate() {
      }
      
      function deleteGroup(index) {
        var groupId = vm.project.groups[index].id;

        lodash.remove(vm.project.group_ids, removeGroupId);

        function removeGroupId(n){
          return n == groupId;
        };

        vm.project.$update(deleteSuccess, deleteError);

        function deleteSuccess() {
          vm.project.groups = lodash.reject(vm.project.groups, {'id': groupId});
          Toasts.toast('Group Removed Project.');
        }

        function deleteError() {
          Toasts.error('Could not remove group. Try again later.');
        }
      }
    }
  }
})();
