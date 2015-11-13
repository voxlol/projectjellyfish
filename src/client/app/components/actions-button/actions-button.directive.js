(function() {
  'use strict';

  angular.module('app.components')
    .directive('actionsButton', ActionsButtonDirective);

  /** @ngInject */
  function ActionsButtonDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        service: '=service'
      },
      link: link,
      templateUrl: 'app/components/actions-button/actions-button.html',
      controller: ActionsButtonController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ActionsButtonController(Service) {
      var vm = this;

      vm.activate = activate;
      vm.actions = [{name: 'Deprovision'}];
      vm.executeAction = executeAction;

      function activate() {
      }

      function executeAction(action) {
        Service.action({id: vm.service.id, action: action.toLowerCase()}).$promise.then(actionSuccess, actionFailure);
      }

      function actionSuccess(data) {
        console.log(data);
      }

      function actionFailure(data) {
        console.log(data);
      }
    }
  }
})();
