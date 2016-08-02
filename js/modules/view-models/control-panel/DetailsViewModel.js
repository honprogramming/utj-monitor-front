define(['knockout', 'view-models/GeneralViewModel',
        'models/control-panel/PlanElementTypes',
        'view-models/events/EventTypes',
        'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge', 'ojs/ojcollapsible'],
        function (ko, GeneralViewModel, PlanElementTypes, EventTypes) {
            var theKey = {};

            function DetailsViewModel(controlPanelModel) {
                var self = this;
                this.listeners = [];
                
                var privateData = {
                    controlPanelModel: controlPanelModel,
                    statusMeterPlanElementsMap: {},
                    collapsiblePanelTitles: ["Ver mas", "Ocultar"]
                };

                this.ControlPanelDetails_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                this.selectedPlanElement = ko.observable();
                this.currentParents = ko.observableArray();
                this.currentChildren = ko.observableArray();
                this.childrenType = ko.observable();
                this.collapsibleParentsPanelTitle = ko.observable(privateData.collapsiblePanelTitles[0]);
                this.collapsibleChildrenPanelTitle = ko.observable(privateData.collapsiblePanelTitles[0]);

                this.collapseParentsHandler = function (event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleParentsPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };

                this.collapseChildrenHandler = function (event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleChildrenPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };

                this.clickHandler = function (data, event) {
                    self.onClick(data.clickHandlerValue);
                };
            }

            DetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = DetailsViewModel.prototype;
            
            prototype.addSelectionListener = function(listener) {
                this.addListener(listener, EventTypes.SELECTION_EVENT);
            };
            
            prototype.onClick = function (selectedPlanElementId) {
                var controlPanelModel = this.getControlPanelModel();
                var selectedPlanElement = controlPanelModel.getPlanElementsArray()[selectedPlanElementId];
                this.setSelectedItem(selectedPlanElement);
                this.callListeners(EventTypes.SELECTION_EVENT, selectedPlanElement);
            };

            prototype.setSelectedItem = function (selectedPlanElement) {
                var controlPanelModel = this.getControlPanelModel();
                var planElementIndex = controlPanelModel.getPlanElementsArray().indexOf(selectedPlanElement);

                var statusMeterPlanElement = this.getStatusMeterPlanElement(planElementIndex);

                this.selectedPlanElement(statusMeterPlanElement);
                this.updateParents(selectedPlanElement);
                this.updateChildren(selectedPlanElement);
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
                return this.ControlPanelDetails_(theKey).statusMeterPlanElementsMap;
            };

            prototype.updateChildren = function (selectedPlanElement) {
                var childrenPlanElement = [];
                var planElementsArray = this.getControlPanelModel().getPlanElementsArray();
                var children = selectedPlanElement.getChildren();
                
                if (selectedPlanElement.getType() === PlanElementTypes.AXE) {
                    var objectives = [];

                    for (var i = 0; i < children.length; i++) {
                        children[i].getChildren().forEach(
                                function (objective) {
                                    objectives.push(objective);
                                }
                        );
                    }
                    
                    children = objectives;
                }
                
                if (children) {
                    for (var i = 0; i < children.length; i++) {
                        var child = this.getStatusMeterPlanElement(planElementsArray.indexOf(children[i]));
                        childrenPlanElement.push(child);
                    }

                    this.childrenType(this.nls("controlPanel." + PlanElementTypes.getPlural(children[0].getType())));
                }

                this.currentChildren(childrenPlanElement);
            };

            prototype.updateParents = function (selectedPlanElement) {
                var parents = getParents.call(this, selectedPlanElement,
                        this.getControlPanelModel(), this.getStatusMeterPlanElementsMap());
                this.currentParents(parents);
            };

            function getParents(planElement, controlPanelModel) {
                var parentElements = [];
                var planElementsArray = controlPanelModel.getPlanElementsArray();
                
                while (planElement.getParent()) {
                    planElement = planElement.getParent();
                    
                    if (planElement.getType() === PlanElementTypes.THEME) {
                        planElement = planElement.getParent();
                    }
                    
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
                return this.ControlPanelDetails_(theKey).controlPanelModel;
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
                    clickHandlerValue: id,
                    values: {
                        id: id,
                        min: progress < 0 ? progress : 0,
                        max: 100,
                        value: progress < 0 ? 0 : progress,
                        title: {text: progress + '%', position: 'center'},
                        thresholdValues: thresholdValues,
                        referenceLines: progress < 0 ? referenceLines : undefined
//                        ,
//                        tooltipRenderer: toolTipStatusMeter
                    }
                };

                return statusMeterElement;

//                function toolTipStatusMeter(dataContext) {
//                    var id = dataContext.component()[0].id;
//                    var element = planElementsMap[id];
//                    var achieve = element["node"]["achieve"];
//                    var goal = element["node"]["goal"];
//                    
//                    //add to a <table>
//                    var toolTip = document.createElement("div");
//                    var toolTipValue = document.createElement("div");
//                    var toolTipTextValue = document.createTextNode("value: " + achieve);
//                    toolTipValue.appendChild(toolTipTextValue);
//                    toolTip.appendChild(toolTipValue);
//                    
//                    var toolTipGoal = document.createElement("div");
//                    var toolTipTextGoal = document.createTextNode("goal: " + goal);
//                    toolTipGoal.appendChild(toolTipTextGoal);
//                    toolTip.appendChild(toolTipGoal);
//
//                    return toolTip;
//                }
            }

            return DetailsViewModel;
        }
);