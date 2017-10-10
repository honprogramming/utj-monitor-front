define(function () {
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

        items.forEach(function (item) {
            privateData.itemsMap[item.id] = item;
        });
    }

    var prototype = IndicatorModel.prototype;

    prototype.addItem = function (parentItemId, item) {
        var parentItem = this.getItemById(parentItemId);

        if (parentItem) {
            parentItem.children.push(item);
        }

        var itemsMap = this.getItems();
        itemsMap[item.id] = item;
    };

    prototype.updateItemName = function (id, name) {
        var item = this.getItemById(id);

        if (item) {
            item.name = name;
        }
    };

    prototype.getItems = function () {
        return this.IndicatorModel_(theKey).itemsMap;
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

    prototype.getItemsByType = function (indicatorType) {
        var items = this.getItems();
        var itemKeys = Object.keys(items);
        var itemKeys = itemKeys.filter(function (key) {
            var item = items[key];

            return item.indicatorType === indicatorType;
        });

        var typeItems = [];

        itemKeys.forEach(function (key) {
            typeItems.push(items[key]);
        });

        return typeItems;
    };

    prototype.getItemsByTypeByParent = function (type, parents) {
        var allItems = this.getItems();
        var typeItems = this.getItemsByType(type);
        var parentItems = typeItems.filter(function (element) {
            var parentItem;

            for (var i = 0; i < parents.length; i++) {
                parentItem = allItems[i];

                if (parentItem.children.includes(element)) {
                    return true;
                }
            }

            return false;
        });

        return parentItems;
    };

    return IndicatorModel;
});