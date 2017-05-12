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
                    var visionItem = new StrategicItem(
                            visionObject["id"],
                            visionObject["name"],
                            StrategicType.VISION
                    );

                    strategicItems.push(visionItem);

                    var axesArray = visionObject[StrategicType.getPlural(StrategicType.AXE)];

                    for (var i = 0; i < axesArray.length; i++) {
                        var axeObject = axesArray[i];
                        var axeElement = new StrategicItem(
                                axeObject["id"],
                                axeObject["name"],
                                StrategicType.AXE
                        );

                        visionItem.children.push(axeElement);
                        strategicItems.push(axeElement);

                        var themesArray = axeObject[StrategicType.getPlural(StrategicType.THEME)];
                        for (var j = 0; j < themesArray.length; j++) {
                            var themeObject = themesArray[j];
                            var themeElement = new StrategicItem(
                                    themeObject["id"],
                                    themeObject["name"],
                                    StrategicType.THEME
                            );

                            axeElement.children.push(themeElement);
                            strategicItems.push(themeElement);

                            var objectivesArray = themeObject[StrategicType.getPlural(StrategicType.OBJECTIVE)];
                            for (var k = 0; k < objectivesArray.length; k++) {
                                var objectiveObject = objectivesArray[k];
                                var objectiveElement = new StrategicItem(
                                        objectiveObject["id"],
                                        objectiveObject["name"],
                                        StrategicType.OBJECTIVE
                                );

                                themeElement.children.push(objectiveElement);
                                strategicItems.push(objectiveElement);

                                var strategiesArray = objectiveObject[StrategicType.getPlural(StrategicType.STRATEGY)];
                                for (var s = 0; s < strategiesArray.length; s++) {
                                    var strategyObject = strategiesArray[s];
                                    var strategyElement = new StrategicItem(
                                            strategyObject["id"],
                                            strategyObject["name"],
                                            StrategicType.STRATEGY
                                    );

                                    objectiveElement.children.push(strategyElement);
                                    strategicItems.push(strategyElement);
                                }
                            }
                        }
                    }

                    return strategicItems;
                }
            };

            return StrategicDataParser;
        }
);