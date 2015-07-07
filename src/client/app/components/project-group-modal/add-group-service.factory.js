(function() {
  'use strict';

  angular.module('app.components')
    .factory('AddGroup', AddGroupFactory);

  /** @ngInject */
  function AddGroupFactory($modal, Group, Role) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/project-group-modal/add-group-modal.html',
        controller: AddGroupModalController,
        controllerAs: 'vm',
        resolve: {
          groups: resolveGroups,
          roles: resolveRoles
        },
        windowTemplateUrl: 'app/components/wizard/wizard-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveGroups() {
        return Group.query().$promise;
      }

      function resolveRoles() {
        return Role.query().$promise;
      }
    }
  }

  /** @ngInject */
  function AddGroupModalController(groups, lodash, roles) {
    var vm = this;

    vm.groups = groups;
    vm.membersip = '';
    vm.roles = roles;



    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;



    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }

    activate();

    function activate() {
    }
  }
})();
