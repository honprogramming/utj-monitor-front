define(
        function () {

            function PeItem(id, name, peType) {
                this.id = id;
                this.name = name;
                this.peType = peType;
                this.children = [];
            }
            
            var prototype = PeItem.prototype;
            
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
            
            
            return PeItem;
        }
);