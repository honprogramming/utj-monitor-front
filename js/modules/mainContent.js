define(
    [
        'knockout',
        'modules/header/menu/menu',
        'view-models/GeneralViewModel',
        'modules/header/menu/view-model/MenuItems',
        'modules/header/header'
    ],
    function (ko, menu, GeneralViewModel, MenuItems, Header) {
        var firstMenuId = menu.menuItems[0]["id"];

        const mainContentViewModel = {
            selectedModule: ko.observable(MenuItems[firstMenuId]["module"]),
            listeners: []
        };

        const selectModule = value => mainContentViewModel.selectedModule(MenuItems[value]["module"]);

        menu.checked(firstMenuId);
        menu.addClickListener(selectModule);

        mainContentViewModel.prototype = Object.create(GeneralViewModel);
        Header.setLogoutHook(
            () => {
                if (mainContentViewModel.selectedModule().name === MenuItems['admin']['module'].name) {
                    mainContentViewModel.selectedModule(MenuItems[firstMenuId]['module']);
                }
            }
        );

        const prototype = mainContentViewModel.prototype;

        return mainContentViewModel;
    }
);
