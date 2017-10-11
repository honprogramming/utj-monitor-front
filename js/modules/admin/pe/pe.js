/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*define ( [
    "jquery",
    "knockout",
    "ojs/ojcore"
], function ($, ko, oj) {
    
    function PEViewModel() {
        var self = this;
        
    };
    
    return new PEViewModel();
    
});*/

define(
        [
            'jquery',
            'knockout',
            'data/DataProvider',
            'data/RESTConfig',
            'data/AjaxUtils',
            'view-models/GeneralViewModel',
            'modules/admin/pe/model/PeDataParser',
            'modules/admin/pe/model/PeModel',
            'modules/admin/pe/model/PeItem',
            'modules/admin/pe/model/PeTypes',
            'modules/admin/pe/model/PeTypesParser',
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
                PeDataParser, PeModel, PeItem, 
                PeTypes, PeTypesParser,
                EditableTable, FormActions, AdminItems, ActionTypes) {
            function PeViewModel() {
                var self = this;
                self.title = AdminItems["pe"]["label"];
                self.vision = ko.observable();
       
                self.columns = [
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.nameColumn"),
                        headerStyle: 'min-width: 50%; max-width: 50em; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 50%; max-width: 50em; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.actionsColumn"),
                        headerStyle: 'min-width: 2em; max-width: 5em; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 2em; max-width: 5em; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];
                
                self.columnsPe = [
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.nameColumn"),
                        headerStyle: 'min-width: 50%; max-width: 50em; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 50%; max-width: 50em; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.nameShortColumn"),
                        headerStyle: 'min-width: 50%; max-width: 50em; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 50%; max-width: 50em; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortable: 'disabled'
                    },
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.actionsColumn"),
                        headerStyle: 'min-width: 2em; max-width: 5em; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 2em; max-width: 5em; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];
                
                self.formActions = new FormActions();
                self.resetDialogId = "pe-reset-dialog";
                self.resetDialogTitle = GeneralViewModel.nls("admin.pe.resetDialog.title");
                self.resetWarningText = GeneralViewModel.nls("admin.pe.resetDialog.warningText");
                self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.pe.resetDialog.okButton");
                self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.pe.resetDialog.cancelButton");
                self.saveDialogId = "pe-save-dialog";
                self.saveMessage = ko.observable();
                self.saveDialogTitle = GeneralViewModel.nls("admin.pe.saveDialog.title");
                
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
                
                var peTypesDataProvider =
                        new DataProvider(
                        "data/pe-types.json",
//                            RESTConfig.admin.strategic.types.path,
                            PeTypesParser);
                
                var typesPromise = peTypesDataProvider.fetchData();
                
                var typesSetPromise = typesPromise.then(
                        function() {
                            var types = peTypesDataProvider.getDataArray();
                            var peTypesMap = PeTypes.getTypesMap();
                            
                            types.forEach(
                                function(type) {
                                    var peType = peTypesMap[type.name];
                                    
                                    if (peType) {
                                        peType.id = type.id;
                                    }
                                }
                            );
                        }
                );
                
                var peDataProvider =
                        new DataProvider(
                        "data/pe-items-full.json",
//                                RESTConfig.admin.strategic.items.path,
                                PeDataParser);
                                        
                var dataPromise = peDataProvider.fetchData();
                self.observableTiposPeTable = ko.observable();
                self.observablePeTable = ko.observable();
                
                Promise.all([typesSetPromise, dataPromise]).then(
                        function () {
                            var peModel = new PeModel(peDataProvider);
                            var peItem = peModel.getItemsByType(PeTypes.PE)[0];
                            var tipoArray = peModel.getItemsByType(PeTypes.TIPO);
                            var deletedIds = [];
                            
                            if (!peItem) {
                                peItem = new PeItem(1, "", PeTypes.PE);
                                peModel.addItem(null, peItem);
                            }
                            
                            function hasNoChildren(itemId) {
                                var item = peModel.getItemById(itemId);
                                
                                if (item) {
                                    return item.children.length === 0;
                                }
                                
                                return true;
                            }
                            
                            function createItem(id, table, peType) {
                                var newItem = new PeItem(id, "", peType);
                                var parentRow = table.getCurrentRow();
                                peModel.addItem(parentRow.rowKey, newItem);
                                removeDeletedIds(id);
                                
                                return newItem;
                            }
                            
                            function removeItem(itemId) {
                                var item = peModel.getItemById(itemId);
                                peModel.removeItem(item);
                                deletedIds.push(item.id);
                            };
                            
                            function getChildrenItems(ids) {
                                var items = peModel.getItemsById(ids);
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
                                peModel.updateItemName(currentRow.data.id, currentRow.data.name);
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
                            
                            self.vision(peItem ? peItem.name : "");
                            
                            self.tiposPeTable = new EditableTable(tipoArray, peModel,
                                    {
                                        id: "tiposPe-table",
                                        title: GeneralViewModel.nls("admin.pe.tiposPeTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.tiposPeTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.tiposPeTable.tableAria"),
                                        columns: self.columns,
                                        newErrorText: GeneralViewModel.nls("admin.pe.tiposPeTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.tiposPeTable.deleteErrorText"),
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.vision().length > 0;
                                        },
                                        itemCreator: function(id) {
                                            var newItem = new PeItem(id, "", PeTypes.TIPO);
                                            peModel.addItem(peItem.id, newItem);
                                            removeDeletedIds(id);
                                            
                                            return newItem;
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                    
                            self.enableTiposNew = ko.computed(
                                function() {
                                    //self.tiposPeTable.setNewEnabled(self.vision().length > 0);
                                }
                            );
                            
                            self.tiposPeTable.addEditListener(updateEditedItem);
                    
                            self.observableTiposPeTable(self.tiposPeTable);
                            
                            var carreraArray = peModel.getItemsByType(PeTypes.CARRERA);
                            
                            self.peTable = new EditableTable(carreraArray, peModel,
                                    {
                                        id: "pe-table",
                                        title: GeneralViewModel.nls("admin.pe.peTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.peTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.peTable.tableAria"),
                                        columns: self.columnsPe,
                                        newEnabled: false,
                                        newErrorText: GeneralViewModel.nls("admin.pe.peTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.peTable.deleteErrorText"),
                                        deleteValidator: hasNoChildren,
                                        newValidator: function() {
                                            return self.tiposPeTable.currentRow();
                                        },
                                        itemCreator: function(id) {
                                            return createItem(id, self.tiposPeTable, PeTypes.TIPO);
                                        },
                                        itemRemover: removeItem
                                    }
                            );
                            
                            self.enableCarreraNew = ko.computed(
                                function() {
                                    self.peTable.setNewEnabled(self.tiposPeTable.currentRow());
                                }
                            );
                            
                            self.peTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            var currentAxe = self.tiposPeTable.getCurrentRow();
                                            peModel.addItem(currentAxe.rowKey, item);
                                        break;
                                    }
                                }
                            );
                    
                            self.peTable.addEditListener(updateEditedItem);
                            
                            self.observablePeTable(self.peTable);
                            
                            self.tiposPeTable.addFilterListener(
                                function(ids, removeFilter) {
                                    
                                    var itemsToKeep = removeFilter
                                            ? carreraArray
                                            : getChildrenItems(ids);
                                    
                                    self.carreraTable.filter(itemsToKeep);
                                }
                            );
                    
                            //var objectivesArray = strategicModel.getItemsByType(StrategicTypes.OBJECTIVE);
                            
                            /*self.objectivesTable = new EditableTable(objectivesArray, strategicModel,
                                    {
                                        id: "objectives-table",
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
                                        itemRemover: removeItem
                                    }
                            );*/
                            
                            /*self.enableObjectivesNew = ko.computed(
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
                            );*/
                    
                            //self.objectivesTable.addEditListener(updateEditedItem);
                    
                            //self.observableObjectivesTable(self.objectivesTable);
                            
                            /*self.topicsTable.addFilterListener(
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
                            );*/
                    
                            //var strategiesArray = strategicModel.getItemsByType(StrategicTypes.STRATEGY);
                            
                            /*self.strategiesTable = new EditableTable(strategiesArray, strategicModel,
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
                            );*/
                    
                            clickOkHandlerObservable(
                                    function() {
                                        $("#" + self.resetDialogId).ojDialog("close");

                                        self.vision(peItem.name);
                                        self.tiposPeTable.resetData();
                                        self.peTable.resetData();
                                        
                                    }
                            );
                    
                            self.formActions.addSaveListener(function() {
                                    peItem.name = self.vision();
                                    
                                    var method = 'PUT';
                                    var visionPromise = $.getJSON(
                                            RESTConfig.admin.pe.items.path + "/" + peItem.id);
                                    
                                    visionPromise.then(
                                        function(data) {
                                            var path = RESTConfig.admin.pe.items.path;
                                            
                                            if (!data) {
                                                method = 'POST';
                                            } else {
                                                path += "/" + peItem.id;
                                            }
                                            
                                            function successFunction () {
                                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success"));
                                                saveDialogClass = "save-dialog-success";
                                            }
                                            
                                            function errorFunction(jqXHR, textStatus, errMsg) {
                                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success") + errMsg);
                                                saveDialogClass = "save-dialog-error";
                                            }
                                                    
                                            if (deletedIds.length > 0) {
                                                deletedIds.forEach(
                                                        function(id) {
                                                            AjaxUtils.ajax(RESTConfig.admin.pe.items.path + "/" + id, 'DELETE', null, null, errorFunction);
                                                        }
                                                );
                                            }
                                            
                                            var savePromise = AjaxUtils.ajax(path, method, peItem, successFunction, errorFunction);
                                            
                                            
                                            savePromise.then(
                                                function() {
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
                );
            }

            return new PeViewModel();
        }
);