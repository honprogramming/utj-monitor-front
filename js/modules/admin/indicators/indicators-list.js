define(
    [
        'jquery',
        'knockout',
        'data/DataProvider',
        'data/RESTConfig',
        'data/AjaxUtils',
        'view-models/GeneralViewModel',
        'modules/admin/strategic/model/StrategicDataParser',
        'modules/admin/strategic/model/StrategicTypes',
        'modules/admin/strategic/model/StrategicModel',
        'modules/admin/indicators/model/IndicatorDataParser',
        'modules/admin/indicators/model/IndicatorModel',
        'modules/admin/indicators/model/IndicatorItem',
        'templates/EditableTable',
        'templates/FormActions',
        'modules/admin/view-model/AdminItems',
        'events/ActionTypes',
        'ojs/ojcore',
        'ojs/ojknockout',
        'ojs/ojcollapsible',
        'ojs/ojinputtext',
        'ojs/ojdialog',
        'ojs/ojbutton',
        'ojs/ojarraytabledatasource',
        'ojs/ojselectcombobox',
        'promise',
        'ojs/ojtable'
    ], function ($, ko, DataProvider, RESTConfig, AjaxUtils, GeneralViewModel, 
            StrategicDataParser, StrategicTypes, StrategicModel,
            IndicatorDataParser, IndicatorModel, IndicatorItem,
            EditableTable, FormActions, AdminItems) {

        function IndicatorsListViewModel(params) {
            var self = this;

            // Vision data
            self.vision = ko.observable();

            // Section title text
            self.title = AdminItems["indicators"]["label"];

            // General filter text
            self.generalFilter = GeneralViewModel.nls("admin.indicators.main.filters.general.title");
            self.typeLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.type");
            self.statusLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.status");
            self.periodicityLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.periodicity");
            self.periodicities = ko.observableArray([]);
            self.types = ko.observableArray([]);
            self.status = ko.observableArray([]);

            // PIDE filter text
            self.pideFilter = GeneralViewModel.nls("admin.indicators.main.filters.pide.title");
            self.axisLabel = GeneralViewModel.nls("admin.indicators.main.filters.pide.axis");
            self.topicLabel = GeneralViewModel.nls("admin.indicators.main.filters.pide.topic");
            self.objectiveLabel = GeneralViewModel.nls("admin.indicators.main.filters.pide.objective");
            self.axes = ko.observableArray([]);
            self.topics = ko.observableArray([]);
            self.objectives = ko.observableArray([]);

            // Responsible filter text
            self.responsibleFilterTitle = GeneralViewModel.nls("admin.indicators.main.filters.responsible.title");
            self.secretaryLabel = GeneralViewModel.nls("admin.indicators.main.filters.responsible.secretary");
            self.areaLabel = GeneralViewModel.nls("admin.indicators.main.filters.responsible.area");
            self.nameLabel = GeneralViewModel.nls("admin.indicators.main.filters.responsible.name");
            
            //Indicators table section
            self.indicatorsCollapsibleTitle = GeneralViewModel.nls("admin.indicators.main.table.collapsible.title");
            
            // Table columns
            self.columns = [
                {
                    headerText: GeneralViewModel.nls("admin.indicators.main.table.headers.name"),
                    headerStyle: 'min-width: 50%; max-width: 50em; width: 85%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 50%; max-width: 50em; width: 85%;',
                    className: 'oj-helper-text-align-start',
                    sortProperty: 'name'
                },
                {
                    headerText: GeneralViewModel.nls("admin.indicators.main.table.headers.actions"),
                    headerStyle: 'min-width: 2em; max-width: 5em; width: 15%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 2em; max-width: 5em; width: 15%; text-align:center;',
                    sortable: 'disabled'
                }
            ];

            // Reset dialog text
            self.resetDialogId = "indicators-reset-dialog";
            self.resetDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.title");
            self.resetWarningText = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.warningText");
            self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.okButton");
            self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.cancelButton");

            // Save dialog text
            self.saveDialogId = "indicators-save-dialog";
            self.saveMessage = ko.observable();
            self.saveDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.save.title");
            var saveDialogClass = "";

            // Form actions
            self.formActions = new FormActions();

            // Reset listener
            self.formActions.addResetListener(
                    () =>  $("#" + self.resetDialogId).ojDialog("open")
            );

            // Click ok handler
            var clickOkHandlerObservable = ko.observable();
            self.clickOkHandler = function () {
                var handler = clickOkHandlerObservable();
                handler();
            };

            // Click cancer handler
            self.clickCancelHandler = () => $("#" + self.resetDialogId).ojDialog("close");            
            
            let sortByName = (a, b) => a.name.localeCompare(b.name);
            
            //General Filter select controls population
            var periodicitiesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.periodicities.path, 'GET');

            periodicitiesPromise.then(
                periodicities => {
                    self.periodicities(periodicities);
                    $("#periodicity").ojSelect("refresh");
                } 
            );

            var typesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.types.path, 'GET');

            typesPromise.then(
                types => {
                    self.types(types);
                    $("#type").ojSelect("refresh");
                } 
            );

            var statusPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.status.path, 'GET');

            statusPromise.then(
                status => {
                    self.status(status);
                    $("#status").ojSelect("refresh");
                } 
            );
            
            //PIDE Filter select controls population
            var strategicDataProvider =
                            new DataProvider(
                                    RESTConfig.admin.strategic.items.path,
                                    StrategicDataParser);

            var strategicPromise = strategicDataProvider.fetchData();

            strategicPromise.then(
                () =>  {
                    let strategicModel = new StrategicModel(strategicDataProvider);
                    let axes = strategicModel.getItemsByType(StrategicTypes.AXE);
            
                    self.axes(axes.sort(sortByName));
                    $("#axes").ojSelect("refresh");
                    
                    let topics = strategicModel.getItemsByType(StrategicTypes.TOPIC);
                    self.topics(topics.sort(sortByName));
                    $("#topics").ojSelect("refresh");
                    
                    let objectives = strategicModel.getItemsByType(StrategicTypes.OBJECTIVE);
                    self.objectives(objectives.sort(sortByName));
                    $("#objectives").ojSelect("refresh");
                }
            );

            // Indicator data provider
            var indicatorDataProvider = new DataProvider(
                "data/pide-items-full.json",
                // RESTConfig.admin.strategic.items.path,
                IndicatorDataParser
            );

            var dataPromise = indicatorDataProvider.fetchData();

            // Tables observable
            self.observableIndicatorsTable = ko.observable();
            
            dataPromise.then(
                () => {
                var indicatorsModel = new IndicatorModel(indicatorDataProvider);
                var visionItem = indicatorsModel.getItemsByType(StrategicTypes.VISION)[0];
                var indicatorsArray = indicatorsModel.getItemsByType(StrategicTypes.INDICATOR);
                var deletedIds = [];

                if (!visionItem) {
                    visionItem = new IndicatorItem(1, "", StrategicTypes.VISION);
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
//                    var newItem = new IndicatorItem(id, "", indicatorType);
//                    //var parentRow = table.getCurrentRow();
//
//                    var parentRow = table.observableDataSource().data.length - 1;
//
//                    indicatorsModel.addItem(parentRow.rowKey, newItem);
//                    removeDeletedIds(id);
//
//                    return newItem;
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
                    title: GeneralViewModel.nls("admin.indicators.main.table.pide.title"),
                    tableSummary: GeneralViewModel.nls("admin.indicators.main.table.pide.tableSummary"),
                    tableAria: GeneralViewModel.nls("admin.indicators.main.table.pide.tableAria"),
                    columns: self.columns,
                    newErrorText: GeneralViewModel.nls("admin.indicators.main.table.pide.newErrorText"),
                    deleteErrorText: GeneralViewModel.nls("admin.indicators.main.table.pide.deleteErrorText"),
                    deleteValidator: hasNoChildren,
                    actions: ["delete", "clone", "edit"],
                    newValidator: function () {
                        return true;//self.vision().length > 0;
                    },
                    itemCreator: function (id) {
                        params.switchFunction();
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
            }
        );

        }

        return IndicatorsListViewModel;
    }
);