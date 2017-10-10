define([
    'modules/admin/indicators/model/IndicatorItem',
    'modules/admin/indicators/model/IndicatorType'
], function (IndicatorType) {
    var IndicatorTypesParser = {
        
        parse: function (data) {
            var indicatorTypes = [];

            if (Array.isArray(data)) {
                data.forEach(function (jsonType) {
                    indicatorTypes.push(new IndicatorType(jsonType["id"], jsonType["name"]));
                });
            }

            return indicatorTypes;
        }
    };

    return IndicatorTypesParser;
});