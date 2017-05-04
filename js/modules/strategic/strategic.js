/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'models/data/DataProvider',
            'models/strategic/StrategicDataParser',
            'models/strategic/StrategicModel',
            'models/strategic/StrategicType',
            'view-models/templates/EditableTable',
            'view-models/admin/AdminItems',
            'view-models/events/ActionTypes',
            'jquery',
            'ojs/ojcore',
            'ojs/ojknockout',
            'ojs/ojcollapsible', 'ojs/ojinputtext',
            'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, GeneralViewModel, DataProvider,
                StrategicDataParser, StrategicModel, StrategicType,
                EditableTable, AdminItems, ActionTypes) {
            function StrategicViewModel() {
                var self = this;
                self.title = AdminItems["strategic"]["label"];
                self.visionTitle = GeneralViewModel.nls("admin.strategic.vision.title");
                self.vision = ko.observable();
                self.placeholder = GeneralViewModel.nls("admin.strategic.vision.placeHolder");

                self.columns = [
                    {
                        headerText: 'Nombre',
                        headerStyle: 'min-width: 90%; max-width: 90%; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 90%; max-width: 90%; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: 'Acciones',
                        headerStyle: 'min-width: 10%; max-width: 10%; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 10%; max-width: 10%; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];

                var strategicDataProvider =
                        new DataProvider("data/strategic.json",
                                StrategicDataParser);

                var dataPromise = strategicDataProvider.fetchData();
                self.observableAxesTable = ko.observable();
                self.observableTopicsTable = ko.observable();
                self.observableObjectivesTable = ko.observable();
                self.observableStrategiesTable = ko.observable();
                
                dataPromise.then(
                        function() {
                            var strategicModel = new StrategicModel(strategicDataProvider);
                            var axesArray = strategicModel.getItemsByType(StrategicType.AXE);
                            var visionItem = strategicModel.getItemsByType(StrategicType.VISION)[0];
                            
                            self.vision(visionItem.name);
                            
                            self.axesTable = new EditableTable(axesArray, strategicModel,
                                    {
                                        id: "axes-table",
                                        title: GeneralViewModel.nls("admin.strategic.axesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.axesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.axesTable.tableAria"),
                                        columns: self.columns,
                                        type: StrategicType.AXE
                                    }
                            );
                    
                            self.enableAxesNew = ko.computed(
                                function() {
                                    self.axesTable.setNewEnabled(self.vision().length > 0);
                                }
                            );
                            
                            self.axesTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.axesTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            strategicModel.addItem(visionItem.id, item);
                                        break;
                                    }
                                }
                            );
                            
                            self.observableAxesTable(self.axesTable);
                            
                            var topicsArray = strategicModel.getItemsByType(StrategicType.TOPIC);
                            
                            self.topicsTable = new EditableTable(topicsArray, strategicModel,
                                    {
                                        id: "topics-table",
                                        title: GeneralViewModel.nls("admin.strategic.topicsTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.topicsTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.topicsTable.tableAria"),
                                        columns: self.columns,
                                        type: StrategicType.TOPIC,
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.topicsTable.errorText"),
                                        newValidator: function() {
                                            return self.axesTable.currentRow();
                                        }
                                    }
                            );
                            
                            self.enableTopicsNew = ko.computed(
                                function() {
                                    self.topicsTable.setNewEnabled(self.axesTable.currentRow());
                                }
                            );
                            
                            self.topicsTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.topicsTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            var currentAxe = self.axesTable.getCurrentRow();
                                            strategicModel.addItem(currentAxe.rowKey, item);
                                        break;
                                    }
                                }
                            );
                    
                            self.observableTopicsTable(self.topicsTable);
                            
                            var objectivesArray = strategicModel.getItemsByType(StrategicType.OBJECTIVE);
                            
                            self.objectivesTable = new EditableTable(objectivesArray, strategicModel,
                                    {
                                        id: "objectives-table",
                                        title: GeneralViewModel.nls("admin.strategic.objectivesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.objectivesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.objectivesTable.tableAria"),
                                        columns: self.columns,
                                        type: StrategicType.OBJECTIVE,
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.objectivesTable.errorText"),
                                        newValidator: function() {
                                            return self.topicsTable.currentRow();
                                        }
                                    }
                            );
                            
                            self.enableObjectivesNew = ko.computed(
                                function() {
                                    self.objectivesTable.setNewEnabled(self.topicsTable.currentRow());
                                }
                            );
                    
                            self.objectivesTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.observableObjectivesTable(self.objectivesTable);
                            
                            var strategiesArray = strategicModel.getItemsByType(StrategicType.STRATEGY);
                            
                            self.strategiesTable = new EditableTable(strategiesArray, strategicModel,
                                    {
                                        id: "strategies-table",
                                        title: GeneralViewModel.nls("admin.strategic.strategiesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.strategiesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.strategiesTable.tableAria"),
                                        columns: self.columns,
                                        type: StrategicType.STRATEGY,
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.strategiesTable.errorText"),
                                        newValidator: function() {
                                            return self.objectivesTable.currentRow();
                                        }
                                    }
                            );
                            
                            self.enableStrategiesNew = ko.computed(
                                function() {
                                    self.strategiesTable.setNewEnabled(self.objectivesTable.currentRow());
                                }
                            );
                    
                            self.strategiesTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.observableStrategiesTable(self.strategiesTable);
                        }
                );
            }

            return new StrategicViewModel();
        }
);