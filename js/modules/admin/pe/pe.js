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
            'modules/admin/pe/model/PEItem',
            'modules/admin/pe/model/PETypesParser',
            'templates/EditableTable',
            'templates/FormActions',
            'modules/admin/view-model/AdminItems',
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
                PEDataParser, PETypesModel, PEModel, PEType, PEItem, PeTypesParser,
                EditableTable, FormActions, AdminItems) {
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
                
                self.formActions.addResetListener(
                        function() {
                            $("#" + self.resetDialogId).ojDialog("open");
                        }
                );
                
                let clickOkHandlerObservable = ko.observable();
                
                self.clickOkHandler = function() {
                    var handler = clickOkHandlerObservable();
                    handler();
                };

                self.clickCancelHandler = function() {
                    $("#" + self.resetDialogId).ojDialog("close");
                };
                
                const peTypesDataProvider =
                        new DataProvider(
//                        "data/pe-types.json",
                            RESTConfig.admin.pe.types.path,
                            PeTypesParser);
                
                const typesPromise = peTypesDataProvider.fetchData();
                
                const peDataProvider =
                        new DataProvider(
//                        "data/pe-items.json",
                            RESTConfig.admin.pe.path,
                            PEDataParser);
                                        
                const pePromise = peDataProvider.fetchData();
                
                self.peTypesObservableTable = ko.observable();
                self.peObservableTable = ko.observable();
                
                let peTypesModel;
                let peModel;
                let deletedTypes;
                let deletedPE;
                let peTypesTable;
                let peTable;
                let saveDialogClass = "";
                
                Promise.all([typesPromise, pePromise]).then(
                    () => {
                        clickOkHandlerObservable(
                            () => {
                                $("#" + self.resetDialogId).ojDialog("close");
                                
                                updateTypesTable(peTypesDataProvider);
                                updatePETable(peDataProvider);
                            }
                        );

                        self.formActions.addSaveListener(
                            () => {
                                const types = peTypesModel.getData();
                                const pe = peModel.getData();
                                const errorFunction = (j, t, m) => {
                                    self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.error") + m);
                                    saveDialogClass = "save-dialog-error";
                                };
                                
                                const typesPromises = [];
                                const pePromises = [];
                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success"));
                                saveDialogClass = "save-dialog-success";

                                const typesPath = RESTConfig.admin.pe.types.path;
                                const pePath = RESTConfig.admin.pe.path;

                                typesPromises.push(AjaxUtils.ajax(typesPath, 'POST', types, null, errorFunction));
                                typesPromises.push(AjaxUtils.ajax(typesPath, 'DELETE', deletedTypes, null, errorFunction)); 
                                pePromises.push(AjaxUtils.ajax(pePath, 'POST', pe, null, errorFunction));
                                pePromises.push(AjaxUtils.ajax(pePath, 'DELETE', deletedPE, null, errorFunction)); 

                                Promise.all(typesPromises)
                                    .then(() => updateTypesTable(peTypesDataProvider))
                                    .then(
                                        () => {
                                            if (saveDialogClass === "save-dialog-error") {
                                                throw 'No se pudo guardar el tipo de PE';
                                            }
                                        }
                                    )
                                    .then(Promise.all(pePromises))
                                    .then(() => updatePETable(peDataProvider))
                                    .then(() => self.showDialog())
                                    .catch(
                                        err => {
                                            const message = `Error al guardar: ${err}`;
                                            console.log(message);
                                            self.saveMessage(message);
                                            self.showDialog();
                                        }
                                    );
                            
                            }
                        );

                        self.showDialog = function() {
                            const saveDialog = $("#" + self.saveDialogId);
                            saveDialog.ojDialog("widget").addClass(saveDialogClass);
                            saveDialog.ojDialog("open");
                        };
                    }
                );
        
                const updateTypesTable = (types) => {
                    peTypesModel = new PETypesModel(types);
                    deletedTypes = [];
                    
                    function createType(id) {
                        const newType = new PEType(id, "");
                        peTypesModel.addItem(newType);
                            
                        return newType;
                    }
                            
                    function removeType(itemId) {
                        const item = peTypesModel.getItemById(itemId);
                        peTypesModel.removeItem(item);
                        deletedTypes.push(item);
                    }
                            
                    function validateTypeDelete(id) {
                        return true;
                    }

                    function updateEditedType(currentRow) {
                        peTypesModel.updateItemName(currentRow.data.id, currentRow.data.name);
                    }
                    
                    peTypesTable = new EditableTable(peTypesModel,
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

                    self.peTypesObservableTable(peTypesTable);
                    peTypesTable.addEditListener(updateEditedType);
                };
                
                const updatePETable = (pe) => {
                    peModel = new PEModel(pe);
                    deletedPE = [];
                    
                    function createItem(id) {
                        const newItem = new PEItem(id, "", "");
                        const currentRow = peTypesTable.currentRow();
                        
                        newItem.setType(peTypesModel.getItemById(currentRow.rowKey));
                        peModel.addItem(newItem);
                            
                        return newItem;
                    }
                    
                    function removeItem(itemId) {
                        const item = peModel.getItemById(itemId);
                        peModel.removeItem(item);
                        deletedPE.push(item);
                    }
                    
                    function updateEditedItem(currentRow) {
                        peModel.updateItemName(currentRow.data.id, currentRow.data.name);
                    }
                    
                    peTable = new EditableTable(peModel,
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
                            itemCreator: createItem,
                            itemRemover: removeItem,
                            deleteValidator: () => true
                        }
                    );
                    
                    self.peObservableTable(peTable);
                    peTable.addEditListener(updateEditedItem);
                };
                
                typesPromise.then(() => updateTypesTable(peTypesDataProvider));
                
                pePromise.then(() => updatePETable(peDataProvider));
        
                Promise.all([typesPromise, pePromise])
                    .then(
                        () => ko.computed(() => peTable.setNewEnabled(peTypesTable.currentRow()))
                    );
            }

            return new PEViewModel();
        }
);