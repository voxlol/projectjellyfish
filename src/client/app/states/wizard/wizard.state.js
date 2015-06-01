(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper, WIZARD_MULTIPAGE) {
    routerHelper.configureStates(getStates(WIZARD_MULTIPAGE));
  }

  /** @ngInject */
  function getStates(WIZARD_MULTIPAGE) {
    return {
      'wizard': {
        url: '/project/:projectId/wizard',
        redirectTo: WIZARD_MULTIPAGE ? 'wizard.multipage' : 'wizard.singlepage',
        resolve: {
          /** @ngInject */
          question: function(WizardQuestion) {
            return WizardQuestion.get({ id: 'first' }).$promise;
          },
          /** @ngInject */
          questions: function(WizardQuestion) {
            return WizardQuestion.query().$promise;
          },
        },
        template: '<ui-view></ui-view>'
      }
    };
  }
})();
