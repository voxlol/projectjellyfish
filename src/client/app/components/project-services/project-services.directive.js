(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectServices', ProjectServicesDirective);

  /** @ngInject */
  function ProjectServicesDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        projectId: '=',
        projectArchived: '=?',
        services: '='
      },
      link: link,
      templateUrl: 'app/components/project-services/project-services.html',
      controller: ProjectServicesController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectServicesController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();
