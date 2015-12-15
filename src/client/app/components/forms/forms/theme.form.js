(function() {
  'use strict';

  angular.module('app.components')
    .config(themeForm);

  /** @ngInject */
  function themeForm(FormsProvider) {
    FormsProvider.register('themeForm', {
      fields: [
        {
          className: 'forms__category',
          template: '<hr/>Global:'
        },
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'global',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Navigation:'
        }, {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'navigation',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Button:'
        }, {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'button',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Link:'
        },
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'link',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Region:'
        }, {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'region',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Table:'
        }, {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'tables',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Tags:'
        }, {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'tags',
              type: 'multipleColors'
            }
          ]
        }, {
          className: 'forms__category',
          template: '<hr/>Modal:'
        },
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'modal',
              type: 'multipleColors'
            }
          ]
        }
      ]
    })
    ;
  }
})();
