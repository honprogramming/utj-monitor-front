/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} StrategicItem The class representing a single strategic item.
 * @param {Function} StrategicType The Object wit all constants representing an item type.
 * @returns {Object} The parser for the Strategic Model.
 */
define(
        [
            'models/strategic/StrategicItem',
            'models/strategic/StrategicType'
        ],
        function (StrategicItem, StrategicType) {
            var StrategicDataParser = {
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
                    var strategicItems = [];
                    var visionItem = new StrategicItem(visionObject["id"],
                            visionObject["name"], StrategicType.VISION);

                    strategicItems.push(visionItem);

                    var axesArray = visionObject[StrategicType.getPlural(StrategicType.AXE)];

                    for (var i = 0; i < axesArray.length; i++) {
                        var axeObject = axesArray[i];
                        var axeElement = new StrategicItem(axeObject["id"],
                                axeObject["name"], StrategicType.AXE);

                        visionItem.children.push(axeElement);
                        strategicItems.push(axeElement);

//                        var themesArray = axeObject[PlanElementTypes.THEMES];
//                        for (var j = 0; j < themesArray.length; j++) {
//                            var themeObject = themesArray[j];
//                            var themeElement = new PlanElement(
//                                    PlanElementTypes.THEME, themeObject["label"],
//                                    themeObject["name"], axeElement, []);
//
//                            axeElement.getChildren().push(themeElement);
//                            planElements.push(themeElement);
//
//                            var objectivesArray = themeObject[PlanElementTypes.OBJECTIVES];
//                            for (var k = 0; k < objectivesArray.length; k++) {
//                                var objectiveObject = objectivesArray[k];
//                                var objectiveElement = new PlanElementCalculated(
//                                        PlanElementTypes.OBJECTIVE, objectiveObject["label"],
//                                        objectiveObject["name"], axeElement, [],
//                                        objectiveObject["responsibles"]);

//                                themeElement.getChildren().push(objectiveElement);
//                                axeElement.getChildren().push(objectiveElement);
//                                planElements.push(objectiveElement);
//
//                                var indicatorsArray = objectiveObject[PlanElementTypes.INDICATORS];
//                                for (var z = 0; z < indicatorsArray.length; z++) {
//                                    var indicatorObject = indicatorsArray[z];
//                                    var indicatorElement = new PlanElementMeasurable(
//                                            PlanElementTypes.INDICATOR, indicatorObject["label"],
//                                            indicatorObject["name"], indicatorObject["goal"],
//                                            indicatorObject["achieve"], objectiveElement, null,
//                                            indicatorObject["responsibles"]);
//
//                                    objectiveElement.getChildren().push(indicatorElement);
//                                    planElements.push(indicatorElement);
//                                }
//
//                                var strategiesArray = objectiveObject[PlanElementTypes.STRATEGIES];
//                                for (var s = 0; s < strategiesArray.length; s++) {
//                                    var strategyObject = strategiesArray[s];
//                                    var strategyElement = new PlanElement(
//                                            PlanElementTypes.STRATEGY, strategyObject["label"],
//                                            strategyObject["name"], objectiveElement, null
//                                            );
//
//                                    objectiveElement.getChildren().push(strategyElement);
//                                }
//                            }
//                        }
                    }

                    return strategicItems;
                }
            };

            return StrategicDataParser;
        }
);