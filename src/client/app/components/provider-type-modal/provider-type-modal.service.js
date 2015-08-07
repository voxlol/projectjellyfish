(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProviderTypeModal', ProviderTypeModalFactory);

  /** @ngInject */
  function ProviderTypeModalFactory($modal) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/provider-type-modal/provider-type-modal.html',
        controller: ProviderTypeModalController,
        controllerAs: 'vm',
        resolve: {
          registeredProviders: resolveRegisteredProviders
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveRegisteredProviders(RegisteredProvider) {
        return RegisteredProvider.query().$promise;
      }
    }
  }

  /** @ngInject */
  function ProviderTypeModalController(registeredProviders) {
    var vm = this;

    vm.providers = registeredProviders;
  }
})();
