'use strict';

/**@ngInject*/
var FooterController = function(footerLinks, APP_VERSION) {

  this.footerLinks = footerLinks;
  this.copyrightYear = new Date();
  this.jellyfishVersion = APP_VERSION.ux;
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



