/**
 * Header module
 */

/**
 * 
 * @param {type} ko
 * @param {type} oj
 * @returns {header_L9.HeaderViewModel}
 */
define(['view-models/GeneralViewModel',
    'view-models/header/MobileMenuViewModel',
    'view-models/header/MenuViewModel',
    'view-models/header/ToolBarViewModel'],
        function (GeneralViewModel, MobileMenuViewModel, MenuViewModel, ToolBarViewModel) {
            /**
             * The view model for the header module
             */

            function HeaderViewModel() {
                var self = this;
                self.homeMenu = new MenuViewModel();
                self.mobileMenu = new MobileMenuViewModel();
                self.toolBar = new ToolBarViewModel();

                self.appTitle = GeneralViewModel.nls("appTitle");
            }
            return HeaderViewModel;
        });
