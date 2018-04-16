/**
 * Indicator Data Parser.
 * 
 * @param {type} SummaryIndicator
 */
define(
        [
            'modules/admin/indicators/model/SummaryIndicator'
        ],
        function (SummaryIndicator) {

            var IndicatorDataParser = {

                parse: function (data) {

                    // Indicator items array
                    let indicatorItems = [];

                    data.forEach(element => createIndicator(element));

                    /**
                     * Creates an Indicator Item..
                     * 
                     * @param {type} item
                     */
                    function createIndicator(item) {

                        // Creates a new Indicator item based on the param values.
                        let indicator = new SummaryIndicator(
                                item.id,
                                item.name,
                                item.status,
                                item.strategicItem,
                                item.description,
                                item.direction,
                                item.measureUnit,
                                item.baseYear
                        );

                        // Add the new Indicator item to items array
                        indicatorItems.push(indicator);

                        return indicator;
                    }

                    return indicatorItems;
                }
            };

            return IndicatorDataParser;
        }
);