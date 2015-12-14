(function() {
  'use strict';

  angular.module('app.components')
    .config(themeForm);

  /** @ngInject */
  function themeForm(FormsProvider) {
    FormsProvider.register('themeForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A theme name must be provided"'
                }
              }
            },
            {
              key: 'colors',
              type: 'multipleColors'
            }
          ]
        }
      ]
    });
  }
})();
