(function() {
  'use strict';

  angular.module('broker.wizard').config(StateConfig);

  function StateConfig($stateProvider, WIZARD_MULTIPAGE) {
    var config = WIZARD_MULTIPAGE ? questionPerPage : allQuestionsOnOnePage;
    $stateProvider.state('base.authed.wizard', config);
  };

  var questionPerPage = {
    controller: "WizardQuestionsController as vm",
    resolve: {
      question: function(WizardQuestionsResource) {
        return WizardQuestionsResource.get({ id: "first" }).$promise;
      },
    },
    templateUrl: "/templates/partials/wizard/question.html",
    url: "/project/:projectId/wizard",
  };

  var allQuestionsOnOnePage = {
    controller: "WizardAllQuestionsController as vm",
    resolve: {
      questions: function(WizardQuestionsResource) {
        return WizardQuestionsResource.query().$promise;
      },
    },
    templateUrl: "/templates/partials/wizard/allQuestions.html",
    url: "/project/:projectId/wizard",
  };
}());
