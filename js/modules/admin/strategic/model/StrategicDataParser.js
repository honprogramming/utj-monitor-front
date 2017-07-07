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
                    var strategicItems = [];
                    var strategicItemsMap = {};
                    var typesMap = StrategicTypes.getTypesMap();
                    var vision = data[0];

                    createStrategicItem(vision);

                    function createStrategicItem(item) {
                        var strategicItem = 
                                new StrategicItem(
                                    item.id,
                                    item.name,
                                    typesMap[item.strategicType.name]
                                );
                        
                        strategicItems.push(strategicItem);
                        strategicItemsMap[strategicItem.id] = strategicItem;
                    
                        if (item.children) {
                            item.children.forEach(
                                    function (item) {
                                        strategicItem.children.push(createStrategicItem(item));
                                    }
                            );

                        }
                        
                        return strategicItem;
                    }

                    return strategicItems;
                }
            };

            return StrategicDataParser;
        }
);