(function() {
  'use strict';

  angular.module('app.components')
    .directive('footer', FooterDirective);

  /** @ngInject */
  function FooterDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        jellyfish_version: '='
      },
      replace: true,
      link: link,
      templateUrl: 'app/components/footer/footer.html',
      controller: SulyController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude, Version) {
      vm.activate();
    }

    /** @ngInject */
    function SulyController($http) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        initVersion();
      }

      function initVersion() {
        $http.get('/api/v1/version/')
          .then(handleResults);

        function handleResults(results) {
          vm.version = results.data.jellyfish_version;
          console.log(results.data.jellyfish_version);
        }
      }
    }
  }
})();
