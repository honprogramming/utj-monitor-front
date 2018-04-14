define(
        function() {
            function PeType(id, name) {
                this.id = id;
                this.name = name;
            }
            const prototype = PeType.prototype;
            
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
            
            return PeType;
        }
);