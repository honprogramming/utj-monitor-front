/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PEItem The class representing a single strategic item.
 * @param {Function} PeTypes The Object wit all constants representing an item type.
 * @returns {Object} The parser for the Strategic Model.
 */
define(
        [
            'modules/admin/pe/model/PEItem'
        ],
        function (PEItem) {
            var PeDataParser = {
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
                    var peItems = [];
                    
                    for (var i = 0; i < data.length; i ++) {
                        createPEItem(data[i]);
                    }
                    
                    function createPEItem(item) {
                        const peItem = 
                                new PEItem(
                                    item.id,
                                    item.name,
                                    item.shortName
                                );
                        
                        peItems.push(peItem);
                    
                        return peItem;
                    }

                    return peItems;
                }
            };

            return PeDataParser;
        }
);