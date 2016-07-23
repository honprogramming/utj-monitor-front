define([],
        function () {
            var theKey = {};

            function ControlPanel(dataProvider) {
                var self = this;

                var privateData = {
                    dataProvider: dataProvider,
                    planElementsArray: undefined
                };

                this.ControlPanel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.planElementsArray = dataProvider.getDataArray();
            }

            var prototype = ControlPanel.prototype;

//            prototype.getChildren = function (planElement) {
//                var planElementsArray = this.getPlanElementsArray();
//
//                return planElementsArray[planElementId]["children"];
//            };

            prototype.getParents = function (planElementId) {
                var parentElements = [];
                var planElementsArray = this.getPlanElementsArray();
                var element = planElementsArray[planElementId];
                var thresholdValues = [
                    {max: 39, color: "#DF0101"},
                    {max: 59, color: "#FE9A2E"},
                    {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}
                ];

                var referenceLines = [{value: 0, color: "#000000"}];

                while (element["parent"]) {
                    element = planElementsArray[element["parent"]];
                    var progress = element["node"]["achieve"] / element["node"]["goal"] * 100;

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

                    parentElements.unshift(statusMeterElement);
                }

                function toolTipStatusMeter(dataContext) {
                    var id = dataContext.component()[0].id;
                    var element = planElementsArray[id];
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

                return parentElements;
            };

            prototype.getPlanElementName = function (planElementId) {
                var element = this.getPlanElementsArray()[planElementId];

                try {
                    return element["node"]["name"];
                } catch (error) {
                    console.debug(error);
                }
            };

            prototype.getPlanElementsArray = function () {
                return this.ControlPanel_(theKey).planElementsArray;
            };

            return ControlPanel;
        }
);