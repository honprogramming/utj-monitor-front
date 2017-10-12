/**
 * Indicator Data Parser.
 * 
 * @param {type} IndicatorItem
 * @param {type} IndicatorTypes
 * @returns {IndicatorDataParserL#7.IndicatorDataParser}
 */
define([
    'modules/admin/indicators/model/IndicatorItem',
    'modules/admin/indicators/model/IndicatorTypes'
], function (IndicatorItem, IndicatorTypes) {

    var IndicatorDataParser = {

        parse: function (data) {

            // Indicator items array
            var indicatorItems = [];
            var indicatorItemsMap = {};
            var typesMap = IndicatorTypes.getTypesMap();

            var vision = data[0];

            createIndicatorItem(vision);

            /**
             * Creates an Indicator Item..
             * 
             * @param {type} item
             * @returns {IndicatorDataParserL#4.IndicatorItem}
             */
            function createIndicatorItem(item) {

                // Creates a new Indicator item based on the param values.
                var indicatorItem = new IndicatorItem(
                    item.id, 
                    item.name, 
                    typesMap[item.type.name]
                );

                // Add the new Indicator item to items array
                indicatorItems.push(indicatorItem);

                // Add item's ID to items map array
                indicatorItemsMap[indicatorItem.id] = indicatorItem;

                // If Item has children
                if (item.children) {
                    // For each child
                    item.children.forEach(function (item) {
                        // Add new Indicator Item to children array
                        indicatorItem.children.push(createIndicatorItem(item));
                    });
                }

                return indicatorItem;
            }

            return indicatorItems;
        }
    };

    return IndicatorDataParser;
});