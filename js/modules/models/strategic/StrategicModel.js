define(
        function () {
            var theKey = {};
            
            function StrategicModel(rootItem) {
                var privateData = {
                    items: {}
                };
                
                this.StrategicModel_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                var item;
                var items = [rootItem];
                
                while (items.length > 0) {
                    item = items[0];
                    items[item.getId()] = items[0];
                    items = items.concat(item.children());
                    items.splice(0, 1);
                }
            }
            
            var prototype = StrategicModel.prototype;
            
            prototype.getItems = function() {
                return this.StrategicModel_(theKey).items;
            };
            
            prototype.getItemsByType = function(type) {
                var items = this.getItems();
                var typeItems = items.filter(
                            function(element) {
                                return element.getType() === type;
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
                                    if (parentItem.children().includes(element)) {
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