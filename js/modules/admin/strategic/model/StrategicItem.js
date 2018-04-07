define(
        function () {

            function StrategicItem(id, name, strategicType) {
                this.id = id;
                this.name = name;
                this.strategicType = strategicType;
                this.children = [];
                this.isNew = false;
            }
            
            var prototype = StrategicItem.prototype;
            
            prototype.getId = function() {
                return this.id;
            };
            
            prototype.setId = function(id) {
                this.id = id;
            };
            
            prototype.getName = function() {
                return this.name;
            };
            
            prototype.setName = function(name) {
                this.name = name;
            };
            
            prototype.getStrategicType = function() {
                return this.name;
            };
            
            prototype.setStrategicType = function(strategicType) {
                this.strategicType = strategicType;
            };
            
            prototype.getChildren = function() {
                return this.children;
            };
            
            prototype.setChildren = function(children) {
                this.children = children;
            };
            
            
            return StrategicItem;
        }
);