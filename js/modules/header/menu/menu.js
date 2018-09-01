/**
 * Menu module
 */

/**
 * 
 */
define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'events/EventTypes',
            'modules/header/header',
            'modules/header/menu/view-model/MenuItems',
            'modules/admin/security/authentication',
            'ojs/ojcore', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel, EventTypes, header, MenuItems) {
            /**
             * The view model for the menu
             */

            function MenuViewModel() {
                var self = this;
                self.id = "main-menu-button-set";
                self.listeners = [];
                self.checked = ko.observable();
                self.menuItems = Object.values(MenuItems);
                self.admin = MenuItems['admin'];                

                self.clickHandler = function (event, ui) {
                    if (ui.value) {
                        self.onClick(ui.value);
                    }
                };

                self.addClickListener = function (listener) {
                    self.addListener(listener, EventTypes.CLICK_EVENT);
                };

                self.onClick = function (value) {
                    self.checked(value);

                    self.callListeners(EventTypes.CLICK_EVENT, value);
                };
                
                self.shouldDisplay = ko.computed(() => `*,${header.isAuthenticated() ? "admin" : ""}`);
            }
            
            MenuViewModel.prototype = Object.create(GeneralViewModel);

            return new MenuViewModel();
        }
);