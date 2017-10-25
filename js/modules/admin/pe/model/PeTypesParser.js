/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PeType The Object wit all constants representing a strategic type.
 * @returns {Object} The parser for the PE Types Model.
 */
define(
        [
            'modules/admin/pe/model/PeItem',
            'modules/admin/pe/model/PeType'
        ],
        function (PeType) {
            var PeTypesParser = {
                /**
                 * Parses the data from JSON format into an Array of
                 * StrategicType objects.
                 * 
                 * @param {Object} data An Object in JSON format with the data
                 * to parse.
                 * @returns {Array} An Array containing StrategicType objects.
                 */
                parse: function (data) {
                    var peTypes = [];
                    
                    if (Array.isArray(data)) {
                        data.forEach(
                                function(jsonType) {
                                    peTypes.push(new PeType(jsonType["id"], jsonType["name"]));
                                }
                        );
                    }
                    
                    return peTypes;
                }
            };

            return PeTypesParser;
        }
);