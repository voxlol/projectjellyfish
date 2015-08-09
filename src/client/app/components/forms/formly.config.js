/* global apiCheck:false */
(function(apiCheck) {
  'use strict';

  angular.module('app.components')
    .constant('jfApiCheck', apiCheck({
      output: {
        prefix: 'Jellyfish Fields:'
      }
    }))
    .run(wrappers)
    .run(types)
    .run(validation);

  /** @ngInject */
  function wrappers(formlyConfig, jfApiCheck) {
    formlyConfig.setWrapper([
      {
        name: 'jfField',
        templateUrl: 'app/components/forms/wrappers/field.html'
      },
      {
        name: 'jfLabel',
        templateUrl: 'app/components/forms/wrappers/label.html',
        apiCheck: checkLabel
      },
      {
        name: 'jfHasError',
        templateUrl: 'app/components/forms/wrappers/has-error.html'
      },
      {
        name: 'jfLoading',
        templateUrl: 'app/components/forms/wrappers/loading.html'
      }
    ]);

    function checkLabel() {
      return {
        templateOptions: {
          label: jfApiCheck.string
        }
      };
    }
  }

  /** @ngInject */
  function types(formlyConfig, jfApiCheck) {
    formlyConfig.setType({
      name: 'text',
      template: '<input type="text" class="field__input" ng-model="model[options.key]" autocomplete="off"/>',
      wrapper: ['jfHasError', 'jfLabel', 'jfField']
    });

    formlyConfig.setType({
      name: 'password',
      template: '<input type="password" class="field__input" ng-model="model[options.key]" autocomplete="off"/>',
      wrapper: ['jfHasError', 'jfLabel', 'jfField']
    });

    formlyConfig.setType({
      name: 'textarea',
      template: '<textarea class="field__input" ng-model="model[options.key]"></textarea>',
      wrapper: ['jfHasError', 'jfLabel', 'jfField'],
      defaultOptions: {
        templateOptions: {
          rows: 3
        },
        ngModelAttrs: {
          rows: {attribute: 'rows'}
        }
      },
      apiCheck: checkTextarea
    });

    function checkTextarea() {
      return {
        templateOptions: {
          rows: jfApiCheck.number.optional
        }
      };
    }

    formlyConfig.setType({
      name: 'checkbox',
      template: '<div class="field__checkbox"><input ng-model="model[options.key]" type="checkbox"/>' +
      '<label for="{{ options.id }}">{{ to.checkboxLabel || to.label }}</label></div>',
      wrapper: ['jfHasError', 'jfLabel', 'jfField'],
      apiCheck: checkCheckbox
    });

    function checkCheckbox() {
      return {
        templateOptions: {
          checkboxLabel: jfApiCheck.string.optional
        }
      };
    }

    formlyConfig.setType({
      name: 'select',
      template: '<select class="field__input" ng-model="model[options.key]"></select>',
      wrapper: ['jfHasError', 'jfLabel', 'jfField'],
      defaultOptions: selectDefaultOptions,
      apiCheck: checkSelect
    });

    function checkSelect() {
      return {
        templateOptions: {
          options: jfApiCheck.arrayOf(jfApiCheck.object),
          labelProp: jfApiCheck.string.optional,
          valueProp: jfApiCheck.string.optional,
          groupProp: jfApiCheck.string.optional
        }
      };
    }

    function selectDefaultOptions(options) {
      var defaultNgOptions = 'option[to.valueProp || \'value\'] ' +
        'as option[to.labelProp || \'label\'] ' +
        'group by option[to.groupProp || \'group\'] ' +
        'for option in to.options';
      var ngOptions = options.templateOptions.ngOptions || defaultNgOptions;
      var ngModelAttrs = {};

      ngModelAttrs[ngOptions] = {value: 'ng-options'};

      return {
        ngModelAttrs: ngModelAttrs
      };
    }

    formlyConfig.setType({
      name: 'price',
      extends: 'text',
      defaultOptions: {
        templateOptions: {
          scale: 0
        },
        validators: {
          pattern: {
            expression: function(viewValue, modelValue, scope) {
              var value = modelValue || viewValue;
              var scale = scope.to.scale;
              var precision = scope.to.precision - scale;
              var pRx = '\\d{1,' + precision + '}';
              var sRx = 0 < scale ? '(?:\\.\\d{1,' + scale + '})?' : '';
              var rx = new RegExp(['^', pRx, sRx, '$'].join(''));

              return rx.test(value);
            },
            message: function(foo, bar, scope) {
              var to = scope.to;

              return [
                'Enter a value between',
                Math.pow(10, to.scale * -1).toFixed(to.scale),
                'and',
                (Math.pow(10, to.precision - to.scale) - Math.pow(10, to.scale * -1)).toFixed(to.scale)
              ].join(' ');
            }
          }
        }
      },
      apiCheck: checkPrice
    });

    function checkPrice() {
      return {
        templateOptions: {
          precision: jfApiCheck.number,
          scale: jfApiCheck.number.optional
        }
      };
    }

    formlyConfig.setType({
      name: 'async_select',
      extends: 'select',
      wrapper: ['jfHasError', 'jfLoading', 'jfLabel', 'jfField']
    });

    formlyConfig.setType({
      name: 'data_select',
      extends: 'select',
      apiCheck: checkDataSelect,
      controller: DataSelectController
    });

    function checkDataSelect() {
      return {
        templateOptions: {
          dataKey: jfApiCheck.string
        }
      };
    }

    /** @ngInject */
    function DataSelectController($scope, Toasts) {
      var dataKey = $scope.to.dataKey;

      if (angular.isUndefined(dataKey)) {
        Toasts.warning([$scope.to.label, 'has no dataKey'].join(' '));
        return;
      }

      if (angular.isUndefined($scope.formState[dataKey])) {
        Toasts.warning([$scope.to.label, 'cannot find', dataKey, 'in formState'].join(' '));
      }

      $scope.to.options = $scope.formState[dataKey];
    }

    formlyConfig.setType({
      name: 'questions',
      template: '<formly-form form="form" model="model[options.key]" fields="options.data.fields" options="formOptions"></formly-form>',
      defaultOptions: {
        data: {
          fields: []
        }
      },
      controller: QuestionsController
    });

    /** @ngInject */
    function QuestionsController($scope, lodash, Forms) {
      var templateOptions = [
        'label', 'placeholder', // General
        'options', 'labelProp', 'valueProp', 'groupProp', // Select
        'rows', // Textarea
        'minlength', 'maxlength', 'pattern' // Validation
      ];
      var data = $scope.model[$scope.options.key];

      $scope.options.data.fields = lodash.map(data, buildField);

      function buildField(question) {
        var field = angular.copy(Forms.fields(question.field || 'text'));

        field.key = 'value';
        field.model = question;

        if (angular.isDefined(field.templateOptions)) {
          angular.forEach(templateOptions, setTemplateOptions);
        }

        if (angular.isDefined(question['required'])) {
          setRequired();
        }

        return field;

        function setTemplateOptions(option) {
          if (angular.isDefined(question[option])) {
            field.templateOptions[option] = question[option];
          }
        }

        function setRequired() {
          switch (question['required']) {
            case 'if_new':
              if (angular.isUndefined(field.expressionProperties)) {
                field.expressionProperties = {};
              }
              field.expressionProperties['templateOptions.required'] = '!model.id';
              break;
            case true:
              if (angular.isUndefined(field.templateOptions)) {
                field.templateOptions = {};
              }
              field.templateOptions.required = true;
              break;
            case false:
              break;
            default:
              if (angular.isUndefined(field.expressionProperties)) {
                field.expressionProperties = {};
              }
              field.expressionProperties['templateOptions.required'] = question['required'];
          }
        }
      }
    }

    formlyConfig.setType({
      name: 'tags',
      templateUrl: 'app/components/forms/types/tags.html',
      wrapper: ['jfHasError', 'jfLabel', 'jfField'],
      defaultOptions: {
        ngModelAttrs: {
          minTags: {
            attribute: 'min-tags'
          },
          maxTags: {
            attribute: 'max-tags'
          }
        }
      },
      controller: TagsController,
      apiCheck: checkTags,
      apiCheckInstance: jfApiCheck
    });

    function checkTags() {
      return {
        templateOptions: {
          minTags: jfApiCheck.number.optional,
          maxTags: jfApiCheck.number.optional
        }
      }
    }

    /** @ngInject */
    function TagsController($scope, Tag, TAG_QUERY_LIMIT) {
      $scope.queryTags = queryTags;

      function queryTags(query) {
        return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
      }
    }

    formlyConfig.setType({
      name: 'image-chooser',
      template: '<image-chooser image="model[options.key]"></image-chooser>'
    });
  }

  /** @ngInject */
  function validation(formlyConfig, jfApiCheck, formlyValidationMessages) {
    formlyConfig.extras.apiCheckInstance = jfApiCheck;
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'form.$submitted';
    formlyValidationMessages.messages.required = 'to.label + " is required"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
    formlyValidationMessages.messages.minlength = 'to.label + " is too short"';
    formlyValidationMessages.messages.maxlength = 'to.label + " is too long"';
    formlyValidationMessages.messages.pattern = 'to.label + " is not formatted correctly"';
  }
})(apiCheck);
