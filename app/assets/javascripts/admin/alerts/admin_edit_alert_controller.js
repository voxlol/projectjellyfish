'use strict';

/**@ngInject*/
var AdminEditAlertController = function(alert, currentUser, FlashesService) {
  this.alert = alert;
  this.currentUser = currentUser;
  this.FlashesService = FlashesService;
};

AdminEditAlertController.resolve = {
  /**@ngInject*/
  alert: function(AlertsResource, $stateParams) {
    return AlertsResource.get({id: $stateParams.id}).$promise;
  }
};

AdminEditAlertController.prototype = {

};

window.AdminEditAlertController = AdminEditAlertController;
