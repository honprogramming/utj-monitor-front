define(
        function() {
            function StrategicType(id, name) {
                this.id = id;
                this.name = name;
            }
            var prototype = StrategicType.prototype;
            
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
            
            return StrategicType;
        }
);