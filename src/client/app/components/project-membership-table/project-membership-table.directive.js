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
    function ProjectMembershipController($q, lodash, Toasts, MembershipModal, Membership) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteMembership;
      vm.showMembershipModal = showMembershipModal;
      vm.rowLookup = rowLookup;

      function activate() {
      }

      function deleteMembership(index) {
        vm.membership = new Membership();
        vm.membership.$delete({project_id: vm.memberships[index].project_id, group_id: vm.memberships[index].group_id},
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
        vm.membership = Membership.new(row);
        MembershipModal.showModal(vm.membership).then(updateMembership);

        function updateMembership(result) {
          console.log(result);
          row.role_id = result.role_id;
        }
      }

      function rowLookup(collection, itemId, itemKey) {
        return lodash.result(lodash.find(collection, {id: itemId}), itemKey);
      }
    }
  }
})();
