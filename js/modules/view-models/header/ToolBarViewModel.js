/**
 * 
 */
/**
 * 
 * @param {type} $
 * @param {type} ko
 * @returns {ToolBarViewModel_L5.ToolBarViewModel}
 */
define(['jquery', 'knockout', 'ojs/ojdialog'],
        function ($, ko) {
            function ToolBarViewModel() {
                var self = this;
                // 
                // Toolbar buttons
                // 
                var toolbarData = {
                    // user name in toolbar
                    "login": "Iniciar sesón | registrarse",
                    "toolbar_buttons": [
                        {
                            "label": "toolbar_search_button",
                            "iconClass": "oj-fwk-icon-magnifier oj-fwk-icon",
                            "url": "#"
                        }
                    ],
                    // Data for global nav dropdown menu embedded in toolbar.
                    "global_nav_dropdown_items": [
                        {"label": "Iniciar sesión",
                            "url": "login"
                        },
                        {"label": "Registrarse",
                            "url": "register"
                        },
                        {"label": "Recuperar contraseña",
                            "url": "passwordrecover"
                        },
                        {"label": "Salir",
                            "url": "index.html?root=signOut"
                        }
                    ]
                };
                
                // 
                // Dropdown menu states
                // 

                self.menuItemSelect = function (event, ui) {
                    switch (ui.item.attr("id")) {
                        case "About":
                            $("#aboutDialog").ojDialog("open");
                            break;
                        default:
                    }
                };

                self.userName = ko.observable(toolbarData.login);
                self.toolbarButtons = toolbarData.toolbar_buttons;
                self.globalNavItems = toolbarData.global_nav_dropdown_items;
            }

            return ToolBarViewModel;
        }
);