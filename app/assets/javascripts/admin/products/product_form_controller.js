/**
 * @todo This mirrors the admin_user_form_controller.js file in a lot of regards, could be abstracted.
 */

/**@ngInject*/
function ProductFormController($scope, $state,
                               FlashesService, ProductTypesResource) {
  'use strict';
  var self = this;

  this.product = null;
  this.formSubmitted = false;
  $scope.prodsByName = ProductTypesResource.query();
  this.prices = [
    { id: "productSetupPrice", name: "Setup Price", field: ["setup_price"] },
    { id: "productMonthlyPrice", name: "Monthly Price", field: ["monthly_price"] },
    { id: "productHourlyPrice", name: "Hourly Price", field: ["hourly_price"] },
  ]

  $scope.$watchCollection('productForm.product.product_type',
    function(productTypeSelected) {
    angular.forEach($scope.prodsByName, function(item){
      if(item.title == productTypeSelected){
        self.formItems = [];
        angular.forEach(item.properties, function (item, key) {
          self.formItems.push({
            type: 'section',
            htmlClass: 'col-sm-6 customForm',
            items: [{
              key:key,
              feedback: false,
              disableSuccessState: true}]
          });
        });
        self.schemaForm = self.formItems;
        return false;
      }
    });
  });


  this.buildForm = function (formData) {
    self.formItems = [];
    angular.forEach(formData, function (item, key) {
      self.formItems.push({
        type: 'section',
        htmlClass: 'col-sm-6 customForm',
        items: [{
          key:key,
          feedback: false,
        disableSuccessState: true}]
      });
    });
    this.schemaForm = self.formItems;

    return false;
  };

  this.priceRlmegex = '\\d{1,6}(\\.\\d{1,4})?';

  this.initForm = function (parent) {
    angular.extend(this, parent);
  };

  this.onSuccess = function (message) {
    FlashesService.add({
      timeout: true,
      type: 'success',
      message: message || 'Product: Operation completed successfully!'
    });
    $state.go('base.authed.admin.products.list');

    return false;
  };

  this.onFailure = function (message) {
    FlashesService.add({
      timeout: true,
      type: 'error',
      message: message || 'Product: Operation failed to complete. You may want to try again later.'
    });
  };

  this.create = function () {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }

    self.product.$save(function () {
      self.onSuccess('Product was successfully added.');
    }, function () {
      self.onFailure('There was a problem saving the product. You may want to try again later.');
    });
  };

  this.update = function () {
    self.formSubmitted = true;
    if (self.form.$invalid) {
      return false;
    }

    // Make sure description is a string, textarea empty is null which is not valid;
    self.product.description = String(self.product.description);

    self.product.$update(function () {
      self.onSuccess('Product was successfully updated.');
    }, function () {
      self.onFailure('There was a problem editing the product. You may want to try again later.');
    });
  };

  this.destroy = function () {
    self.formSubmitted = true;

    self.product.$delete(function () {
      self.onSuccess('Product was successfully deleted.');
    }, function () {
      self.onFailure('There was a problem deleting the product. You may want to try again later.');
    });
  };

  this.canSubmit = function () {
    return !self.formSubmitted || (self.form.$dirty && self.form.$valid);
  };

  this.hasError = function (field, validation) {
    // Only show validation errors on submit; Avoids angulars hasty error messaging
    if (validation) {
      return self.formSubmitted && self.form[field].$error[validation];
    }
    return self.formSubmitted && self.form[field].$invalid;
  };
}

window.ProductFormController = ProductFormController;
