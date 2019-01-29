define(
        function () {
            var theKey = {};

            function PEModel(dataProvider) {
                const privateData = {
                    dataProvider,
                    itemsArray: undefined,
                    types: [],
                    itemsMap: {}
                };

                this.PEModel_ = (key) => {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.itemsArray = dataProvider.getDataArray();

                let items = privateData.itemsArray.slice();

                items.forEach(
                    function(item) {
                        privateData.itemsMap[item.id] = item;
                    }
                );
            }

            var prototype = PEModel.prototype;
            
            prototype.setTypes = function(types) {
                this.PEModel_(theKey).types = types;
            };
            
            prototype.getTypes = function() {
                return this.PEModel_(theKey).types;
            };
            
            prototype.addItem = function (item) {
                const itemsMap = this.getItems();
                const itemsArray = this.getData();
                itemsMap[item.id] = item;
                itemsArray.push(item);
            };
            
            prototype.updateItemName = function(id, name) {
                var item = this.getItemById(id);
                
                if (item) {
                    item.name = name;
                }
            };
            
            prototype.getItems = function () {
                return this.PEModel_(theKey).itemsMap;
            };
            
            prototype.getData = function () {
                return this.PEModel_(theKey).itemsArray;
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
                const itemsMap = this.getItems();
                const itemsArray = this.getData();
                const index = itemsArray.indexOf(target);
                
                itemsArray.splice(index, 1);
                delete itemsMap[target.getId()];
            };

            prototype.getItemsByTypeId = function (peTypeId) {
                const items = this.getItems();
                const itemKeys = Object.keys(items);
                const typeItems = [];
                
                itemKeys.forEach(
                    key => {
                        const item = items[key];

                        if (item.type.id === peTypeId) {
                            typeItems.push(item);
                        }
                    }
                );
        
                return typeItems;
            };

            prototype.getItemsByTypeByParent = function (type, parents) {
                var allItems = this.getItems();
                var typeItems = this.getItemsByType(type);
                var parentItems = typeItems.filter(
                        function (element) {
                            var parentItem;

                            for (var i = 0; i < parents.length; i++) {
                                parentItem = allItems[i];
                                if (parentItem.children.includes(element)) {
                                    return true;
                                }
                            }

                            return false;
                        }
                );

                return parentItems;
            };

            return PEModel;
        }
);