//= require_tree .
'use strict';

angular.module('broker', [
  "ui.router",
  "ngResource",
  "angular-loading-bar",
  "smart-table",
  'ngAnimate',
  "ui.gravatar",
  "angucomplete",
  "ui.bootstrap",
  "ui.select",
  "fiestah.money",
  "ngCookies",
  "angular-progress-arc",
  "broker.common",
  "broker.base",
  "broker.errors",
  "broker.admin",
  "broker.alerts",
  "broker.flashes",
  "broker.question_input",
  "broker.auth",
  "broker.cart",
  "broker.projects",
  "broker.products",
  "broker.clouds",
  "broker.services",
  "broker.marketplace",
  "broker.orders",
  "broker.directives",
  "broker.dashboard",
  "broker.users",
  "broker.settings"

])
  .run(Init);
