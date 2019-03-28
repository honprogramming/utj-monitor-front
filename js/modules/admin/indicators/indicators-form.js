define(
        [
            'ojs/ojcore',
            'jquery',
            'knockout',
            'view-models/GeneralViewModel',
            'data/RESTConfig',
            'data/AjaxUtils',
            'data/DataProvider',
            'modules/admin/strategic/model/StrategicModel',
            'modules/admin/strategic/model/StrategicTypes',
            'modules/admin/strategic/model/StrategicDataParser',
            'modules/admin/indicators/model/IndicatorDataParser',
            'modules/admin/pe/model/PEDataParser',
            'modules/admin/indicators/model/FullIndicator',
            'modules/admin/indicators/model/ComponentItem',
            'ojs/ojknockout',
            'ojs/ojradioset',
            'ojs/ojswitch',
            'ojs/ojcollapsible',
            'ojs/ojinputtext',
            'ojs/ojselectcombobox',
            'ojs/ojdatetimepicker',
            'ojs/ojinputnumber',
            'ojs/ojchart',
            'ojs/ojtable',
            'ojs/ojarraytabledatasource',
            'promise'
        ],
        function (oj, $, ko, GeneralViewModel, RESTConfig, AjaxUtils, DataProvider,
                StrategicModel, StrategicTypes,
                StrategicDataParser, IndicatorDataParser, PEDataParser,
                FullIndicator,
                ComponentItem) {
            /**
             * Indicators Form ViewModel.
             */
            function FormViewModel(params) {
                var self = this;

                // Date converter
                var dateOptions = {formatStyle: 'date', pattern: 'dd/MM/yyyy'};
                self.dateConverter = oj.Validation.converterFactory("datetime").createConverter(dateOptions);

                // Sections enabled
                self.generalEnable = ko.observable(false);
                self.responsibleEnable = ko.observable(false);
                self.metadataEnable = ko.observable(false);
                self.progressTableId = 'progress-table';

                /*
                 * Main section.
                 */
                // Type option
                self.typeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.type");
                self.typeValue = ko.observable('1');

                /**
                 * Type change event.
                 *
                 * This function is triggered after selecting an option in
                 * type's radioset.
                 *
                 * @param {*} event
                 * @param {*} data
                 */
                self.typeChange = function (event, data) {
                    if (data.option === 'value') {
                        switch (data.value) {
                            case "1":
                                self.generalEnable(false);
                                self.responsibleEnable(false);
                                self.metadataEnable(false);
                                setGradesToDefaultValues();
                                break;

                            case "2":
                                self.generalEnable(false);
                                self.responsibleEnable(true);
                                self.metadataEnable(false);
                                break;

                            case "3":
                                self.generalEnable(true);
                                self.responsibleEnable(true);
                                self.metadataEnable(true);
                                break;
                        }
                    }
                };

                // Active/Inactive option
                self.activeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.active");
                self.activeValue = ko.observable(true);
                self.switchToList = function () {
                    params.switchFunction();
                };

                self.saveMessage = ko.observable();
                self.saveDialogId = "indicator-form-save-dialog";
                self.saveDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.save.title");
                self.resetMessage = ko.observable();
                self.resetDialogId = "indicator-form-reset-dialog";
                self.resetDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.title");
                let saveDialogClass;
                
                self.alignmentSectionExpanded = ko.observable(false);
                self.generalSectionExpanded = ko.observable(true);
                self.axesOptions = ko.observableArray();
                self.topicsOptions = ko.observableArray();
                self.objectivesOptions = ko.observableArray();
                self.axeChangeHandler = ko.observable(() => {});
                self.topicChangeHandler = ko.observable(() => {});
                
                function populateIndicator(indicator) {
                    //general
                    indicator.setIndicatorType({id: parseInt(self.typeValue())});
                    indicator.setStatus({id: self.activeValue() ? 1 : 2});
                    indicator.setDescription(self.descriptionValue());
                    indicator.setDirection(self.directionValue()[0]);
                    indicator.setPeriodicity({id: parseInt(self.periodicityValue()[0])});
                    
                    if (indicator.getIndicatorType().id !== 3) {
                        indicator.setMeasureUnit({type: {id: self.measureUnitValue()[0]}});
                    }
                    
                    indicator.setBaseYear(self.baseYearValue());
                    indicator.setResetType({id: parseInt(self.resetValue()[0])});
                    
                    let resetType = indicator.getResetType().id;
                    let resetDatesNumber = resetType === 1 ? 0 : resetType === 2 ? 3 : 1;
                    let resetDates = [];

                    for (let i = 0; i < resetDatesNumber; i++) {
                        resetDates.push(isoToTimestamp(self.resetDateValues[i]()));
                    }

                    indicator.setResetDates(resetDates);
                    
                    //alignment
                    switch(indicator.getIndicatorType().id) {
                        case 1:
                            if(self.alignmentObjective() && self.alignmentObjective().length > 0) {
                                indicator.setStrategicItem({id: self.alignmentObjective()[0]});
                            }
                            break;
                        case 3:
                            if(self.peIndicatorsValue() && self.peIndicatorsValue().length > 0) {
                                indicator.setPideIndicator({id: self.peIndicatorsValue()[0]});
                            }
                            break;
                        default:
                            //MECASUT
                            break;
                    }
                    
                    //PE
                    if (indicator.getIndicatorType().id === 3) {
                        indicator.setPe({id: self.peValue()[0]});
                    }
                    
                    //responsible
                    indicator.setResponsible({id: responsibleId});
                    
                    //metadata
                    indicator.setSource(self.sourceValue());
                    indicator.setLink(self.linkValue());
                    indicator.setFormula(self.formulaValue());
                    indicator.setVariables(self.variablesValue());
                    indicator.setMethod(self.methodValue());
                    indicator.setMetaDataObservations(self.observationsMValue());
                    
                    if (indicator.getIndicatorType().id !== 2) {
                        indicator.setGrades(
                            [    
                                {
                                    color: "red",
                                    maxPercentage: self.redValue() * 100
                                },
                                {
                                    color: "orange",
                                    maxPercentage: self.orangeValue() * 100
                                },
                                {
                                    color: "yellow",
                                    maxPercentage: self.yellowValue() * 100
                                },
                                {
                                    color: "green",
                                    maxPercentage: self.greenValue() * 100
                                }
                            ]
                        );
                    } else {
                        delete indicator.gradesMap;
                        delete indicator.grades;
                    }
                    //achievements
                    let achievements = [];
                    let progressItems = self.progressObservableArray();

                    if (progressItems.length > 0) {
                        let items =
                                progressItems.map(
                                        item => {
                                            return {
                                                data: item.value,
                                                date: isoToTimestamp(item.date),
                                                achievementType: 'PROGRESS'
                                            };
                                        }
                                );

                        achievements = achievements.concat(items);
                    }
                    
                    if (indicator.getIndicatorType().id !== 2) {
                        let goalItems = self.goalObservableArray();

                        if (goalItems.length > 0) {
                            let items =
                                    goalItems.map(
                                            item => {
                                                return {
                                                    data: item.value,
                                                    date: isoToTimestamp(item.date),
                                                    achievementType: 'GOAL'
                                                };
                                            }
                                    );

                            achievements = achievements.concat(items);
                        }
                    }

                    indicator.setAchievements(achievements);
                    
                    if (indicator.getIndicatorType().id !== 2) {
                        indicator.setPotentialRisk(self.riskValue());
                        indicator.setImplementedActions(self.actionsValue());
                    }
                    
                    if (indicator.getIndicatorType().id === 2) {
                        indicator.setClassType({id: parseInt(self.classValue()[0])});
                    }
                    
                    function isoToTimestamp(isoDate) {
                        let date = oj.IntlConverterUtils.isoToLocalDate(isoDate);
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        month = month < 10 ? "0" + month : month;
                        let day = date.getDate();
                        day = day < 10 ? "0" + day : day;

                        return year + "-" + month + "-" + day + " 00:00:00";
                    }
                }

                function initializeForm() {
                    if (params.id) {
                        let id = params.cloneOf ? params.cloneOf : params.id;
                        let path = RESTConfig.admin.indicators.path + "/" + id;
                        let method = "GET";

                        function errorFunction(jqXHR, textStatus, errMsg) {
                            console.error(errMsg);
                        }

                        let indicatorPromise = AjaxUtils.ajax(path, method, undefined, null, errorFunction);

                        indicatorPromise.then(
                                function (indicator) {
                                    //general
                                    let name = params.cloneOf ? params.name : indicator.name;
                                    self.nameValue(name);
                                    self.typeValue(indicator.indicatorType.id.toString());
                                    self.activeValue(indicator.status.id === 1);
                                    self.descriptionValue(indicator.description);
                                    
                                    if (indicator.indicatorType.id !== 3) {
                                        self.directionValue([indicator.direction]);
                                        self.periodicityValue([String(indicator.periodicity.id)]);
                                        self.measureUnitValue([indicator.measureUnit.type.id]);
                                        self.baseYearValue(indicator.baseYear);
                                        self.resetValue(String(indicator.resetType.id));

                                        let resetDates = indicator.resetDates;

                                        resetDates = resetDates.map(
                                                (date) => {
                                            let resetDate = new Date();
                                            resetDate.setTime(date.time);

                                            return resetDate;
                                        }
                                        );

                                        resetDates.sort((a, b) => a.getTime() > b.getTime());

                                        resetDates.forEach(
                                                (date, index) => {
                                                    self.resetDateValues[index](oj.IntlConverterUtils.dateToLocalIso(date));
                                                }
                                        );
                                    }
                                    //alignment
                                    if (indicator.strategicItem) {
                                        let objective = strategicModel.getItemById(indicator.strategicItem.id);
                                        let topic = strategicModel
                                                .getItemsByType(StrategicTypes.TOPIC)
                                                .filter(item => item.children.includes(objective));
                                        topic = topic[0];

                                        let axe = strategicModel.getItemsByType(StrategicTypes.AXE)
                                                .filter(item => item.children.includes(topic));
                                        axe = axe[0];

                                        let topicOptionsArray;
                                        topicOptionsArray = strategicModel
                                                .getItemsByTypeByParent(StrategicTypes.TOPIC, [axe])
                                                .map(
                                                    topic => {
                                                        return {value: topic.id, label: topic.name};
                                                    }
                                                );
                                                
                                        self.topicsOptions(topicOptionsArray);

                                        let objectiveOptionsArray;
                                        objectiveOptionsArray = strategicModel
                                                .getItemsByTypeByParent(StrategicTypes.OBJECTIVE, [topic])
                                                .map(
                                                    objective => {
                                                        return {value: objective.id, label: objective.name};
                                                    }
                                                );
                                                
                                        self.objectivesOptions(objectiveOptionsArray);
                                        
                                        self.alignmentAxe([axe.id]);
                                        self.alignmentTopic([topic.id]);
                                        self.alignmentObjective([objective.id]);
                                    }
                                    
                                    if (indicator.pideIndicator) {
                                        let objective = strategicModel.getItemById(indicator.pideIndicator.strategicItem.id);
                                        let topic = strategicModel
                                                .getItemsByType(StrategicTypes.TOPIC)
                                                .filter(item => item.children.includes(objective));
                                        topic = topic[0];

                                        let axe = strategicModel.getItemsByType(StrategicTypes.AXE)
                                                .filter(item => item.children.includes(topic));
                                        axe = axe[0];

                                        let topicOptionsArray;
                                        topicOptionsArray = strategicModel
                                                .getItemsByTypeByParent(StrategicTypes.TOPIC, [axe])
                                                .map(
                                                    topic => {
                                                        return {value: topic.id, label: topic.name};
                                                    }
                                                );
                                                
                                        self.topicsOptions(topicOptionsArray);

                                        let objectiveOptionsArray;
                                        objectiveOptionsArray = strategicModel
                                                .getItemsByTypeByParent(StrategicTypes.OBJECTIVE, [topic])
                                                .map(
                                                    objective => {
                                                        return {value: objective.id, label: objective.name};
                                                    }
                                                );
                                                
                                        self.objectivesOptions(objectiveOptionsArray);
                                        
                                        self.peAxesValue([axe.id]);
                                        
                                        
                                        const petopicOptionsSubscription = self.peTopicsOptions.subscribe(
                                          () => {
                                            self.peTopicsValue([topic.id]);
                                            petopicOptionsSubscription.dispose();
                                          }
                                        );
                                        
                                        const peObjectivesSubscription = self.peObjectivesOptions.subscribe(
                                          () => {
                                            self.peObjectivesValue([objective.id]);
                                            peObjectivesSubscription.dispose();
                                          }
                                        );
                                    
                                        const peIndicatorsSubscription = self.peIndicatorsOptions.subscribe(
                                          () => {
                                            self.peIndicatorsValue([indicator.pideIndicator.id]);
                                            peIndicatorsSubscription.dispose();
                                          }
                                        );
                                    }
                                    
                                    if (indicator.pe) {
                                        
                                      self.peTypeValue([indicator.pe.type.id]);
                                        
                                      const peOptionsSubscription = self.peOptions.subscribe(
                                        () => {
                                          self.peValue([indicator.pe.id]);
                                          peOptionsSubscription.dispose();
                                        }
                                      );

                                      self.shortNameValue(indicator.pe.shortName);
                                    }
                                    
                                    //responsible
                                    responsibleId = indicator.responsible.id;
                                    self.areaValue(positionsMap[responsibleId].area.id);
                                    self.jobTitleValue(positionsMap[responsibleId].jobTitle.id);
                                    self.responsibleNameValue(positionsMap[responsibleId].player.name);
                                    let phone = positionsMap[responsibleId].player.phones[0];
                                    self.phoneValue(phone ? phone.number : '');
                                    
                                    //metadata
                                    self.sourceValue(indicator.source);
                                    self.linkValue(indicator.link);
                                    self.formulaValue(indicator.formula);
                                    self.variablesValue(indicator.variables);
                                    self.methodValue(indicator.method);
                                    self.observationsMValue(indicator.metaDataObservations);
                                    
                                    let colorGradesMap = {};
                                    indicator.grades.forEach(g => colorGradesMap[g.color] = g.maxPercentage / 100);
                                    
                                    self.redValue(colorGradesMap[FullIndicator.GradesColor.RED]);
                                    self.orangeValue(colorGradesMap[FullIndicator.GradesColor.ORANGE]);
                                    self.yellowValue(colorGradesMap[FullIndicator.GradesColor.YELLOW]);
                                    self.greenValue(colorGradesMap[FullIndicator.GradesColor.GREEN]);
                                    //achievements
                                    let achievementTypes = ['PROGRESS', 'GOAL'];
                                    let observableAchievements = [self.progressObservableArray, self.goalObservableArray];

                                    indicator.achievements.forEach(
                                            (achievement, index) => {
                                                let typeIndex = achievementTypes.indexOf(achievement.achievementType);
                                                let observableAchievement = observableAchievements[typeIndex];
                                                let date = new Date();
                                                date.setTime(achievement.date.time);
                                                
                                                let row = {
                                                    id: index,
                                                    value: achievement.data,
                                                    date: oj.IntlConverterUtils.dateToLocalIso(date)
                                                };
                                        
                                                observableAchievement.push(row);
                                            }
                                    );
                                    
                                    self.progressObservableArray()
                                        .forEach(
                                            progress => self.progressDataSource.add(progress)
                                        );
                                
                                    self.goalObservableArray()
                                        .forEach(
                                            goal => self.goalDataSource.add(goal)
                                        );
                                    
                                    self.riskValue(indicator.potentialRisk);
                                    self.actionsValue(indicator.implementedActions);
                                    
                                    if (indicator.classType) {
                                        self.classValue(`${indicator.classType.id}`);
                                    }
                                    
                                    self.updateChart();
                                }
                        );
                    }
                }

                self.saveForm = function () {
                    let indicator = new FullIndicator(params.id, self.nameValue(), self.typeValue());
                    populateIndicator(indicator);

                    let path = RESTConfig.admin.indicators.path;
                    let method = indicator.getId() ? "PUT" : "POST";

                    path += indicator.getId() ? "/" + params.id : "";

                    function successFunction(data) {
                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success"));
                        saveDialogClass = "save-dialog-success";

                        if (data) {
                            indicator.setId(data.id);
                            params.id = data.id;
                        }
                    }

                    function errorFunction(jqXHR, textStatus, errMsg) {
                        self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success") + errMsg);
                        saveDialogClass = "save-dialog-error";
                    }

                    let savePromise = AjaxUtils.ajax(path, method, indicator, successFunction, errorFunction);

                    savePromise.then(
                            function () {
                                self.showDialog();
                            }
                    );
                };

                self.showDialog = function () {
                    var saveDialog = $("#" + self.saveDialogId);
                    saveDialog.ojDialog("widget").addClass(saveDialogClass);
                    saveDialog.ojDialog("open");
                };
                
                self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.cancelButton");
                self.clickCancelHandler = function() {
                    var resetDialog = $("#" + self.resetDialogId);
                    resetDialog.ojDialog("close");
                };
                
                self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.okButton");
                self.clickOkHandler = function() {
                    var resetDialog = $("#" + self.resetDialogId);
                    resetDialog.ojDialog("close");
                    initializeForm();
                };
                
                self.resetMessage(GeneralViewModel.nls("admin.indicators.main.dialogs.reset.warningText"));
                self.resetForm = function () {
                    var resetDialog = $("#" + self.resetDialogId);
                    resetDialog.ojDialog("open");
                };
                
                /*
                 * General section.
                 */
                self.generalTitle = GeneralViewModel.nls("admin.indicators.form.sections.general.title");

                // Update option
                self.updateLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.update");
                self.updateValue = ko.observable('Manual');

                // PE Axes option
                self.peAxesLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.axes");
                self.peAxesValue = ko.observable("");
                self.peAxesOptions = ko.observableArray([]);

                // PE Topics option
                self.peTopicsLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.topics");
                self.peTopicsValue = ko.observable("");
                self.peTopicsOptions = ko.observableArray([]);

                // PE Objectives option
                self.peObjectivesLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.objectives");
                self.peObjectivesValue = ko.observable("");
                self.peObjectivesOptions = ko.observableArray([]);

                // PE Indicators option
                self.peIndicatorsLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.indicators");
                self.peIndicatorsValue = ko.observable("");
                self.peIndicatorsOptions = ko.observableArray([]);

                /**
                 * PE Axes change event.
                 *
                 * Triggered after changing the PE Axes combobox.
                 *
                 * @param {*} event
                 * @param {*} data
                 */
                self.peAxesChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.generalSectionExpanded()) {
                        self.peAxesOptions(axes);
                        
                        const topics = getTopicsByAxe(self.peAxesValue()[0]);
                        self.peTopicsOptions(topics);
                    }
                };

                /**
                 * PE Topics change event.
                 *
                 * Triggered after changing the PE Topics combobox.
                 *
                 * @param {*} event
                 * @param {*} data
                 */
                self.peTopicsChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.generalSectionExpanded() && self.peTopicsValue()) {
                        self.peObjectivesOptions(getObjectivesByTopic(data.value[0]));
                    } 
                };

                self.peObjectivesChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.generalSectionExpanded() && self.peObjectivesValue()) {
                        const indicators = getIndicatorsByObjective(data.value[0]);
                        
                        if (indicators.length === 0) {
                            indicators.push({value: '', label: ''});
                            setIndicatorFields();
                        }
                        
                        self.peIndicatorsOptions(indicators);
                    }
                };
                
                self.peIndicatorsChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.generalSectionExpanded() && self.peIndicatorsValue()) {
                        const indicator = indicatorsMap[self.peIndicatorsValue()];
                        
                        if (indicator) {
                            setIndicatorFields(indicator);
                        }
                    }
                };
                
                const setIndicatorFields = indicator => {
                    self.descriptionValue((indicator && indicator.description) ? indicator.description : '');
                    self.directionValue((indicator && indicator.direction) ? String(indicator.direction) : '');
                    self.measureUnitValue((indicator && indicator.measureUnit) ? [indicator.measureUnit.type.id] : ['']);
                    self.baseYearValue(indicator && indicator.baseYear ? indicator.baseYear : '');
                };
                
                const getIndicatorsByObjective = objectiveId => {
                    return objectiveIndicatorsMap[objectiveId] || [];
                };
                
                // Name field
                self.nameLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.name.label");
                self.namePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.name.placeholder");
                self.nameValue = ko.observable("");

                // Description field
                self.descriptionLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.description.label");
                self.descriptionPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.description.placeholder");
                self.descriptionValue = ko.observable("");

                // Class field
                self.classLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.class");
                self.classValue = ko.observable("");
                self.classOptions = ko.observableArray(
                        [
                            {value: '1', label: 'Eficiencia'},
                            {value: '2', label: 'Eficacia'},
                            {value: '3', label: 'Pertinencia'},
                            {value: '4', label: 'Equidad'},
                            {value: '5', label: 'Vinculación'},
                            {value: '6', label: 'Otros'}
                        ]
                );
                
                // PE type
                self.peTypeLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.pe.typeLabel"); 
                self.peTypeValue = ko.observable("");
                self.peTypeOptions = ko.observableArray([]);
                
                // PE field
                self.peLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.pe.label");
                self.peValue = ko.observable("");
                self.peOptions = ko.observableArray([]);
                
                const peDataProvider =
                        new DataProvider(
                                RESTConfig.admin.pe.path,
                                PEDataParser);
                                
                const pePromise = peDataProvider.fetchData();
                let peTypesMap = {};
                let peTypesMatrix = {};
                let peTypesArray = [];
                
                pePromise.then(
                    () => {
                        peDataProvider.getDataArray()
                            .forEach(
                                pe => {
                                   if (!peTypesMap[pe.type.id]) {
                                       peTypesMap[pe.type.id] = [];
                                       peTypesArray.push({value: pe.type.id, label: pe.type.name});
                                       peTypesMatrix[pe.type.id] = {};
                                   }
                                   
                                   peTypesMap[pe.type.id].push({value: pe.id, label: pe.name});
                                   peTypesMatrix[pe.type.id][pe.id] = pe;
                                }
                            );
                    
                        self.peTypeOptions([{value: -1, label: ''}].concat(peTypesArray));
                        self.peTypeValue(-1);
                    }
                );
        
                self.peTypesChange = function(event, data) {
                  if (data.option === "value" && strategicModel && self.generalSectionExpanded() && self.peTypeValue()) {
                    self.peTypeOptions(peTypesArray);
                    const pe = peTypesMap[data.value[0]];

                    self.peOptions(pe);
                  }
                };
                
                self.peChange = function(event, data) {
                  if (data.option === "value" && strategicModel && self.generalSectionExpanded() && self.peValue()) {
                    const pe = peTypesMatrix[self.peTypeValue()[0]][data.value[0]];
                    self.shortNameValue(pe.shortName);
                  } else if (data.option === "options") {
                    const pes = peTypesMap[self.peTypeValue()[0]];
                    
                    if (!pes.some(pe => pe.value == self.peValue())) {
                      self.peValue([data.value[0].value]);
                    }
                  }
                };
                
                // Short name field
                self.shortNameLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.shortName.label");
                self.shortNamePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.shortName.placeholder");
                self.shortNameValue = ko.observable("");

                // Direction option
                self.directionLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.direction");
                self.directionOptions = ko.observableArray(
                        [
                            {value: 'POSITIVE', label: 'Positivo'},
                            {value: 'NEGATIVE', label: 'Negativo'}
                        ]
                        );
                self.directionValue = ko.observable('POSITIVE');

                // Unit of measurement field
                self.measureUnitValue = ko.observable();
                self.measureUnitLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.measure.label");
                //TO-DO: Change this for an ajax call to bring the types and then translate them.
                $.getJSON(RESTConfig.catalogs.unitTypes.path).then(
                    (types) => {                        
                        self.measureUnitOptions(types.map(t => ({value: t.id, label: GeneralViewModel.nls(`graphics.unit-types.${t.name}`)})));
                    }
                )
                .fail(
                    () => {
                        self.measureUnitOptions(
                            [
                                {value: 1, label: 'Numérico'},
                                {value: 2, label: 'Porcentaje'},
                                {value: 3, label: 'Ordinal'},
                                {value: 4, label: 'Promedio'},
                                {value: 5, label: 'Moneda'},
                                {value: 6, label: 'Tiempo'}
                            ]
                        );
                    }
                )
                .always(
                    () => {
                        self.measureUnitValue([1]);
                    }
                );
        
                self.measureUnitOptions = ko.observableArray();                

                // Base year field
                self.baseYearLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.baseYear.label");
                self.baseYearPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.baseYear.placeholder");
                self.baseYearValue = ko.observable("");

                // Periodicity option
                self.periodicityLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.periodicity");
                self.periodicityOptions = ko.observableArray([
                    {value: '1', label: 'Mensual'},
                    {value: '2', label: 'Cuatrimestral'},
                    {value: '3', label: 'Semestral'},
                    {value: '4', label: 'Anual'}
                ]);
                self.periodicityValue = ko.observable('1');

                // Reset option
                self.resetLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.reset");
                self.resetOptions = ko.observableArray([
                    {value: '1', label: 'Continuo'},
                    {value: '2', label: 'Cuatrimestral'},
                    {value: '3', label: 'Anual'}
                ]);
                self.resetValue = ko.observable('1');

                // Reset date field
                self.resetDateLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.resetDates");
                self.resetDateValues = [];

                for (let i = 0; i < 3; i++) {
                    self.resetDateValues.push(ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date())));
                }

                /*
                 * Alignment section
                 */
                self.alignmentTitle = GeneralViewModel.nls("admin.indicators.form.sections.alignment.title");
                self.alignmentAxe = ko.observable();
                self.alignmentTopic = ko.observable();
                self.alignmentObjective = ko.observable();
                
                // PIDE table
                self.pideTableLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.title");
                self.axeColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.axe");
                self.topicColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.topic");
                self.objectiveColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.objective");

                let sortByName = (a, b) => a.name.localeCompare(b.name);

                //PIDE Filter select controls population
                const strategicDataProvider =
                        new DataProvider(
                                RESTConfig.admin.strategic.path,
                                StrategicDataParser);
                
                const indicatorsDataProvider =
                        new DataProvider(
                                RESTConfig.admin.indicators.pide.path,
                                IndicatorDataParser);

                const strategicPromise = strategicDataProvider.fetchData();
                const indicatorsPromise = indicatorsDataProvider.fetchData();
                let strategicModel;
                let objectiveIndicatorsMap = {};
                let indicatorsMap = {};
                let axes = [];
                
                const strategicLoadedPromise = strategicPromise.then(
                    () => {
                        strategicModel = new StrategicModel(strategicDataProvider.getDataArray());
                        axes = strategicModel
                                 .getItemsByType(StrategicTypes.AXE)
                                 .sort(sortByName)
                                 .map(
                                     (axe) => {
                                         return {value: axe.id, label: axe.name};
                                     }
                                 );
                         
                        self.axesOptions([{value: -1, label: ''}].concat(axes));
                        self.alignmentAxe(-1);
                        self.peAxesOptions(self.axesOptions());
                        self.peAxesValue(-1);
                    }
                );
        
                const indicatorsLoadPromise = indicatorsPromise.then(
                    () => {
                        const indicators = indicatorsDataProvider.getDataArray();
                
                        indicators.forEach(
                            i => {
                                if (!objectiveIndicatorsMap[i.strategicItem.id]) {
                                    objectiveIndicatorsMap[i.strategicItem.id] = [];
                                }
                                
                                objectiveIndicatorsMap[i.strategicItem.id].push({value: i.id, label: i.name});
                                indicatorsMap[i.id] = i;
                            }
                        );
                    }
                );
                
                /**
                * Axes change event.
                *
                * Triggered after changing the axe to align.
                *
                */
                self.axeChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.alignmentSectionExpanded()) {
                        self.axesOptions(axes);
                        self.topicsOptions(getTopicsByAxe(self.alignmentAxe()[0]));
                    }
                };
                
                const getTopicsByAxe = axeId => {
                    return strategicModel.getItemsByTypeByParent(
                               StrategicTypes.TOPIC, 
                               [strategicModel.getItemById(axeId)]
                            )
                            .map(topic => ({value: topic.id, label: topic.name}));
                };
                
                /**
                * Topics change event.
                *
                * Triggered after changing the topic to align.
                */
                self.topicChange = function (event, data) {
                    if (data.option === "value" && strategicModel && self.alignmentSectionExpanded() && self.alignmentTopic()) {
                        self.objectivesOptions(getObjectivesByTopic(self.alignmentTopic()[0]));
                    }
                };
                
                const getObjectivesByTopic = topicId => {
                    return strategicModel.getItemsByTypeByParent(
                                StrategicTypes.OBJECTIVE,
                                [strategicModel.getItemById(topicId)]
                            )
                            .map(objective => ({value: objective.id, label: objective.name}));
                };
                
                // POA section
                self.poaSectionLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.poa.title");

                // Process table
                self.processTableLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.poa.process.title");
                self.processId = Math.floor(Math.random() * 100) + 1;
                self.processColumns = [
                    {"headerText": "Procesos", "sortable": "auto"}
                ];
                self.processObservableArray = ko.observableArray([]);
                self.processDataSource = new oj.ArrayTableDataSource(self.processObservableArray, {idAttribute: 'id'});

                // Projects table
                self.projectsTableLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.poa.projects.title");
                self.projectsId = Math.floor(Math.random() * 100) + 1;
                self.projectsColumns = [
                    {"headerText": "Proyectos", "sortable": "auto"}
                ];
                self.projectsObservableArray = ko.observableArray([]);
                self.projectsDataSource = new oj.ArrayTableDataSource(self.projectsObservableArray, {idAttribute: 'id'});

                // Get data
