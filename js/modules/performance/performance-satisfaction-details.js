define(
        [   
            'ojs/ojcore',
            'knockout',            
            'view-models/GeneralViewModel',
            'events/EventTypes',
            'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge', 'ojs/ojcollapsible', 
            'ojs/ojmasonrylayout', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojsunburst'
        ],
        function (oj, ko, GeneralViewModel, EventTypes) {
            var theKey = {};

            function PerformanceSatisfactionDetailsViewModel(params) {
                var self = this;
                this.listeners = [];

                var privateData = {
                    model: params.model,
                    statusMeterElementsMap: {},
                    collapsiblePanelTitles: ["Ver mas", "Ocultar"],
                    cardModel: undefined,
                    colorHandler: new oj.ColorAttributeGroupHandler()
                };

                this.PerformanceSatisfactionDetailsViewModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                this.selectedElement = ko.observable();
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

            PerformanceSatisfactionDetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = PerformanceSatisfactionDetailsViewModel.prototype;
            
            prototype.getCardModel = function() {
                return this.PerformanceSatisfactionDetailsViewModel_(theKey).cardModel;
            };
            
            prototype.setCardModel = function(cardModel) {
                this.PerformanceSatisfactionDetailsViewModel_(theKey).cardModel = cardModel;
            };
            
            prototype.isIndicator = function(type) {
                return type.match(/indica.*/i);
            };
            
            prototype.setSelectedItem = function (id) {
                let model = this.getModel();
                let elementsMap = model.getElementsMap();
                let selectedElement = elementsMap[id];
                var statusMeterElement = this.getStatusMeterElement(selectedElement);
                        
                this.selectedElement(statusMeterElement);
                this.updateParents(selectedElement);
                this.updateSunburstProcesses(selectedElement);
            };

            prototype.getStatusMeterElement = function (element) {
                var statusMeterElementsMap = this.getStatusMeterElementsMap();
                var statusMeterElement = statusMeterElementsMap[element.getId()];

                if (!statusMeterElement) {
                    return addNewElementToMap.call(this, element, statusMeterElementsMap);
                } else {
                    return statusMeterElement;
                }
            };

            prototype.getStatusMeterElementsMap = function () {
                return this.PerformanceSatisfactionDetailsViewModel_(theKey).statusMeterElementsMap;
            };

            prototype.updateParents = function (selectedElement) {
                var parents = getParents.call(this, selectedElement);
                this.currentParents(parents);
            };
            
            prototype.updateSunburstProcesses = function(element) {
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
                    label: element.getName(),
                    id: element.getId(),
                    value: 1,
                    color: colorHandler.getValue(element.getName()),
                    shortDesc: element.getName(),
                    nodes: processes
                };
                
                this.label(indicator.label);
                this.sunburstProcessesValues([indicator]);
            };
            
            function getParents(element) {
                var parentElements = [];
                
                while (element.getParent()) {
                    element = element.getParent();

                    var statusMeterElement = this.getStatusMeterElement(element);

                    parentElements.unshift(statusMeterElement);
                }

                return parentElements;
            }

            /**
             * Getter method for ControlPanel
             * @returns The ControlPanel Model.
             */
            prototype.getModel = function () {
                return this.PerformanceSatisfactionDetailsViewModel_(theKey).model;
            };
            
            /**
             * Getter method for Color Handler
             * @returns The oj.ColorAttributeGroupHandler Object.
             */
            prototype.getColorHandler = function () {
                return this.PerformanceSatisfactionDetailsViewModel_(theKey).colorHandler;
            };

            function addNewElementToMap(element, statusMeterElementsMap) {
                var statusMeterElement = createStatusMeterElement.call(this, element);

                statusMeterElementsMap[element.getId()] = statusMeterElement;
                return statusMeterElement;
            }

            function createStatusMeterElement(element) {
                var progress = Math.round(Math.random() * 100);
                var referenceLines = [{value: 0, color: "#000000"}];
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];

                var statusMeterElement = {
                    type: "Responsible type",
                    text: element.getName(),
                    values: {
                        id: element.getId(),
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

            return PerformanceSatisfactionDetailsViewModel;
        }
);