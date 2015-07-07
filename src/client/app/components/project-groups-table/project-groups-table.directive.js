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
    function ProjectGroupsTableController(lodash, Toasts, ProjectGroup) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteGroup;
      vm.openEditGroup = openEditGroup;

      function activate() {
      }

      function deleteGroup(index) {
        var groupId = vm.project.groups[index].id;

        lodash.remove(vm.project.group_ids, removeGroupId);

        function removeGroupId(n) {
          return n === groupId;
        }

        vm.project.$update(deleteSuccess, deleteError);

        function deleteSuccess() {
          vm.project.groups = lodash.reject(vm.project.groups, {'id': groupId});
          Toasts.toast('Group successfully removed.');
        }

        function deleteError() {
          Toasts.error('Could not remove group. Try again later.');
        }
      }

      function openEditGroup(row) {
        ProjectGroup.showModal(row).then(updateGroups);

        function updateGroups(group) {
          vm.groupToAdd = group;
          if (lodash.result(lodash.find(vm.project.groups, 'id', vm.groupToAdd.id), 'id')) {
            Toasts.error('Group already associated with this project.');
          } else {
            vm.project.groups.push(vm.groupToAdd);
            vm.project.$update(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Group successfully added.');
          vm.project.group_ids.push(vm.groupToAdd.id);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while updating.');
        }
      }
    }
  }
})();
