/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([
    'ojs/ojcore',
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
    'ojs/ojdatetimepicker',
    'ojs/ojtable',
    'ojs/ojchart',
    'ojs/ojdatagrid',
    'ojs/ojarraydatagriddatasource'
],
function(oj, $, ko, AdminItems, PoaModel, PoaDataParser, GeneralViewModel, DataProvider, EditableTable, FormActions)
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
            self.class1 = "Programa educativo";
            self.class2 = "Proceso de gestión";
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
            self.greenValue = ko.observable(1.00);
            
            //SECCIÓN ALINEACIÓN
            self.alignmentTitle = GeneralViewModel.nls("admin.poa.edit.alineacion.title");
            self.alignmentLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.label");
            
            //EJES
            self.axesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.axes");
            self.axes1 = "Eje 1";
            self.axes2 = "Eje 2";
            self.axesOptions = ko.observableArray([
                {value: self.axes1, label: self.axes1}, 
                {value: self.axes2, label: self.axes2}
            ]);
            self.axesValue = ko.observable(self.axes1);
            
            //TEMAS
            self.themesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.themes");
            self.themes1 = "Tema 1";
            self.themes2 = "Tema 2";
            self.themesOptions = ko.observableArray([
                {value: self.themes1, label: self.themes1}, 
                {value: self.themes2, label: self.themes2}
            ]);
            self.themesValue = ko.observable(self.themes1);
            
            //OBJETIVOS
            self.objectivesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.objectives");
            self.objectives1 = "Objetivo 1";
            self.objectives2 = "Objetivo 2";
            self.objectivesOptions = ko.observableArray([
                {value: self.objectives1, label: self.objectives1}, 
                {value: self.objectives2, label: self.objectives2}
            ]);
            self.objectivesValue = ko.observable(self.objectives1);
            
            //INDICADORES
            self.indicatorsLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.indicators");
            self.indicators1 = "Indicador 1";
            self.indicators2 = "Indicador 2";
            self.indicatorsOptions = ko.observableArray([
                {value: self.indicators1, label: self.indicators1}, 
                {value: self.indicators2, label: self.indicators2}
            ]);
            self.indicatorsValue = ko.observable(self.indicators1);
            
            //BOTÓN
            self.buttonLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.button");
            self.buttonValue = ko.observable();
                        
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
            
            //SECCIÓN RESPONSABLE
            self.responsableTitle = GeneralViewModel.nls("admin.poa.edit.responsable.title");
            
            //SECRETARÍA
            self.secretaryLabel = GeneralViewModel.nls("admin.poa.edit.responsable.secretary");
            self.rectory = "Rectoria";
            self.administrative = "Administrativa";
            self.vinculacion = "Vinculación";
            self.secretaryOptions = ko.observableArray([
                {value: self.rectory, label: self.rectory}, 
                {value: self.administrative, label: self.administrative},
                {value: self.vinculacion, label : self.vinculacion}
            ]);
            self.secretaryValue = ko.observable(self.rectory);
            
            //DIRECCIÓN
            self.directionLabel = GeneralViewModel.nls("admin.poa.edit.responsable.direction");
            self.direction1 = "Dirección 1";
            self.direction2 = "Dirección 2";
            self.directionOptions = ko.observableArray([
                {value: self.direction1, label: self.direction1}, 
                {value: self.direction2, label: self.direction2}
            ]);
            self.directionValue = ko.observable(self.direction1);
            
            //JEFE DE DEPARTAMENTO
            self.bossLabel = GeneralViewModel.nls("admin.poa.edit.responsable.boss");
            self.boss1 = "Jefe de departamento";
            self.bossOptions = ko.observableArray([
                {value: self.boss1, label: self.boss1}
            ]);
            self.bossValue = ko.observable(self.boss1);
            
            //RESPONSABLE
            self.responsableLabel = GeneralViewModel.nls("admin.poa.edit.responsable.responsable");
            self.responsable1 = "Persona responsable de la información";
            self.responsableOptions = ko.observableArray([
                {value: self.responsable1, label: self.responsable1}
            ]);
            self.responsableValue = ko.observable(self.responsable1);
            
            //CARGO DEL RESPONSABLE
            self.positionLabel = GeneralViewModel.nls("admin.poa.edit.responsable.position.label");
            self.positionPlaceHolder = GeneralViewModel.nls("admin.poa.edit.responsable.position.placeHolder");
            self.positionValue = ko.observable("");
            
            //CORREO DEL RESPONSABLE
            self.emailLabel = GeneralViewModel.nls("admin.poa.edit.responsable.email.label");
            self.emailPlaceHolder = GeneralViewModel.nls("admin.poa.edit.responsable.email.placeHolder");
            self.emailValue = ko.observable("");
            
            //TELÉFONO DEL RESPONSABLE
            self.telLabel = GeneralViewModel.nls("admin.poa.edit.responsable.tel.label");
            self.telPlaceHolder = GeneralViewModel.nls("admin.poa.edit.responsable.tel.placeHolder");
            self.telValue = ko.observable("");
            
            //EXTENSIÓN DEL RESPONSABLE
            self.extensionLabel = GeneralViewModel.nls("admin.poa.edit.responsable.extension.label");
            self.extensionPlaceHolder = GeneralViewModel.nls("admin.poa.edit.responsable.extension.placeHolder");
            self.extensionValue = ko.observable("");
            
            //OBSERVACIONES
            self.observationsLabel = GeneralViewModel.nls("admin.poa.edit.responsable.observations");
            self.observationsValue = ko.observable("");
            
            //SECCIÓN COMPONENTES
            self.componentsTitle = GeneralViewModel.nls("admin.poa.edit.components.title");
            self.componentsLabel = GeneralViewModel.nls("admin.poa.edit.components.component");

            //NOMBRE
            self.componentName = GeneralViewModel.nls("admin.poa.edit.components.name");
            self.componentNameValue = ko.observable("");

            //DESCRIPCIÓN
            self.description = GeneralViewModel.nls("admin.poa.edit.components.description");
            self.descriptionValue = ko.observable("");

            //INDICADOR
            self.indicator = GeneralViewModel.nls("admin.poa.edit.components.indicator");
            self.indicatorValue = ko.observable("");

            //UNIDAD DE MEDIDA
            self.unit = GeneralViewModel.nls("admin.poa.edit.components.unit");
            self.unitValue = ko.observable("");

            //VALOR INICIAL
            self.initial = GeneralViewModel.nls("admin.poa.edit.components.initialValue");
            self.initialValue = ko.observable("");

            //META FINAL
            self.finishLine = GeneralViewModel.nls("admin.poa.edit.components.finishLine");
            self.finishLineValue = ko.observable("");

            //AVANCE GENERAL
            self.generalAdvance = GeneralViewModel.nls("admin.poa.edit.components.generalAdvance");
            self.converterGeneralAdvance = GeneralViewModel.converters.percent;
            self.generalAdvanceValue = ko.observable("");

            //RESPONSABLE
            self.responsableComponents = GeneralViewModel.nls("admin.poa.edit.components.responsable");
            self.responsableComponents1 = "Responsable";
            self.responsableComponentsOptions = ko.observableArray([
                {value: self.responsableComponents1, label: self.responsableComponents1}
            ]);
            self.responsableComponentsValue = ko.observable(self.responsableComponents1);

            //JUSTIFICACIÓN
            self.justification = GeneralViewModel.nls("admin.poa.edit.components.justification");
            self.justificationValue = ko.observable("");

            //AVANCES Y METAS
            self.advancesLabel = GeneralViewModel.nls("admin.poa.edit.components.advances");

            //TABLA AVANCES Y METAS
            self.columnsAdvances = [
                {"headerText": "Mes", "sortable": "disabled"},
                {"headerText": "Ene", "sortable": "disabled"},
                {"headerText": "Feb", "sortable": "disabled"},
                {"headerText": "Mar", "sortable": "disabled"},
                {"headerText": "Abr", "sortable": "disabled"},
                {"headerText": "May", "sortable": "disabled"},
                {"headerText": "Jun", "sortable": "disabled"},
                {"headerText": "Jul", "sortable": "disabled"},
                {"headerText": "Ago", "sortable": "disabled"},
                {"headerText": "Sep", "sortable": "disabled"},
                {"headerText": "Oct", "sortable": "disabled"},
                {"headerText": "Nov", "sortable": "disabled"},
                {"headerText": "Dic", "sortable": "disabled"}
            ];

            self.advanceRow = function (value, goalFinal) {
                    
                    var advanceValue = (value * 100) / goalFinal;
                    
                    var valueTotal = advanceValue.toFixed(2);
                    
                    return valueTotal;
                    
                };
                
                var advanceArray = [];
                
                var goalArray = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

                self.goalObservableArray = ko.observableArray(goalArray);
                
                var valueArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
               
                self.valueObservableArray = ko.observableArray(valueArray);
                
                for (var i = 0; i < valueArray.length; i++){

                    advanceArray[i] =  self.advanceRow(self.valueObservableArray()[i], self.goalObservableArray()[11]);

                };
                
                self.advanceObservableArray = ko.observableArray(advanceArray);
           
                var tableArray = [

                    /*[
                        'Meta', [self.goalObservableArray()[0], self.goalObservableArray()[1], self.goalObservableArray()[2],
                        self.goalObservableArray()[3], self.goalObservableArray()[4], self.goalObservableArray()[5], self.goalObservableArray()[6], 
                        self.goalObservableArray()[7], self.goalObservableArray()[8], self.goalObservableArray()[9], self.goalObservableArray()[10], 
                        self.goalObservableArray()[11]]
                    ],
                    [
                        'Valor', [self.valueObservableArray()[0], self.valueObservableArray()[1], self.valueObservableArray()[2],
                        self.valueObservableArray()[3], self.valueObservableArray()[4], self.valueObservableArray()[5], self.valueObservableArray()[6],
                        self.valueObservableArray()[7], self.valueObservableArray()[8], self.valueObservableArray()[9], self.valueObservableArray()[10],
                        self.valueObservableArray()[11]]
                    ],
                    [
                        '% Avance', [self.advanceObservableArray()[0], self.advanceObservableArray()[1], self.advanceObservableArray()[2], 
                        self.advanceObservableArray()[3], self.advanceObservableArray()[4], self.advanceObservableArray()[5], self.advanceObservableArray()[6],
                        self.advanceObservableArray()[7], self.advanceObservableArray()[8], self.advanceObservableArray()[9], self.advanceObservableArray()[10], 
                        self.advanceObservableArray()[11]]
                    ]*/
                    {Mes: 'Meta', Ene: self.goalObservableArray()[0], Feb: self.goalObservableArray()[1], Mar: self.goalObservableArray()[2], 
                        Abr: self.goalObservableArray()[3], May: self.goalObservableArray()[4], Jun: self.goalObservableArray()[5],
                        Jul: self.goalObservableArray()[6], Ago: self.goalObservableArray()[7], Sep: self.goalObservableArray()[8],
                        Oct: self.goalObservableArray()[9], Nov: self.goalObservableArray()[10], Dic: self.goalObservableArray()[11]},
                    {Mes: 'Valor', Ene: self.valueObservableArray()[0], Feb: self.valueObservableArray()[1], Mar: self.valueObservableArray()[2], 
                        Abr: self.valueObservableArray()[3], May: self.valueObservableArray()[4], Jun: self.valueObservableArray()[5],
                        Jul: self.valueObservableArray()[6], Ago: self.valueObservableArray()[7], Sep: self.valueObservableArray()[8],
                        Oct: self.valueObservableArray()[9], Nov: self.valueObservableArray()[10], Dic: self.valueObservableArray()[11]},
                    {Mes: '% Avance', Ene: self.advanceObservableArray()[0], Feb: self.advanceObservableArray()[1], Mar: self.advanceObservableArray()[2],
                        Abr: self.advanceObservableArray()[3], May: self.advanceObservableArray()[4], Jun: self.advanceObservableArray()[5],
                        Jul: self.advanceObservableArray()[6], Ago: self.advanceObservableArray()[7], Sep: self.advanceObservableArray()[8],
                        Oct: self.advanceObservableArray()[9], Nov: self.advanceObservableArray()[10], Dic: self.advanceObservableArray()[11]}
                
                ];

                self.tableObservableArray = ko.observableArray(tableArray);
                self.dataSource = new oj.ArrayTableDataSource(self.tableObservableArray);

                // ROW TEMPLATE TABLA
                self.getTableRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];
                    return mode === 'edit' ? 'EditRowTemplate' : 'RowTemplate';
                };

                //GRAFICA 
                var lineGroups = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

                self.lineGroupsValue = ko.observableArray(lineGroups);

                /**
                 * Update chart values.
                 * 
                 * @returns {void}
                 */
                self.updateChart = function () {

                    var lineSeries = [
                        {name: "Metas", items: []},
                        {name: "Avances", items: [], assignedToY2: 'on'}
                    ];

                    //self.goalObservableArray().forEach(function (goal) {

                        //if (index !== 1) {

                            lineSeries[0].items = [
                                
                                self.tableObservableArray()[0].Ene, // Goal value
                                self.tableObservableArray()[0].Feb, // Goal value
                                self.tableObservableArray()[0].Mar, // Goal value
                                self.tableObservableArray()[0].Abr, // Goal value
                                self.tableObservableArray()[0].May, // Goal value
                                self.tableObservableArray()[0].Jun, // Goal value
                                self.tableObservableArray()[0].Jul, // Goal value
                                self.tableObservableArray()[0].Ago, // Goal value
                                self.tableObservableArray()[0].Sep, // Goal value
                                self.tableObservableArray()[0].Oct, // Goal value
                                self.tableObservableArray()[0].Nov, // Goal value
                                self.tableObservableArray()[0].Dic  // Goal value*/
                            ];
                        //}
                    //});

                    //self.advanceObservableArray().forEach(function (advance) {

                        lineSeries[1].items = [
                            self.tableObservableArray()[2].Ene, // advance value
                            self.tableObservableArray()[2].Feb, // advance value
                            self.tableObservableArray()[2].Mar, // advance value
                            self.tableObservableArray()[2].Abr, // advance value
                            self.tableObservableArray()[2].May, // advance value
                            self.tableObservableArray()[2].Jun, // advance value
                            self.tableObservableArray()[2].Jul, // advance value
                            self.tableObservableArray()[2].Ago, // advance value
                            self.tableObservableArray()[2].Sep, // advance value
                            self.tableObservableArray()[2].Oct, // advance value
                            self.tableObservableArray()[2].Nov, // advance value
                            self.tableObservableArray()[2].Dic  // advance value
                        ];

                    //});

                    self.lineSeriesValue = ko.observableArray(lineSeries);

                };

            // Update chart values
            self.updateChart();

            /**
             * Before Row Edit End event.
             * 
             * @param {any} event
             * @param {any} event
             * @returns {void}
             */
            self.beforeRowEditEnd = function (event, ui) {
                // Update chart values
                self.updateChart();
            };

            // TABLA COMPONENTES
            self.columns = [
                {
                    headerText: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.headers.name"),
                    headerStyle: 'min-width: 50%; max-width: 50em; width: 85%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 50%; max-width: 50em; width: 85%;',
                    className: 'oj-helper-text-align-start',
                    sortProperty: 'name'
                },
                {
                    headerText: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.headers.actions"),
                    headerStyle: 'min-width: 2em; max-width: 5em; width: 15%',
                    headerClassName: 'oj-helper-text-align-start',
                    style: 'min-width: 2em; max-width: 5em; width: 15%; text-align:center;',
                    sortable: 'disabled'
                }
            ];

            var componentsDataProvider =
                new DataProvider(
                        "data/components-types.json",
//                            RESTConfig.admin.pe.types.path,
                        PoaDataParser);

            var componentsPromise = componentsDataProvider.fetchData();

            self.observableComponentsTable = ko.observable();

            Promise.all([componentsPromise]).then(
                function () {
                    var componentsModel = new PoaModel(componentsDataProvider);
                    componentsModel.setTypes(componentsDataProvider.getDataArray());

                    var componentsArray = componentsModel.getTypes();

                    function updateEditedItem(currentRow) {
                        componentsModel.updateItemName(currentRow.data.id, currentRow.data.name);
                    }

                    self.componentsTable = new EditableTable(componentsArray, componentsModel, {
                        id: "components-table",
                        title: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.title"),
                        tableSummary: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.tableSummary"),
                        tableAria: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.tableAria"),
                        columns: self.columns,
                        newErrorText: GeneralViewModel.nls("aadmin.poa.edit.components.tableComponents.newErrorText"),
                        deleteErrorText: GeneralViewModel.nls("admin.poa.edit.components.tableComponents.deleteErrorText"),
                        actions: ["delete", "clone", "edit"]

                    });

                    self.enableComponentsNew = ko.computed(function () {
                        self.componentsTable.setNewEnabled(true);
                    });

                    self.componentsTable.addEditListener(updateEditedItem);

                    self.observableComponentsTable(self.componentsTable);

                    clickOkHandlerObservable(function () {
                        $("#" + self.resetDialogId).ojDialog("close");

                        self.componentsTable.resetData();
                    });

                    // Add save listener
                    self.formActions.addSaveListener(function () {

                    });
                });

        }   
        
    return new PoaEditViewModel();
 
});  





