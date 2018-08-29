/**
 * Header module
 */

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
            'modules/admin/security/authentication',
        ],
        function (ko, GeneralViewModel, MobileMenuViewModel, MenuViewModel, 
            ToolBarViewModel, Authentication) {
            /**
             * The view model for the header module
             */

            function HeaderViewModel() {
                var self = this;
                self.listeners = [];
                self.homeMenu = new MenuViewModel();
                self.mobileMenu = new MobileMenuViewModel();
                self.toolBar = new ToolBarViewModel();

                self.appTitle = GeneralViewModel.nls("appTitle");
                self.altText = ko.observable();
                self.userImage = ko.observable();
                self.userNickname = ko.observable();
                self.signIcon = ko.observable();
                self.hideMenu = ko.observable();
                        
                const getSessionLabel = () => {
                    const nlsKey = `header.${Authentication.isAuthenticated() ? "logout" : "login"}`;
                    return GeneralViewModel.nls(nlsKey);
                };
                
                const getUserImage = () => {
                    if (Authentication.isAuthenticated()) {
                      return Authentication.getProfile()
                        .then(profile => profile.picture)
                        .catch(e => console.log(e));
                    } else {
                        return Promise.resolve('/utj-monitor/css/images/avatar_24px.png');
                    }
                };
                
                const getUserNickname = () => {
                    if (Authentication.isAuthenticated()) {
                        return Authentication.getProfile()
                            .then(profile => profile.nickname)
                            .catch(e => console.log(e));
                    } else {
                        return Promise.resolve('');
                    }
                };
                
                const getSignIcon = () => `fa fa-2x ${Authentication.isAuthenticated() ? "fa-sign-out" : "fa-sign-in"}`;
                
                const updateUserInfo = () => {
                    self.altText(getSessionLabel());
                    getUserImage().then(picture => self.userImage(picture));
                    getUserNickname().then(nickname => self.userNickname(nickname));
                    self.signIcon(getSignIcon());
                    self.hideMenu(!Authentication.isAuthenticated());
                };
                
                Authentication.addObserver(() => updateUserInfo());
                
                self.sessionHandler = () => {
                    if (Authentication.isAuthenticated()) {
                        Authentication.logout();
                    } else {
                        Authentication.authorize();
                    }
                };
                
                self.addUserClickListener = listener => self.listeners.push(listener);
                
                self.userClickHandler = (event, data) => {
                    self.listeners.forEach(listener => listener(data.target.id.replace("option-", "")));
                };
                
                Authentication.handleAuthentication()
                    .then(() => updateUserInfo())
                    .catch(e => console.log(e));
            
                updateUserInfo();
            }
            
            return new HeaderViewModel();
        }
);
