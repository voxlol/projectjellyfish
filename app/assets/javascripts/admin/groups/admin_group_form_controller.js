'use strict';

var adminGroupsListState = 'base.authed.admin.groups.list';

// @todo This mirrors the product_form_controller.js file in a lot of regards,
//       could be abstracted.

/**@ngInject*/
var AdminGroupFormController = function($state, UsersResource) {

  this.$state = $state;
  this.group = null;
  this.formSubmitted = false;
  this.users = UsersResource.query();

  // Set the available roles.
  // @todo Should probably be pulled form the backend
  // @todo For some reason ui-select goes nuts if this is returned from a
  //       method.
  this.roles = [
    {
      value: 'group',
      name: 'Group'
    },
    {
      value: 'admin',
      name: 'Admin'
    }
  ];

};


AdminGroupFormController.prototype = {

  /**
   * Take the group resource from the parent (edit/add).
   *
   * @param parent
   */
  initForm: function(parent) {
    this.group = parent.group;
    this.FlashesService = parent.FlashesService;
  },

  create: function() {
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    this.group.$save(_.bind(function() {
        this.FlashesService.add({
            timeout: true,
            type: 'success',
            message: 'Group successfully created.'
        });
        this.$state.go(adminGroupsListState);
        }, this), _.bind(function(response) {
            this.FlashesService.add({
                timeout: true,
                type: 'error',
                message: 'Error while creating group. Please try again.'
            });
            this._handleServerErrors(response.data.errors);
        }, this));

  },

  update: function() {
    this.formSubmitted = true;
    if (this.form.$invalid) {
      return false;
    }

    this.group.$update(_.bind(function() {
            this.FlashesService.add({
                timeout: true,
                type: 'success',
                message: 'Group successfully updated.'
            });
            this.$state.go(adminGroupsListState);
            }, this), _.bind(
        function(response) {
            this.FlashesService.add({
                timeout: true,
                type: 'error',
                message: 'Error while updating group. Please try again.'
            });
            this._handleServerErrors(response.data.errors);
        }, this) );
  },

  destroy: function() {
    this.formSubmitted = true;
    this.group.$delete(_.bind(function() {
        this.FlashesService.add({
            timeout: true,
            type: 'success',
            message: 'Group was successfully deleted.'
        });
        this.$state.go(adminGroupsListState);
    }, this), _.bind(function(response) {
        this.FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'Error while deleting group. Please try again, later.'
        });
        this._handleServerErrors(response.data.errors);
    }, this) );
  },

  canSubmit: function() {
    return !this.formSubmitted || (this.form.$dirty && this.form.$valid);
  },

  hasError: function(field, validation) {
    // Only show validation errors on submit;
    // Avoids angulars hasty error messaging
    if (validation) {
      return this.formSubmitted && this.form[field].$error[validation];
    }
    return this.formSubmitted && this.form[field].$invalid;
  },

  /**
   * Since we can't easily validate the error coming from the server, we use
   * ng-change to clear the error when the group updates the field.  This way
   * the form will allow a resubmit.
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
   * Parse the errors from the server, Set the invalid flag, error flag for the
   * server.
   * @param errors
   * @private
   */
  _handleServerErrors: function(errors) {

    var form = this.form;

    _.each(errors, function(errorArray, fieldName) {
      form[fieldName].$error.submitError = '';

      _.each(errorArray, function(error) {
        var formattedFieldName = fieldName.charAt(0).toUpperCase() +
          fieldName.slice(1).toLowerCase();
        form[fieldName].$error.submitError +=
          formattedFieldName + ' ' + error + ' ';
      });

      form[fieldName].$invalid = true;
    });
  }
};

window.AdminGroupFormController = AdminGroupFormController;
