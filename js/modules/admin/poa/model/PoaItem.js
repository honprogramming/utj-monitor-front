define(
        function () {

            function PoaItem(id, name, shortName, poaType) {
                this.id = id;
                this.name = name;
                this.shortName = shortName;
                this.poaType = poaType;
                this.children = [];
            }
            
            var prototype = PoaItem.prototype;
            
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
            
            prototype.getPoaType = function() {
                return this.name;
            };
            
            prototype.setPoaType = function(poaType) {
                this.poaType = poaType;
            };
            
            prototype.getChildren = function() {
                return this.children;
            };
            
            prototype.setChildren = function(children) {
                this.children = children;
            };
            
            
            return PoaItem;
        }
);
