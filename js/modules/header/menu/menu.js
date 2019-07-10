/**
 * Menu module
 */

/**
 * 
 */
define(
  [
    'knockout',
    'utils/RoutesWrapper',
    'view-models/GeneralViewModel',
    'events/EventTypes',
    'modules/header/header',
    'modules/header/menu/view-model/MenuItems',
    'modules/admin/security/authorization',
    'modules/admin/security/roles',
    'ojs/ojcore', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'
  ],
  function (ko, RoutesWrapper, GeneralViewModel, EventTypes, header, MenuItems, Authorization, Roles) {
      /**
       * The view model for the menu
       */

      function MenuViewModel() {
        const self = this;
        self.id = 'main-menu-button-set';
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
        
        self.shouldDisplay = ko.observable('*');
        
        ko.computed(
          () => {
            const isAuthenticated = header.isAuthenticated();
            const version = RoutesWrapper.getParameter("version");
            
            if (version) {
              return;
            }
            
            if (isAuthenticated) {
              Authorization.hasRole(Roles.writer)
                  .then(
                    data => {
                      if (data) {
                        self.shouldDisplay('*,admin');
                      }
                    }
                  );
            } 
          }
        );
      }

      MenuViewModel.prototype = Object.create(GeneralViewModel);

      return new MenuViewModel();
    }
);