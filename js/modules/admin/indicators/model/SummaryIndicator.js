define(
        function () {

            /**
             * Indicator Item.
             * 
             * @param {type} id
             * @param {type} name
             */
            function SummaryIndicator(id, type, name, status, strategicItem, description,
                    direction, measureUnit, baseYear) {
                this.id = id;
                this.type = type;
                this.name = name;
                this.status = status;
                this.strategicItem = strategicItem;
                this.description = description;
                this.direction = direction;
                this.measureUnit = measureUnit;
                this.baseYear = baseYear;
                this.cloneOf = undefined;
            }
            
            var prototype = SummaryIndicator.prototype;
            
            prototype.getCloneOf = function() {
                return this.cloneOf;
            };
            
            prototype.setCloneOf = function(id) {
                this.cloneOf = id;
            };
            
            prototype.getId = function () {
                return this.id;
            };

            prototype.setId = function (id) {
                this.id = id;
            };

            prototype.getName = function () {
                return this.name;
            };
            
            prototype.setName = function (name) {
                this.name = name;
            };

            prototype.setStatus = function (status) {
                this.status = status;
            };
            
            prototype.getStatus = function () {
                return this.status;
            };

            prototype.setStrategicItem = function (strategicItem) {
                this.strategicItem = strategicItem;
            };
            
            prototype.getStrategicItem = function () {
                return this.strategicItem;
            };
            
            prototype.getDirection = function() {
                return this.direction;
            };
            
            prototype.setDirection = function(direction) {
                this.direction = direction;
            };
            
            prototype.getMeasureUnit = function() {
                return this.measureUnit;
            };
            
            prototype.setMeasureUnit = function(measureUnit) {
                this.measureUnit = measureUnit;
            };
            
            prototype.getBaseYear = function() {
                return this.baseYear;
            };
            
            prototype.setBaseYear = function(baseYear) {
                this.baseYear = baseYear;
            };
            
            prototype.getType = function() {
                return this.type;
            };
            
            prototype.setType = function(type) {
                this.type = type;
            };

            return SummaryIndicator;
        }
);