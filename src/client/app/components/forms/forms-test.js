(function() {
  'use strict';

  angular.module('app.components')
    .config(configForms)
    .directive('testing', TestingDirective);

  /** @ngInject */
  function TestingDirective() {
    var directive = {
      restrict: 'AE',
      scope: true,
      template: '<div><button ng-click="vm.onClick()" class="btn-rounded">Click Me</button></div>',
      bindToController: {
        fooBar: '@?',
        barFoo: '@?'
      },
      link: link,
      controller: TestingController,
      controllerAs: 'vm'
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function TestingController() {
      var vm = this;

      vm.activate = activate;
      vm.onClick = onClick;

      function activate() {
        vm.fooBar = vm.fooBar || 'fooBar not set';
        vm.barFoo = vm.barFoo || 'barFoo not set';
      }

      function onClick() {
        console.log(vm.fooBar, vm.barFoo);
      }
    }
  }

  /** @ngInject */
  function configForms(FormsProvider) {
    FormsProvider.register('fooForm', {
      controller: FooController,
      fields: [
        //{
        //  key: 'foo',
        //  type: 'text',
        //  templateOptions: {
        //    label: 'Foo'
        //  }
        //},
        //{
        //  key: 'toggle',
        //  type: 'checkbox',
        //  templateOptions: {
        //    label: 'Toggle',
        //    checkboxLabel: 'Make It Happen'
        //  }
        //},
        {
          key: 'tags',
          type: 'tags',
          templateOptions: {
            label: 'Tag(s)',
            minTags: 4
          },
          validation: {
            messages: {
              minTags: '"Enter at least four tags."'
            }
          }
        }//,
        //{
        //  key: 'bar',
        //  type: 'questions'
        //}
      ]
    });

    /** @ngInject */
    function FooController() {
      var vm = this;

      vm.afterActivate = afterActivate;

      function afterActivate() {
        vm.record = {
          foo: 'foo text',
          bar: [
            {name: 'fizz', value: 'fizz fizz', value_type: 'string', field: 'text', label: 'Fizz'},
            {name: 'buzz', value: 19, value_type: 'integer', field: 'text', label: 'Buzz'}
          ]
        }
      }

      // Private
    }
  }

})();
