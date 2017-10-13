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
            'modules/admin/pe/model/PeDataParser',
            'modules/admin/pe/model/PeModel',
            'modules/admin/pe/model/PeItem',
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
                PeDataParser, PeModel, PeItem, PeTypesParser,
                EditableTable, FormActions, AdminItems, ActionTypes) {
            function PeViewModel() {
                var self = this;
                self.title = AdminItems["pe"]["label"];
      
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
                        sortable: 'name'
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
//                            RESTConfig.admin.pe.types.path,
                            PeTypesParser);
                
                var typesPromise = peTypesDataProvider.fetchData();
                
                var peDataProvider =
                        new DataProvider(
                        "data/pe-items.json",
//                            RESTConfig.admin.pe.types.path,
                            PeDataParser);
                                        
                var pePromise = peDataProvider.fetchData();
                
                self.observableTiposPeTable = ko.observable();
                self.observablePeTable = ko.observable();
                
                Promise.all([typesPromise, pePromise]).then(
                        function () {
                            var peModel = new PeModel(peDataProvider);
                            peModel.setTypes(peTypesDataProvider.getDataArray());
                            
                            var typesArray = peModel.getTypes();
                            var deletedIds = [];
                            
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
                          
                            self.tiposPeTable = new EditableTable(typesArray, peModel,
                                    {
                                        id: "tiposPe-table",
                                        title: GeneralViewModel.nls("admin.pe.tiposPeTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.tiposPeTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.tiposPeTable.tableAria"),
                                        columns: self.columns,
                                        newErrorText: GeneralViewModel.nls("admin.pe.tiposPeTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.tiposPeTable.deleteErrorText"),
                           
                                        itemRemover: removeItem
                                    }
                            );
                    
                            self.tiposPeTable.addEditListener(updateEditedItem);
                    
                            self.observableTiposPeTable(self.tiposPeTable);
                            
                            peModel.setTypes(peDataProvider.getDataArray());
                            
                            var peArray = peModel.getItemsArray();
                            
                            self.peTable = new EditableTable(peArray, peModel,
                                    {
                                        id: "pe-table",
                                        title: GeneralViewModel.nls("admin.pe.peTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.peTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.peTable.tableAria"),
                                        columns: self.columnsPe,
                                        newEnabled: false,
                                        newErrorText: GeneralViewModel.nls("admin.pe.peTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.peTable.deleteErrorText"),
                                   
                                        itemRemover: removeItem
                                    }
                            );
                                                  
                            self.peTable.addDataListener(
                                function(item, action) {
                                    switch(action) {
                                        case ActionTypes.ADD:
                                            var currentAxe = self.peTable.getCurrentRow();
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
                                            ? peArray
                                            : getChildrenItems(ids);
                                    
                                    self.peTable.filter(itemsToKeep);
                                }
                            );
                    
                            clickOkHandlerObservable(
                                    function() {
                                        $("#" + self.resetDialogId).ojDialog("close");

                                        self.tiposPeTable.resetData();
                                        self.peTable.resetData();
                                        
                                    }
                            );
                    
                            self.formActions.addSaveListener(function() {
                                           
                                    var method = 'PUT';
                                    var visionPromise = $.getJSON(
                                            RESTConfig.admin.pe.items.path + "/" + peItem.id);
                                    
                                    visionPromise.then(
                                        function(data) {
                                            var path = RESTConfig.admin.pe.items.path;
                                
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