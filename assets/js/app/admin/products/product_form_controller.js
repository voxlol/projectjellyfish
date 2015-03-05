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

  this.create = function() {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }
    self.product.$save(function() {
      $state.go('base.authed.admin.products.list');
    }, function() {
      FlashesService.add({
        timeout: true,
        type: 'error',
        message: 'There was a problem saving the product. You may want to try again later.'
      });
    });
  };

  this.update = function() {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }

    // Make sure description is a string, textarea empty is null which is not valid;
    self.product.description = String(self.product.description);

    self.product.$update(function() {
      $state.go('base.authed.admin.products.list');
    }, function() {
      FlashesService.add({
        timeout: true,
        type: 'error',
        message: 'There was a problem updating the product. You may want to try again later.'
      });
    });
  };

  this.destroy = function() {
    self.formSubmitted = true;
    self.product.$delete(function() {
      $state.go('base.authed.admin.products.list');
    }, function() {
      FlashesService.add({
        timeout: true,
        type: 'error',
        message: 'There was a problem removing the product. You may want to try again later.'
      });
    });
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
