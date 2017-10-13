/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PeItem The class representing a single strategic item.
 * @param {Function} PeTypes The Object wit all constants representing an item type.
 * @returns {Object} The parser for the Strategic Model.
 */
define(
        [
            'modules/admin/pe/model/PeItem',
        ],
        function (PeItem) {
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
                    var peItemsMap = {};
                    var vision = data[0];

                    createPeItem(vision);

                    function createPeItem(item) {
                        var peItem = 
                                new PeItem(
                                    item.id,
                                    item.name,
                                );
                        
                        peItems.push(peItem);
                        peItemsMap[peItem.id] = peItem;
                    
                        if (item.children) {
                            item.children.forEach(
                                    function (item) {
                                        peItem.children.push(createPeItem(item));
                                    }
                            );

                        }
                        
                        return peItem;
                    }

                    return peItems;
                }
            };

            return PeDataParser;
        }
);