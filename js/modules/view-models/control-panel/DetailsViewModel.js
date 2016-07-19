define(['knockout', 'view-models/GeneralViewModel',
    'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge', 'ojs/ojcollapsible'],
        function (ko, GeneralViewModel) {
            var theKey = {};

            function DetailsViewModel(controlPanelModel) {
                var self = this;
                var privateData = {
                    controlPanelModel: controlPanelModel,
                    collapsiblePanelTitles: ["Click para ver", "Click para ocultar"]
                };

                this.ControlPanelDetails_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                this.thresholdValues = [{max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"}, {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}];
                this.referenceLines = [{value: 0, color: "#000000"}];
                this.min = -20; //if value is negative then min = value else min = 0
                this.max = 100;
                this.value = 95;
                this.title = {text: "value: " + this.value, position: "center"};
                this.selectedPlanElement = ko.observable();
                this.currentParents = ko.observableArray();
                this.currentChildren = ko.observableArray();
                this.collapsibleParentsPanelTitle = ko.observable(privateData.collapsiblePanelTitles[1]);
                this.collapsibleChildrenPanelTitle = ko.observable(privateData.collapsiblePanelTitles[1]);
                
                this.onChangeParents = function(event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleParentsPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
                
                this.onChangeChildren = function(event, ui) {
                    if (ui["option"] === "expanded") {
                        self.collapsibleChildrenPanelTitle(privateData.collapsiblePanelTitles[ui["value"] ? 1 : 0]);
                    }
                };
            }

            DetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = DetailsViewModel.prototype;

            prototype.setSelectedItemId = function (selectedPlanElementId) {
                this.updateSelectedPlanElement(selectedPlanElementId);
                this.updateParents(selectedPlanElementId);
                this.updateChildren(selectedPlanElementId);
            };

            prototype.updateSelectedPlanElement = function (selectedPlanElementId) {
                var controlPanelModel = this.getControlPanelModel();
                var planElementsMap = controlPanelModel.getPlanElementsMap();
                var element = planElementsMap[selectedPlanElementId];
                
                this.selectedPlanElement(createStatusMeterPlanElement(element));
            };

            prototype.updateChildren = function (selectedPlanElementId) {
                var controlPanelModel = this.getControlPanelModel();
                var planElementsMap = controlPanelModel.getPlanElementsMap();
                var element = planElementsMap[selectedPlanElementId];
                var childrenPlanElement = [];
                
                var children = element["children"];
                if(children) {
                    for (var i = 0; i < children.length; i ++) {
                        var child = createStatusMeterPlanElement(planElementsMap[children[i]]);
                        childrenPlanElement.push(child);
                    }
                }
                
                this.currentChildren(childrenPlanElement);
            };
            
            prototype.updateParents = function (selectedPlanElementId) {
                var controlPanelModel = this.getControlPanelModel();

                var parents = controlPanelModel.getParents(selectedPlanElementId);
                this.currentParents(parents);
            };

            /**
             * Getter method for ControlPanel
             * @returns The ControlPanel Model.
             */
            prototype.getControlPanelModel = function () {
                return this.ControlPanelDetails_(theKey).controlPanelModel;
            };
            
            function createStatusMeterPlanElement(element) {
                var progress = element["node"]["achieve"] / element["node"]["goal"] * 100;
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];
                
                var statusMeterElement = {
                    type: element["node"]["type"],
                    text: element["node"]["name"],
                    values: {
                        id: element["id"],
                        min: progress < 0 ? progress : 0,
                        max: 100,
                        value: progress < 0 ? 0 : progress,
                        title: {text: progress + '%', position: "center"},
                        thresholdValues: thresholdValues,
                        referenceLines: progress < 0 ? referenceLines : undefined,
                        tooltipRenderer: toolTipStatusMeter
                    }
                };
                
                return statusMeterElement;
                
                function toolTipStatusMeter(dataContext) {
                    var id = dataContext.component()[0].id;
                    var element = planElementsMap[id];
                    var achieve = element["node"]["achieve"];
                    var goal = element["node"]["goal"];
                    
                    //add to a <table>
                    var toolTip = document.createElement("div");
                    var toolTipValue = document.createElement("div");
                    var toolTipTextValue = document.createTextNode("value: " + achieve);
                    toolTipValue.appendChild(toolTipTextValue);
                    toolTip.appendChild(toolTipValue);
                    
                    var toolTipGoal = document.createElement("div");
                    var toolTipTextGoal = document.createTextNode("goal: " + goal);
                    toolTipGoal.appendChild(toolTipTextGoal);
                    toolTip.appendChild(toolTipGoal);

                    return toolTip;
                }
            }
            
            return DetailsViewModel;
        }
);