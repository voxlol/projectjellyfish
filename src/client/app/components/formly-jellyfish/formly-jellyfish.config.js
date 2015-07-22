(function() {
  'use strict';

  var formlyJellyfishApiCheck = apiCheck({
    output: {
      prefix: 'formly-jellyfish'
    }
  });

  angular.module('app.components')
    .config(wrappers)
    .config(types);

  /** @ngInject */
  function wrappers(formlyConfigProvider) {
    formlyConfigProvider.setWrapper([
      {
        name: 'jellyfishField',
        templateUrl: 'app/components/formly-jellyfish/wrappers/field.html'
      },
      {
        name: 'jellyfishLabel',
        templateUrl: 'app/components/formly-jellyfish/wrappers/label.html',
        apiCheck: {
          templateOptions: formlyJellyfishApiCheck.shape({
            label: formlyJellyfishApiCheck.string
          })
        },
        apiCheckInstance: formlyJellyfishApiCheck
      },
      {
        name: 'jellyfishHasError',
        templateUrl: 'app/components/formly-jellyfish/wrappers/has-error.html'
      }
    ]);
  }

  /** @ngInject */
  function types(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'text',
      template: '<input type="text" class="field__input" ng-model="model[options.key]" />',
      wrapper: ['jellyfishHasError', 'jellyfishLabel', 'jellyfishField']
    });

    formlyConfigProvider.setType({
      name: 'password',
      template: '<input type="password" class="field__input" ng-model="model[options.key]" />',
      wrapper: ['jellyfishHasError', 'jellyfishLabel', 'jellyfishField']
    });

    formlyConfigProvider.setType({
      name: 'textarea',
      template: '<textarea class="field__input" ng-model="model[options.key]"></textarea>',
      wrapper: ['jellyfishHasError', 'jellyfishLabel', 'jellyfishField'],
      defaultOptions: {
        ngModelAttrs: {
          rows: { attribute: 'rows' }
        }
      },
      apiCheck: {
        templateOptions: formlyJellyfishApiCheck.shape({
          rows: formlyJellyfishApiCheck.number.optional
        })
      },
      apiCheckInstance: formlyJellyfishApiCheck
    });

    formlyConfigProvider.setType({
      name: 'select',
      template: '<select class="field__input" ng-model="model[options.key]"></select>',
      wrapper: ['jellyfishHasError', 'jellyfishLabel', 'jellyfishField'],
      defaultOptions: selectDefaultOptions,
      apiCheck: {
        templateOptions: formlyJellyfishApiCheck.shape({
          options: formlyJellyfishApiCheck.arrayOf(formlyJellyfishApiCheck.object),
          labelProp: formlyJellyfishApiCheck.string.optional,
          groupProp: formlyJellyfishApiCheck.string.optional
        })
      }
    });

    function selectDefaultOptions(options) {
      var ngOptions = options.templateOptions.ngOptions || 'option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options';

      return {
        ngModelAttrs: _defineProperty({}, ngOptions, {
          value: 'ng-options'
        })
      };

      function _defineProperty(obj, key, value) {
        return Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
    }
  }
})();
