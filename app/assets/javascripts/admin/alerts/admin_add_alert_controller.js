'use strict';

/**@ngInject*/
var AdminAddAlertController = function(alert, currentUser, FlashesService) {
  this.alert = alert;
  this.currentUser = currentUser;
  this.FlashesService = FlashesService;
};

AdminAddAlertController.resolve = {
  /**@ngInject*/
  alert: function(AlertsResource) {
    return new AlertsResource();
  }
};

AdminAddAlertController.prototype = {

};

window.AdminAddAlertController = AdminAddAlertController;
