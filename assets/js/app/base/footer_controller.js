'use strict';

/**@ngInject*/
var FooterController = function(footerLinks) {

  this.footerLinks = footerLinks;
  this.copyrightYear = new Date();
  this.jellyfishVersion = window.appVersion.ux;
};

FooterController.resolve = {
  /**@ngInject*/
  footerLinks: function(currentUser, SettingsResource) {
    return SettingsResource.get({hid: 'footer'}).$promise;
  }
};

FooterController.prototype = {

};

module.exports = FooterController;



