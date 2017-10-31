/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([
    'jquery', 
    'knockout', 
    'modules/admin/view-model/AdminItems',
    'modules/admin/poa/model/PoaModel',
    'modules/admin/poa/model/PoaDataParser',
    'view-models/GeneralViewModel',
    'data/DataProvider',
    'templates/EditableTable',
    'templates/FormActions',
    'ojs/ojknockout', 
    'ojs/ojselectcombobox',
    'ojs/ojcollapsible',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource',
    'ojs/ojselectcombobox',
    'promise',
    'ojs/ojtable'
],
function($, ko, AdminItems, PoaModel, PoaDataParser, GeneralViewModel, DataProvider, EditableTable, FormActions)
{   
        function PoaViewModel() {
	    var self = this;
            self.title = AdminItems["poa"]["label"];
            //Tipo
            self.process1 = GeneralViewModel.nls("admin.poa.typesPoa.option1");
            self.process2 = GeneralViewModel.nls("admin.poa.typesPoa.option2");
            self.process3 = GeneralViewModel.nls("admin.poa.typesPoa.option3");
            self.processOptions = ko.observableArray([
                {value: self.process1, label: self.process1}, 
                {value: self.process2, label: self.process2},
                {value: self.process3, label: self.process3}
            ]);
            self.processValue = ko.observable(self.process1);
            
            //Periodicidad
            self.anual = GeneralViewModel.nls("admin.poa.periodicityPoa.option1");
            self.mensual = GeneralViewModel.nls("admin.poa.periodicityPoa.option2");
            self.semanal = GeneralViewModel.nls("admin.poa.periodicityPoa.option3");
            self.periodicityOptions = ko.observableArray([
                {value: self.anual, label: self.anual}, 
                {value: self.mensual, label: self.mensual},
                {value: self.semanal, label: self.semanal}
            ]);
            self.periodicityValue = ko.observable(self.anual);
            
            //Año
            self.year1 = GeneralViewModel.nls("admin.poa.yearPoa.option1");
            self.year2 = GeneralViewModel.nls("admin.poa.yearPoa.option2");
            self.year3 = GeneralViewModel.nls("admin.poa.yearPoa.option3");
            self.yearOptions = ko.observableArray([
                {value: self.year1, label: self.year1}, 
                {value: self.year2, label: self.year2},
                {value: self.year3, label: self.year3}
            ]);
            self.yearValue = ko.observable(self.year1);
            
            //Status
            self.status1 = GeneralViewModel.nls("admin.poa.statusPoa.option1");
            self.status2 = GeneralViewModel.nls("admin.poa.statusPoa.option2");
            self.status3 = GeneralViewModel.nls("admin.poa.statusPoa.option3");
            self.statusOptions = ko.observableArray([
                {value: self.status1, label: self.status1}, 
                {value: self.status2, label: self.status2},
                {value: self.status3, label: self.status3}
            ]);
            self.statusValue = ko.observable(self.status1);
            
            //FILTROPIDE
            self.filtroPide = GeneralViewModel.nls("admin.poa.filtros.filtroPide.title");
            self.axesLabel = GeneralViewModel.nls("admin.poa.filtros.filtroPide.axes");
            self.thmesLabel = GeneralViewModel.nls("admin.poa.filtros.filtroPide.thmes");
            self.objectivesLabel = GeneralViewModel.nls("admin.poa.filtros.filtroPide.objectives");
            self.indicatorLabel = GeneralViewModel.nls("admin.poa.filtros.filtroPide.indicator");
            
            //Ejes
            self.eje1 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.axesPide.option1");
            self.eje2 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.axesPide.option2");
            self.eje3 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.axesPide.option3");
            self.axesOptions = ko.observableArray([
                {value: self.eje1, label: self.eje1}, 
                {value: self.eje2, label: self.eje2},
                {value: self.eje3, label: self.eje3}
            ]);
            self.axesValue = ko.observable(self.eje1);
            
            //Temas
            self.tema1 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.thmesPide.option1");
            self.tema2 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.thmesPide.option2");
            self.tema3 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.thmesPide.option3");
            self.thmesOptions = ko.observableArray([
                {value: self.tema1, label: self.tema1}, 
                {value: self.tema2, label: self.tema2},
                {value: self.tema3, label: self.tema3}
            ]);
            self.thmesValue = ko.observable(self.tema1);
            
            //Objetivos
            self.objetivo1 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.objectivesPide.option1");
            self.objetivo2 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.objectivesPide.option2");
            self.objetivo3 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.objectivesPide.option3");
            self.objectivesOptions = ko.observableArray([
                {value: self.objetivo1, label: self.objetivo1}, 
                {value: self.objetivo2, label: self.objetivo2},
                {value: self.objetivo3, label: self.objetivo3}
            ]);
            self.objectivesValue = ko.observable(self.objetivo1);
            
            //Indicador
            self.indicador1 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.indicatorPide.option1");
            self.indicador2 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.indicatorPide.option2");
            self.indicador3 = GeneralViewModel.nls("admin.poa.filtros.filtroPide.indicatorPide.option3");
            self.indicatorOptions = ko.observableArray([
                {value: self.indicador1, label: self.indicador1}, 
                {value: self.indicador2, label: self.indicador2},
                {value: self.indicador3, label: self.indicador3}
            ]);
            self.indicatorValue = ko.observable(self.indicador1);
            
            //FILTRO RESPONSABLE
            self.filtroResponsable = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.title");
            self.secretaryLabel = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.secretary");
            self.direccionLabel = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.direccion");
            self.responsableLabel = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.responsable");
            
            //Secretaría
            self.secretary1 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.secretaryResp.option1");
            self.secretary2 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.secretaryResp.option2");
            self.secretary3 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.secretaryResp.option3");
            self.secretaryOptions = ko.observableArray([
                {value: self.secretary1, label: self.secretary1}, 
                {value: self.secretary2, label: self.secretary2},
                {value: self.secretary3, label: self.secretary3}
            ]);
            self.secretaryValue = ko.observable(self.secretary1);
            
            //Dirección
            self.direccion1 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.direccionResp.option1");
            self.direccion2 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.direccionResp.option2");
            self.direccion3 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.direccionResp.option3");
            self.direccionOptions = ko.observableArray([
                {value: self.direccion1, label: self.direccion1}, 
                {value: self.direccion2, label: self.direccion2},
                {value: self.direccion3, label: self.direccion3}
            ]);
            self.direccionValue = ko.observable(self.direccion1);
            
            //Responsable
            self.responsable1 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.responsableResp.option1");
            self.responsable2 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.responsableResp.option2");
            self.responsable3 = GeneralViewModel.nls("admin.poa.filtros.filtroResponsable.responsableResp.option3");
            self.responsableOptions = ko.observableArray([
                {value: self.responsable1, label: self.responsable1}, 
                {value: self.responsable2, label: self.responsable2},
                {value: self.responsable3, label: self.responsable3}
            ]);
            self.responsableValue = ko.observable(self.responsable1);
            
                // Table columns
            self.columns = [
                /*{
                    headerText: GeneralViewModel.nls("admin.poa.tablePoa.headers.status"),
                    headerStyle: 'min-width: 2em; max-width: 5em; width: 15%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 2em; max-width: 5em; width: 15%; text-align:center;',
                    sortable: 'disabled'
                },*/
                {
                    headerText: GeneralViewModel.nls("admin.poa.tablePoa.headers.name"),
                    headerStyle: 'min-width: 50%; max-width: 50em; width: 85%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 50%; max-width: 50em; width: 85%;',
                    className: 'oj-helper-text-align-start',
                    sortProperty: 'name'
                },
                {
                    headerText: GeneralViewModel.nls("admin.poa.tablePoa.headers.actions"),
                    headerStyle: 'min-width: 2em; max-width: 5em; width: 15%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 2em; max-width: 5em; width: 15%; text-align:center;',
                    sortable: 'disabled'
                }
            ];

            // Form actions
            self.formActions = new FormActions();

            // Reset listener
            self.formActions.addResetListener(function () {
                $("#" + self.resetDialogId).ojDialog("open");
            });

            // Click ok handler
            var clickOkHandlerObservable = ko.observable();
            
            self.clickOkHandler = function () {
                var handler = clickOkHandlerObservable();
                handler();
            };

            // Click cancer handler
            self.clickCancelHandler = function () {
                $("#" + self.resetDialogId).ojDialog("close");
            };
                
                var poaDataProvider =
                        new DataProvider(
                        "data/poa-types.json",
//                            RESTConfig.admin.pe.types.path,
                            PoaDataParser);
                                        
                var poaPromise = poaDataProvider.fetchData();
                
                self.observablePoaTable = ko.observable();
                
                Promise.all([poaPromise]).then(
                        function () {
                            var poaModel = new PoaModel(poaDataProvider);
                            poaModel.setTypes(poaDataProvider.getDataArray());
                            
                            var poaArray = poaModel.getTypes();

                    function updateEditedItem(currentRow) {
                        poaModel.updateItemName(currentRow.data.id, currentRow.data.name);
                    }

                    self.poaTable = new EditableTable(poaArray, poaModel, {
                        id: "poa-table",
                        title: GeneralViewModel.nls("admin.poa.tablePoa.title"),
                        tableSummary: GeneralViewModel.nls("admin.poa.tablePoa.tableSummary"),
                        tableAria: GeneralViewModel.nls("admin.poa.tablePoa.tableAria"),
                        columns: self.columns,
                        newErrorText: GeneralViewModel.nls("admin.poa.tablePoa.newErrorText"),
                        deleteErrorText: GeneralViewModel.nls("admin.poa.tablePoa.deleteErrorText"),
                        actions: ["delete", "clone", "read", "edit"]
                    
                    });

                    self.enablePoaNew = ko.computed(function () {
                        self.poaTable.setNewEnabled(true);
                    });

                    self.poaTable.addEditListener(updateEditedItem);

                    self.observablePoaTable(self.poaTable);

                    clickOkHandlerObservable(function () {
                        $("#" + self.resetDialogId).ojDialog("close");

                        self.poaTable.resetData();
                    });

                    // Add save listener
                    self.formActions.addSaveListener(function () {
    
                });
            });
        }
        
    return new PoaViewModel();
 
});  



