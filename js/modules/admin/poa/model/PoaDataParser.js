/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PeItem The class representing a single strategic item.
 * @param {Function} PeTypes The Object wit all constants representing an item type.
 * @returns {Object} The parser for the Strategic Model.
 */
define(
        [
            'modules/admin/poa/model/StrategicItem'
        ],
        function (PoaItem) {
            var PoaDataParser = {
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
                    var poaItems = [];
                    
                    for (var i = 0; i < data.length; i ++) {
                        createPoaItem(data[i]);
                    }
                    
                    function createPoaItem(item) {
                        var poaItem = 
                                new PoaItem(
                                    item.id,
                                    item.name,
                                    item.shortName
                                );
                        
                        poaItems.push(poaItem);
                    
                        return poaItem;
                    }

                    return poaItems;
                }
            };

            return PoaDataParser;
        }
);


