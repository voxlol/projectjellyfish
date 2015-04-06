'use strict';

/**@ngInject*/
function DateTimePickerDirective($timeout) {
  var defaults = {
  };

  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      datetimeOptions: '=',
      useUtc: '='
    },
    link: function (scope, el, attrs, ngModel) {
      var useUtc = angular.isUndefined(scope.useUtc) ? false : scope.useUtc,
        options;

      ngModel.$formatters.push(function fromModel(input) {
        if ('undefined' === typeof el.data('DateTimePicker')) {
          options = angular.extend({defaultDate: input}, defaults, scope.datetimeOptions || {});
          el.datetimepicker(options);
        }
        return input ? moment(input).format(options.format) : '';
      });

      ngModel.$parsers.push(function toModel(input) {
        if (null === input) {
          return null;
        }
        if ('string' === typeof input) {
          return null;
        }
        return (useUtc ? input.utc() : input.local()).seconds(0).format();
      });


      el.on('focusout', function() {
        console.log("FOCUSOUT!");
        ngModel.$setViewValue(el.data('DateTimePicker').date());
      });

      el.on('focusin', function() {
        console.log("FOCUSIN!");
        el.data('DateTimePicker').show();
      });
    }
  };
}

window.DateTimePickerDirective = DateTimePickerDirective;
