define(
  [
    'knockout',
    'modules/header/menu/menu',
    'view-models/GeneralViewModel',
    'modules/header/menu/view-model/MenuItems'
  ],
  function (ko, menu, GeneralViewModel, MenuItems) {
    const firstMenuId = menu.menuItems[0]["id"];

    const mainContentViewModel = {
      selectedModule: ko.observable(MenuItems[firstMenuId]['module']),
      listeners: []
    };

    const selectModule = value => mainContentViewModel.selectedModule(MenuItems[value]['module']);

    menu.checked(firstMenuId);
    menu.addClickListener(selectModule);

    mainContentViewModel.prototype = Object.create(GeneralViewModel);

    const prototype = mainContentViewModel.prototype;

    return mainContentViewModel;
  }
);
