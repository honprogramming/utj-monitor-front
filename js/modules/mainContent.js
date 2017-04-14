/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'knockout', 'modules/menu',
            'view-models/GeneralViewModel',
            'view-models/menu/MenuItems'
        ],
        function (ko, menu, GeneralViewModel, MenuItems) {
            var firstMenuId = menu.menuItems[0]["id"];
            
            var mainContentViewModel = {
                selectedModule: ko.observable(MenuItems[firstMenuId]["module"]),
                listeners: []
            };

            menu.checked(firstMenuId);
            menu.addClickListener(
                    function (value) {
                        mainContentViewModel.selectedModule(MenuItems[value]["module"]);
                    }
            );

            mainContentViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = mainContentViewModel.prototype;

            return mainContentViewModel;
        }
);
