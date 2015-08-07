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
        templateUrl: 'app/components/formly-jellyfish/wrappers/field.html'
      },
      {
        name: 'jfLabel',
        templateUrl: 'app/components/formly-jellyfish/wrappers/label.html',
        apiCheck: checkLabel
      },
      {
        name: 'jfHasError',
        templateUrl: 'app/components/formly-jellyfish/wrappers/has-error.html'
      },
      {
        name: 'jfLoading',
        templateUrl: 'app/components/formly-jellyfish/wrappers/loading.html'
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
        'as option[to.labelProp || \'name\'] ' +
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
      name: 'async_select',
      extend: 'select',
      wrapper: ['jfHasError', 'jfLoading', 'jfLabel', 'jfField']
    });


    //formlyConfig.setType({
    //  name: 'async_select',
    //  template: '<select class="field__input" ng-model="model[options.key]"></select>',
    //  wrapper: ['jfHasError', 'jfLoading', 'jfLabel', 'jfField'],
    //  defaultOptions: selectDefaultOptions,
    //  apiCheck: {
    //    templateOptions: {
    //      asyncKey: jfApiCheck.string,
    //      options: jfApiCheck.arrayOf(jfApiCheck.object),
    //      labelProp: jfApiCheck.string.optional,
    //      valueProp: jfApiCheck.string.optional,
    //      groupProp: jfApiCheck.string.optional,
    //      blank: jfApiCheck.string.optional
    //    }
    //  },
    //  apiCheckInstance: jfApiCheck,
    //  controller: AsyncSelectController
    //});

    ///** @ngInject */
    //function AsyncSelectController($scope) {
    //  var blank = {};
    //
    //  $scope.to.loading = $scope.formState.productType.asyncSelect($scope.to.asyncKey).then(handleResults);
    //
    //  blank[$scope.to.valueProp || 'value'] = '';
    //  blank[$scope.to.labelProp || 'name'] = $scope.to.blank;
    //
    //  function handleResults(data) {
    //    if ($scope.to.blank) {
    //      data.unshift(blank);
    //    }
    //    $scope.to.options = data;
    //
    //    return data;
    //  }
    //}

    formlyConfig.setType({
      name: 'questions',
      template: '<formly-form form="form" model="model[options.key]" fields="options.data.fields"></formly-form>',
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
      templateUrl: 'app/components/formly-jellyfish/types/tags.html',
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
