/**
 * 
 * @returns {ControlPanelDataParser_L5.ControlPanelDataParser}
 */
define(['models/control-panel/PlanElementCalculated',
        'models/control-panel/PlanElement',
        'models/control-panel/PlanElementTypes'],
        function (PlanElementCalculated, PlanElement, PlanElementTypes) {
            var ControlPanelDataParser = {
                /**
                 * 
                 * @param {type} data
                 * @returns {ControlPanelDataParser_L6.ControlPanelDataParser.createNode.ControlPanelDataParserAnonym$5}
                 */
                parse: function (data) {
                    var visionObject = data["vision"];
                    var planElements = [];
                    var visionElement = new PlanElementCalculated(
                            PlanElementTypes.VISION, visionObject["label"], 
                            visionObject["name"], null, []);
                    
                    planElements.push(visionElement);
                    
                    var axesArray = visionObject[PlanElementTypes.AXES];
                    
                    for (var i = 0; i < axesArray.length; i++) {
                        var axeObject = axesArray[i];
                        var axeElement = new PlanElementCalculated(
                                PlanElementTypes.AXE, axeObject["label"],
                                axeObject["name"], visionElement, []);
                        
                        visionElement.getChildren().push(axeElement);
                        planElements.push(axeElement);
                        
                        var objectivesArray = axeObject[PlanElementTypes.OBJECTIVES];
                        for (var j = 0; j < objectivesArray.length; j++) {
                            var objectiveObject = objectivesArray[j];
                            var objectiveElement = new PlanElementCalculated(
                                    PlanElementTypes.OBJECTIVE, objectiveObject["label"],
                                    objectiveObject["name"], axeElement, []);
                                    
                            axeElement.getChildren().push(objectiveElement);
                            planElements.push(objectiveElement);

                            var indicatorsArray = objectiveObject[PlanElementTypes.INDICATORS];
                            for (var z = 0; z < indicatorsArray.length; z++) {
                                var indicatorObject = indicatorsArray[z];
                                var indicatorElement = new PlanElement(
                                        PlanElementTypes.INDICATOR, indicatorObject["label"],
                                        indicatorObject["name"], indicatorObject["goal"], 
                                        indicatorObject["achieve"], objectiveElement, null);

                                objectiveElement.getChildren().push(indicatorElement);
                                planElements.push(indicatorElement);
                            }
                        }
                    }

                    return planElements;
                }
            };
            
            return ControlPanelDataParser;
        }
);