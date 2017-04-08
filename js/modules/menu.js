/**
 * Menu module
 */

/**
 * 
 */
define(
        [   'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojcore', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel) {
            /**
             * The view model for the menu
             */

            function MenuViewModel() {
                var self = this;
                
                self.menuItems = [
                    {
                        id: "pide",
                        label: "PIDE"
                    },
                    {
                        id: "mecasut",
                        label: "MECASUT"
                    },
                    {
                        id: "pe",
                        label: "PE"
                    },
                    {
                        id: "poa",
                        label: "POA"
                    },
                    {
                        id: "performance",
                        label: "DESEMPEÑO"
                    },
                    {
                        id: "admin",
                        label: "ADMINISTRADOR"
                    }
                ];
                
//                self.clickHandler = function(item) {
//                    self.checked([item.id]);
//                };
            }
            
            return MenuViewModel;
        }
);


