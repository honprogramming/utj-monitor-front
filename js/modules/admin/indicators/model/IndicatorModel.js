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

                privateData.itemsArray = dataProvider.getDataArray().slice();

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
            
            prototype.getData = function () {
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
            
            prototype.addItem = function(item) {
                if (item.id) {
                    let items = this.getItems();
                    items[item.id] = item;
                    
                    items = this.getItemsArray();
                    items.push(item);
                }
            };
            
            prototype.removeItem = function (itemTarget) {
                let items = this.getData();
                let itemIndex = items.indexOf(itemTarget);
                
                if (itemIndex >= 0) {
                    items.splice(itemIndex, 1);
                }
                
                items = this.getItems();
                
                if (items[itemTarget.id]) {
                    delete items[itemTarget.id];
                }
            };

            return IndicatorModel;
        }
);