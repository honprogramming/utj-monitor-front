define(
        function () {
            var theKey = {};
            
            function StrategicItem(id, name, type) {
                var privateData = {
                    id: id,
                    name: name,
                    type: type,
                    children: []
                };
                
                this.StrategicItem_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
            }
            
            var prototype = StrategicItem.prototype;
            
            prototype.getId = function () {
                return this.StrategicItem_().id;
            };
            
            prototype.getName = function () {
                return this.StrategicItem_().name;
            };
            
            prototype.getType = function () {
                return this.StrategicItem_().type;
            };
            
            prototype.getChildren = function () {
                return this.StrategicItem_().children;
            };
            
            prototype.addChildren = function (child) {
                return this.StrategicItem_().children.push(child);
            };
        }
);