//                $.getJSON("data/pide-alignment.json")
//                        .done(function (data) {
//                            // PIDE data
//                            let pide = data.alignment.pide;
//
//                            // POA data
//                            let poa = data.alignment.poa;
//
//                            // Fill Process Table
//                            $.each(poa.process, function (key, value) {
//                                self.processObservableArray.push({
//                                    'id': self.processId++,
//                                    'Process': value.process
//                                });
//                            });
//
//                            // Fill Projects Table
//                            $.each(poa.projects, function (key, value) {
//                                self.projectsObservableArray.push({
//                                    'id': self.projectsId++,
//                                    'Project': value.project
//                                });
//                            });
//                        });

                /*
                 * Responsible section
                 */
                self.responsibleTitle = GeneralViewModel.nls("admin.indicators.form.sections.responsible.title");

                // positions
                self.areaLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.area");
                let positionsPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.positions.path, 'GET');
                self.areaOptions = ko.observableArray();
                let areaValues = [];
                let jobTitlesByArea = {};
                let playersByAreaAndJobTitle = {};
                
                self.areaValue = ko.observable();
                self.jobTitleOptions = ko.observableArray();
                self.jobTitleValue = ko.observable();
                // Responsible name
                self.responsibleNameLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.name.label");
                self.responsibleNameValue = ko.observable("Nombre del responsable");
                self.responsibleNamePlaceHolder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.name.placeholder");
                let responsibleId;
                let positionsMap = {};
                
                // Email field
