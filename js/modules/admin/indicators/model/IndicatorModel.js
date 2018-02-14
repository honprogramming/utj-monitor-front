define(
        function () {
            var theKey = {};

            function IndicatorModel(dataProvider) {

                var privateData = {
                    dataProvider: dataProvider,
                    itemsArray: undefined,
                    itemsMap: {}
                };

                this.IndicatorModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.itemsArray = dataProvider.getDataArray();

                var items = privateData.itemsArray.slice();

                items.forEach(item => privateData.itemsMap[item.id] = item);
            }

            var prototype = IndicatorModel.prototype;

            prototype.updateItemName = function (id, name) {
                var item = this.getItemById(id);

                if (item) {
                    item.name = name;
                }
            };

            prototype.getItems = function () {
                return this.IndicatorModel_(theKey).itemsMap;
            };
            
            prototype.getItemsArray = function () {
                return this.IndicatorModel_(theKey).itemsArray;
            };

            prototype.getItemById = function (itemId) {
                return this.getItems()[itemId];
            };

            prototype.getItemsById = function (itemIds) {
                var items = [];

                if (Array.isArray(itemIds)) {
                    itemIds.forEach(function (id) {
                        items.push(this.getItems()[id]);
                    }, this);
                } else {
                    items.push(this.getItemById(itemIds));
                }

                return items;
            };

            prototype.removeItem = function (target) {
                var items = this.getItems();

                for (var id in items) {
                    var item = items[id];

                    if (item.children.includes(target)) {
                        item.children = item.children.filter(function (value) {
                            return value !== target;
                        });

                        delete items[target.id];

                        return target;
                    }
                }
            };

            return IndicatorModel;
        }
);