/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} StrategicType The Object wit all constants representing a strategic type.
 * @returns {Object} The parser for the Strategic Types Model.
 */
define(
        [
            'modules/admin/strategic/model/StrategicItem',
            'modules/admin/strategic/model/StrategicType'
        ],
        function (StrategicType) {
            var StrategicTypesParser = {
                /**
                 * Parses the data from JSON format into an Array of
                 * StrategicType objects.
                 * 
                 * @param {Object} data An Object in JSON format with the data
                 * to parse.
                 * @returns {Array} An Array containing StrategicType objects.
                 */
                parse: function (data) {
                    var strategicTypes = [];
                    
                    if (Array.isArray(data)) {
                        data.forEach(
                                function(jsonType) {
                                    strategicTypes.push(new StrategicType(jsonType["id"], jsonType["name"]));
                                }
                        );
                    }
                    
                    return strategicTypes;
                }
            };

            return StrategicTypesParser;
        }
);