define(
    [
        'modules/admin/indicators/model/IndicatorItem',
        'modules/admin/indicators/model/IndicatorType'
    ], function (IndicatorType) {
        var IndicatorTypesParser = {

            parse: function (data) {
                var indicatorTypes = [];

                if (Array.isArray(data)) {
                    data.forEach(
                        function (object) {
                            indicatorTypes.push(new IndicatorType(object["id"], object["name"]));
                        }
                    );
                }

                return indicatorTypes;
            }
        };

        return IndicatorTypesParser;
    }
);