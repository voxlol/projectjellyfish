(function() {
  'use strict';

  angular.module('app.components')
    .factory('AddGroup', AddGroupFactory);

  /** @ngInject */
  function AddGroupFactory($modal, Group) {
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
          groups: resolveGroups
        },
        windowTemplateUrl: 'app/components/wizard/wizard-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveGroups() {
        return Group.query().$promise;
      }
    }
  }

  /** @ngInject */
  function AddGroupModalController(groups, lodash) {
    var vm = this;

    vm.groups = groups;
    vm.group = '';

    activate();

    function activate() {
    }
  }
})();
