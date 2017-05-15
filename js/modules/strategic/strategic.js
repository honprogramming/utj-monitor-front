/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'jquery',
            'knockout',
            'view-models/GeneralViewModel',
            'models/data/DataProvider',
            'models/strategic/StrategicDataParser',
            'models/strategic/StrategicModel',
            'models/strategic/StrategicItem',
            'models/strategic/StrategicType',
            'view-models/templates/EditableTable',
            'view-models/templates/FormActions',
            'view-models/admin/AdminItems',
            'view-models/events/ActionTypes',
            'ojs/ojcore',
            'ojs/ojknockout',
            'ojs/ojcollapsible',
            'ojs/ojinputtext',
            'ojs/ojtable',
            'ojs/ojdialog',
            'ojs/ojbutton',
            'ojs/ojarraytabledatasource'
        ],
        function ($, ko, GeneralViewModel, DataProvider,
                StrategicDataParser, StrategicModel, StrategicItem, StrategicType,
                EditableTable, FormActions, AdminItems, ActionTypes) {
            function StrategicViewModel() {
                var self = this;
                self.title = AdminItems["strategic"]["label"];
                self.visionTitle = GeneralViewModel.nls("admin.strategic.vision.title");
                self.vision = ko.observable();
                self.placeholder = GeneralViewModel.nls("admin.strategic.vision.placeHolder");

                self.columns = [
                    {
                        headerText: GeneralViewModel.nls("admin.strategic.tableHeaders.nameColumn"),
                        headerStyle: 'min-width: 50%; max-width: 50em; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 50%; max-width: 50em; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: GeneralViewModel.nls("admin.strategic.tableHeaders.actionsColumn"),
                        headerStyle: 'min-width: 2em; max-width: 5em; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 2em; max-width: 5em; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];
                
                self.formActions = new FormActions();
                self.resetDialogId = "strategic-reset-dialog";
                self.resetDialogTitle = GeneralViewModel.nls("admin.strategic.resetDialog.title");
                self.resetWarningText = GeneralViewModel.nls("admin.strategic.resetDialog.warningText");
                self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.strategic.resetDialog.okButton");
                self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.strategic.resetDialog.cancelButton");
                
                self.formActions.addResetListener(
                        function() {
                            $("#" + self.resetDialogId).ojDialog("open");
                        }
                );
                
                var clickOkHandlerObservable = ko.observable();
                
                self.clickOkHandler = function() {
                    var handler = clickOkHandlerObservable();
                    handler();
                };

                self.clickCancelHandler = function() {
                    $("#" + self.resetDialogId).ojDialog("close");
                };
                
                var strategicDataProvider =
                        new DataProvider("data/strategic-items.json",
                                StrategicDataParser);

                var dataPromise = strategicDataProvider.fetchData();
                self.observableAxesTable = ko.observable();
                self.observableTopicsTable = ko.observable();
                self.observableObjectivesTable = ko.observable();
                self.observableStrategiesTable = ko.observable();
                
                dataPromise.then(
                        function () {
                            var strategicModel = new StrategicModel(strategicDataProvider);
                            var axesArray = strategicModel.getItemsByType(StrategicType.AXE);
                            var visionItem = strategicModel.getItemsByType(StrategicType.VISION)[0];
                            
                            function hasNoChildren(itemId) {
                                var item = strategicModel.getItemById(itemId);
                                
                                if (item) {
                                    return item.children.length === 0;
                                }
                                
                                return true;
                            }
                            
                            function createItem(id, table) {
                                var newItem = new StrategicItem(id, "", StrategicType.AXE);
                                var parentRow = table.getCurrentRow();
                                strategicModel.addItem(parentRow.rowKey, newItem);
                                
                                return newItem;
                            }
                            
                            function removeItem(itemId) {
                                var item = strategicModel.getItemById(itemId);
                                strategicModel.removeItem(item);
                            };
                            
                            function getItemsChildren(ids) {
                                var items = strategicModel.getItemsById(ids);
                                var children = [];
                                
                                if (Array.isArray(items)) {
                                    items.forEach(
                                            function(item) {
                                                children = children.concat(item.children);
                                            }
                                    );
                                }
                                
                                return children;
                            }
                            
                            self.vision(visionItem.name);
                            
                            self.axesTable = new EditableTable(axesArray, strategicModel,
                                    {
                                        id: "axes-table",
                                        title: GeneralViewModel.nls("admin.strategic.axesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.axesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.axesTable.tableAria"),
                                        columns: self.columns,
                                        errorText: GeneralViewModel.nls("admin.strategic.axesTable.errorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.strategic.axesTable.deleteErrorText"),
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.vision().length > 0;
                                        },
                                        itemCreator: function(id) {
                                            var newItem = new StrategicItem(id, "", StrategicType.AXE);
                                            strategicModel.addItem(visionItem.id, newItem);
                                            
                                            return newItem;
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                    
                            self.enableAxesNew = ko.computed(
                                function() {
                                    self.axesTable.setNewEnabled(self.vision().length > 0);
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
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.topicsTable.errorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.strategic.topicsTable.deleteErrorText"),
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.axesTable.currentRow();
                                        },
                                        itemCreator: function(id) {
                                            return createItem(id, self.axesTable);
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                            
                            self.enableTopicsNew = ko.computed(
                                function() {
                                    self.topicsTable.setNewEnabled(self.axesTable.currentRow());
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
                            
                            self.axesTable.addFilterListener(
                                function(ids, removeFilter) {
                                    var itemsToKeep = removeFilter
                                            ? topicsArray
                                            : getItemsChildren(ids);
                                    
                                    self.topicsTable.filter(itemsToKeep);
                                }
                            );
                    
                            var objectivesArray = strategicModel.getItemsByType(StrategicType.OBJECTIVE);
                            
                            self.objectivesTable = new EditableTable(objectivesArray, strategicModel,
                                    {
                                        id: "objectives-table",
                                        title: GeneralViewModel.nls("admin.strategic.objectivesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.objectivesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.objectivesTable.tableAria"),
                                        columns: self.columns,
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.objectivesTable.errorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.strategic.objectivesTable.deleteErrorText"),
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.topicsTable.currentRow();
                                        },
                                        itemCreator: function(id) {
                                            return createItem(id, self.topicsTable);
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                            
                            self.enableObjectivesNew = ko.computed(
                                function() {
                                    self.objectivesTable.setNewEnabled(self.topicsTable.currentRow());
                                }
                            );
                    
                            self.objectivesTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            var currentTopic = self.topicsTable.getCurrentRow();
                                            strategicModel.addItem(currentTopic.rowKey, item);
                                        break;
                                    }
                                }
                            );
                    
                            self.observableObjectivesTable(self.objectivesTable);
                            
                            self.topicsTable.addFilterListener(
                                function(ids, removeFilter) {
                                    var itemsToKeep = removeFilter
                                            ? objectivesArray
                                            : getItemsChildren(ids);
                                    
                                    self.objectivesTable.filter(itemsToKeep);
                                }
                            );
                    
                            var strategiesArray = strategicModel.getItemsByType(StrategicType.STRATEGY);
                            
                            self.strategiesTable = new EditableTable(strategiesArray, strategicModel,
                                    {
                                        id: "strategies-table",
                                        title: GeneralViewModel.nls("admin.strategic.strategiesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.strategic.strategiesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.strategic.strategiesTable.tableAria"),
                                        columns: self.columns,
                                        newEnabled: false,
                                        errorText: GeneralViewModel.nls("admin.strategic.strategiesTable.errorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.strategic.strategiesTable.deleteErrorText"),
                                        actions: ["delete"],
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.objectivesTable.currentRow();
                                        },
                                        itemCreator: function(id) {
                                            return createItem(id, self.objectivesTable);
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                            
                            self.enableStrategiesNew = ko.computed(
                                function() {
                                    self.strategiesTable.setNewEnabled(self.objectivesTable.currentRow());
                                }
                            );
                    
                            self.strategiesTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            var currentObjective = self.objectivesTable.getCurrentRow();
                                            strategicModel.addItem(currentObjective.rowKey, item);
                                        break;
                                    }
                                }
                            );
                    
                            self.observableStrategiesTable(self.strategiesTable);
                            
                            self.objectivesTable.addFilterListener(
                                function(ids, removeFilter) {
                                    var itemsToKeep = removeFilter
                                            ? strategiesArray
                                            : getItemsChildren(ids);
                                    
                                    self.strategiesTable.filter(itemsToKeep);
                                }
                            );
                    
                            clickOkHandlerObservable(
                                    function() {
                                        $("#" + self.resetDialogId).ojDialog("close");

                                        self.vision(visionItem.name);
                                        self.axesTable.resetData();
                                        self.topicsTable.resetData();
                                        self.objectivesTable.resetData();
                                        self.strategiesTable.resetData();
                                    }
                            );
                        }
                );
            }

            return new StrategicViewModel();
        }
);