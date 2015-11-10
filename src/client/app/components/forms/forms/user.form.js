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
                required: true,
                placeholder: 'Enter a first name.'
              }
            },
            {
              key: 'last_name',
              type: 'text',
              templateOptions: {
                label: 'Last Name',
                required: true,
                placeholder: 'Enter a last name.'
              }
            },
            {
              key: 'email',
              type: 'email',
              controller: EmailFieldController,
              templateOptions: {
                label: 'Email',
                required: true,
                type: 'email',
                placeholder: 'Enter a valid email address.',
                onKeyDown: onKeyDown,
                onBlur: onBlur
              },
              asyncValidators: {
                uniqueEmail: {
                  expression: uniqueEmail,
                  message: '"This email address is already taken, please try another."'
                }
              },
              modelOptions: {
                updateOn: 'blur'
              }
            },
            {
              key: 'phone',
              type: 'text',
              templateOptions: {
                label: 'Phone Number',
                placeholder: 'Enter a valid phone number.'
              }
            },
            {
              key: 'password',
              type: 'password',
              templateOptions: {
                label: 'Password',
                placeholder: 'Enter a password.',
                minlength: 8
              },
              expressionProperties: {
                'templateOptions.required': '!model.id'
              },
              validation: {
                messages: {
                  required: '"A password must be provided"'
                }
              }
            },
            {
              key: 'password_confirmation',
              type: 'password',
              extras: {validateOnModelChange: true},
              templateOptions: {
                label: 'Confirm Password',
                placeholder: 'Please re-enter your password',
                minlength: 8
              },
              expressionProperties: {
                'templateOptions.required': 'model.password'
              },
              validators: {
                samePassword: samePassword
              },
              validation: {
                messages: {
                  required: '"A password confirmation must be provided"',
                  samePassword: '"Must match your password"'
                }
              }
            },
            {
              key: 'role',
              type: 'select',
              templateOptions: {
                label: 'Role',
                options: [
                  {label: 'User', value: 'user'},
                  {label: 'Manager', value: 'manager'},
                  {label: 'Admin', value: 'admin'}
                ],
                required: true
              },
              validation: {
                messages: {
                  required: '"An user status is required."'
                }
              }
            }
          ]
        }
      ]
    });

    /** @ngInject */
    function EmailFieldController($scope, $q, Staff) {
      $scope.Staff = Staff;
      $scope.q = $q;

      init();

      function init() {
        $scope.initialEmail = $scope.model.email;
      }
    }

    function uniqueEmail(view, model, scope) {
      var defer = scope.q.defer();

      if (scope.model.id && scope.initialEmail && view === scope.initialEmail) {
        defer.resolve();
      } else {
        scope.Staff.query({by_email: view}).$promise.then(handleRequest);
      }

      return defer.promise;

      function handleRequest(res) {
        return res.length > 0 ? defer.reject() : defer.resolve();
      }
    }

    function onKeyDown(value, options) {
      options.validation.show = false;
    }

    function onBlur(value, options) {
      options.validation.show = null;
    }

    function samePassword(view, model, scope) {
      return view === scope.model.password;
    }
  }
})();
