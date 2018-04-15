define(
        function () {

            function PEItem(id, name, shortName, type) {
                this.id = id;
                this.name = name;
                this.shortName = shortName;
                this.type = type;
            }
            
            var prototype = PEItem.prototype;
            
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
            
            prototype.getShortName = function() {
                return this.shortName;
            };
            
            prototype.setShortName = function(shortName) {
                this.shortName = shortName;
            };
            
            prototype.getType = function() {
                return this.type;
            };
            
            prototype.setType = function(type) {
                this.type = type;
            };
            
            return PEItem;
        }
);