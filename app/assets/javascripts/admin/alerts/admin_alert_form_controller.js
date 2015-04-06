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
    if (typeof this.alert.start_date === "undefined" || this.alert.start_date === null) {
      this.alert.start_date = '';
    }
    if (typeof this.alert.end_date === "undefined" || this.alert.end_date === null) {
      this.alert.end_date = '';
    }

  },

  create: function() {
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    if (this.alert.start_date === null) {
      this.alert.start_date = '';
    }
    if (this.alert.end_date === null) {
      this.alert.end_date = '';
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
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    if (this.alert.start_date === null) {
      this.alert.start_date = '';
    }
    if (this.alert.end_date === null) {
      this.alert.end_date = '';
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
