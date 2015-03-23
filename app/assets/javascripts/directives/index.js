//= require_tree .
'use strict';

var DirectivesModule = angular.module('broker.directives', [])
  .directive('dropDown', DropDown)
  .directive('expandArrow', ExpandArrow)
  .directive('setWidth', SetWidth)
  .directive('toggleSidebar', ToggleSidebar)
  .directive('formInput', FormInput)
  .directive('switchViewButtons', SwitchViewButtons)
  .directive('fallbackImage', FallbackImage)
  .directive('initiallyNullAlwaysNull', InitiallyNullAlwaysNull)

window.DirectivesModule = DirectivesModule;
