//= require_tree .
'use strict';

var QuestionInputModule = angular.module('broker.question_input', [])
  .controller('QuestionInputController', QuestionInputController)
  .directive('questionInput', QuestionInputDirective)

window.QuestionInputModule = QuestionInputModule;
