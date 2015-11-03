(function() {
  'use strict';

  angular.module('app.components')
    .config(userForm);

  /** @ngInject */
  function userForm(FormsProvider) {
    FormsProvider.register('userForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'first_name',
              type: 'text',
              templateOptions: {
                label: 'First Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A first name must be provided"'
                }
              }
            },
            {
              key: 'last_name',
              type: 'text',
              templateOptions: {
                label: 'Last Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A last name must be provided"'
                }
              }
            },
            {
              key: 'email',
              type: 'text',
              templateOptions: {
                label: 'Email',
                required: true
              },
              validation: {
                messages: {
                  required: '"A email address must be provided"'
                }
              }
            },
            {
              key: 'phone',
              type: 'text',
              templateOptions: {
                label: 'Phone Number',
                required: true
              },
              validation: {
                messages: {
                  required: '"A phone number must be provided"'
                }
              }
            },
            {
              key: 'password',
              type: 'password',
              templateOptions: {
                label: 'Password',
                required: false
              },
              validation: {
                messages: {
                  required: '"A password must be provided"'
                }
              }
            },
            {
              key: 'passwordConfirm',
              type: 'password',
              templateOptions: {
                label: 'Confirm Password',
                required: false
              },
              validation: {
                messages: {
                  required: '"A password confirmation must be provided"'
                }
              }
            }
          ]
        }
      ]
    });
  }
})();
