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
            'jquery',
            'ojs/ojcore',
            'ojs/ojknockout',
            'ojs/ojcollapsible', 'ojs/ojinputtext',
            'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, GeneralViewModel, DataProvider,
                StrategicDataParser, StrategicModel, StrategicType,
                EditableTable, AdminItems) {
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
                            self.axesTable = new EditableTable(strategicModel, 
                                    {
                                        id: "axes-table",
                                        title: "admin.strategic.axesTable.title",
                                        tableSummary: "admin.strategic.axesTable.tableSummary",
                                        tableAria: "admin.strategic.axesTable.tableAria",
                                        columns: self.columns,
                                        type: StrategicType.AXE
                                    }
                            );
                            
                            self.axesTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.observableAxesTable(self.axesTable);
                            
                            self.topicsTable = new EditableTable(strategicModel, 
                                    {
                                        id: "axes-table",
                                        title: "admin.strategic.topicsTable.title",
                                        tableSummary: "admin.strategic.topicsTable.tableSummary",
                                        tableAria: "admin.strategic.topicsTable.tableAria",
                                        columns: self.columns,
                                        type: StrategicType.TOPIC
                                    }
                            );
                            
                            self.topicsTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.observableTopicsTable(self.topicsTable);
                            
                            self.objectivesTable = new EditableTable(strategicModel, 
                                    {
                                        id: "axes-table",
                                        title: "admin.strategic.objectivesTable.title",
                                        tableSummary: "admin.strategic.objectivesTable.tableSummary",
                                        tableAria: "admin.strategic.objectivesTable.tableAria",
                                        columns: self.columns,
                                        type: StrategicType.TOPIC
                                    }
                            );
                            
                            self.objectivesTable.addFilterListener(
                                function(rowKey) {
                                    console.trace("filter listener: %o", rowKey);
                                }
                            );
                            
                            self.observableObjectivesTable(self.objectivesTable);
                            
                            self.strategiesTable = new EditableTable(strategicModel, 
                                    {
                                        id: "axes-table",
                                        title: "admin.strategic.strategiesTable.title",
                                        tableSummary: "admin.strategic.strategiesTable.tableSummary",
                                        tableAria: "admin.strategic.strategiesTable.tableAria",
                                        columns: self.columns,
                                        type: StrategicType.TOPIC
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