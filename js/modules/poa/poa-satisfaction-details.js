define(
        [   
            'ojs/ojcore',
            'knockout',            
            'view-models/GeneralViewModel',
            'events/EventTypes',
            'modules/pide/model/PlanElementCalculated',
            'modules/pide/model/PlanElementMeasurable',
            'modules/pide/model/PlanElementTypes',
            'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge', 'ojs/ojcollapsible', 
            'ojs/ojmasonrylayout', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojsunburst'
        ],
        function (oj, ko, GeneralViewModel, EventTypes) {
            var theKey = {};

            function POASatisfactionDetailsViewModel(params) {
                var self = this;
                this.listeners = [];

                var privateData = {
                    controlPanelModel: params.model,
                    statusMeterPlanElementsMap: {},
                    collapsiblePanelTitles: ["Ver mas", "Ocultar"],
                    cardModel: undefined,
                    colorHandler: new oj.ColorAttributeGroupHandler()
                };

                this.POASatisfactionDetailsViewModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                this.selectedPlanElement = ko.observable();
                this.cardModule = ko.observable({viewName: 'empty'});
                this.collapsibleParentsPanelTitle = ko.observable(privateData.collapsiblePanelTitles[0]);
                this.collapsibleStatusMeterPanelTitle = ko.observable(privateData.collapsiblePanelTitles[1]);
                this.collapsibleChildrenPanelTitle = ko.observable(privateData.collapsiblePanelTitles[1]);
                this.currentChildren = ko.observableArray();
                this.currentParents = ko.observableArray();

                this.collapseParentsHandler = function (event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleParentsPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
                
                this.collapseStatusMeter = function (event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleStatusMeterPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
                
                this.collapseChildrenHandler = function (event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleChildrenPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
                
                this.sunburstProcessesValues = ko.observableArray([]);
                this.label = ko.observable();
                
                params.autoExport(this);
            }

            POASatisfactionDetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = POASatisfactionDetailsViewModel.prototype;
            
            prototype.getCardModel = function() {
                return this.POASatisfactionDetailsViewModel_(theKey).cardModel;
            };
            
            prototype.setCardModel = function(cardModel) {
                this.POASatisfactionDetailsViewModel_(theKey).cardModel = cardModel;
            };
            
            prototype.isIndicator = function(type) {
                return type.match(/indica.*/i);
            };
            
            prototype.getIndexById = function(id) {
                let controlPanelModel = this.getControlPanelModel();
                let elementsArray = controlPanelModel.getPlanElementsArray();
                
                for (let i = 0; i < elementsArray.length; i ++) {
                    let element = elementsArray[i];
                    
                    if (element.getType() + element.getLabel() === id) {
                        return i;
                    }
                }
                
                return -1;
            };
            
            prototype.setSelectedItem = function (id) {
                let controlPanelModel = this.getControlPanelModel();
                let elementsArray = controlPanelModel.getPlanElementsArray();
                var planElementIndex = this.getIndexById(id);
                var statusMeterPlanElement = this.getStatusMeterPlanElement(planElementIndex);
                let selectedPlanElement = elementsArray[planElementIndex];
                        
                this.selectedPlanElement(statusMeterPlanElement);
                this.updateParents(selectedPlanElement);
                this.updateSunburstProcesses(selectedPlanElement);
            };

            prototype.getStatusMeterPlanElement = function (id) {
                var statusMeterPlanElementsMap = this.getStatusMeterPlanElementsMap();
                var statusMeterPlanElement = statusMeterPlanElementsMap[id];

                if (!statusMeterPlanElement) {
                    var controlPanelModel = this.getControlPanelModel();
                    var planElement = controlPanelModel.getPlanElementsArray()[id];

                    return addNewPlanElementToMap.call(this, planElement,
                            controlPanelModel, statusMeterPlanElementsMap);
                } else {
                    return statusMeterPlanElement;
                }
            };

            prototype.getStatusMeterPlanElementsMap = function () {
                return this.POASatisfactionDetailsViewModel_(theKey).statusMeterPlanElementsMap;
            };

            prototype.updateParents = function (selectedPlanElement) {
                var parents = getParents.call(this, selectedPlanElement,
                        this.getControlPanelModel(), this.getStatusMeterPlanElementsMap());
                this.currentParents(parents);
            };
            
            prototype.updateSunburstProcesses = function(planElement) {
                var randomSize = Math.round(Math.random() * 6);
                var processes = [];
                var colorHandler = this.getColorHandler();
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];
                
                for (var i = 1; i <= randomSize; i ++) {
                    processes.push(
                        {
                            label: "Proceso " + i,
                            id: i,
                            value: 1,
                            color: colorHandler.getValue(i),
                            values: {
                                id: i,
                                min: 0,
                                max: 100,
                                value: Math.round(Math.random() * 100),
                                title: {text: Math.round(Math.random() * 100) + '%', position: 'center'},
                                thresholdValues: thresholdValues,
                                referenceLines: undefined
                            }
                        }
                    );
                }
                
                this.currentChildren(processes);
                
                var indicator = {
                    label: planElement.getLabel(),
                    id: planElement.getType() + planElement.getLabel(),
                    value: 1,
                    color: colorHandler.getValue(planElement.getLabel()),
                    shortDesc: planElement.getName(),
                    nodes: processes
                };
                
                this.label(indicator.label);
                this.sunburstProcessesValues([indicator]);
            };
            
            function getParents(planElement, controlPanelModel) {
                var parentElements = [];
                var planElementsArray = controlPanelModel.getPlanElementsArray();

                while (planElement.getParent()) {
                    planElement = planElement.getParent();

                    var id = planElementsArray.indexOf(planElement);
                    var statusMeterElement = this.getStatusMeterPlanElement(id);

                    parentElements.unshift(statusMeterElement);
                }

                return parentElements;
            }

            /**
             * Getter method for ControlPanel
             * @returns The ControlPanel Model.
             */
            prototype.getControlPanelModel = function () {
                return this.POASatisfactionDetailsViewModel_(theKey).controlPanelModel;
            };
            
            /**
             * Getter method for Color Handler
             * @returns The oj.ColorAttributeGroupHandler Object.
             */
            prototype.getColorHandler = function () {
                return this.POASatisfactionDetailsViewModel_(theKey).colorHandler;
            };

            function addNewPlanElementToMap(element, controlPanelModel, statusMeterPlanElementsMap) {
                var planElementIndex = controlPanelModel.getPlanElementsArray().indexOf(element);
                var statusMeterPlanElement = createStatusMeterPlanElement.call(this, planElementIndex, element);

                statusMeterPlanElementsMap[planElementIndex] = statusMeterPlanElement;
                return statusMeterPlanElement;
            }

            function createStatusMeterPlanElement(id, element) {
                var progress = Math.round(element.getProgress() * 100);
                var referenceLines = [{value: 0, color: "#000000"}];
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];

                var translatedType = this.nls("controlPanel." + element.getType());
                
                var statusMeterElement = {
                    type: translatedType,
                    text: element.getName(),
                    values: {
                        id: id,
                        min: progress < 0 ? progress : 0,
                        max: 100,
                        value: progress < 0 ? 0 : progress,
                        title: {text: progress + '%', position: 'center'},
                        thresholdValues: thresholdValues,
                        referenceLines: progress < 0 ? referenceLines : undefined
                    }
                };

                return statusMeterElement;
            }

            return POASatisfactionDetailsViewModel;
        }
);