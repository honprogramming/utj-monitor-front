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
                var self = this;

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

                let sortByName = (a, b) => a.name.localeCompare(b.name);

                //General Filter select controls population
                let periodicitiesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.periodicities.path, 'GET');

                periodicitiesPromise.then(
                        periodicities => {
                            self.periodicities(periodicities);
                            $("#periodicity").ojSelect("refresh");
                        }
                );

                let typesPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.types.path, 'GET');

                typesPromise.then(
                        types => {
                            self.types(types);
                            $("#type").ojSelect("refresh");
                        }
                );

                let statusPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.status.path, 'GET');

                statusPromise.then(
                        status => {
                            self.status(status);
                            $("#status").ojSelect("refresh");
                        }
                );

                //PIDE Filter select controls population
                let strategicDataProvider =
                        new DataProvider(
                                RESTConfig.admin.strategic.items.path,
                                StrategicDataParser);

                let strategicPromise = strategicDataProvider.fetchData();

                strategicPromise.then(
                    () => {
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

                // Indicators data provider
                let indicatorsDataProvider = new DataProvider(
                        RESTConfig.admin.indicators.pide.items.path,
                        IndicatorDataParser
                );

                let indicatorsPromise = indicatorsDataProvider.fetchData();

                // Tables observable
                self.observableIndicatorsTable = ko.observable();

                indicatorsPromise.then(
                    () => {
                        let indicatorsModel = new IndicatorModel(indicatorsDataProvider);
                        let deletedIds = [];

                        function removeItem(itemId) {
                            let item = indicatorsModel.getItemById(itemId);
                            indicatorsModel.removeItem(item);
                            deletedIds.push(item.id);
                        }

                        function updateEditedItem(currentRow) {
                            indicatorsModel.updateItemName(currentRow.data.id, currentRow.data.name);
                        }
                        
                        function cloneItem(itemId) {
                            let item = indicatorsModel.getItemById(itemId);
                            let indicator = new SummaryIndicator(item.id + 1, item.name + "_clone");
                            
                            indicator.setCloneOf(itemId);
                            indicatorsModel.addItem(indicator);
                            
                            return indicator;
                        }

                        let indicatorsTable = new EditableTable(indicatorsModel, 
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
                                itemClonator: (id) => cloneItem(id),
                                itemCreator: () => params.switchFunction(),
                                itemRemover: (id) => removeItem(id),
                                itemEditor: (id) => params.switchFunction(indicatorsModel.getItemById(id))
                            }
                        );

                        indicatorsTable.addEditListener(updateEditedItem);
                        self.observableIndicatorsTable(indicatorsTable);
                        clickOkHandlerObservable(
                            () => {
                                let indicatorsModel = new IndicatorModel(indicatorsDataProvider);
                                
                                indicatorsTable.setModel(indicatorsModel);
                                indicatorsTable.resetData();
                                $("#" + self.resetDialogId).ojDialog("close");
                            }
                        );
                    }
                );
        
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