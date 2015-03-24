//= require_tree .
'use strict';

var ProjectQuestionsData = ProjectQuestionsController.resolve;
var ProjectQuestionData = EditProjectQuestionController.resolve;

var ProjectsAdminModule = angular.module('broker.admin.projects', [])
    .controller('ProjectsAdminController', ProjectsAdminController)
    .controller('ProjectQuestionsController', ProjectQuestionsController)
    .controller('NewProjectQuestionController', NewProjectQuestionController)
    .controller('EditProjectQuestionController', EditProjectQuestionController)
    .directive('projectQuestionForm', ProjectQuestionForm)
    .factory('ProjectQuestion', ProjectQuestion)
    .config(
        /**@ngInject*/
        function($stateProvider) {
          $stateProvider
            .state('base.authed.admin.projects', {
              url: '/projects',
              abstract: true,
              template: '<div class="projects-admin" ui-view></div>',
              controller: 'ProjectsAdminController as productsAdminCtrl'
            })
            .state('base.authed.admin.projects.project_questions', {
              url: '/questions',
              templateUrl: "/assets/templates/partials/admin/projects/project_questions.html",
              controller: 'ProjectQuestionsController as projectQuestion',
              resolve: ProjectQuestionsData
            })
            .state('base.authed.admin.projects.new_project_questions', {
              url: '/questions/new',
              templateUrl: "/assets/templates/partials/admin/projects/project_question.html",
              controller: 'NewProjectQuestionController as newProjectQuestion'
            })
            .state('base.authed.admin.projects.edit_project_questions', {
              url: '/questions/:id',
              templateUrl: "/assets/templates/partials/admin/projects/project_question.html",
              controller: 'EditProjectQuestionController as editProjectQuestion',
              resolve: ProjectQuestionData
            });
        }
      );

window.ProjectsAdminModule = ProjectsAdminModule;
