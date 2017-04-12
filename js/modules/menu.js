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
            'view-models/events/EventTypes',
            'view-models/menu/MenuItems',
            'ojs/ojcore', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel, EventTypes, MenuItems) {
            /**
             * The view model for the menu
             */

            function MenuViewModel() {
                var self = this;
                self.listeners = [];
                self.checked = ko.observable();
                self.menuItems = Object.values(MenuItems);

                self.clickHandler = function (event, ui) {
                    self.onClick(ui.value);
                };

                self.addClickListener = function (listener) {
                    self.addListener(listener, EventTypes.CLICK_EVENT);
                };

                self.onClick = function (value) {
                    self.checked(value);
                    self.callListeners(EventTypes.CLICK_EVENT, value);
                };
            }

            MenuViewModel.prototype = Object.create(GeneralViewModel);

            return new MenuViewModel();
        }
);