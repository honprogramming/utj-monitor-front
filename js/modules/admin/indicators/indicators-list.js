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
            'modules/admin/indicators/model/SummaryIndicator',
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
        ],
        function ($, ko, DataProvider, RESTConfig, AjaxUtils, GeneralViewModel,
                StrategicDataParser, StrategicTypes, StrategicModel,
                IndicatorDataParser, IndicatorModel, SummaryIndicator,
                EditableTable, FormActions, AdminItems) {

            function IndicatorsListViewModel(params) {
                const self = this;
                const filters = {};
                
                // Section title text
                self.title = AdminItems["indicators"]["label"];

                // General filter text
                self.generalFilter = GeneralViewModel.nls("admin.indicators.main.filters.general.title");
                self.periodicityLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.periodicity");
                self.periodicityValue = ko.observable();
                self.periodicities = ko.observableArray([]);
                self.status = ko.observableArray([]);
                self.statusLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.status");
                self.statusValue = ko.observable();
                self.typeLabel = GeneralViewModel.nls("admin.indicators.main.filters.general.type");
                self.typeValue = ko.observable();
                self.types = ko.observableArray([]);

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

                let sortByName = (a, b) => a.name.localeCompare(b.name);

                //General Filter select controls population
                let periodicitiesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.periodicities.path, 'GET');

                periodicitiesPromise.then(
                        periodicities => {
                            self.periodicities([{name: "TODOS", id: 0}, ...periodicities]);
                            $("#periodicity").ojSelect("refresh");
                        }
                );

                let typesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.types.path, 'GET');

                typesPromise.then(
                        types => {
                            self.types([{name: "TODOS", id: 0}, ...types]);
                            $("#type").ojSelect("refresh");
                        }
                );

                let statusPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.status.path, 'GET');

                statusPromise.then(
                        status => {
                            self.status([{name: "TODOS", id: 0}, ...status]);
                            $("#status").ojSelect("refresh");
                        }
                );

                //PIDE Filter select controls population
                let strategicDataProvider =
                        new DataProvider(
                                RESTConfig.admin.strategic.path,
                                StrategicDataParser);

                let strategicPromise = strategicDataProvider.fetchData();

                strategicPromise.then(
                    () => {
                        let strategicModel = new StrategicModel(strategicDataProvider.getDataArray());
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

                // Indicators data provider
                let indicatorsDataProvider = new DataProvider(
                        RESTConfig.admin.indicators.path,
                        IndicatorDataParser
                );

                let indicatorsPromise = indicatorsDataProvider.fetchData();
                let deletedIds = [];
                let cloneItems = [];
                let indicatorsModel;
                let indicatorsTable;
                // Tables observable
                self.observableIndicatorsTable = ko.observable();

                indicatorsPromise.then(
                    () => {
                        indicatorsModel = new IndicatorModel(indicatorsDataProvider);
                        
                        function removeItem(itemId) {
                            let item = indicatorsModel.getItemById(itemId);
                            indicatorsModel.removeItem(item);
                            deletedIds.push(item.id);
                        }

                        function updateEditedItem(currentRow) {
                            indicatorsModel.updateItemName(currentRow.data.id, currentRow.data.name);
                        }
                        
                        function cloneItem(itemId, newId) {
                            let item = indicatorsModel.getItemById(itemId);
                            let indicator = new SummaryIndicator(newId, item.type, "clone_" + item.name);
                            
                            indicator.setCloneOf(item.getCloneOf() ? item.getCloneOf() : itemId);
                            indicatorsModel.addItem(indicator);
                            cloneItems.push(indicator);
                            
                            return indicator;
                        }

                        indicatorsTable = new EditableTable(indicatorsModel, 
                            {
                                id: "indicators-table",
                                title: GeneralViewModel.nls("admin.indicators.main.table.pide.title"),
                                tableSummary: GeneralViewModel.nls("admin.indicators.main.table.pide.tableSummary"),
                                tableAria: GeneralViewModel.nls("admin.indicators.main.table.pide.tableAria"),
                                columns: self.columns,
//                                newErrorText: GeneralViewModel.nls("admin.indicators.main.table.pide.newErrorText"),
//                                deleteErrorText: GeneralViewModel.nls("admin.indicators.main.table.pide.deleteErrorText"),
                                deleteValidator: () => true, 
                                actions: ["delete", "clone", "edit"],
                                newValidator: function () {
                                    return true;
                                },
                                itemClonator: (id, newId) => cloneItem(id, newId),
                                itemCreator: () => params.switchFunction(),
                                itemRemover: (id) => removeItem(id),
                                itemEditor: (id) => params.switchFunction(indicatorsModel.getItemById(id))
                            }
                        );

                        indicatorsTable.addEditListener(updateEditedItem);
                        self.observableIndicatorsTable(indicatorsTable);
                        clickOkHandlerObservable(
                            () => {
                                indicatorsModel = new IndicatorModel(indicatorsDataProvider);
                                
                                indicatorsTable.setModel(indicatorsModel);
                                indicatorsTable.resetData();
                                $("#" + self.resetDialogId).ojDialog("close");
                                deletedIds = [];
                                cloneItems = [];
                            }
                        );
                    }
                )
                .catch(e => console.log(e.message));
        
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

                // Form actions
                self.formActions = new FormActions();

                // Reset listener
                self.formActions.addResetListener(
                    () => $("#" + self.resetDialogId).ojDialog("open")
                );
                
                self.typeChangeHandler = function(event, data) {
                    if (data.option === "value") {
                        const newType = parseInt(data.value[0]);

                        if (newType > 0) {
                            filters["type"] = i => i.type.id == newType;
                        } else {
                            delete filters["type"];
                        }
                        
                        self.applyFilters();
                    }
                };
                
                self.statusChangeHandler = function(event, data) {
                    if (data.option === "value") {
                        const newStatus = parseInt(data.value[0]);

                        if (newStatus > 0) {
                            filters["status"] = i => i.status.id == newStatus;
                        } else {
                            delete filters["status"];
                        }
                        
                        self.applyFilters();
                    }
                };
                
                self.periodicityChangeHandler = function(event, data) {
                    if (data.option === "value") {
                        const newPeriodicity = parseInt(data.value[0]);

                        if (newPeriodicity > 0) {
                            filters["periodicity"] = i => i.periodicity.id == newPeriodicity;
                        } else {
                            delete filters["periodicity"];
                        }
                        
                        self.applyFilters();
                    }
                };
                
                self.applyFilters = function() {
                    if (indicatorsModel) {
                        let indicators = indicatorsModel.getData();

                        for (let filter in filters) {
                            indicators = indicators.filter(filters[filter]);
                        }

                        indicatorsTable.filter(indicators);
                    }
                };
                
                //Save Listener
                self.formActions.addSaveListener(
                    () => {
                        let saveDialogClass = "save-dialog-success";
                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success"));
                        
                        for (let i = 0; i < deletedIds.length; i ++) {
                            let id = deletedIds[i];
                            
                            AjaxUtils.ajax(
                                RESTConfig.admin.indicators.path + "/" + id,
                                'DELETE', 
                                {id: id},
                                () => {},
                                (jqXHR, textStatus, errMsg) => {
                                    saveDialogClass = "save-dialog-error";
                                    self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success") + errMsg);
                                }
                            );
                        };
                
                        cloneItems.forEach(
                            (indicator) => {
                                AjaxUtils.ajax(
                                    RESTConfig.admin.indicators.clone.path + "/" + indicator.getCloneOf(),
                                    'POST', 
                                    indicator,
                                    () => {},
                                    (jqXHR, textStatus, errMsg) => {
                                        saveDialogClass = "save-dialog-error";
                                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success") + errMsg);
                                    }
                                );
                            }
                        );
                        
                        deletedIds = [];
                        cloneItems = [];
                        
                        self.showDialog(saveDialogClass);
                    }
                );
                
                // Show dialog
                self.showDialog = function (saveDialogClass) {
                    var saveDialog = $("#" + self.saveDialogId);
                    saveDialog.ojDialog("widget").addClass(saveDialogClass);
                    saveDialog.ojDialog("open");
                };
                
                // Click ok handler
                let clickOkHandlerObservable = ko.observable();
                self.clickOkHandler = function () {
                    var handler = clickOkHandlerObservable();
                    handler();
                };

                // Click cancer handler
                self.clickCancelHandler = () => $("#" + self.resetDialogId).ojDialog("close");
            }

            return IndicatorsListViewModel;
        }
);