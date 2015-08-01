(function() {
  'use strict';

  var formlyJellyfishApiCheck = apiCheck({
    output: {
      prefix: 'formly-jellyfish'
    }
  });

  angular.module('app.components')
    .config(wrappers)
    .config(types)
    .run(validation);

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
      },
      {
        name: 'jellyfishLoading',
        templateUrl: 'app/components/formly-jellyfish/wrappers/loading.html'
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
          valueProp: formlyJellyfishApiCheck.string.optional,
          groupProp: formlyJellyfishApiCheck.string.optional
        })
      }
    });

    formlyConfigProvider.setType({
      name: 'async_select',
      template: '<select class="field__input" ng-model="model[options.key]"></select>',
      wrapper: ['jellyfishHasError', 'jellyfishLoading', 'jellyfishLabel', 'jellyfishField'],
      defaultOptions: selectDefaultOptions,
      apiCheck: {
        templateOptions: formlyJellyfishApiCheck.shape({
          asyncKey: formlyJellyfishApiCheck.string,
          options: formlyJellyfishApiCheck.arrayOf(formlyJellyfishApiCheck.object),
          labelProp: formlyJellyfishApiCheck.string.optional,
          valueProp: formlyJellyfishApiCheck.string.optional,
          groupProp: formlyJellyfishApiCheck.string.optional,
          blank: formlyJellyfishApiCheck.string.optional
        })
      },
      controller: AsyncSelectController
    });


    function selectDefaultOptions(options) {
      var ngOptions = options.templateOptions.ngOptions || 'option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options';
      var ngModelAttrs = {};

      ngModelAttrs[ngOptions] = { value: 'ng-options' };

      return {
        ngModelAttrs: ngModelAttrs
      };
    }

    /** @ngInject */
    function AsyncSelectController($scope) {
      var blank = {};

      $scope.to.loading = $scope.formState.productType.asyncSelect($scope.to.asyncKey).then(handleResults);

      blank[$scope.to.valueProp || 'value'] = '';
      blank[$scope.to.labelProp || 'name'] = $scope.to.blank;

      function handleResults(data) {
        if ($scope.to.blank) {
          data.unshift(blank);
        }
        $scope.to.options = data;

        return data;
      }
    }
  }

  /** @ngInject */
  function validation(formlyConfig, formlyValidationMessages) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'form.$submitted';
    formlyValidationMessages.messages.required = 'to.label + " is required"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
    formlyValidationMessages.messages.minlength = 'to.label + " is too short"';
    formlyValidationMessages.messages.maxlength = 'to.label + " is too long"';
    formlyValidationMessages.messages.pattern = 'to.label + " is not formatted correctly"';
  }
})();
