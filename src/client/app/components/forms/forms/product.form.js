(function() {
  'use strict';

  angular.module('app.components')
    .config(productForm);

  /** @ngInject */
  function productForm(FormsProvider) {
    FormsProvider.register('productForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A product name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description',
                required: true
              },
              validation: {
                messages: {
                  required: '"A product description must be provided"'
                }
              }
            },
            {
              key: 'active',
              type: 'checkbox',
              templateOptions: {
                label: 'Available',
                checkboxLabel: 'Active'
              }
            },
            {
              key: 'setup_price',
              type: 'price',
              templateOptions: {
                label: 'Setup Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'monthly_price',
              type: 'price',
              templateOptions: {
                label: 'Monthly Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'hourly_price',
              type: 'price',
              templateOptions: {
                label: 'Hourly Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'answers',
              type: 'questions'
            },
            {
              key: 'tags',
              type: 'tags',
              templateOptions: {
                label: 'Tag(s)',
                minTags: 1
              },
              validation: {
                messages: {
                  mingTags: '"At least one tag must be entered"'
                }
              }
            }
          ]
        },
        {
          className: 'forms__aside',
          fieldGroup: [
            {
              noFormControl: true,
              template: '<div class="product-form-image__container"><div class="product-form-image"></div> <button type="button" class="btn-rounded">Choose Image</button></div>'
            }
          ]
        }
      ]
    });
  }
})();
