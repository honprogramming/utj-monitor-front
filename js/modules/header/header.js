/**
 * 
 * @param {type} ko
 * @param {type} oj
 * @returns {header_L9.HeaderViewModel}
 */
define(
  [
    'knockout',
    'view-models/GeneralViewModel',
    'modules/header/view-model/MobileMenuViewModel',
    'modules/header/view-model/MenuViewModel',
    'modules/header/view-model/ToolBarViewModel',
    'modules/admin/security/authentication'
  ],
  function (ko, GeneralViewModel, MobileMenuViewModel, MenuViewModel,
      ToolBarViewModel, Authentication) {
    /**
     * The view model for the header module
     */

    function HeaderViewModel() {
      const self = this;

      self.homeMenu = new MenuViewModel();
      self.mobileMenu = new MobileMenuViewModel();
      self.toolBar = new ToolBarViewModel();

      self.appTitle = GeneralViewModel.nls("appTitle");
      self.altText = ko.observable();
      self.userImage = ko.observable();
      self.userNickname = ko.observable();
      self.signIcon = ko.observable();
      self.isAuthenticated = ko.observable(Authentication.isAuthenticated());

      const getSessionLabel = (isAuthenticated) => {
        const nlsKey = `header.${isAuthenticated ? "logout" : "login"}`;
        return GeneralViewModel.nls(nlsKey);
      };

      const getUserImage = (isAuthenticated) => {
        if (isAuthenticated) {
          return Authentication.getProfile()
              .then(profile => profile.picture)
              .catch(e => console.log(e));
        } else {
          return Promise.resolve('css/images/avatar_24px.png');
        }
      };

      const getUserNickname = (isAuthenticated) => {
        if (isAuthenticated) {
          return Authentication.getProfile()
              .then(profile => profile.nickname)
              .catch(e => console.log(e));
        } else {
          return Promise.resolve('');
        }
      };

      const getSignIcon = (isAuthenticated) => `pointer fa fa-2x ${isAuthenticated ? "fa-sign-out" : "fa-sign-in"}`;

      ko.computed(
        () => {
          self.altText(getSessionLabel(self.isAuthenticated()));
          getUserImage(self.isAuthenticated()).then(picture => self.userImage(picture));
          getUserNickname(self.isAuthenticated()).then(nickname => self.userNickname(nickname));
          self.signIcon(getSignIcon(self.isAuthenticated()));
        }
      );

      self.sessionHandler = () => {
        if (Authentication.isAuthenticated()) {
          Authentication.logout();
          self.isAuthenticated(false);
        } 
        else {
          Authentication.getProfile();
        }
      };
    }

    return new HeaderViewModel();
  }
);
