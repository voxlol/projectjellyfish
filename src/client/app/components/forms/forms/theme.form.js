(function() {
  'use strict';

  angular.module('app.components')
    .config(themeForm);

  /** @ngInject */
  function themeForm(FormsProvider) {
    FormsProvider.register('themeForm', {
      controller: ThemeFormController
    });

    /** @ngInject */
    function ThemeFormController(lodash) {
      var vm = this;

      init();

      function init() {
        var groups = [
          ['global', 'Site Colors'],
          ['navigation', 'Navigation'],
          ['button', 'Buttons'],
          ['link', 'Links'],
          ['region', 'Regions'],
          ['table', 'Tables'],
          ['tags', 'Tags'],
          ['modal', 'Modals']
        ];

        var fieldGroups = lodash.flatten(lodash.map(groups, buildFieldGroup));
        vm.fields = fieldGroups;

        function buildFieldGroup(group) {
          var key = group[0];
          var label = group[1];

          return [
            {
              className: 'forms__category',
              template: '<hr/>' + label + ':'
            },
            {
              className: 'forms__body',
              fieldGroup: [
                {
                  key: key,
                  type: 'multipleColors'
                }
              ]
            }
          ];
        }
      }
    }
  }
})();
