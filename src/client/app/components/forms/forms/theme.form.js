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
              key: 'global',
              type: 'multipleColors',
              templateOptions: {
                label: 'Global'
              }
            },
            {
              key: 'navigation',
              type: 'multipleColors',
              templateOptions: {
                label: 'Navigation'
              }
            },
            {
              key: 'button',
              type: 'multipleColors',
              templateOptions: {
                label: 'Buttons'
              }
            },
            {
              key: 'link',
              type: 'multipleColors',
              templateOptions: {
                label: 'Links'
              }
            },
            {
              key: 'region',
              type: 'multipleColors',
              templateOptions: {
                label: 'Region'
              }
            },
            {
              key: 'tables',
              type: 'multipleColors',
              templateOptions: {
                label: 'Tables'
              }
            },
            {
              key: 'tags',
              type: 'multipleColors',
              templateOptions: {
                label: 'Tags'
              }
            },
            {
              key: 'modal',
              type: 'multipleColors',
              templateOptions: {
                label: 'Modals'
              }
            }
          ]
        }
      ]
    });
  }
})();
