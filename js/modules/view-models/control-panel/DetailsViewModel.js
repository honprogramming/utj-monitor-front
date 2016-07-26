define(['knockout', 'view-models/GeneralViewModel',
    'models/control-panel/PlanElementTypes',,
    'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge', 'ojs/ojcollapsible'],
        function (ko, GeneralViewModel, PlanElementTypes) {
            var theKey = {};

            function DetailsViewModel(controlPanelModel) {
                var self = this;
                var privateData = {
                    controlPanelModel: controlPanelModel,
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
                
                this.onCollapseParents = function(event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleParentsPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
                
                this.onCollapseChildren = function(event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleChildrenPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
            }

            DetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = DetailsViewModel.prototype;

            prototype.setSelectedItem = function (selectedPlanElement) {
                var controlPanelModel = this.getControlPanelModel();
                this.selectedPlanElement(createStatusMeterPlanElement.call(this, 
                        selectedPlanElement, controlPanelModel));
                this.updateParents(selectedPlanElement, controlPanelModel);
                this.updateChildren(selectedPlanElement, controlPanelModel);
            };

            prototype.updateChildren = function (selectedPlanElement, controlPanelModel) {
                var childrenPlanElement = [];
                
                var children = selectedPlanElement.getChildren();
                if(children) {
                    for (var i = 0; i < children.length; i ++) {
                        var child = createStatusMeterPlanElement.call(this, children[i], controlPanelModel);
                        childrenPlanElement.push(child);
                    }
                }
                
                this.currentChildren(childrenPlanElement);
                this.childrenType(this.nls("controlPanel." + PlanElementTypes.getPlural(children[0].getType())));
            };
            
            prototype.updateParents = function (selectedPlanElement, controlPanelModel) {
                var parents = this.getParents(selectedPlanElement, controlPanelModel);
                this.currentParents(parents);
            };
            
            prototype.getParents = function (planElement, controlPanelModel) {
                var parentElements = [];
                var id = controlPanelModel.getPlanElementsArray().indexOf(planElement);
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];

                var referenceLines = [{value: 0, color: "#000000"}];

                while (planElement.getParent()) {
                    planElement = planElement.getParent();
                    var progress = Math.round(planElement.getProgress() * 100);

                    var statusMeterElement = {
                        type: this.nls("controlPanel." + planElement.getType()),
                        text: planElement.getName(),
                        values: {
                            id: id,
                            min: progress < 0 ? progress : 0,
                            max: 100,
                            value: progress < 0 ? 0 : progress,
                            title: {text: progress + '%', position: "center"},
                            thresholdValues: thresholdValues,
                            referenceLines: progress < 0 ? referenceLines : undefined
//                            ,
//                            tooltipRenderer: toolTipStatusMeter
                        }
                    };

                    parentElements.unshift(statusMeterElement);
                }
                
                return parentElements;
            };
            /**
             * Getter method for ControlPanel
             * @returns The ControlPanel Model.
             */
            prototype.getControlPanelModel = function () {
                return this.ControlPanelDetails_(theKey).controlPanelModel;
            };
            
            function createStatusMeterPlanElement(element, controlPanelModel) {
                var progress = element.getProgress() * 100;
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
                        id: controlPanelModel.getPlanElementsArray().indexOf(element),
                        min: progress < 0 ? progress : 0,
                        max: 100,
                        value: progress < 0 ? 0 : progress,
                        title: {text: progress + '%', position: "center"},
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