'use strict';

/**@ngInject*/
function DashboardController(alerts, projects) {
  this.alerts = alerts;
  this.projects = projects;
}


DashboardController.resolve = {

};

window.DashboardController = DashboardController;
