/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} StrategicItem The class representing a single strategic item.
 * @param {Function} StrategicTypes The Object wit all constants representing an item type.
 * @returns {Object} The parser for the Strategic Model.
 */
define(
        [
            'modules/admin/strategic/model/StrategicItem',
            'modules/admin/strategic/model/StrategicTypes'
        ],
        function (StrategicItem, StrategicTypes) {
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
                            StrategicTypes.VISION
                    );

                    strategicItems.push(visionItem);

                    var axesArray = visionObject[StrategicTypes.getPlural(StrategicTypes.AXE)];

                    for (var i = 0; i < axesArray.length; i++) {
                        var axeObject = axesArray[i];
                        var axeElement = new StrategicItem(
                                axeObject["id"],
                                axeObject["name"],
                                StrategicTypes.AXE
                        );

                        visionItem.children.push(axeElement);
                        strategicItems.push(axeElement);

                        var themesArray = axeObject[StrategicTypes.getPlural(StrategicTypes.TOPIC)];
                        for (var j = 0; j < themesArray.length; j++) {
                            var themeObject = themesArray[j];
                            var themeElement = new StrategicItem(
                                    themeObject["id"],
                                    themeObject["name"],
                                    StrategicTypes.TOPIC
                            );

                            axeElement.children.push(themeElement);
                            strategicItems.push(themeElement);

                            var objectivesArray = themeObject[StrategicTypes.getPlural(StrategicTypes.OBJECTIVE)];
                            for (var k = 0; k < objectivesArray.length; k++) {
                                var objectiveObject = objectivesArray[k];
                                var objectiveElement = new StrategicItem(
                                        objectiveObject["id"],
                                        objectiveObject["name"],
                                        StrategicTypes.OBJECTIVE
                                );

                                themeElement.children.push(objectiveElement);
                                strategicItems.push(objectiveElement);

                                var strategiesArray = objectiveObject[StrategicTypes.getPlural(StrategicTypes.STRATEGY)];
                                for (var s = 0; s < strategiesArray.length; s++) {
                                    var strategyObject = strategiesArray[s];
                                    var strategyElement = new StrategicItem(
                                            strategyObject["id"],
                                            strategyObject["name"],
                                            StrategicTypes.STRATEGY
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