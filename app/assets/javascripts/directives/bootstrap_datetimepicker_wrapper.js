/**@ngInject*/
function DateTimePickerDirective($timeout) {
  var defaults = {
    showClear: true,
    showTodayButton: false,
    sideBySide: true,
    format: 'dddd, MMMM Do YYYY, h:mma'
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


      el.on('blur', function() {
        ngModel.$setViewValue(el.data('DateTimePicker').date());
      });
    }
  };
}

window.DateTimePickerDirective = DateTimePickerDirective;
