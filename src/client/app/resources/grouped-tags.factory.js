(function() {
  'use strict';

  angular.module('app.resources')
    .factory('GroupedTags', GroupedTagsFactory);


  /* @ngInject */
  function GroupedTagsFactory($q, Tag) {

    return {
      getGroupedTags: getGroupedTags
    };

    function getGroupedTags() {
      var deferred = $q.defer();

      $q.all([
        Tag.query().$promise
      ]).then(getGroupedTags);

      return deferred.promise;

      function getGroupedTags(results){
        var taglist = results[0];
        var list = {};
        var re = /[A-Z]/;
        taglist.forEach(groupTag);

        return list;

        function groupTag(tag) {
          var firstChar = tag.name.substring(0, 1).toUpperCase();

          if (!re.test(firstChar)) {
            firstChar = '#';
          }

          if (angular.isUndefined(list[firstChar])) {
            list[firstChar] = [];
          }

          list[firstChar].push(tag);
        }
      }
    }
  }
})();
