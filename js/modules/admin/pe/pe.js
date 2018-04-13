define(
        [
            'jquery',
            'knockout',
            'data/DataProvider',
            'data/RESTConfig',
            'data/AjaxUtils',
            'view-models/GeneralViewModel',
            'modules/admin/pe/model/PEDataParser',
            'modules/admin/pe/model/PETypesModel',
            'modules/admin/pe/model/PEModel',
            'modules/admin/pe/model/PEType',
            'modules/admin/pe/model/PETypesParser',
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
                PeDataParser, PETypesModel, PEModel, PEType, PeTypesParser,
                EditableTable, FormActions, AdminItems, ActionTypes) {
            function PEViewModel() {
                var self = this;
                self.title = AdminItems["pe"]["label"];
                
                const PETypesColumns = [
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
                        headerStyle: 'min-width: 2m; max-width: 5em; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 2em; max-width: 5em; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];
                
                const PEColumns = [
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.nameColumn"),
                        headerStyle: 'min-width: 50%; max-width: 50em; width: 80%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 5%; max-width: 5em; width: 80%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: GeneralViewModel.nls("admin.pe.tableHeaders.shortNameColumn"),
                        headerStyle: 'min-width: 10%; max-width: 10em; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 5%; max-width: 5em; width: 10%;',
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
//                        "data/pe-types.json",
                            RESTConfig.admin.pe.types.path,
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
                            const peTypesModel = new PETypesModel(peTypesDataProvider);
                            const peModel = new PEModel(peDataProvider);
                            
                            const deletedTypeIds = [];
                            const deletedIds = [];
                            
                            function createType(id) {
                                const newType = new PEType(id, "");
                                peTypesModel.addItem(newType);
                                
                                return newType;
                            }
                            
                            function removeType(itemId) {
                                const item = peTypesModel.getItemById(itemId);
                                peTypesModel.removeItem(item);
                                deletedTypeIds.push(item.id);
                            }
                            
                            function validateTypeDelete(id) {
                                return true;
                            }
                            
                            function removeItem(itemId) {
                                const item = peModel.getItemById(itemId);
                                peModel.removeItem(item);
                                deletedIds.push(item.id);
                            }
                            
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
                          
                            self.peTypesTable = new EditableTable(peTypesModel,
                                    {
                                        id: "tiposPe-table",
                                        title: GeneralViewModel.nls("admin.pe.peTypesTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.peTypesTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.peTypesTable.tableAria"),
                                        columns: PETypesColumns,
                                        newErrorText: GeneralViewModel.nls("admin.pe.peTypesTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.peTypesTable.deleteErrorText"),
                                        actions: ["filter", "delete"],
                                        itemCreator: (id) => createType(id),
                                        itemRemover: removeType,
                                        deleteValidator: validateTypeDelete
                                    }
                            );
                    
                            self.peTypesTable.addEditListener(updateEditedItem);
                    
                            self.observableTiposPeTable(self.peTypesTable);
                           
                            var peArray = peModel.getData();
                            
                            self.peTable = new EditableTable(peModel,
                                    {
                                        id: "pe-table",
                                        title: GeneralViewModel.nls("admin.pe.peTable.title"),
                                        tableSummary: GeneralViewModel.nls("admin.pe.peTable.tableSummary"),
                                        tableAria: GeneralViewModel.nls("admin.pe.peTable.tableAria"),
                                        columns: PEColumns,
                                        newEnabled: false,
                                        newErrorText: GeneralViewModel.nls("admin.pe.peTable.newErrorText"),
                                        deleteErrorText: GeneralViewModel.nls("admin.pe.peTable.deleteErrorText"),
                                        actions: ["delete"],
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
                            
                            self.peTypesTable.addFilterListener(
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

                                        self.peTypesTable.resetData();
                                        self.peTable.resetData();
                                        
                                    }
                            );
                            
                            function updateEditedType(currentRow) {
                                peTypesModel.updateItemName(currentRow.data.id, currentRow.data.name);
                            }
                            
                            self.peTypesTable.addEditListener(updateEditedType);
                            
                            self.formActions.addSaveListener(function() {
                                    const typesErrors = [];
                                    const types = peTypesModel.getData();
                                    const typesErrorFunction = (j, t, m) => {
                                        typesErrors.push(m);
                                        self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success") + m);
                                        saveDialogClass = "save-dialog-error";
                                    }
                                    
                                    const typesPromises = [];
                                    self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success"));
                                    saveDialogClass = "save-dialog-success";
                                    
                                    let method = 'POST';
                                    let typesPath = RESTConfig.admin.pe.types.path;
                                    
                                    types.forEach(
                                        type => {
                                            typesPromises.push(AjaxUtils.ajax(typesPath, method, type, null, typesErrorFunction));
                                        }
                                    );
                                    
                                    Promise.all(typesPromises)
                                        .then(
                                            () => {
                                                if (typesErrors.length > 0) {
                                                    console.log('Failed when saving PE types: %O', typesErrors);
                                                }
                                            }
                                        )
                                        .then(() => self.showDialog())
                                        .catch(err => console.log('Failed when saving PE types: %O', err));
                                    
//                                    visionPromise.then(
//                                        function(data) {
//                                            var path = RESTConfig.admin.pe.items.path;
//                                
//                                            function successFunction () {
//                                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success"));
//                                                saveDialogClass = "save-dialog-success";
//                                            }
//                                            
//                                            function errorFunction(jqXHR, textStatus, errMsg) {
//                                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success") + errMsg);
//                                                saveDialogClass = "save-dialog-error";
//                                            }
//                                                    
//                                            if (deletedIds.length > 0) {
//                                                deletedIds.forEach(
//                                                        function(id) {
//                                                            AjaxUtils.ajax(RESTConfig.admin.pe.items.path + "/" + id, 'DELETE', null, null, errorFunction);
//                                                        }
//                                                );
//                                            }
//                                            
//                                            var savePromise = AjaxUtils.ajax(path, method, peItem, successFunction, errorFunction);
//                                            
//                                            
//                                        }
//                                    );
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

            return new PEViewModel();
        }
);