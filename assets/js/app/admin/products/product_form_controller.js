'use strict';

/**
 * @todo This mirrors the admin_user_form_controller.js file in a lot of regards, could be abstracted.
 */

/**@ngInject*/
function ProductFormController($state, FlashesService) {
  var self = this;

  this.product = null;
  this.formSubmitted = false;

  this.priceRegex = "\\d{1,6}(\\.\\d{1,4})?";

  this.initForm = function(parent) {
    this.product = parent.product;
  };

  function onSuccess(actionType) {
      if (actionType === 'create') {
          FlashesService.add({
              timeout: true,
              type: 'success',
              message: 'Product was successfully added.'
          });
      }
      if (actionType === 'update') {
          FlashesService.add({
              timeout: true,
              type: 'success',
              message: 'Product was successfully edited.'
          });
      }
      if (actionType === 'destroy') {
          FlashesService.add({
              timeout: true,
              type: 'success',
              message: 'Product was successfully deleted.'
          });
      }
      else
      {
          FlashesService.add({
              timeout: true,
              type: 'success',
              message: 'Product: Success.'
          });
      }
    $state.go('base.authed.admin.products.list');
  }

  function onFailure(actionType) {
    if (actionType === 'create') {
        FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'There was a problem saving the product. You may want to try again later.'
        });
    }
    if (actionType === 'update') {
      FlashesService.add({
          timeout: true,
          type: 'error',
          message: 'There was a problem editing the product. You may want to try again later.'
      });
    }
    if (actionType === 'destroy') {
      FlashesService.add({
          timeout: true,
          type: 'error',
          message: 'There was a problem deleting the product. You may want to try again later.'
      });
    }
    else
    {
        FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'Product: Failure.'
        });
    }
  }

  this.create = function() {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }
    self.product.$save(onSuccess('create'), onFailure('create'));
  };

  this.update = function() {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }

    // Make sure description is a string, textarea empty is null which is not valid;
    self.product.description = String(self.product.description);

    self.product.$update(onSuccess('update'), onFailure('update'));
  };

  this.destroy = function() {
    self.formSubmitted = true;
    self.product.$delete(onSuccess('destroy'), onFailure('destroy'));
  };

  this.canSubmit = function() {
    return !self.formSubmitted || (self.form.$dirty && self.form.$valid);
  };

  this.hasError = function(field, validation) {
    // Only show validation errors on submit; Avoids angulars hasty error messaging
    if (validation) {
      return self.formSubmitted && self.form[field].$error[validation];
    }
    return self.formSubmitted && self.form[field].$invalid;
  };
}

module.exports = ProductFormController;
