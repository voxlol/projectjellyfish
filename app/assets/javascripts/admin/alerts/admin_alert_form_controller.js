'use strict';

var adminAlertsListState = 'base.authed.admin.alerts.list';

/**
 * @todo This mirrors the admin_user_form_controller.js file in a lot of regards, could be abstracted.
 */

/**@ngInject*/
var AdminAlertFormController = function($state, $scope, AlertsResource, FlashesService) {

  this.$state = $state;
  this.alert = null;
  this.formSubmitted = false;
  this.currentUser = AdminAlertFormController.currentUser;
  this.AlertsResource = AlertsResource;
  // Set the available roles.
  // @todo Should probably be pulled from the backend
  // @todo For some reason ui-select goes nuts if this is returned from a method.
  this.statuses = [
    {
      value: 'OK',
      name: 'OK'
    },
    {
      value: 'WARNING',
      name: 'Warning'
    },
    {
      value: 'CRITICAL',
      name: 'Critical'
    }
  ];

  this.start_time = '';
  this.end_time = '';

  $scope.openStartDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.endDateOpened = false;
    $scope.startDateOpened = true;
  };

  $scope.openEndDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDateOpened = false;
    $scope.endDateOpened = true;
  };

};

AdminAlertFormController.prototype = {

  /**
   * Take the alert resource from the parent (edit/add).
   *
   * @param parent
   */
  initForm: function(parent) {
    this.oldStatus = parent.alert.status;
    this.alert = parent.alert;
    this.FlashesService = parent.FlashesService;
    if (typeof this.alert.project_id === "undefined" || this.alert.project_id === null) {
      this.alert.project_id = '0';
    }
    if (typeof this.alert.order_item_id === "undefined" || this.alert.order_item_id === null) {
      this.alert.order_item_id = '0';
    }
    this.alert.staff_id = String(parent.currentUser.id);
    console.log("This ALERT: " + JSON.stringify(this.alert));
    if (typeof this.alert.start_date === "undefined" || this.alert.start_date === null) {
      this.alert.start_date = '';
      var startTime = new Date();
      startTime.setHours(0,0,0);
      this.start_time = String(startTime);
    }
    else {
      var startDate = new Date(this.alert.start_date);
      this.start_time = String(startDate);
    }
    if (typeof this.alert.end_date === "undefined" || this.alert.end_date === null) {
      this.alert.end_date = '';
      var endTime = new Date();
      endTime.setHours(0,0,0);
      this.end_time = String(endTime);
    }
    else {
      var endDate = new Date(this.alert.end_date);
      this.end_time = String(endDate);
    }

  },

  create: function() {
    console.log("This.Alert.Start_Date: " + this.alert.start_date);
    console.log("This.Alert.End_Date: " + this.alert.end_date);
    console.log("This.Start_Time: " + this.start_time);
    console.log("This.End_Time: " + this.end_time);
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    if (this.alert.start_date === null) {
      this.alert.start_date = '';
    }
    else {
      var startDate = new Date(this.alert.start_date);
      var startTime = new Date(this.start_time);
      startDate.setHours(startTime.getHours(),startTime.getMinutes(),startTime.getSeconds());
      this.alert.start_date = String(startDate);
    }
    if (this.alert.end_date === null) {
      this.alert.end_date = '';
    }
    else {
      var endDate = new Date(this.alert.end_date);
      var endTime = new Date(this.end_time);
      endDate.setHours(endTime.getHours(),endTime.getMinutes(),endTime.getSeconds());
      this.alert.end_date = String(endDate);
    }
    this.alert.$save(_.bind(function() {
      this.FlashesService.add({
        timeout: true,
        type: 'success',
        message: 'Alert successfully created.'
      });
      this.$state.go(adminAlertsListState);
    }, this), _.bind(function(response) {
      this.FlashesService.add({
        timeout: true,
        type: 'error',
        message: 'Alert could not be created. Please try again.'
      });
      this._handleServerErrors(response.data.errors);
    }, this));

  },

  update: function() {
    console.log("This.Alert.Start_Date: " + this.alert.start_date);
    console.log("This.Alert.End_Date: " + this.alert.end_date);
    console.log("This.Start_Time: " + this.start_time);
    console.log("This.End_Time: " + this.end_time);
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    if (this.alert.start_date === null) {
      this.alert.start_date = '';
    }
    else {
      var startDate = new Date(this.alert.start_date);
      var startTime = new Date(this.start_time);
      startDate.setHours(startTime.getHours(),startTime.getMinutes(),startTime.getSeconds());
      this.alert.start_date = String(startDate);
    }
    if (this.alert.end_date === null) {
      this.alert.end_date = '';
    }
    else {
      var endDate = new Date(this.alert.end_date);
      var endTime = new Date(this.end_time);
      endDate.setHours(endTime.getHours(),endTime.getMinutes(),endTime.getSeconds());
      this.alert.end_date = String(endDate);
    }
    if (this.oldStatus !== this.alert.status) {
      var newAlert = new this.AlertsResource();
      newAlert.message = String(this.alert.message);
      newAlert.status = String(this.alert.status);
      newAlert.project_id = String(this.alert.project_id);
      newAlert.order_item_id = String(this.alert.order_item_id);
      newAlert.staff_id = String(this.alert.staff_id);
      newAlert.start_date = String(this.alert.start_date);
      newAlert.end_date = String(this.alert.end_date);
      // Create newAlert
      newAlert.$save(_.bind(function() {
        // Delete old alert
        this.alert.$delete(_.bind(function() {
          this.FlashesService.add({
            timeout: true,
            type: 'success',
            message: 'Alert was successfully updated.'
          });
          this.$state.go(adminAlertsListState);
        }, this), function(response) {
          this.FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'An error occurred while updating the alert.'
          });
          this._handleServerErrors(response.data.errors);
        });
      }, this), _.bind(function(response) {
        this.FlashesService.add({
          timeout: true,
          type: 'error',
          message: 'An error occurred while updating the alert.'
        });
        this._handleServerErrors(response.data.errors);
      }, this));
      //delete this.alert
    }
    else {
      this.alert.$update(_.bind(function () {
        this.FlashesService.add({
          timeout: true,
          type: 'success',
          message: 'Alert was successfully updated.'
        });
        this.$state.go(adminAlertsListState);
      }, this), function (response) {
        this.FlashesService.add({
          timeout: true,
          type: 'error',
          message: 'An error occurred while updating the alert.'
        });
        this._handleServerErrors(response.data.errors);
      });
    }
  },

  canSubmit: function() {
    return !this.formSubmitted || (this.form.$dirty && this.form.$valid);
  },

  hasError: function(field, validation) {
    // Only show validation errors on submit; Avoids angulars hasty error messaging
    if (validation) {
      return this.formSubmitted && this.form[field].$error[validation];
    }
    return this.formSubmitted && this.form[field].$invalid;
  },

  /**
   * Since we can't easily validate the error coming from the server, we use ng-change
   * to clear the error when the user updates the field.  This way the form will allow a resubmit.
   *
   * @param field
   */
  clearSubmitError: function(field) {
    delete this.form[field].$error.submitError;

    if (this.form[field].$error.length === 0) {
      this.form[field].$invalid = false;
    }
  },

  /**
   * Get the submit error value.
   *
   * @param field
   * @returns {*}
   */
  getSubmitErrorValue: function(field) {
    return this.form[field].$error.submitError;
  },

  /**
   * Parse the errors from the server, Set the invalid flag, error flag for the server.
   * @param errors
   * @private
   */
  _handleServerErrors: function(errors) {

    var form = this.form;

    _.each(errors, function(errorArray, fieldName) {
      form[fieldName].$error.submitError = '';

      _.each(errorArray, function(error) {
        var formattedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase();
        form[fieldName].$error.submitError += formattedFieldName + ' ' + error + ' ';
      });

      form[fieldName].$invalid = true;
    });
  }
};


window.AdminAlertFormController = AdminAlertFormController;
