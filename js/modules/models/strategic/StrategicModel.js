define(
        function () {
            var theKey = {};
            
            function StrategicModel(dataProvider) {
                var privateData = {
                    dataProvider: dataProvider,
                    itemsArray: undefined,
                    itemsMap: {}
                };
                
                this.StrategicModel_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                privateData.itemsArray = dataProvider.getDataArray();
                
                var item;
                var items = privateData.itemsArray.slice();
                
                while (items.length > 0) {
                    item = items[0];
                    privateData.itemsMap[item.id] = items[0];
                    items = items.concat(item.children);
                    items.splice(0, 1);
                }
            }
            
            var prototype = StrategicModel.prototype;
            
            prototype.addItem = function(parentItemId, item) {
                var parentItem = this.getItemById(parentItemId);
                
                if (parentItem) {
                    var itemsMap = this.getItems();
                    parentItem.children.push(item);
                    itemsMap[item.id] = item;
                }
            };
            
            prototype.getItems = function() {
                return this.StrategicModel_(theKey).itemsMap;
            };
            
            prototype.getItemById = function(itemId) {
                return this.getItems()[itemId];
            };
            
            prototype.getItemsByType = function(type) {
                var items = this.getItems();
                var itemKeys = Object.keys(items);
                var itemKeys = itemKeys.filter(
                            function(key) {
                                var item = items[key];
                                
                                return item.type === type;
                            }
                        );
                
                var typeItems = [];
                
                itemKeys.forEach(
                        function(key) {
                            typeItems.push(items[key]);
                        }
                );
                
                return typeItems;
            };
            
            prototype.getItemsByTypeByParent = function(type, parents) {
                var allItems = this.getItems();
                var typeItems = this.getItemsByType(type);
                var parentItems = typeItems.filter(
                            function(element) {
                                var parentItem;
                                
                                for (var i = 0; i < parents.length; i ++) {
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
            
            return StrategicModel;
        }
);