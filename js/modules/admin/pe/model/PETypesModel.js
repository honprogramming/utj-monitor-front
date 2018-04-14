define(
        function () {
            var theKey = {};

            function PETypesModel(data) {
                let privateData = {
                    data,
                    itemsArray: undefined,
                    itemsMap: {}
                };

                this.PETypesModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.itemsArray = data.slice();

                let items = privateData.itemsArray.slice();

                items.forEach(
                    function(item) {
                        privateData.itemsMap[item.id] = item;
                    }
                );
            }

            var prototype = PETypesModel.prototype;
            
            prototype.addItem = function (item) {
                const itemsMap = this.getItems();
                const itemsArray = this.getData();
                
                itemsArray.push(item);
                itemsMap[item.id] = item;
            };
            
            prototype.updateItemName = function(id, name) {
                var item = this.getItemById(id);
                
                if (item) {
                    item.name = name;
                }
            };
            
            prototype.getItems = function () {
                return this.PETypesModel_(theKey).itemsMap;
            };
            
            prototype.getData = function () {
                return this.PETypesModel_(theKey).itemsArray;
            };

            prototype.getItemById = function (itemId) {
                return this.getItems()[itemId];
            };

            prototype.getItemsById = function (itemIds) {
                var items = [];

                if (Array.isArray(itemIds)) {
                    itemIds.forEach(
                            function (id) {
                                items.push(this.getItems()[id]);
                            }
                    , this);
                } else {
                    items.push(this.getItemById(itemIds));
                }
                
                return items;
            };

            prototype.removeItem = function (target) {
                const items = this.getItems();
                const item = items[target.id];
                
                let index = 0;
                this.getData().forEach(
                    (type, typeIndex) => {
                        if (type.id === target.id) {
                            index = typeIndex;
                        }
                    }
                );
                
                this.getData().splice(index, 1);
                delete items[target.id];
            };

            return PETypesModel;
        }
);