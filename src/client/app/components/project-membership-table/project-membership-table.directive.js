(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectMembershipTable', ProjectMembershipTableDirective);

  /** @ngInject */
  function ProjectMembershipTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        memberships: '=',
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
    function ProjectMembershipController($q, lodash, Toasts, ProjectMembership, Membership) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteMembership;
      vm.showMembershipModal = showMembershipModal;
      vm.rowLookup = rowLookup;
      vm.membership = new Membership();

      function activate() {
      }

      function deleteMembership(index) {
        vm.membership.$delete({projectId: vm.memberships[index].project_id, groupId: vm.memberships[index].group_id},
          deleteSuccess, deleteError);

        function deleteSuccess() {
          vm.memberships = lodash.reject(vm.memberships, {'id': vm.memberships[index].id});
          Toasts.toast('Group successfully removed.');
        }

        function deleteError() {
          Toasts.error('Could not remove group. Try again later.');
        }
      }

      function showMembershipModal(row) {
        ProjectMembership.showModal(vm.memberships, row).then(updateMembership);

        function updateMembership(membership) {
        }
      }

      function rowLookup(collection, itemId, itemKey) {
        return lodash.result(lodash.find(collection, {id: itemId}), itemKey);
      }
    }
  }
})();
