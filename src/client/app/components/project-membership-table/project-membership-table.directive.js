(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectMembershipTable', ProjectMembershipTableDirective);

  /** @ngInject */
  function ProjectMembershipTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        groups: '=',
        roles: '='
      },
      link: link,
      templateUrl: 'app/components/project-membership-table/project-membership-table.html',
      controller: ProjectMembershipController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectMembershipController(lodash, Toasts, ProjectGroup, Membership) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteGroup;
      vm.openEditGroup = openEditGroup;
      vm.rowLookup = rowLookup;

      function activate() {
      }

      function deleteGroup(index) {
        var groupId = vm.project.groups[index].id;

        lodash.remove(vm.project.group_ids, removeGroupId);

        function removeGroupId(id) {
          return id === groupId;
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

        function updateGroups(membership) {
          vm.project.group_ids = [];
          vm.membership = new Membership();
          vm.groupToAdd = membership.group;
          vm.roleToAdd = membership.role;

          vm.membership.project_id = vm.project.id;
          vm.membership.group_id = vm.groupToAdd.id;
          vm.membership.role_id = vm.roleToAdd.id;
          vm.project.group_ids.push(vm.groupToAdd.id);
          vm.membership.$update({projectId: vm.project.id, groupId: vm.groupToAdd.id},
           updateMembershipSuccess, updateMembershipFailure);
          vm.project.$update(updateSuccess, updateFailure);
        }

        function updateMembershipSuccess() {
        }

        function updateMembershipFailure() {
        }

        function updateSuccess() {
          Toasts.toast('Group successfully added.');
          vm.project.groups.push(vm.groupToAdd);
        }

        function updateFailure() {
          Toasts.error('Server returned an error while updating.');
        }
      }

      function rowLookup(collection, itemId, itemKey) {
        return lodash.result(lodash.find(collection, {id: itemId}), itemKey);
      }
    }
  }
})();
