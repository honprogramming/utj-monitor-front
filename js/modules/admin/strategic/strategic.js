/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'jquery',
            'knockout',
            'data/DataProvider',
            'data/RESTConfig',
            'data/AjaxUtils',
            'view-models/GeneralViewModel',
            'modules/admin/strategic/model/StrategicDataParser',
            'modules/admin/strategic/model/StrategicModel',
            'modules/admin/strategic/model/StrategicItem',
            'modules/admin/strategic/model/StrategicTypes',
            'modules/admin/strategic/model/StrategicTypesParser',
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
            'ojs/ojarraytabledatasource'
        ],
        function ($, ko, DataProvider, RESTConfig, AjaxUtils, GeneralViewModel,
                StrategicDataParser, StrategicModel, StrategicItem, 
                StrategicTypes, StrategicTypesParser,
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
                self.saveDialogId = "strategic-save-dialog";
                self.saveMessage = ko.observable();
                self.saveDialogTitle = GeneralViewModel.nls("admin.strategic.saveDialog.title");
                
                var saveDialogClass = "";
                
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
                
                var strategicTypesDataProvider =
                        new DataProvider(
//                        "data/strategic-types.json",
                            RESTConfig.admin.strategic.types.path,
                            StrategicTypesParser);
                
                var typesPromise = strategicTypesDataProvider.fetchData();
                
                var typesSetPromise = typesPromise.then(
                        function() {
                            var types = strategicTypesDataProvider.getDataArray();
                            var strategicTypesMap = StrategicTypes.getTypesMap();
                            
                            types.forEach(
                                function(type) {
                                    var strategicType = strategicTypesMap[type.name];
                                    
                                    if (strategicType) {
                                        strategicType.id = type.id;
                                    }
                                }
                            );
                        }
                );
                
                var strategicDataProvider =
                        new DataProvider(
//                        "data/strategic-items-full.json",
                                RESTConfig.admin.strategic.path,
                                StrategicDataParser);
                                        
                const dataPromise = strategicDataProvider.fetchData();
                self.observableAxesTable = ko.observable();
                self.observableTopicsTable = ko.observable();
                self.observableObjectivesTable = ko.observable();
                self.observableStrategiesTable = ko.observable();
                
                let visionItem;
                let deletedIds = [];
                let strategicModel;
                
                typesSetPromise.then(dataPromise.then(() => updateForm(strategicDataProvider.getDataArray())));
                
                function updateForm(data) {
                    strategicModel = new StrategicModel(data);
                    visionItem = strategicModel.getItemsByType(StrategicTypes.VISION)[0];

                    if (!visionItem) {
                        visionItem = new StrategicItem(1, "", StrategicTypes.VISION);
                        strategicModel.addItem(null, visionItem);
                    }
                            
                    function hasNoChildren(itemId) {
                        var item = strategicModel.getItemById(itemId);

                        if (item) {
                            return item.children.length === 0;
                        }

                        return true;
                    }

                    function createItem(id, table, strategicType) {
                        let newItem = new StrategicItem(id, "", strategicType);
                        newItem.isNew = true;
                        let parentRow = table.getCurrentRow();
                        strategicModel.addItem(parentRow.rowKey, newItem);
                        removeDeletedIds(id);

                        return newItem;
                    }
                            
                    function removeItem(itemId) {
                        var item = strategicModel.getItemById(itemId);
                        strategicModel.removeItem(item);
                        deletedIds.push(item.id);
                    };

                    function getChildrenItems(ids) {
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

                    function updateEditedItem(currentRow) {
                        strategicModel.updateItemName(currentRow.data.id, currentRow.data.name);
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
                        var promise = new Promise(
                                (resolve) => {
                                    if (tableFilterKey) {
                                        resolve(tableFilterKey);
                                    }

                                    var visibleItemsPromise = table.getVisibleItemsPromise();
                                    visibleItemsPromise.then(
                                        function(data) {
                                            resolve(data.keys);
                                        }
                                    );
                                }
                        );

                        return promise;
                    }
                            
                    function useChildrenItemsToFilterTable(ids, table) {
                        var itemsToKeep = getChildrenItems(ids);
                        table.filter(itemsToKeep);
                    }

                    self.vision(visionItem ? visionItem.name : "");
                            
                    self.axesTable = new EditableTable(strategicModel,
                            {
                                id: "axes-table",
                                actions: ["filter", "delete"],
                                title: GeneralViewModel.nls("admin.strategic.axesTable.title"),
                                tableSummary: GeneralViewModel.nls("admin.strategic.axesTable.tableSummary"),
                                tableAria: GeneralViewModel.nls("admin.strategic.axesTable.tableAria"),
                                columns: self.columns,
                                newErrorText: GeneralViewModel.nls("admin.strategic.axesTable.newErrorText"),
                                deleteErrorText: GeneralViewModel.nls("admin.strategic.axesTable.deleteErrorText"),
                                deleteValidator: hasNoChildren,
                                newValidator: function() {
                                    return self.vision().length > 0;
                                },
                                itemCreator: function(id) {
                                    let newItem = new StrategicItem(id, "", StrategicTypes.AXE);
                                    newItem.isNew = true;
                                    strategicModel.addItem(visionItem.id, newItem);
                                    removeDeletedIds(id);

                                    return newItem;
                                },
                                itemRemover: removeItem,
                                filterFunction: () => {return strategicModel.getItemsByType(StrategicTypes.AXE);}
                            }
                    );
                    
                    self.enableAxesNew = ko.computed(
                        function() {
                            self.axesTable.setNewEnabled(self.vision().length > 0);
                        }
                    );

                    self.axesTable.addEditListener(updateEditedItem);

                    self.observableAxesTable(self.axesTable);

                    self.topicsTable = new EditableTable(strategicModel,
                            {
                                id: "topics-table",
                                actions: ["filter", "delete"],
                                title: GeneralViewModel.nls("admin.strategic.topicsTable.title"),
                                tableSummary: GeneralViewModel.nls("admin.strategic.topicsTable.tableSummary"),
                                tableAria: GeneralViewModel.nls("admin.strategic.topicsTable.tableAria"),
                                columns: self.columns,
                                newEnabled: false,
                                newErrorText: GeneralViewModel.nls("admin.strategic.topicsTable.newErrorText"),
                                deleteErrorText: GeneralViewModel.nls("admin.strategic.topicsTable.deleteErrorText"),
                                deleteValidator: hasNoChildren,
                                newValidator: function() {
                                    return self.axesTable.currentRow();
                                },
                                itemCreator: function(id) {
                                    return createItem(id, self.axesTable, StrategicTypes.TOPIC);
                                },
                                itemRemover: removeItem,
                                filterFunction: () => {return strategicModel.getItemsByType(StrategicTypes.TOPIC);}
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
                    
                    self.topicsTable.addEditListener(updateEditedItem);

                    self.observableTopicsTable(self.topicsTable);

                    self.axesTable.addFilterListener(
                        function(ids, removeFilter) {

                            var itemsToKeep = removeFilter
                                    ? strategicModel.getItemsByType(StrategicTypes.TOPIC)
                                    : getChildrenItems(ids);

                            self.topicsTable.filter(itemsToKeep);
                        }
                    );
                    
                    self.objectivesTable = new EditableTable(strategicModel,
                            {
                                id: "objectives-table",
                                actions: ["filter", "delete"],
                                title: GeneralViewModel.nls("admin.strategic.objectivesTable.title"),
                                tableSummary: GeneralViewModel.nls("admin.strategic.objectivesTable.tableSummary"),
                                tableAria: GeneralViewModel.nls("admin.strategic.objectivesTable.tableAria"),
                                columns: self.columns,
                                newEnabled: false,
                                newErrorText: GeneralViewModel.nls("admin.strategic.objectivesTable.newErrorText"),
                                deleteErrorText: GeneralViewModel.nls("admin.strategic.objectivesTable.deleteErrorText"),
                                deleteValidator: hasNoChildren,
                                newValidator: function() {
                                    return self.topicsTable.currentRow();
                                },
                                itemCreator: function(id) {
                                    return createItem(id, self.topicsTable, StrategicTypes.OBJECTIVE);
                                },
                                itemRemover: removeItem,
                                filterFunction: () => {return strategicModel.getItemsByType(StrategicTypes.OBJECTIVE);}
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
                    
                    self.objectivesTable.addEditListener(updateEditedItem);

                    self.observableObjectivesTable(self.objectivesTable);

                    self.topicsTable.addFilterListener(
                        function(ids, removeFilter) {

                            if (removeFilter) {
                                var itemsPromise = getAvailableParentItems(self.topicsTable);

                                itemsPromise.then(
                                    function(ids) {
                                        useChildrenItemsToFilterTable(ids, self.objectivesTable);
                                    }
                                );
                            } else {
                                useChildrenItemsToFilterTable(ids, self.objectivesTable);
                            }
                        }
                    );
                    
                    self.strategiesTable = new EditableTable(strategicModel,
                            {
                                id: "strategies-table",
                                title: GeneralViewModel.nls("admin.strategic.strategiesTable.title"),
                                tableSummary: GeneralViewModel.nls("admin.strategic.strategiesTable.tableSummary"),
                                tableAria: GeneralViewModel.nls("admin.strategic.strategiesTable.tableAria"),
                                columns: self.columns,
                                newEnabled: false,
                                newErrorText: GeneralViewModel.nls("admin.strategic.strategiesTable.newErrorText"),
                                deleteErrorText: GeneralViewModel.nls("admin.strategic.strategiesTable.deleteErrorText"),
                                actions: ["delete"],
                                deleteValidator: hasNoChildren,
                                newValidator: function() {
                                    return self.objectivesTable.currentRow();
                                },
                                itemCreator: function(id) {
                                    return createItem(id, self.objectivesTable, StrategicTypes.STRATEGY);
                                },
                                itemRemover: removeItem,
                                filterFunction: () => {return strategicModel.getItemsByType(StrategicTypes.STRATEGY);}
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
                    
                    self.strategiesTable.addEditListener(updateEditedItem);

                    self.observableStrategiesTable(self.strategiesTable);
                            
                    self.objectivesTable.addFilterListener(
                        function(ids, removeFilter) {
                            if (removeFilter) {
                                var itemsPromise = getAvailableParentItems(self.objectivesTable);

                                itemsPromise.then(
                                    function(ids) {
                                        useChildrenItemsToFilterTable(ids, self.strategiesTable);
                                    }
                                );
                            } else {
                                useChildrenItemsToFilterTable(ids, self.strategiesTable);
                            }

//                                    var objectivesFilterKey = self.topicsTable.getCurrentFilterKey();
//                                    var visibleObjectivesPromise = self.objectivesTable.getVisibleItemsPromise();
//                                    
//                                    visibleObjectivesPromise.then(
//                                            function(data) {
//                                                var itemsToKeep = removeFilter
//                                            ? (objectivesFilterKey ? 
//                                                getChildrenItems(objectivesFilterKey) : 
//                                                        data.keys.length > 0 ?
//                                                        getChildrenItems(data.keys) :
//                                                        strategiesArray
//                                              )
//                                            : getChildrenItems(ids);
//                                    
//                                                self.strategiesTable.filter(itemsToKeep);
//                                            }
//                                    );


                        }
                    );
                    
                    clickOkHandlerObservable(
                            () => {
                                $("#" + self.resetDialogId).ojDialog("close");

                                self.vision(visionItem.name);
                                self.axesTable.resetData();
                                self.topicsTable.resetData();
                                self.objectivesTable.resetData();
                                self.strategiesTable.resetData();
                            }
                    );
                }
                
                self.formActions.addSaveListener(function() {
                        visionItem.name = self.vision();

                        let method = 'PUT';
                        let visionPromise = $.getJSON(
                                RESTConfig.admin.strategic.path + "/" + visionItem.id);

                        visionPromise.then(
                            function(data) {
                                let path = RESTConfig.admin.strategic.path;

                                if (!data) {
                                    method = 'POST';
                                } else {
                                    path += "/" + visionItem.id;
                                }

                                function successFunction () {
                                    self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success"));
                                    saveDialogClass = "save-dialog-success";
                                }

                                function errorFunction(jqXHR, textStatus, errMsg) {
                                    self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success") + errMsg);
                                    saveDialogClass = "save-dialog-error";
                                }

                                if (deletedIds.length > 0) {
                                    deletedIds.forEach(
                                            function(id) {
                                                AjaxUtils.ajax(RESTConfig.admin.strategic.path + "/" + id, 'DELETE', null, null, errorFunction);
                                            }
                                    );
                                }
                                
                                let strategicMap = strategicModel.getItems();
                                
                                for (let prop in strategicMap) {
                                    if (strategicMap[prop].isNew) {
                                        delete strategicMap[prop].id;
                                    }
                                }
                                
                                const savePromise = AjaxUtils.ajax(path, method, visionItem, successFunction, errorFunction);

                                savePromise.then(
                                    function(data) {
                                        updateForm(StrategicDataParser.parse(data));
                                        self.showDialog();
                                    }
                                );
                            }
                        );
                    }
                );
                    
                self.showDialog = function() {
                    var saveDialog = $("#" + self.saveDialogId);
                    saveDialog.ojDialog("widget").addClass(saveDialogClass);
                    saveDialog.ojDialog("open");
                };
            }

            return new StrategicViewModel();
        }
);