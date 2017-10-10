define([
    'jquery',
    'knockout',
    'data/DataProvider',
    'data/RESTConfig',
    'data/AjaxUtils',
    'view-models/GeneralViewModel',
    'modules/admin/indicators/model/IndicatorDataParser',
    'modules/admin/indicators/model/IndicatorModel',
    'modules/admin/indicators/model/IndicatorItem',
    'modules/admin/indicators/model/IndicatorTypes',
    'modules/admin/indicators/model/IndicatorTypesParser',
    'templates/EditableTable',
    'templates/FormActions',
    'modules/admin/view-model/AdminItems',
    'events/ActionTypes',
    'ojs/ojcore',
    'ojs/ojknockout',
    'ojs/ojcollapsible',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource',
    'ojs/ojselectcombobox',
    'promise',
    'ojs/ojtable'
], function ($, ko, DataProvider, RESTConfig, AjaxUtils, GeneralViewModel, IndicatorDataParser, IndicatorModel, IndicatorItem, IndicatorTypes, IndicatorTypesParser, EditableTable, FormActions, AdminItems, ActionTypes) {

    function IndicatorViewModel() {
        var self = this;

        // Vision data
        self.vision = ko.observable();

        // Section title text
        self.title = AdminItems["indicators"]["label"];

        // General filter text
        self.generalFilter = GeneralViewModel.nls("admin.indicators.filters.general.title");
        self.typeLabel = GeneralViewModel.nls("admin.indicators.filters.general.type");
        self.statusLabel = GeneralViewModel.nls("admin.indicators.filters.general.status");
        self.periodicityLabel = GeneralViewModel.nls("admin.indicators.filters.general.periodicity");

        // PIDE filter text
        self.pideFilter = GeneralViewModel.nls("admin.indicators.filters.pide.title");
        self.axisLabel = GeneralViewModel.nls("admin.indicators.filters.pide.axis");
        self.topicLabel = GeneralViewModel.nls("admin.indicators.filters.pide.topic");
        self.objectiveLabel = GeneralViewModel.nls("admin.indicators.filters.pide.objective");

        // Responsible filter text
        self.responsibleFilter = GeneralViewModel.nls("admin.indicators.filters.responsible.title");
        self.secretaryLabel = GeneralViewModel.nls("admin.indicators.filters.responsible.secretary");
        self.areaLabel = GeneralViewModel.nls("admin.indicators.filters.responsible.area");
        self.nameLabel = GeneralViewModel.nls("admin.indicators.filters.responsible.name");

        // Table columns
        self.columns = [
            {
                headerText: GeneralViewModel.nls("admin.indicators.table.headers.name"),
                headerStyle: 'min-width: 50%; max-width: 43em; width: 85%',
                headerClassName: 'oj-helper-text-align-start',
                style: 'min-width: 50%; max-width: 43em; width: 85%;',
                className: 'oj-helper-text-align-start',
                sortProperty: 'name'
            },
            {
                headerText: GeneralViewModel.nls("admin.indicators.table.headers.actions"),
                headerStyle: 'min-width: 2em; max-width: 7em; width: 15%',
                headerClassName: 'oj-helper-text-align-start',
                style: 'min-width: 2em; max-width: 7em; width: 15%; text-align:center;',
                sortable: 'disabled'
            }
        ];

        // Reset dialog text
        self.resetDialogId = "indicators-reset-dialog";
        self.resetDialogTitle = GeneralViewModel.nls("admin.indicators.dialogs.reset.title");
        self.resetWarningText = GeneralViewModel.nls("admin.indicators.dialogs.reset.warningText");
        self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.indicators.dialogs.reset.okButton");
        self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.indicators.dialogs.reset.cancelButton");

        // Save dialog text
        self.saveDialogId = "indicators-save-dialog";
        self.saveMessage = ko.observable();
        self.saveDialogTitle = GeneralViewModel.nls("admin.indicators.dialogs.save.title");
        var saveDialogClass = "";

        // Form actions
        self.formActions = new FormActions();

        // Reset listener
        self.formActions.addResetListener(function () {
            $("#" + self.resetDialogId).ojDialog("open");
        });

        // Click ok handler
        var clickOkHandlerObservable = ko.observable();
        self.clickOkHandler = function () {
            var handler = clickOkHandlerObservable();
            handler();
        };

        // Click cancer handler
        self.clickCancelHandler = function () {
            $("#" + self.resetDialogId).ojDialog("close");
        };

        // Indicator Types Provider
        var indicatorsTypesDataProvider = new DataProvider(
            "data/strategic-types.json",
            // RESTConfig.admin.strategic.types.path,
            IndicatorTypesParser
        );

        // Indicator Types Promise
        var typesPromise = indicatorsTypesDataProvider.fetchData();

        // Indicator Types Promise resolve
        var typesSetPromise = typesPromise.then(function () {
            // Get Indicator Types Array
            var types = indicatorsTypesDataProvider.getDataArray();

            // Get Indicator Types Map
            var indicatorTypesMap = IndicatorTypes.getTypesMap();

            types.forEach(function (type) {
                var indicatorType = indicatorTypesMap[type.name];

                if (indicatorType) {
                    indicatorType.id = type.id;
                }
            });
        });

        // Indicator data provider
        var indicatorDataProvider = new DataProvider(
            "data/pide-items-full.json",
            // RESTConfig.admin.strategic.items.path,
            IndicatorDataParser
        );

        var dataPromise = indicatorDataProvider.fetchData();

        // Tables observable
        self.observableIndicatorsTable = ko.observable();

        // Obtain data from promises
        Promise.all([typesSetPromise, dataPromise]).then(function () {
            var indicatorsModel = new IndicatorModel(indicatorDataProvider);
            var visionItem = indicatorsModel.getItemsByType(IndicatorTypes.VISION)[0];
            var indicatorsArray = indicatorsModel.getItemsByType(IndicatorTypes.INDICATOR);
            var deletedIds = [];

            if (!visionItem) {
                visionItem = new IndicatorItem(1, "", IndicatorTypes.VISION);
                indicatorsModel.addItem(null, visionItem);
            }

            function hasNoChildren(itemId) {
                var item = indicatorsModel.getItemById(itemId);

                if (item) {
                    return item.children.length === 0;
                }

                return true;
            }

            function createItem(id, table, indicatorType) {
                var newItem = new IndicatorItem(id, "", indicatorType);
                //var parentRow = table.getCurrentRow();

                var parentRow = table.observableDataSource().data.length - 1;

                indicatorsModel.addItem(parentRow.rowKey, newItem);
                removeDeletedIds(id);

                return newItem;
            }

            function removeItem(itemId) {
                var item = indicatorsModel.getItemById(itemId);
                indicatorsModel.removeItem(item);
                deletedIds.push(item.id);
            };

            function getChildrenItems(ids) {
                var items = indicatorsModel.getItemsById(ids);
                var children = [];

                if (Array.isArray(items)) {
                    items.forEach(function (item) {
                        children = children.concat(item.children);
                    });
                }

                return children;
            }

            function updateEditedItem(currentRow) {
                indicatorsModel.updateItemName(currentRow.data.id, currentRow.data.name);
            }

            function removeDeletedIds(id) {
                if (deletedIds.length > 0) {
                    var index = deletedIds.indexOf(id);

                    if (index >= 0) {
                        deletedIds.splice(index, 1);
                    }
                }
            }

            function getAvailableParentItems(table) {
                var tableFilterKey = table.getCurrentFilterKey();
                var promise = new Promise(function (resolve) {
                    if (tableFilterKey) {
                        resolve(tableFilterKey);
                    }

                    var visibleItemsPromise = table.getVisibleItemsPromise();
                    visibleItemsPromise.then(function (data) {
                        resolve(data.keys);
                    });
                });

                return promise;
            }

            function useChildrenItemsToFilterTable(ids, table) {
                var itemsToKeep = getChildrenItems(ids);
                table.filter(itemsToKeep);
            }

            self.vision(visionItem ? visionItem.name : "");

            self.indicatorsTable = new EditableTable(indicatorsArray, indicatorsModel, {
                id: "indicators-table",
                title: GeneralViewModel.nls("admin.indicators.table.pide.title"),
                tableSummary: GeneralViewModel.nls("admin.indicators.table.pide.tableSummary"),
                tableAria: GeneralViewModel.nls("admin.indicators.table.pide.tableAria"),
                columns: self.columns,
                newErrorText: GeneralViewModel.nls("admin.indicators.table.pide.newErrorText"),
                deleteErrorText: GeneralViewModel.nls("admin.indicators.table.pide.deleteErrorText"),
                deleteValidator: hasNoChildren,
                actions: ['redo', 'read', 'edit', 'drop'],
                newValidator: function () {
                    return true;//self.vision().length > 0;
                },
                itemCreator: function (id) {
                    return createItem(id, self.indicatorsTable, IndicatorTypes.INDICATOR);
                },
                itemRemover: removeItem
            });

            self.enableIndicatorsNew = ko.computed(function () {
                self.indicatorsTable.setNewEnabled(true);
            });

            self.indicatorsTable.addEditListener(updateEditedItem);

            self.observableIndicatorsTable(self.indicatorsTable);

            clickOkHandlerObservable(function () {
                $("#" + self.resetDialogId).ojDialog("close");

                self.vision(visionItem.name);
                self.indicatorsTable.resetData();
            });

            // Add save listener
            self.formActions.addSaveListener(function () {
                visionItem.name = self.vision();

                var method = 'PUT';
                var visionPromise = $.getJSON(RESTConfig.admin.strategic.items.path + "/" + visionItem.id);

                visionPromise.then(function (data) {
                    var path = RESTConfig.admin.strategic.items.path;

                    if (!data) {
                        method = 'POST';
                    } else {
                        path += "/" + visionItem.id;
                    }

                    function successFunction() {
                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success"));
                        saveDialogClass = "save-dialog-success";
                    }

                    function errorFunction(jqXHR, textStatus, errMsg) {
                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success") + errMsg);
                        saveDialogClass = "save-dialog-error";
                    }

                    if (deletedIds.length > 0) {
                        deletedIds.forEach(function (id) {
                            AjaxUtils.ajax(RESTConfig.admin.strategic.items.path + "/" + id, 'DELETE', null, null, errorFunction);
                        });
                    }

                    var savePromise = AjaxUtils.ajax(path, method, visionItem, successFunction, errorFunction);

                    savePromise.then(function () {
                        self.showDialog();
                    });
                });
            });

            // Show dialog
            self.showDialog = function () {
                var saveDialog = $("#" + self.saveDialogId);
                saveDialog.ojDialog("widget").addClass(saveDialogClass);
                saveDialog.ojDialog("open");
            };
        });
    }

    return new IndicatorViewModel();
});