'use strict';

function FallbackImage() {
  return {
    restrict: 'A',
    scope: {
      fallbackImage: '@'
    },
    link: function(scope, element, attrs) {
      if (_.isEmpty(attrs.ngSrc)) {
        element.attr('src', scope.fallbackImage);
      }
      element.bind('error', function() {
        element.attr('src', scope.fallbackImage);
      });
    }
  };
}

window.FallbackImage = FallbackImage;
