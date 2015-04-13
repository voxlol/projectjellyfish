//= require_tree .
'use strict';

var ProjectHomeData = ProjectHomeController.resolve;
var NewProjectData = NewProjectController.resolve;
var ProjectData = ProjectController.resolve;
var EditProjectData = EditProjectController.resolve;
var ProjectServicesData = ProjectServicesController.resolve;

var ProjectsModule = angular.module('broker.projects', [])
    .controller('ProjectHomeController', ProjectHomeController)
    .controller('BaseProjectController', BaseProjectController)
    .controller('NewProjectController', NewProjectController)
    .controller('EditProjectController', EditProjectController)
    .controller('ProjectController', ProjectController)
    .controller('ProjectServicesController', ProjectServicesController)
    .directive('projectForm', ProjectForm)
    .directive('projectBox', ProjectBoxDirective)
    .directive('groupsInput', GroupsInput)
    .factory('ProjectsResource', ProjectsResource)
    .factory('ProjectQuestionsResource', ProjectQuestionsResource)
    .config(
    /**@ngInject*/
    function($stateProvider) {
        $stateProvider
            // Project Homepage
            .state('base.authed.projectHome', {
                url: "^/project",
                templateUrl: "/templates/partials/projects/project_home.html",
                resolve: ProjectHomeData ,
                controller: "ProjectHomeController as projecHomeCtrl"
            })
            // Create Project
            .state('base.authed.newProject', {
                url: "^/project/new",
                templateUrl: "/templates/partials/projects/new_project.html",
                resolve: NewProjectData,
                controller: "NewProjectController as newProjectCtrl"
            })
            // Project Base
            .state('base.authed.project', {
                abstract: true,
                url: "^/project/:projectId",
                template: "<div ui-view></div>",
                resolve: ProjectData,
                controller: "BaseProjectController as baseProjectCtrl"
            })
            // Project
            .state('base.authed.project.view', {
                url: "^/project/:projectId",
                templateUrl: "/templates/partials/projects/project.html",
                controller: "ProjectController as projectCtrl"
            })
            // Edit Project
            // @todo This should extend the base.project state if possible.
            .state('base.authed.project.edit', {
                url: "^/project/:projectId/edit",
                templateUrl: "/templates/partials/projects/edit_project.html",
                resolve: EditProjectData,
                controller: "EditProjectController as editProjectCtrl"
            })
            // Add Service to Project
            .state('base.authed.project.addService', {
                url: "^/project/:projectId/add-service",
                templateUrl: '/templates/partials/projects/add_services.html',
                controller: 'ProjectServicesController as projectServicesCtrl',
                resolve: ProjectServicesData
            });
    }
);

window.ProjectsModule = ProjectsModule;
