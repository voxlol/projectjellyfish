(function() {
  'use strict';

  angular.module('app.components')
    .config(testForms);

  /** @ngInject */
  function testForms(formsProvider) {
    console.log(formsProvider);
    formsProvider.register('fooForm', {
      controller: FooController,
      fields: [
        {
          key: 'foo',
          type: 'text',
          templateOptions: {
            label: 99
          }
        },
        {
          key: 'bar',
          type: 'password',
          templateOptions: {
            label: 'Password'
          }
        }
      ]
    });

    /** @ngInject */
    function FooController(Product) {
      var vm = this;

      console.log('this:', this);

      vm.product = Product.new();

      vm.afterActivate = afterActivate;

      function afterActivate() {
        console.log(Product, Product.new());
        foo();
      }

      // Private

      function foo() {
        console.log('private foo');
      }
    }
  }
})();
