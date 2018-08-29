/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'knockout',
            'modules/header/menu/menu',
            'modules/header/header',
            'view-models/GeneralViewModel',
            'modules/header/menu/view-model/MenuItems'
        ],
        function (ko, menu, header,GeneralViewModel, MenuItems) {
            var firstMenuId = menu.menuItems[0]["id"];
            
            var mainContentViewModel = {
                selectedModule: ko.observable(MenuItems[firstMenuId]["module"]),
                listeners: []
            };
            
            const selectModule = value => mainContentViewModel.selectedModule(MenuItems[value]["module"]);
            
            menu.checked(firstMenuId);
            menu.addClickListener(selectModule);
            header.addUserClickListener(
                value => {
                    selectModule(value);
                    
                    if (value === "admin") {
                        menu.checked(null);
                    }
                }
            );
            
            mainContentViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = mainContentViewModel.prototype;

            return mainContentViewModel;
        }
);
