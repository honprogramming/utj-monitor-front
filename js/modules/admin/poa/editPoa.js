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
    'modules/admin/poa/model/StrategicItem',
    'ojs/ojknockout',
    'ojs/ojcollapsible',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource',
    'ojs/ojselectcombobox',
    'promise',
    'ojs/ojradioset',
    'ojs/ojinputnumber',
    'ojs/ojdatetimepicker',
    'ojs/ojchart'
],
        function (oj, $, ko, AdminItems, PoaModel, PoaDataParser, GeneralViewModel,
                DataProvider, EditableTable, FormActions, StrategicItem) {
            function PoaEditViewModel() {
                
                var self = this;
                self.title = AdminItems["editPoa"]["label"];
                
                self.formActions = new FormActions();

                self.formActions.addResetListener(
                        function () {
                            $("#" + self.resetDialogId).ojDialog("open");
                        }
                );

                var clickOkHandlerObservable = ko.observable();

                self.clickOkHandler = function () {
                    var handler = clickOkHandlerObservable();
                    handler();
                };

                self.clickCancelHandler = function () {
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

                //DENOMINACIÓN DEL PROCESO / PROYECTO
                self.nameProcessLabel = GeneralViewModel.nls("admin.poa.edit.general.name.labelProcess");
                self.nameProyectLabel = GeneralViewModel.nls("admin.poa.edit.general.name.labelProyect");
                self.namePlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.name.placeHolder");
                self.nameValue = ko.observable("");

                //OBJETIVO DEL PROCESO / PROYECTO
                self.objectiveLabel = GeneralViewModel.nls("admin.poa.edit.general.objective.label");
                self.objectiveProcessPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.objective.placeHolderProcess");
                self.objectiveProyectPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.objective.placeHolderProyect");
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
                
                //JUSTIFICACIÓN DEL PROYECTO
                self.justificationProyectLabel = GeneralViewModel.nls("admin.poa.edit.general.justification.label");
                self.justificationProyectPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.justification.placeHolder");
                self.justificationProyectValue = ko.observable("");
                
                //DESCRIPCIÓN DEL PROYECTO
                self.descriptionLabel = GeneralViewModel.nls("admin.poa.edit.general.description.label");
                self.descriptionPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.description.placeHolder");
                self.descriptionValue = ko.observable("");
                
                 //RESULTADOS ESPERADOS
                self.resultsLabel = GeneralViewModel.nls("admin.poa.edit.general.results.label");
                self.resultsPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.results.placeHolder");
                self.resultsValue = ko.observable("");

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
                
                //ORIGEN DE LOS RECURSOS
                self.originResourcesLabel = GeneralViewModel.nls("admin.poa.edit.general.originResources.label");
                self.originResourcesPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.originResources.placeHolder");
                self.originResourcesValue = ko.observable("");

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
                self.poaAxesOptions = ko.observableArray([]);
                self.poaAxesValue = ko.observable("");

                //TEMAS
                self.topicsLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.topics");
                self.poaTopicsOptions = ko.observableArray([]);
                self.poaTopicsValue = ko.observable("");

                //OBJETIVOS
                self.objectivesLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.objectives");
                self.poaObjectivesOptions = ko.observableArray([]);
                self.poaObjectivesValue = ko.observable("");

                //INDICADORES
                self.indicatorsLabel = GeneralViewModel.nls("admin.poa.edit.alineacion.alineacionPide.indicators");
                self.poaIndicatorsOptions = ko.observableArray([]);
                self.poaIndicatorsValue = ko.observable("");

                /**
                 * Axes change event.
                 * 
                 * Triggered after changing the Axes combobox.
                 * 
                 * @param {*} event 
                 * @param {*} data 
                 */
                self.poaAxesChange = function (event, data) {
                    // If the new value is not empty
                    if (data.value !== "") {
                        // IF the axes value has changed / the change option is triggered because the options has changed.
                        if (data.option === "options") {
                            // Set new objective options
                            self.poaTopicsOptions(self.getTopics(data.value[0].value));
                        } else {
                            // Set new objective options
                            self.poaTopicsOptions(self.getTopics(data.value));
                        }
                    }
                };

                /**
                 * Topics change event.
                 * 
                 * Triggered after changing the PE Topics combobox.
                 * 
                 * @param {*} event 
                 * @param {*} data 
                 */
                self.poaTopicsChange = function (event, data) {
                    // If the new value is not empty
                    if (data.value !== "") {
                        // IF the axes value has changed / the change option is triggered because the options has changed.
                        if (data.option === "options") {
                            // Set new objective options
                            self.poaObjectivesOptions(self.getObjectives(self.poaAxesValue(), data.value[0].value));
                        } else {
                            // Set new objective options
                            self.poaObjectivesOptions(self.getObjectives(self.poaAxesValue(), data.value));
                        }
                    }
                };

                /**
                 * Objectives change event.
                 * 
                 * Triggered after changing the PE Objectives combobox.
                 * 
                 * @param {*} event 
                 * @param {*} data 
                 */
                self.poaObjectivesChange = function (event, data) {
                    // If the new value is not empty
                    if (data.value !== "") {
                        // IF the topics value has changed / the change option is triggered because the options has changed.
                        if (data.option === "options") {
                            // Set new indicators options
                            self.poaIndicatorsOptions(self.getIndicators(self.poaAxesValue(), self.poaTopicsValue(), data.value[0].value));
                        } else {
                            // Set new indicators options
                            self.poaIndicatorsOptions(self.getIndicators(self.poaAxesValue(), self.poaTopicsValue(), data.value));
                        }
                    }
                };

                // Full strategic items
                self.strategicItems = [];

                // Filtered strategic items
                self.strategicArray = [];

                // Get strategic items data
                $.getJSON("data/admin-strategic-items.json")
                        .done(function (data) {
                            // Get all strategic items
                            self.strategicItems = data.map(function (element) {
                                return new StrategicItem(element.id, element.name, element.strategicType.name, element.children);
                            });

                            // Get axes
                            self.strategicArray = self.strategicItems.filter(function (element) {
                                return element.type === "axe";
                            });

                            self.strategicArray.forEach(function (axe) {
                                // Get topics
                                axe.children = axe.children.map(function (topic) {
                                    return self.strategicItems.filter(function (element) {
                                        return element.id === topic && element.type === "topic";
                                    })[0];
                                });

                                axe.children.forEach(function (topic) {
                                    // Get objectives
                                    topic.children = topic.children.map(function (objective) {
                                        return self.strategicItems.filter(function (element) {
                                            return element.id === objective && element.type === "objective";
                                        })[0];
                                    });

                                    // Filter undefined
                                    topic.children = topic.children.filter(function (element) {
                                        return typeof element !== "undefined";
                                    });

                                    topic.children.forEach(function (objective) {
                                        // Get indicators
                                        objective.children = objective.children.map(function (indicator) {
                                            return self.strategicItems.filter(function (element) {
                                                return element.id === indicator && element.type === "indicator";
                                            })[0];
                                        });

                                        // Filter undefined
                                        objective.children = objective.children.filter(function (element) {
                                            return typeof element !== "undefined";
                                        });
                                    });
                                });
                            });

                            // New Axes' combobox options
                            self.poaAxesOptions(self.getAxes());

                            // New Topics' combobox options
                            self.poaTopicsOptions(self.getTopics(self.strategicArray[0].name));

                            // New Objectives' combobox options
                            self.poaObjectivesOptions(self.getObjectives(self.strategicArray[0].name, self.strategicArray[0].children[0].name));

                            // New Indicators' combobox options
                            self.poaIndicatorsOptions(self.getIndicators(
                                    self.strategicArray[0].name, // First axe
                                    self.strategicArray[0].children[0].name, // First topic
                                    self.strategicArray[0].children[0].children[0].name // First objective
                                    ));
                        })
                        .fail(function (data) {
                            console.log("Mal", data);
                        });

                /**
                 * Get axes options.
                 * @returns {array}
                 */
                self.getAxes = function () {
                    // Get all axes.
                    let axes = self.strategicArray.map(function (axe) {
                        return {value: axe.name, label: axe.name};
                    });

                    return axes;
                };

                /**
                 * Get Topic array.
                 * @param {string} search
                 * @returns {array}
                 */
                self.getTopics = function (search) {
                    // In case the value comes in [] or {} format
                    search = typeof search === 'object' ? search[0] : search;

                    // Get first coincidence of the searched axe.
                    let searchAxe = self.strategicArray.filter(function (axe) {
                        return axe.name === search;
                    })[0];

                    // Get all topics from the searched axe.
                    let topics = searchAxe.children.map(function (topic) {
                        return {value: topic.name, label: topic.name};
                    });

                    return topics;
                };

                /**
                 * Get Objectives array.
                 * @param {any} searchAxe 
                 * @param {any} searchTopic 
                 */
                self.getObjectives = function (searchAxe, searchTopic) {
                    // In case the value comes in [] or {} format
                    searchAxe = typeof searchAxe === 'object' ? searchAxe[0] : searchAxe;
                    searchTopic = typeof searchTopic === 'object' ? searchTopic[0] : searchTopic;

                    // Get first coincidence of the searched axe.
                    let axeArray = self.strategicArray.filter(function (axe) {
                        return axe.name === searchAxe;
                    })[0];

                    // Get first coincidence of the searched topic.
                    let topicArray = axeArray.children.filter(function (topic) {
                        return topic.name === searchTopic;
                    })[0];

                    // Get all objectives from the searched topic.
                    let objectives = topicArray.children.map(function (topic) {
                        return {value: topic.name, label: topic.name};
                    });

                    return objectives;
                };

                /**
                 * Get Indicators array.
                 * @param {*} searchAxe 
                 * @param {*} searchTopic 
                 * @param {*} searchObjective 
                 */
                self.getIndicators = function (searchAxe, searchTopic, searchObjective) {
                    // In case the value comes in [] or {} format
                    searchAxe = typeof searchAxe === 'object' ? searchAxe[0] : searchAxe;
                    searchTopic = typeof searchTopic === 'object' ? searchTopic[0] : searchTopic;
                    searchObjective = typeof searchObjective === 'object' ? searchObjective[0] : searchObjective;

                    // Get first coincidence of the searched axe.
                    let axeArray = self.strategicArray.filter(function (axe) {
                        return axe.name === searchAxe;
                    })[0];

                    // Get first coincidence of the searched topic.
                    let topicArray = axeArray.children.filter(function (topic) {
                        return topic.name === searchTopic;
                    })[0];

                    // Get first coincidence of the searched objective.
                    let objectivesArray = topicArray.children.filter(function (objective) {
                        return objective.name === searchObjective;
                    })[0];

                    // Get all indicators from the searched objective.
                    let indicators = objectivesArray.children.map(function (indicator) {
                        return {value: indicator.name, label: indicator.name};
                    });

                    return indicators;
                };

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
                    {value: self.vinculacion, label: self.vinculacion}
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
                
                //SECCIÓN METAS Y AVANCES
                self.goalsAndProgressTitle = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.title");
                
                //NOMBRE DEL INDICADOR GENERAL DEL AVANCE
                self.indicatorNameLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.indicatorName.label");
                self.indicatorNamePlaceHolder = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.indicatorName.placeHolder");
                self.indicatorNameValue = ko.observable("");
                
                //RIESGO POTENCIAL
                self.potentialRiskLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.potentialRisk.label");
                self.potentialRiskPlaceHolder = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.potentialRisk.placeHolder");
                self.potentialRiskValue = ko.observable("");
                
                //ACCIONES IMPLEMENTADAS
                self.implementedActionsLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.implementedActions.label");
                self.implementedActionsPlaceHolder = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.implementedActions.placeHolder");
                self.implementedActionsValue = ko.observable("");
                
                //UNIDAD DE MEDIDA
                self.indicatorGoalsAndProgressLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.indicator");
                self.indicatorGoalsAndProgressValue = ko.observable("");
                
                //INDICADOR SECCIÓN METAS Y AVANCES
                self.unitOfMLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.unitOfM");
                self.unitOfMValue = ko.observable("");
                
                //% AVANCE GENERAL
                self.perProgressLabel = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.perProgress.label");
                self.perProgressPlaceHolder = GeneralViewModel.nls("admin.poa.edit.goalsAndProgress.perProgress.placeHolder");
                self.perProgressValue = ko.observable("");
                
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
                self.finalGoal = GeneralViewModel.nls("admin.poa.edit.components.finishLine");
                self.finalGoalValue = ko.observable(24);

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
                self.progressLabel = GeneralViewModel.nls("admin.poa.edit.components.progressAndGoals");

                //TABLA AVANCES Y METAS
                // Month labels
                let months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

                // Goals and progress table columns
                self.comGoalsColumns = [{
                    "headerText": 'Mes',
                    "headerStyle": 'max-width: 7.69%; width: 7.69%',
                    "style": 'min-width: 7.69%; width: 7.69%;',
                    "sortable": 'disabled'
                }];

                // For each month label
                months.forEach(function (month) {
                    // Add new column to goals and progress table
                    self.comGoalsColumns.push({
                        "headerText": month,
                        "headerStyle": 'max-width: 7.69%; width: 7.69%',
                        "style": 'min-width: 7.69%; width: 7.69%;',
                        "sortable": "disabled"
                    });
                });

                // Goals observable array
                self.comGoalsObservableArray = ko.observableArray([
                    {
                        "Mes": "Meta",
                        "Ene": ko.observable(2), "Feb": ko.observable(4), "Mar": ko.observable(6),
                        "Abr": ko.observable(8), "May": ko.observable(10), "Jun": ko.observable(12),
                        "Jul": ko.observable(14), "Ago": ko.observable(16), "Sep": ko.observable(18),
                        "Oct": ko.observable(20), "Nov": ko.observable(22), "Dic": ko.observable(24)
                    },
                    {
                        "Mes": "Valor",
                        "Ene": ko.observable(1), "Feb": ko.observable(3), "Mar": ko.observable(5),
                        "Abr": ko.observable(7), "May": ko.observable(9), "Jun": ko.observable(11),
                        "Jul": ko.observable(13), "Ago": ko.observable(15), "Sep": ko.observable(17),
                        "Oct": ko.observable(19), "Nov": ko.observable(21), "Dic": ko.observable(23)
                    },
                    {
                        "Mes": "% Avance",
                        "Ene": ko.observable(50.00), "Feb": ko.observable(75.00), "Mar": ko.observable(83.33),
                        "Abr": ko.observable(87.50), "May": ko.observable(90.00), "Jun": ko.observable(91.66),
                        "Jul": ko.observable(92.85), "Ago": ko.observable(93.75), "Sep": ko.observable(94.44),
                        "Oct": ko.observable(95.00), "Nov": ko.observable(95.45), "Dic": ko.observable(95.83)
                    }
                ]);

                /**
                 * Components Goals and Progress option change event.
                 * 
                 * Triggered after changing an input value in Goals and
                 * Progress table.
                 * 
                 * @param {*} event 
                 * @param {*} ui 
                 */
                self.comGoalsOptionChange = function (event, ui) {
                    // If the value has changed and is not empty
                    if (ui.value !== "" && ui.option === "value") {
                        // Goals and values array
                        let goals = [];
                        let values = [];
                        let count = 0;

                        // For each row in goals and progress table
                        self.comGoalsObservableArray().forEach(function (value, index) {
                            // If the current row is Goals
                            if (index === 0) {
                                // For each value in Goals row
                                for (let v in value) {
                                    // Skip row name
                                    if (value[v] !== "Meta") {
                                        // Push goal in goals array
                                        goals.push(value[v]());
                                    }
                                }
                                // If the current row is Values
                            } else if (index === 1) {
                                // For each value in Values row
                                for (let v in value) {
                                    // Skip row name
                                    if (value[v] !== "Valor") {
                                        // Push value in values array
                                        values.push(value[v]());
                                    }
                                }
                                // If the current row is Progress
                            } else if (index === 2) {
                                // For each value in Progress row
                                for (let v in value) {
                                    // Skip row name
                                    if (value[v] !== "% Avance") {
                                        // Calculate the new value based in the column goals and values.
                                        value[v](self.calculateProgress(goals[count], values[count]));
                                        count++;
                                    }
                                }
                            }
                        });

                        // Update chart values
                        self.comUpdateChart();
                    }
                };

                /**
                 * Calculate Progress value.
                 * 
                 * This function calculates the progress based in the
                 * expected goal and actual value.
                 * 
                 * @param {*} goal 
                 * @param {*} value 
                 */
                self.calculateProgress = function (goal, value) {
                    let progress = parseFloat(value) / parseFloat(goal) * 100;
                    return progress.toFixed(1);
                };

                // Table data source
                self.comGoalsDataSource = ko.observable(new oj.ArrayTableDataSource(self.comGoalsObservableArray, { idAttribute: "Mes" }));

                // Table row template
                self.comGoalsRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];
                    return mode === 'edit' ? 'comGoalsEditRowTemplate' : 'comGoalsRowTemplate';
                };

                // Goals and progress chart
                self.comChartGroupsValue = ko.observableArray(months);
                self.comChartSeriesValue = ko.observableArray([]);
                self.comChartYAxis = ko.observable();
                self.comChartY2Axis = {title: "Avances"};

                // Update reference line (final goal line) in goals and progress chart
                ko.computed(function () {
                    self.comChartYAxis({
                        title: "Meta",
                        referenceObjects: [{
                            text: "Meta final",
                            type: "line",
                            value: self.finalGoalValue(),
                            color: '#A0CEEC',
                            displayInLegend: 'on',
                            lineWidth: 3,
                            location: 'back',
                            lineStyle: 'dashed',
                            shortDesc: 'Meta final del componente'
                        }]
                    });
                });

                /**
                 * Update chart values.
                 */
                self.comUpdateChart = function () {
                    // New chart series
                    var chartSeries = [
                        { name: 'Metas', items: [] },
                        { name: 'Avances', items: [], assignedToY2: 'on' }
                    ];

                    // For each goal in Goals' table
                    self.comGoalsObservableArray().forEach(function (value, index) {
                        if (index === 0) {
                            // For each value in Goals row
                            for (let v in value) {
                                // Skip row name
                                if (value[v] !== "Meta") {
                                    // Add new item to Chart series
                                    chartSeries[0].items.push(value[v]());
                                }
                            }
                        } else if (index === 2) {
                            // For each value in Values row
                            for (let v in value) {
                                // Skip row name
                                if (value[v] !== "% Avance") {
                                    // Add new item to Chart series
                                    chartSeries[1].items.push(value[v]());
                                }
                            }
                        }
                    });

                    // Set chart values
                    self.comChartSeriesValue(chartSeries);
                };
                
                self.comUpdateChart();
                
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

        }
);