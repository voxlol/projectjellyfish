(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagShowModal', TagShowModalDirective);

  /** @ngInject */
  function TagShowModalDirective() {
    var directive = {
      restrict: 'AE',
      require: '^tagField',
      scope: {},
      link: link,
      transclude: true,
      templateUrl: 'app/components/tags/tag-show-modal.html',
      controller: TagShowModalController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, tagField, transclude) {
      var vm = scope.vm;

      vm.activate(tagField);
    }

    /** @ngInject */
    function TagShowModalController($modal) {
      var vm = this;

      var modalOptions = {};

      vm.activate = activate;
      vm.showModal = showModal;

      function activate(tagField) {
        vm.mode = tagField.mode;
        vm.tagField = tagField;
        modalOptions = {
          templateUrl: 'app/components/tags/tag-modal.html',
          controller: TagModalController,
          controllerAs: 'vm',
          resolve: {
            tagList: resolveTagList,
            tagCommands: resolveTagCommands,
            mode: resolveMode
          },
          windowTemplateUrl: 'app/components/tags/tag-modal-window.html'
        };
      }

      function showModal() {
        var modal = $modal.open(modalOptions);

        modal.result.then();
      }

      // Private

      function resolveTagList() {
        return vm.tagField.tagList;
      }

      function resolveTagCommands() {
        return {
          add: vm.tagField.addTag,
          remove: vm.tagField.removeTag,
          clear: vm.tagField.clearTags
        };
      }

      function resolveMode() {
        return vm.mode;
      }
    }

    /** @ngInject */
    function TagModalController(tagList, tagCommands, GroupedTags, mode) {
      var vm = this;
      vm.tags = [];
      vm.tagList = tagList;
      vm.addTag = tagCommands.add;
      vm.removeTag = tagCommands.remove;
      vm.clearTags = tagCommands.clear;

      activate();

      function activate(){
        return GroupedTags.getGroupedTags().then(function(data) {
          vm.tags = data;
          return vm.tags;
        });
      }

      vm.shortcuts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

      vm.tagsExistForLetter = tagsExistForLetter;
      vm.tagInUse = tagInUse;
      vm.tagUnavailable = tagUnavailable;

      function tagsExistForLetter(letter) {
        return !angular.isUndefined(vm.tags[letter]);
      }

      function tagInUse(tag) {
        return vm.tagList.tagInList(tag);
      }

      function tagUnavailable(tag) {
        if ('search' === mode) {
          return tagInUse(tag.name) || 0 === tag.results;
        } else {
          return tagInUse(tag.name);
        }
      }
    }
  }
})();
