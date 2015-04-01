'use strict';

/**@ngInject*/
var ListAlertsController = function($scope, $state, alerts, FlashesService, users, AlertsResource) {
  this.alerts = alerts.filter(function(alert) {
      return alert.staff_id !== 0;
    });
  this.alerts = this.mapUserToAlert(this.alerts, users);
  this.idAlertMap = {};

  this.deleteAlert = function(alert) {
    var newAlert = new AlertsResource();
    newAlert.message = String(alert.message);
    newAlert.status = String(alert.status);
    newAlert.project_id = String(alert.project_id);
    newAlert.order_item_id = String(alert.order_item_id);
    newAlert.staff_id = String(alert.staff_id);
    newAlert.start_date = String(alert.start_date);
    newAlert.end_date = String(alert.end_date);
    this.idAlertMap[String(alert.id)] = newAlert;
    alert.$delete(function() {
        FlashesService.add({
          timeout: true,
          type: 'success',
          message: 'Alert successfully deleted.'
        });
        //$state.go('base.authed.admin.alerts.list', {}, {reload: true});
      },
      function() {
        FlashesService.add({
          timeout: true,
          type: 'error',
          message: 'Alert deletion failed. Please try again, later.'
        });
      }
    );
  };

  this.checkIfDeleted = function(alert) {
    return this.idAlertMap.hasOwnProperty(alert.id);
  };

  this.undoDelete = function(alert) {
    this.idAlertMap[alert.id].$save(_.bind(function() {
      FlashesService.add({
        timeout: true,
        type: 'success',
        message: 'Alert deletion successfully undone.'
      });
      //set the listed alert's id to that of the new alert, so when the update/delete links are called, not all is lost.
      alert.id = this.idAlertMap[alert.id].id;
      delete this.idAlertMap[alert.id];
    }, this), _.bind(function(response) {
      FlashesService.add({
        timeout: true,
        type: 'error',
        message: 'Unable to undo deletion.'
      });
    }, this));
  };
};

ListAlertsController.resolve = {
  /**@ngInject*/
  alerts: function(AlertsResource) {
    return AlertsResource.query().$promise;
  },
  /**@ngInject*/
  users: function(UsersResource) {
    return UsersResource.query().$promise;
  }
};

ListAlertsController.prototype = {
  mapUserToAlert : function(alerts, users) {
    _.each(alerts, function(alert) {
      alert.user = _.find(users, function(user) {
        return user.id === alert.staff_id;
      });
    });
    return alerts;
  }
};

window.ListAlertsController = ListAlertsController;
