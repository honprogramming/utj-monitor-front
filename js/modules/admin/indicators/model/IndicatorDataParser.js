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
                        let name;
                        
                        if (item.type.id === 3) {
                            const peTypeName = item.pe ? item.pe.type : '';
                            const peName = item.pe ? item.pe.name : '';
                            const pideIndicatorName = item.pideIndicator ? item.pideIndicator.name : '';
                            name = `${peTypeName} -> ${peName} -> ${pideIndicatorName}`;
                        } else {
                            name = item.name;
                        }
                        
                        // Creates a new Indicator item based on the param values.
                        let indicator = new SummaryIndicator(
                                item.id,
                                item.type,
                                name,
                                item.status,
                                item.strategicItem,
                                item.description,
                                item.periodicity
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