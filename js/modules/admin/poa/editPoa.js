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
    'ojs/ojtable',
    'ojs/ojradioset',
    'ojs/ojinputnumber',
    'ojs/ojdatetimepicker'
],
function($, ko, AdminItems, PoaModel, PoaDataParser, GeneralViewModel, DataProvider, EditableTable, FormActions)
{   
        function PoaEditViewModel() {
	    var self = this;
            self.title = AdminItems["editPoa"]["label"];
            
            self.formActions = new FormActions();
            
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
            
            //TYPE
            self.typeLabel = GeneralViewModel.nls("admin.poa.edit.main.label");
            self.proceso = GeneralViewModel.nls("admin.poa.edit.main.proceso");
            self.proyecto = GeneralViewModel.nls("admin.poa.edit.main.proyecto");
            self.typeValue = ko.observable(self.proceso);
            
            //SECCIÓN GENERAL 
            self.titleGeneral = GeneralViewModel.nls("admin.poa.edit.general.title");
            
            //ALCANCE RADIO BUTTON
            self.scopeLabel = GeneralViewModel.nls("admin.poa.edit.general.scope.label");
            self.anual = GeneralViewModel.nls("admin.poa.edit.general.scope.anual");
            self.multiAnual = GeneralViewModel.nls("admin.poa.edit.general.scope.multiAnual");
            self.scopeValue = ko.observable(self.anual);
            
            //DENOMINACIÓN DEL PROCESO
            self.nameLabel = GeneralViewModel.nls("admin.poa.edit.general.name.label");
            self.namePlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.name.placeHolder");
            self.nameValue = ko.observable("");
            
            //OBJETIVO DEL PROCESO
            self.objectiveLabel = GeneralViewModel.nls("admin.poa.edit.general.objective.label");
            self.objectivePlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.objective.placeHolder");
            self.objectiveValue = ko.observable("");
            
            //CLASE
            self.classLabel = GeneralViewModel.nls("admin.poa.edit.general.class.label");
            self.class1 = GeneralViewModel.nls("admin.poa.edit.general.class.option1");
            self.class2 = GeneralViewModel.nls("admin.poa.edit.general.class.option2");
            self.classOptions = ko.observableArray([
                {value: self.class1, label: self.class1}, 
                {value: self.class2, label: self.class2}
            ]);
            self.classValue = ko.observable(self.class1);
            
            //PROBLEMÁTICA
            self.problematicLabel = GeneralViewModel.nls("admin.poa.edit.general.problematic.label");
            self.problematicPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.problematic.placeHolder");
            self.problematicValue = ko.observable("");
            
            //AÑO
            self.yearLabel = GeneralViewModel.nls("admin.poa.edit.general.año.label");
            self.yearConverter = GeneralViewModel.converters.yearDecimal;
            self.yearValue = ko.observable(2017);
            
            //INICIO
            self.startLabel = GeneralViewModel.nls("admin.poa.edit.general.inicio.label");
            self.startConverter = GeneralViewModel.converters.date;
            self.startValue = ko.observable("");
            
            //TERMINO
            self.finishedLabel = GeneralViewModel.nls("admin.poa.edit.general.termino.label");
            self.finishedConverter = GeneralViewModel.converters.date;
            self.finishedValue = ko.observable("");
            
            //CALIFICACIÓN
            self.qualificationLabel = GeneralViewModel.nls("admin.poa.edit.general.qualification.label");
            self.qualificationConverter = GeneralViewModel.converters.percent;
            self.redLabel = GeneralViewModel.nls("admin.poa.edit.general.qualification.red");
            self.redValue = ko.observable(0.35);
            self.orangeLabel = GeneralViewModel.nls("admin.poa.edit.general.qualification.orange");
            self.orangeValue = ko.observable(0.60);
            self.yellowLabel = GeneralViewModel.nls("admin.poa.edit.general.qualification.yellow");
            self.yellowValue = ko.observable(0.80);
            self.greenLabel = GeneralViewModel.nls("admin.poa.edit.general.qualification.green");
            self.greenValue = ko.observable(0.100);
            
            //SECCIÓN ALINEACIÓN
            self.alignmentTitle = GeneralViewModel.nls("admin.poa.edit.alineacion.title");
            self.alignmentLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.label");
            
            //EJES
            self.axesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.axes.label");
            self.axes1 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.axes.option1");
            self.axes2 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.axes.option2");
            self.axesOptions = ko.observableArray([
                {value: self.axes1, label: self.axes1}, 
                {value: self.axes2, label: self.axes2}
            ]);
            self.axesValue = ko.observable(self.axes1);
            
            //TEMAS
            self.themesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.themes.label");
            self.themes1 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.themes.option1");
            self.themes2 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.themes.option2");
            self.themesOptions = ko.observableArray([
                {value: self.themes1, label: self.themes1}, 
                {value: self.themes2, label: self.themes2}
            ]);
            self.themesValue = ko.observable(self.themes1);
            
            //OBJETIVOS
            self.objectivesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.objectives.label");
            self.objectives1 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.objectives.option1");
            self.objectives2 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.objectives.option2");
            self.objectivesOptions = ko.observableArray([
                {value: self.objectives1, label: self.objectives1}, 
                {value: self.objectives2, label: self.objectives2}
            ]);
            self.objectivesValue = ko.observable(self.objectives1);
            
            //INDICADORES
            self.indicatorsLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.indicators.label");
            self.indicators1 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.indicators.option1");
            self.indicators2 = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.indicators.option2");
            self.indicatorsOptions = ko.observableArray([
                {value: self.indicators1, label: self.indicators1}, 
                {value: self.indicators2, label: self.indicators2}
            ]);
            self.indicatorsValue = ko.observable(self.indicators1);
                        
            // TABLA INDICADORES ALINEADOS
            self.columns = [
                {
                    headerText: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.headers.name"),
                    headerStyle: 'min-width: 50%; max-width: 50em; width: 85%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 50%; max-width: 50em; width: 85%;',
                    className: 'oj-helper-text-align-start',
                    sortProperty: 'name'
                },
                {
                    headerText: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.headers.actions"),
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
                
                var alignedIndicatorsDataProvider =
                        new DataProvider(
                        "data/poa-edit-types.json",
//                            RESTConfig.admin.pe.types.path,
                            PoaDataParser);
                                        
                var alignedIndicatorsPromise = alignedIndicatorsDataProvider.fetchData();
                
                self.observableAlignedIndicatorsTable = ko.observable();
                
                Promise.all([alignedIndicatorsPromise]).then(
                        function () {
                            var alignedIndicatorsModel = new PoaModel(alignedIndicatorsDataProvider);
                            alignedIndicatorsModel.setTypes(alignedIndicatorsDataProvider.getDataArray());
                            
                            var alignedIndicatorsArray = alignedIndicatorsModel.getTypes();

                    function updateEditedItem(currentRow) {
                        alignedIndicatorsModel.updateItemName(currentRow.data.id, currentRow.data.name);
                    }

                    self.alignedIndicatorsTable = new EditableTable(alignedIndicatorsArray, alignedIndicatorsModel, {
                        id: "alignedIndicators-table",
                        title: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.title"),
                        tableSummary: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.tableSummary"),
                        tableAria: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.tableAria"),
                        columns: self.columns,
                        newErrorText: GeneralViewModel.nls("aadmin.poa.edit.alineacion.tableAlignedIndicators.newErrorText"),
                        deleteErrorText: GeneralViewModel.nls("admin.poa.edit.alineacion.tableAlignedIndicators.deleteErrorText"),
                        actions: ["delete", "clone", "edit"]
                    
                    });

                    self.enableAlignedIndicatorsNew = ko.computed(function () {
                        self.alignedIndicatorsTable.setNewEnabled(true);
                    });

                    self.alignedIndicatorsTable.addEditListener(updateEditedItem);

                    self.observableAlignedIndicatorsTable(self.alignedIndicatorsTable);

                    clickOkHandlerObservable(function () {
                        $("#" + self.resetDialogId).ojDialog("close");

                        self.alignedIndicatorsTable.resetData();
                    });

                    // Add save listener
                    self.formActions.addSaveListener(function () {
    
                });
            });
            
        }   
        
    return new PoaEditViewModel();
 
});  





