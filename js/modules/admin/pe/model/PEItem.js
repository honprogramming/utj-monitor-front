define(
        function () {

            function PEItem(id, name, shortName, peType) {
                this.id = id;
                this.name = name;
                this.shortName = shortName;
                this.peType = peType;
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
            
            prototype.getPeType = function() {
                return this.name;
            };
            
            prototype.setPeType = function(peType) {
                this.peType = peType;
            };
            
            prototype.getChildren = function() {
                return this.children;
            };
            
            prototype.setChildren = function(children) {
                this.children = children;
            };
            
            
            return PEItem;
        }
);