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
                PEDataParser, PETypesModel, PEModel, PEType, PeTypesParser,
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
                
                const peTypesDataProvider =
                        new DataProvider(
//                        "data/pe-types.json",
                            RESTConfig.admin.pe.types.path,
                            PeTypesParser);
                
                const typesPromise = peTypesDataProvider.fetchData();
                
                const peDataProvider =
                        new DataProvider(
                        "data/pe-items.json",
//                            RESTConfig.admin.pe.types.path,
                            PEDataParser);
                                        
                const pePromise = peDataProvider.fetchData();
                
                self.peTypesObservableTable = ko.observable();
                self.peObservableTable = ko.observable();
                
                let peTypesModel;
                let deletedTypes;
                let peTypesTable;
                let peTable;
                
                Promise.all([typesPromise, pePromise]).then(
                    () => {
                        clickOkHandlerObservable(
                            () => {
                                $("#" + self.resetDialogId).ojDialog("close");
                                
                                peTypesDataProvider.fetchData()
                                    .then(data => updateTypesTable(data));
                            
                                peDataProvider.fetchData()
                                    .then(data => updatePETable(data));
                            }
                        );

                        self.formActions.addSaveListener(
                            () => {
                                const typesErrors = [];
                                const types = peTypesModel.getData();
                                const typesErrorFunction = (j, t, m) => {
                                    typesErrors.push(m);
                                    self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success") + m);
                                    saveDialogClass = "save-dialog-error";
                                };
                                
                                const typesPromises = [];
                                self.saveMessage(GeneralViewModel.nls("admin.pe.saveDialog.success"));
                                saveDialogClass = "save-dialog-success";

                                let typesPath = RESTConfig.admin.pe.types.path;

                                typesPromises.push(AjaxUtils.ajax(typesPath, 'POST', types, null, typesErrorFunction));
                                typesPromises.push(AjaxUtils.ajax(typesPath, 'DELETE', deletedTypes, null, typesErrorFunction)); 

                                Promise.all(typesPromises)
                                    .then(() => peTypesDataProvider.fetchData())
                                    .then(data => updateTypesTable(data))
                                    .then(
                                        () => {
                                            if (typesErrors.length > 0) {
                                                console.log('Failed when saving PE types: %O', typesErrors);
                                            }
                                        }
                                    )
                                    .then(() => self.showDialog())
                                    .catch(err => console.log('Failed when saving PE types: %O', err));
                            
                            }
                        );

                        self.showDialog = function() {
                            var saveDialog = $("#" + self.saveDialogId);
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
                    const peModel = new PEModel(pe);
                    const deletedIds = [];

                    function removeItem(itemId) {
                        const item = peModel.getItemById(itemId);
                        peModel.removeItem(item);
                        deletedIds.push(item.id);
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
                            itemRemover: removeItem
                        }
                    );
            
                    self.peObservableTable(peTable);
                };
                
                typesPromise.then(
                    types => {
                        updateTypesTable(types);
                    }
                );
                
                pePromise.then(
                    pe => {
                        updatePETable(pe);
                    }
                );
            }

            return new PEViewModel();
        }
);