//                self.emailLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.email.label");
//                self.emailPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.email.placeholder");
//                self.emailValue = ko.observable("");

                // Phone field
                self.phoneLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.phone.label");
                self.phonePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.phone.placeholder");
                self.phoneValue = ko.observable("");

                // Extension field
                self.extensionLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.extension.label");
                self.extensionPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.extension.placeholder");
                self.extensionValue = ko.observable("");
                
                positionsPromise.then(
                        positions => {
                            positions.forEach(
                                p => {
                                    const area = p.area;
                                    const areaObject = {label: area.name, value: area.id};
                                    
                                    if (!areaValues.includes(areaObject.value)) {
                                        self.areaOptions.push(areaObject);
                                        areaValues.push(areaObject.value);
                                    }
                                    
                                    const jobTitle = p.jobTitle;
                                    const jobTitleObject = {label: jobTitle.name, value: `${jobTitle.id}#${p.id}`};
                                    
                                    if (!jobTitlesByArea[areaObject.value]) {
                                        jobTitlesByArea[areaObject.value] = [];
                                    }
                                    
                                    let jobTitles = jobTitlesByArea[areaObject.value];
                                    jobTitles.push(jobTitleObject);
                                    
                                    playersByAreaAndJobTitle[`${areaObject.value}#${jobTitleObject.value}`] = p.player;
                                    p.player.id = p.id;
                                    
                                    positionsMap[p.id] = p;
                                }
                            );
                        }
                ).then(
                    () => {
                        self.jobTitleOptions(jobTitlesByArea[self.areaValue()[0]]);
                    }
                ).then(
                    () => {
                        let player = playersByAreaAndJobTitle[`${self.areaValue()[0]}#${self.jobTitleValue()[0]}`];
                        self.responsibleNameValue(player.name);
                        responsibleId = player.id;
                    }
                );
                
                self.areaChangeHandler = (event, data) => {
                    if (data.option === 'value') {
                        self.jobTitleOptions(jobTitlesByArea[data.value]);
                    }
                };
                    
                // Address option
                self.jobTitleLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.jobTitle");
                
                self.jobChangeHandler = (event, data) => {
                    if (data.option === 'value') {
                        let player = playersByAreaAndJobTitle[`${self.areaValue()[0]}#${self.jobTitleValue()[0]}`];
                        
                        if (player) {
                            self.responsibleNameValue(player.name);
                            
                            let phone = player.phones[0];
                            self.phoneValue(phone ? phone.number : '');
                            
                            responsibleId = player.id;
                        }
                    }
                };
                
                // Observations field
                self.observationsRLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.observations");
                self.observationsRValue = ko.observable("");

                /*
                 * Metadata section
                 */
                self.metadataTitle = GeneralViewModel.nls("admin.indicators.form.sections.metadata.title");

                // Source field
                self.sourceLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.source.label");
                self.sourcePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.source.placeholder");
                self.sourceValue = ko.observable("");

                // Link field
                self.linkLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.link.label");
                self.linkPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.link.placeholder");
                self.linkValue = ko.observable("");

                // Formula field
                self.formulaLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.formula.label");
                self.formulaPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.formula.placeholder");
                self.formulaValue = ko.observable("");

                // Variables field
                self.variablesLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.variables.label");
                self.variablesPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.variables.placeholder");
                self.variablesValue = ko.observable("");

                // Method field
                self.methodLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.method.label");
                self.methodPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.method.placeholder");
                self.methodValue = ko.observable("");

                // Observations field
                self.observationsMLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.observations.label");
                self.observationsMPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.observations.placeholder");
                self.observationsMValue = ko.observable("");

                // Score
                self.scoreLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.label");

                // Score to percent converter
                self.scoreConverter = GeneralViewModel.converters.percent;

                // Red score field
                self.redLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.red");
                self.redValue = ko.observable(0.35);

                // Orange score field
                self.orangeLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.orange");
                self.orangeValue = ko.observable(0.6);

                // Yello score field
                self.yellowLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.yellow");
                self.yellowValue = ko.observable(0.8);

                // Green score field
                self.greenLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.green");
                self.greenValue = ko.observable(1);
                
                function setGradesToDefaultValues() {
                    self.redValue(0.35);
                    self.orangeValue(0.6);
                    self.yellowValue(0.8);
                    self.greenValue(1);
                }
                
                /*
                 * Goals and progress section
                 */
                self.goalsTitle = GeneralViewModel.nls("admin.indicators.form.sections.goals.title");
                self.progressTitle = GeneralViewModel.nls("admin.indicators.form.sections.goals.alternative");

                // Chart series
                self.chartSeriesValue = ko.observableArray([]);

                // Goal/Progress ID
                self.goalId = Math.floor(Math.random() * 100) + 1;

                // Table headers
                self.goalsColumns = [
                    {
                        "headerText": "Valor",
                        "headerStyle": 'max-width: 5em;',
                        "style": 'min-width: 45%; width: 45%;',
                        "sortable": "disabled"
                    },
                    {
                        "headerText": "Fecha",
                        "headerStyle": 'max-width: 5em;',
                        "style": 'min-width: 45%; width: 45%;',
                        "sortable": "auto"
                    },
                    {
                        "headerText": 'Acciones',
                        "headerStyle": 'max-width: 5em;',
                        "style": 'min-width: 10%; width: 10%;',
                        "sortable": "disabled"
                    }
                ];

                // Goals table
                self.goalsLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.table.goals");
                self.goalObservableArray = ko.observableArray([]);
                self.goalDataSource = new oj.ArrayTableDataSource(self.goalObservableArray(), {idAttribute: 'id'});

                // Row template for Goals' table
                self.getGoalRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];
                    return mode === 'edit' ? 'goalEditRowTemplate' : 'goalRowTemplate';
                };

                // Progress table
                self.progressLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.table.progress");
                self.progressObservableArray = ko.observableArray([]);
                self.progressDataSource = new oj.ArrayTableDataSource(self.progressObservableArray(), {idAttribute: 'id'});

                // Row template for Progress' table
                self.getProgressRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];
                    return mode === 'edit' ? 'progressEditRowTemplate' : 'progressRowTemplate';
                };
                
                /**
                 * Update chart values.
                 */
                self.updateChart = function () {
                    // New chart series
                    var chartSeries = [
                        {name: 'Metas', items: []},
                        {name: 'Avances', items: []}
                    ];

                    // For each goal in Goals' table
                    self.goalObservableArray().forEach(function (goal) {
                        // Add new item to Chart series
                        chartSeries[0].items.push({
                            x: goal.date, // Goal date
                            value: goal.value // Goal value
                        });
                    });

                    // For each progress in Progress' table
                    self.progressObservableArray().forEach(function (progress) {
                        // Add new item to Chart Series
                        chartSeries[1].items.push({
                            x: progress.date, // Progress date
                            value: progress.value // Progress value
                        });
                    });

                    // Sort arrays by date
                    chartSeries[0].items.sort(self.orderChartByDate);
                    chartSeries[1].items.sort(self.orderChartByDate);

                    // Set chart values
                    self.chartSeriesValue(chartSeries);
                };

                /**
                 * Order chart by date.
                 *
                 * @param elem1
                 * @param elem2
                 * @returns {int}
                 */
                self.orderChartByDate = function (elem1, elem2) {
                    if (elem1.x > elem2.x)
                        return 1;
                    else if (elem1.x < elem2.x)
                        return -1;
                    else if (elem1.x === elem2.x)
                        return 0;
                };

                /**
                 * Add new row table.
                 *
                 * @param {String} table
                 * @returns {void}
                 */
                self.addRow = function (table) {
                    // New row
                    var row = {
                        'id': self.goalId++,
                        'value': 0,
                        'date': oj.IntlConverterUtils.dateToLocalIso(new Date())
                    };

                    // Pick table
                    if (table === 'Goals') {
                        self.goalObservableArray.push(row);
                        self.goalDataSource.add(row);
                    } else if (table === 'Progress') {
                        self.progressObservableArray.push(row);
                        self.progressDataSource.add(row);
                    }
                    // Update chart values
                    self.updateChart();
                };

                /**
                 * Remove selected row.
                 *
                 * @param {String} table Table source.
                 * @param {Object} row Goal/Progress object with ID, Value and Date.
                 * @returns {void}
                 */
                self.removeRow = function (table, row) {
                    if (table === 'Goals') {
                        // Remove from Goals table
                        self.goalObservableArray.remove(function (item) {
                            return item.id === row.id && item.value === row.value && item.date === row.date;
                        });
                        self.goalDataSource.remove({id: row.id, date: row.date, value: row.value});
                    } else if (table === 'Progress') {
                        // Remove from Progress table
                        self.progressObservableArray.remove(function (item) {
                            return item.id === row.id && item.value === row.value && item.date === row.date;
                        });
                        self.progressDataSource.remove({id: row.id, date: row.date, value: row.value});
                    }

                    // Update chart values
                    self.updateChart();
                };

                /**
                 * Before Row Edit End event.
                 *
                 * @param {any} event
                 * @param {any} ui
                 * @returns {void}
                 */
                self.beforeRowEditEnd = function (event, ui) {
                    // Update chart values
                    self.updateChart();
                };

                // Potential risk field
                self.riskLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.risk.label");
                self.riskPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.goals.risk.placeholder");
                self.riskValue = ko.observable("");

                // Implemented actions
                self.actionsLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.actions.label");
                self.actionsPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.goals.actions.placeholder");
                self.actionsValue = ko.observable("");

                /*
                 * Components section
                 */
                self.componentsTitle = GeneralViewModel.nls("admin.indicators.form.sections.components.title");

                // Name field
                self.comNameLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.name");
                self.comNameValue = ko.observable("");

                // Description field
                self.comDescriptionLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.description");
                self.comDescriptionValue = ko.observable("");

                // Indicator field
                self.comIndicatorLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.indicator");
                self.comIndicatorValue = ko.observable("");

                // Measure field
                self.comMeasureLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.measure");
                self.comMeasureValue = ko.observable("");

                // Initial value field
                self.comInitialValueLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.initialValue");
                self.comInitialValueValue = ko.observable("");

                // Final goal field
                self.comFinalGoalLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.finalGoal");
                self.comFinalGoalValue = ko.observable("");

                // General progress field
                self.comGeneralProgressLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.generalProgress");
                self.comGeneralProgressValue = ko.observable("");

                // Initial date field
                self.comInitialDateLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.initialDate");
                self.comInitialDateValue = ko.observable("");

                // Final date field
                self.comFinalDateLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.finalDate");
                self.comFinalDateValue = ko.observable("");

                // Responsible option
                self.comResponsibleLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.responsible");
                self.comResponsibleOptions = ko.observableArray([
                    {"value": "Responsable", "label": "Responsable"}
                ]);
                self.comResponsibleValue = ko.observable("");

                // Justification field
                self.comJustificationLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.justification");
                self.comJustificationValue = ko.observable("");

                // Goals and progress table
                self.comGoalsLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.goals");

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
                self.comGoalsDataSource = ko.observable(new oj.ArrayTableDataSource(self.comGoalsObservableArray, {idAttribute: "Mes"}));

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
                                value: self.comFinalGoalValue(),
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
                        {name: 'Metas', items: []},
                        {name: 'Avances', items: [], assignedToY2: 'on'}
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

                // Components table
                self.componentsTableLabel = GeneralViewModel.nls("admin.indicators.form.sections.components.table.title");
                self.componentsId = 1;
                self.componentsEnable = ko.observable(false);

                // Components table columns
                self.componentsColumns = [
                    {
                        "headerText": GeneralViewModel.nls("admin.indicators.form.sections.components.table.headers.name"),
                        "headerStyle": 'max-width: 10%; width: 10%',
                        "style": 'min-width: 90%; width: 90%;',
                        "sortable": "auto"
                    },
                    {
                        "headerText": GeneralViewModel.nls("admin.indicators.form.sections.components.table.headers.actions"),
                        "headerStyle": 'max-width: 10%; width: 10%',
                        "style": 'max-width: 10%; width: 10%',
                        "sortable": "disabled"
                    }
                ];

                // Components table observable array
                self.componentsObservableArray = ko.observableArray([]);

                // Get components data
//                $.getJSON("data/components.json")
//                        .done(function (data) {
//                            $.each(data, function (index, value) {
//                                self.componentsObservableArray.push(new ComponentItem(value));
//                            });
//                        });

                // Components table data source
                self.componentsDataSource = new oj.ArrayTableDataSource(self.componentsObservableArray, {idAttribute: 'id'});
                const promises = [strategicLoadedPromise, positionsPromise, indicatorsLoadPromise];
                Promise.all(promises).then(() => initializeForm());
            }

            return FormViewModel;
        }
);