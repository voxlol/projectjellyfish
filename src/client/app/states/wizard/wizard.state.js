(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper, WIZARD_MULTIPAGE) {
    routerHelper.configureStates(getStates(WIZARD_MULTIPAGE));
  }

  function getStates(WIZARD_MULTIPAGE) {
    return {
      'wizard': {
        url: '/project/:projectId/wizard',
        template: '<ui-view></ui-view>',
        redirectTo: WIZARD_MULTIPAGE ? 'wizard.multipage' : 'wizard.singlepage',
        resolve: {
          question: resolveQuestion,
          questions: resolveQuestions
        }
      }
    };
  }

  /** @ngInject */
  function resolveQuestion(WizardQuestion) {
    return WizardQuestion.query({id: 'first'}).$promise;
  }

  /** @ngInject */
  function resolveQuestions(WizardQuestion) {
    return WizardQuestion.query().$promise;
  }
})();
