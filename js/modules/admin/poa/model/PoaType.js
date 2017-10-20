define(
        function() {
            function PoaType(id, name) {
                this.id = id;
                this.name = name;
            }
            var prototype = PoaType.prototype;
            
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
            
            return PoaType;
        }
);

