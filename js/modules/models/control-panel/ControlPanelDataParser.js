/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PlanElement The parent class of all plan elements.
 * @param {Function} PlanElementCalculated A plan element class which some of their values
 * are calculated based on its children values.
 * @param {Function} PlanElementMeasurable A plan element class with basic information for a plan element.
 * @param {Object} PlanElementTypes An Object with constants defining the
 * different types of plan elements.
 * @returns {Object} The parser for the Control Panel Model.
 */
define(
        [
            'models/control-panel/PlanElement',
            'models/control-panel/PlanElementCalculated',
            'models/control-panel/PlanElementMeasurable',
            'models/control-panel/PlanElementTypes'
        ],
        function (PlanElement, PlanElementCalculated, PlanElementMeasurable, PlanElementTypes) {
            var ControlPanelDataParser = {
                /**
                 * Parses the data from JSON format into an Array of
                 * PlanElementCalculated and PlanElementMeasurable objects.
                 * 
                 * @param {Object} data An Object in JSON format with the data
                 * to parse.
                 * @returns {Array} An Array containing PlanElementCalculated 
                 * and PlanElementMeasurable objects.
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
                                axeObject["name"], visionElement, [], axeObject["responsibles"]);

                        visionElement.getChildren().push(axeElement);
                        planElements.push(axeElement);

                        var themesArray = axeObject[PlanElementTypes.THEMES];
                        for (var j = 0; j < themesArray.length; j++) {
                            var themeObject = themesArray[j];
//                            var themeElement = new PlanElementCalculated(
//                                    PlanElementTypes.THEME, themeObject["label"],
//                                    themeObject["name"], axeElement, []);
//
//                            axeElement.getChildren().push(themeElement);
//                            planElements.push(themeElement);

                            var objectivesArray = themeObject[PlanElementTypes.OBJECTIVES];
                            for (var k = 0; k < objectivesArray.length; k++) {
                                var objectiveObject = objectivesArray[k];
                                var objectiveElement = new PlanElementCalculated(
                                        PlanElementTypes.OBJECTIVE, objectiveObject["label"],
                                        objectiveObject["name"], axeElement, [],
                                        objectiveObject["responsibles"]);

//                                themeElement.getChildren().push(objectiveElement);
                                axeElement.getChildren().push(objectiveElement);
                                planElements.push(objectiveElement);

                                var indicatorsArray = objectiveObject[PlanElementTypes.INDICATORS];
                                for (var z = 0; z < indicatorsArray.length; z++) {
                                    var indicatorObject = indicatorsArray[z];
                                    var indicatorElement = new PlanElementMeasurable(
                                            PlanElementTypes.INDICATOR, indicatorObject["label"],
                                            indicatorObject["name"], indicatorObject["goal"],
                                            indicatorObject["achieve"], objectiveElement, null,
                                            indicatorObject["responsibles"]);

                                    objectiveElement.getChildren().push(indicatorElement);
                                    planElements.push(indicatorElement);
                                }

                                var strategiesArray = objectiveObject[PlanElementTypes.STRATEGIES];
                                for (var s = 0; s < strategiesArray.length; s++) {
                                    var strategyObject = strategiesArray[s];
                                    var strategyElement = new PlanElement(
                                            PlanElementTypes.STRATEGY, strategyObject["label"],
                                            strategyObject["name"], objectiveElement, null
                                            );

                                    objectiveElement.getChildren().push(strategyElement);
                                }
                            }
                        }
                    }

                    return planElements;
                }
            };

            return ControlPanelDataParser;
        }
);